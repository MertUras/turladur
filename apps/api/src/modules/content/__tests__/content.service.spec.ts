import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { ContentService } from '../services/content.service';
import {
  createCacheMock,
  createPrismaMock,
} from '../../__tests__/test-helpers';

describe('ContentService', () => {
  let service: ContentService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let cache: ReturnType<typeof createCacheMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    cache = createCacheMock();
    const module = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: PrismaService, useValue: prisma },
        { provide: CacheService, useValue: cache },
      ],
    }).compile();
    service = module.get(ContentService);
  });

  describe('searchPosts', () => {
    it('should list published posts by default', async () => {
      (prisma.post.count as jest.Mock).mockResolvedValue(1);
      (prisma.post.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'p1',
          title: 'Kapadokya Rehberi',
          slug: 'kapadokya-rehberi',
          excerpt: 'Kısa özet',
          published: true,
          authorId: 'u1',
          publishedAt: new Date(),
          categories: [{ id: 'c1', name: 'Rehber', slug: 'rehber' }],
        },
      ]);

      const result = await service.searchPosts({ page: 1, limit: 10 });
      expect(result.data[0].slug).toBe('kapadokya-rehberi');
      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ published: true }),
        }),
      );
    });

    it('should include drafts for admin', async () => {
      (prisma.post.count as jest.Mock).mockResolvedValue(0);
      (prisma.post.findMany as jest.Mock).mockResolvedValue([]);

      await service.searchPosts(
        { includeDrafts: true, page: 1, limit: 10 },
        true,
      );
      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({ published: true }),
        }),
      );
    });
  });

  describe('createPost', () => {
    it('should create unpublished post with unique slug', async () => {
      (prisma.post.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.post.create as jest.Mock).mockResolvedValue({
        id: 'p1',
        title: 'Yeni Yazı Başlığı',
        slug: 'yeni-yazi-basligi',
        excerpt: null,
        published: false,
        authorId: 'admin1',
        publishedAt: null,
        categories: [],
      });

      const result = await service.createPost(
        {
          title: 'Yeni Yazı Başlığı',
          content: 'İçerik en az on karakter olmalı.',
        },
        'admin1',
      );

      expect(result.data.published).toBe(false);
      expect(result.data.slug).toBe('yeni-yazi-basligi');
    });
  });

  describe('createComment', () => {
    it('should require published post', async () => {
      (prisma.post.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        service.createComment('p1', { content: 'Güzel yazı' }, 'u1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should create comment on published post', async () => {
      (prisma.post.findFirst as jest.Mock).mockResolvedValue({
        id: 'p1',
        published: true,
        deletedAt: null,
      });
      (prisma.comment.create as jest.Mock).mockResolvedValue({
        id: 'cm1',
        postId: 'p1',
        authorId: 'u1',
        content: 'Güzel yazı',
        createdAt: new Date(),
      });

      const result = await service.createComment(
        'p1',
        { content: 'Güzel yazı' },
        'u1',
      );
      expect(result.data.id).toBe('cm1');
    });
  });

  describe('createCategory', () => {
    it('should create category with slug', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.category.create as jest.Mock).mockResolvedValue({
        id: 'c1',
        name: 'Rehberler',
        slug: 'rehberler',
      });

      const result = await service.createCategory({ name: 'Rehberler' });
      expect(result.data.slug).toBe('rehberler');
    });
  });

  describe('update / delete post and category', () => {
    it('should update and soft-delete post as admin', async () => {
      (prisma.post.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: 'p1',
          authorId: 'admin1',
          published: false,
          publishedAt: null,
          deletedAt: null,
        })
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'p1',
          authorId: 'admin1',
          deletedAt: null,
        });
      (prisma.post.update as jest.Mock)
        .mockResolvedValueOnce({
          id: 'p1',
          title: 'Güncel',
          slug: 'guncel',
          excerpt: null,
          published: true,
          authorId: 'admin1',
          publishedAt: new Date(),
          categories: [],
        })
        .mockResolvedValueOnce({});

      const updated = await service.updatePost(
        'p1',
        { title: 'Güncel', published: true },
        { userId: 'admin1', role: 'ADMIN' },
      );
      expect(updated.data.published).toBe(true);

      const deleted = await service.softDeletePost('p1', {
        userId: 'admin1',
        role: 'ADMIN',
      });
      expect(deleted.data.deleted).toBe(true);
    });

    it('should update and soft-delete category', async () => {
      (prisma.category.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 'c1', deletedAt: null }) // require
        .mockResolvedValueOnce(null); // uniqueCategorySlug
      (prisma.category.update as jest.Mock).mockResolvedValue({
        id: 'c1',
        name: 'Yeni',
        slug: 'yeni',
      });

      const updated = await service.updateCategory('c1', { name: 'Yeni' });
      expect(updated.data.name).toBe('Yeni');

      (prisma.category.findFirst as jest.Mock).mockResolvedValue({
        id: 'c1',
        deletedAt: null,
      });
      (prisma.category.update as jest.Mock).mockResolvedValue({});
      const deleted = await service.softDeleteCategory('c1');
      expect(deleted.data.deleted).toBe(true);
    });

    it('should update and delete own comment', async () => {
      (prisma.comment.findFirst as jest.Mock).mockResolvedValue({
        id: 'cm1',
        postId: 'p1',
        authorId: 'u1',
        deletedAt: null,
      });
      (prisma.comment.update as jest.Mock).mockResolvedValue({
        id: 'cm1',
        content: 'Düzenlendi',
        updatedAt: new Date(),
      });

      const updated = await service.updateComment(
        'p1',
        'cm1',
        { content: 'Düzenlendi' },
        { userId: 'u1', role: 'CUSTOMER' },
      );
      expect(updated.data.content).toBe('Düzenlendi');

      const deleted = await service.softDeleteComment('p1', 'cm1', {
        userId: 'u1',
        role: 'CUSTOMER',
      });
      expect(deleted.data.deleted).toBe(true);
    });

    it('should list categories and comments', async () => {
      (prisma.category.findMany as jest.Mock).mockResolvedValue([
        { id: 'c1', name: 'A', slug: 'a' },
      ]);
      const cats = await service.listCategories();
      expect(cats.data).toHaveLength(1);

      (prisma.post.findFirst as jest.Mock).mockResolvedValue({
        id: 'p1',
        deletedAt: null,
      });
      (prisma.comment.findMany as jest.Mock).mockResolvedValue([]);
      const comments = await service.listComments('p1');
      expect(comments.data).toEqual([]);
    });

    it('should get post by slug', async () => {
      (prisma.post.findFirst as jest.Mock).mockResolvedValue({
        id: 'p1',
        title: 'T',
        slug: 't',
        excerpt: null,
        published: true,
        authorId: 'u1',
        publishedAt: new Date(),
        categories: [],
      });
      const result = await service.getPostBySlugOrId('t');
      expect(result.data.slug).toBe('t');
    });
  });

  describe('getPageCover', () => {
    it('returns disabled when row is missing', async () => {
      (prisma.sitePageCover.findFirst as jest.Mock).mockResolvedValue(null);
      const result = await service.getPageCover('activities_listing');
      expect(result.data.enabled).toBe(false);
      expect(result.data.key).toBe('activities_listing');
    });

    it('returns disabled when table is missing', async () => {
      (prisma.sitePageCover.findFirst as jest.Mock).mockRejectedValue(
        new Error('table does not exist'),
      );
      const result = await service.getPageCover('activities_listing');
      expect(result.data.enabled).toBe(false);
    });

    it('returns cached cover without hitting prisma', async () => {
      cache.get.mockResolvedValue({
        key: 'activities_listing',
        enabled: true,
        headline: 'Yeniliyoruz',
        subtitle: null,
      });
      const result = await service.getPageCover('activities_listing');
      expect(result.data.enabled).toBe(true);
      expect(prisma.sitePageCover.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('getRoutePage', () => {
    it('returns exists:false when row is missing', async () => {
      (prisma.routePage.findFirst as jest.Mock).mockResolvedValue(null);
      const result = await service.getRoutePage('kapadokya');
      expect(result.data.exists).toBe(false);
      expect(result.data.routeKey).toBe('kapadokya');
    });

    it('returns exists:false when table is missing', async () => {
      (prisma.routePage.findFirst as jest.Mock).mockRejectedValue(
        new Error('table does not exist'),
      );
      const result = await service.getRoutePage('kapadokya');
      expect(result.data.exists).toBe(false);
    });

    it('returns cached overlay without hitting prisma', async () => {
      cache.get.mockResolvedValue({
        routeKey: 'kapadokya',
        exists: true,
        seoTitle: 'Kapadokya SEO',
        seoDescription: null,
        summary: 'Özel özet',
        body: null,
      });
      const result = await service.getRoutePage('kapadokya');
      expect(result.data.seoTitle).toBe('Kapadokya SEO');
      expect(prisma.routePage.findFirst).not.toHaveBeenCalled();
    });

    it('rejects unknown route keys', async () => {
      await expect(
        service.getRoutePage('unknown-route'),
      ).rejects.toBeInstanceOf(BusinessException);
    });
  });

  describe('listRoutePages', () => {
    it('returns empty array when table is missing', async () => {
      (prisma.routePage.findMany as jest.Mock).mockRejectedValue(
        new Error('table does not exist'),
      );
      const result = await service.listRoutePages();
      expect(result.data).toEqual([]);
    });

    it('returns overlays from database', async () => {
      (prisma.routePage.findMany as jest.Mock).mockResolvedValue([
        {
          routeKey: 'kapadokya',
          seoTitle: 'Kapadokya',
          seoDescription: 'Meta',
          summary: 'Özet',
          body: 'Gövde',
        },
      ]);
      const result = await service.listRoutePages();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].exists).toBe(true);
    });
  });

  describe('updateRoutePage', () => {
    it('upserts overlay and clears cache', async () => {
      (prisma.routePage.upsert as jest.Mock).mockResolvedValue({
        routeKey: 'kapadokya',
        seoTitle: 'Kapadokya SEO',
        seoDescription: 'Meta açıklama',
        summary: 'Özet',
        body: 'Gövde metni',
      });

      const result = await service.updateRoutePage(
        'kapadokya',
        {
          seoTitle: 'Kapadokya SEO',
          seoDescription: 'Meta açıklama',
          summary: 'Özet',
          body: 'Gövde metni',
        },
        'admin1',
      );

      expect(result.data.exists).toBe(true);
      expect(result.data.seoTitle).toBe('Kapadokya SEO');
      expect(cache.del).toHaveBeenCalledWith('content:route-page:kapadokya');
      expect(cache.del).toHaveBeenCalledWith('content:route-pages:all');
    });

    it('returns 503 when storage table is missing', async () => {
      (prisma.routePage.upsert as jest.Mock).mockRejectedValue(
        new Error('table does not exist'),
      );

      await expect(
        service.updateRoutePage('kapadokya', { seoTitle: 'Test' }, 'admin1'),
      ).rejects.toMatchObject({
        code: 'CONTENT_STORAGE_UNAVAILABLE',
        statusCode: 503,
      });
    });
  });
});
