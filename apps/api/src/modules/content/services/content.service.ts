import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '@turladur/shared-constants';
import type {
  Category as SharedCategory,
  Post as SharedPost,
} from '@turladur/shared-types';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  CreateCategoryDto,
  CreateCommentDto,
  CreatePostDto,
  SearchPostsDto,
  UpdateCategoryDto,
  UpdateCommentDto,
  UpdatePostDto,
} from '../dto/content.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Posts ────────────────────────────────────────────

  async searchPosts(dto: SearchPostsDto, isAdmin = false) {
    const page = dto.page ?? DEFAULT_PAGE;
    const limit = dto.limit ?? DEFAULT_PAGE_LIMIT;
    const includeDrafts = Boolean(dto.includeDrafts && isAdmin);

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      ...(includeDrafts ? {} : { published: true }),
      ...(dto.q
        ? {
            OR: [
              { title: { contains: dto.q, mode: 'insensitive' } },
              { excerpt: { contains: dto.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(dto.categorySlug
        ? {
            categories: {
              some: { slug: dto.categorySlug, deletedAt: null },
            },
          }
        : {}),
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { categories: { where: { deletedAt: null } } },
      }),
    ]);

    return {
      success: true,
      data: rows.map((r) => this.toPost(r)),
      error: null,
      meta: { page, limit, total },
    };
  }

  async getPostBySlugOrId(slugOrId: string, isAdmin = false) {
    const post = await this.prisma.post.findFirst({
      where: {
        deletedAt: null,
        OR: [{ id: slugOrId }, { slug: slugOrId }],
        ...(isAdmin ? {} : { published: true }),
      },
      include: { categories: { where: { deletedAt: null } } },
    });
    if (!post) {
      throw new NotFoundException({
        code: 'POST_NOT_FOUND',
        message: 'Yazı bulunamadı',
      });
    }
    return { success: true, data: this.toPost(post), error: null };
  }

  async createPost(dto: CreatePostDto, authorId: string) {
    const slug = await this.uniquePostSlug(slugify(dto.title));
    const published = dto.published ?? false;

    const post = await this.prisma.post.create({
      data: {
        title: dto.title.trim(),
        slug,
        content: dto.content,
        excerpt: dto.excerpt?.trim(),
        coverImage: dto.coverImage,
        published,
        publishedAt: published ? new Date() : null,
        authorId,
        ...(dto.categoryIds?.length
          ? {
              categories: {
                connect: dto.categoryIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: { categories: true },
    });

    return { success: true, data: this.toPost(post), error: null };
  }

  async updatePost(
    postId: string,
    dto: UpdatePostDto,
    actor: { userId: string; role: string },
  ) {
    const post = await this.requirePost(postId);
    this.assertPostAccess(post.authorId, actor);

    const data: Prisma.PostUpdateInput = {};
    if (dto.title !== undefined) {
      data.title = dto.title.trim();
      data.slug = await this.uniquePostSlug(slugify(dto.title), postId);
    }
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.excerpt !== undefined) data.excerpt = dto.excerpt.trim();
    if (dto.coverImage !== undefined) data.coverImage = dto.coverImage;
    if (dto.published !== undefined) {
      data.published = dto.published;
      if (dto.published && !post.publishedAt) {
        data.publishedAt = new Date();
      }
    }
    if (dto.categoryIds !== undefined) {
      data.categories = {
        set: dto.categoryIds.map((id) => ({ id })),
      };
    }

    const updated = await this.prisma.post.update({
      where: { id: post.id },
      data,
      include: { categories: { where: { deletedAt: null } } },
    });

    return { success: true, data: this.toPost(updated), error: null };
  }

  async softDeletePost(
    postId: string,
    actor: { userId: string; role: string },
  ) {
    const post = await this.requirePost(postId);
    this.assertPostAccess(post.authorId, actor);
    await this.prisma.post.update({
      where: { id: post.id },
      data: { deletedAt: new Date(), published: false },
    });
    return {
      success: true,
      data: { id: postId, deleted: true },
      error: null,
    };
  }

  // ─── Categories ───────────────────────────────────────

  async listCategories() {
    const rows = await this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return {
      success: true,
      data: rows.map((r) => this.toCategory(r)),
      error: null,
    };
  }

  async createCategory(dto: CreateCategoryDto) {
    const slug = await this.uniqueCategorySlug(slugify(dto.name));
    const row = await this.prisma.category.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim(),
      },
    });
    return { success: true, data: this.toCategory(row), error: null };
  }

  async updateCategory(categoryId: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: { id: categoryId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Kategori bulunamadı',
      });
    }

    const data: Prisma.CategoryUpdateInput = {};
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
      data.slug = await this.uniqueCategorySlug(slugify(dto.name), categoryId);
    }
    if (dto.description !== undefined) {
      data.description = dto.description.trim();
    }

    const updated = await this.prisma.category.update({
      where: { id: existing.id },
      data,
    });
    return { success: true, data: this.toCategory(updated), error: null };
  }

  async softDeleteCategory(categoryId: string) {
    const existing = await this.prisma.category.findFirst({
      where: { id: categoryId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Kategori bulunamadı',
      });
    }
    await this.prisma.category.update({
      where: { id: existing.id },
      data: { deletedAt: new Date() },
    });
    return {
      success: true,
      data: { id: categoryId, deleted: true },
      error: null,
    };
  }

  // ─── Comments ─────────────────────────────────────────

  async listComments(postId: string) {
    await this.requirePublishedOrAnyPost(postId);
    const rows = await this.prisma.comment.findMany({
      where: { postId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        postId: r.postId,
        authorId: r.authorId,
        content: r.content,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
      error: null,
    };
  }

  async createComment(postId: string, dto: CreateCommentDto, authorId: string) {
    await this.requirePublishedOrAnyPost(postId, true);
    const row = await this.prisma.comment.create({
      data: {
        postId,
        authorId,
        content: dto.content.trim(),
      },
    });
    return {
      success: true,
      data: {
        id: row.id,
        postId: row.postId,
        authorId: row.authorId,
        content: row.content,
        createdAt: row.createdAt.toISOString(),
      },
      error: null,
    };
  }

  async updateComment(
    postId: string,
    commentId: string,
    dto: UpdateCommentDto,
    actor: { userId: string; role: string },
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, postId, deletedAt: null },
    });
    if (!comment) {
      throw new NotFoundException({
        code: 'COMMENT_NOT_FOUND',
        message: 'Yorum bulunamadı',
      });
    }
    const isAdmin = actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN';
    if (!isAdmin && comment.authorId !== actor.userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu yorumu düzenleyemezsiniz',
      });
    }

    const updated = await this.prisma.comment.update({
      where: { id: comment.id },
      data: { content: dto.content.trim() },
    });
    return {
      success: true,
      data: {
        id: updated.id,
        content: updated.content,
        updatedAt: updated.updatedAt.toISOString(),
      },
      error: null,
    };
  }

  async softDeleteComment(
    postId: string,
    commentId: string,
    actor: { userId: string; role: string },
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, postId, deletedAt: null },
    });
    if (!comment) {
      throw new NotFoundException({
        code: 'COMMENT_NOT_FOUND',
        message: 'Yorum bulunamadı',
      });
    }
    const isAdmin = actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN';
    if (!isAdmin && comment.authorId !== actor.userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu yorumu silemezsiniz',
      });
    }
    await this.prisma.comment.update({
      where: { id: comment.id },
      data: { deletedAt: new Date() },
    });
    return {
      success: true,
      data: { id: commentId, deleted: true },
      error: null,
    };
  }

  private assertPostAccess(
    authorId: string,
    actor: { userId: string; role: string },
  ) {
    const isAdmin = actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN';
    if (!isAdmin && authorId !== actor.userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu yazıyı yönetemezsiniz',
      });
    }
  }

  private async requirePost(postId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
    });
    if (!post) {
      throw new NotFoundException({
        code: 'POST_NOT_FOUND',
        message: 'Yazı bulunamadı',
      });
    }
    return post;
  }

  private async requirePublishedOrAnyPost(
    postId: string,
    mustBePublished = false,
  ) {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        deletedAt: null,
        ...(mustBePublished ? { published: true } : {}),
      },
    });
    if (!post) {
      throw new NotFoundException({
        code: 'POST_NOT_FOUND',
        message: 'Yazı bulunamadı',
      });
    }
    return post;
  }

  private async uniquePostSlug(base: string, excludeId?: string) {
    let slug = base;
    let i = 0;
    while (true) {
      const existing = await this.prisma.post.findFirst({
        where: {
          slug,
          deletedAt: null,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (!existing) return slug;
      i += 1;
      slug = `${base}-${i}`;
    }
  }

  private async uniqueCategorySlug(base: string, excludeId?: string) {
    let slug = base;
    let i = 0;
    while (true) {
      const existing = await this.prisma.category.findFirst({
        where: {
          slug,
          deletedAt: null,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (!existing) return slug;
      i += 1;
      slug = `${base}-${i}`;
    }
  }

  private toPost(row: {
    id: string;
    title: string;
    slug: string;
    content?: string;
    excerpt: string | null;
    coverImage?: string | null;
    published: boolean;
    authorId: string;
    publishedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    categories?: Array<{ id: string; name: string; slug: string }>;
  }): SharedPost & { categories?: SharedCategory[] } {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      coverImage: row.coverImage ?? null,
      published: row.published,
      authorId: row.authorId,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      createdAt: row.createdAt?.toISOString(),
      updatedAt: row.updatedAt?.toISOString(),
      ...(row.categories
        ? { categories: row.categories.map((c) => this.toCategory(c)) }
        : {}),
    };
  }

  private toCategory(row: {
    id: string;
    name: string;
    slug: string;
  }): SharedCategory {
    return { id: row.id, name: row.name, slug: row.slug };
  }
}
