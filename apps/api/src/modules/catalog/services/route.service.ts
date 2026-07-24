import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  ROUTE_CATEGORY_LABELS,
  ROUTE_DEFINITIONS,
  type RouteCategory,
  type RouteDefinition,
  type RouteFilters,
  type RouteWithStats,
} from '../data/route-definitions';
import { SearchRoutesDto } from '../dto/route.dto';

type CatalogTour = {
  id: string;
  title: string;
  description: string;
  category: string;
  durationDays: number;
  price: Prisma.Decimal;
  averageRating: Prisma.Decimal;
  partnerId: string;
};

@Injectable()
export class RouteService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: SearchRoutesDto) {
    const filters: RouteFilters = {
      search: dto.q,
      category: dto.category,
      duration: dto.duration,
      season: dto.season,
    };
    const allTours = await this.fetchPublishedTours();

    const routes = ROUTE_DEFINITIONS.map((route) => {
      const matching = this.toursForRoute(route, allTours, filters);
      return this.withStats(route, matching);
    }).filter((route) => {
      if (filters.category && route.category !== filters.category) return false;
      if (filters.search) {
        const query = this.normalize(filters.search);
        const routeText = this.normalize(`${route.name} ${route.description}`);
        if (!routeText.includes(query) && route.tourCount === 0) return false;
      }
      if ((filters.duration || filters.season) && route.tourCount === 0) {
        return false;
      }
      return true;
    });

    const categories = (
      Object.keys(ROUTE_CATEGORY_LABELS) as RouteCategory[]
    ).map((key) => ({
      key,
      ...ROUTE_CATEGORY_LABELS[key],
      count: routes.filter((r) => r.category === key && r.tourCount > 0).length,
    }));

    const uniquePartners = new Set(allTours.map((t) => t.partnerId));
    const allMatched = ROUTE_DEFINITIONS.flatMap((route) =>
      this.toursForRoute(route, allTours, filters),
    );
    const uniqueTourIds = new Set(allMatched.map((t) => t.id));

    return {
      success: true,
      data: {
        routes,
        categories,
        stats: {
          routeCount: routes.filter((r) => r.tourCount > 0).length,
          tourCount: uniqueTourIds.size,
          operatorCount: uniquePartners.size,
          avgRating: this.avgRating(allMatched),
        },
      },
      error: null,
    };
  }

  async getById(routeId: string, dto: SearchRoutesDto) {
    const routeDef = ROUTE_DEFINITIONS.find((r) => r.id === routeId);
    if (!routeDef) {
      throw new NotFoundException({
        code: 'ROUTE_NOT_FOUND',
        message: 'Rota bulunamadı',
      });
    }

    const filters: RouteFilters = {
      search: dto.q,
      category: dto.category,
      duration: dto.duration,
      season: dto.season,
    };
    const allTours = await this.fetchPublishedTours();
    const matching = this.toursForRoute(routeDef, allTours, filters);

    return {
      success: true,
      data: {
        route: this.withStats(routeDef, matching),
        tours: matching.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          durationDays: t.durationDays,
          price: t.price.toString(),
          averageRating: t.averageRating.toString(),
          partnerId: t.partnerId,
        })),
      },
      error: null,
    };
  }

  /** Admin-only: list curated definitions (no DB mutate — static catalog). */
  async listDefinitions(role: string) {
    this.assertAdmin(role);
    return {
      success: true,
      data: ROUTE_DEFINITIONS,
      error: null,
    };
  }

  private assertAdmin(role: string) {
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu işlem için admin yetkisi gerekli',
      });
    }
  }

  private async fetchPublishedTours(): Promise<CatalogTour[]> {
    return this.prisma.tour.findMany({
      where: { deletedAt: null, status: 'PUBLISHED' },
      orderBy: [{ averageRating: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        durationDays: true,
        price: true,
        averageRating: true,
        partnerId: true,
      },
    });
  }

  private toursForRoute(
    route: RouteDefinition,
    tours: CatalogTour[],
    filters: RouteFilters,
  ) {
    return tours.filter(
      (tour) =>
        this.matchesRoute(tour, route) && this.matchesFilters(tour, filters),
    );
  }

  private matchesRoute(tour: CatalogTour, route: RouteDefinition) {
    const haystack = this.normalize(
      `${tour.title} ${tour.description} ${tour.category}`,
    );
    return route.matchKeywords.some((keyword) =>
      haystack.includes(this.normalize(keyword)),
    );
  }

  private matchesFilters(tour: CatalogTour, filters: RouteFilters) {
    if (filters.search) {
      const query = this.normalize(filters.search);
      const text = this.normalize(
        `${tour.title} ${tour.description} ${tour.category}`,
      );
      if (!text.includes(query)) return false;
    }
    if (filters.duration) {
      const d = tour.durationDays;
      switch (filters.duration) {
        case '1-day':
          if (d !== 1) return false;
          break;
        case '2-3-days':
          if (d < 2 || d > 3) return false;
          break;
        case '4-7-days':
          if (d < 4 || d > 7) return false;
          break;
        case '7-plus-days':
          if (d < 7) return false;
          break;
        default:
          break;
      }
    }
    return true;
  }

  private withStats(
    route: RouteDefinition,
    tours: CatalogTour[],
  ): RouteWithStats {
    return {
      ...route,
      tourCount: tours.length,
      priceRange: this.priceRange(tours),
      avgRating: this.avgRating(tours),
      computedDuration: this.durationRange(tours) ?? route.duration,
    };
  }

  private priceRange(tours: CatalogTour[]) {
    if (tours.length === 0) return null;
    const prices = tours.map((t) => Number(t.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const fmt = (n: number) =>
      new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
      }).format(n);
    return min === max ? fmt(min) : `${fmt(min)} - ${fmt(max)}`;
  }

  private durationRange(tours: CatalogTour[]) {
    if (tours.length === 0) return null;
    const durations = tours.map((t) => t.durationDays);
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    return min === max ? `${min} gün` : `${min}-${max} gün`;
  }

  private avgRating(tours: CatalogTour[]) {
    const rated = tours.filter((t) => Number(t.averageRating) > 0);
    if (rated.length === 0) return null;
    const sum = rated.reduce((acc, t) => acc + Number(t.averageRating), 0);
    return Math.round((sum / rated.length) * 10) / 10;
  }

  private normalize(value: string) {
    return value
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i');
  }
}
