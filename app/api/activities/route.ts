import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');

    let where: any = {};
    if (category) {
        where.category = category;
    }

    const experiences = await prisma.experience.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(experiences);
} 