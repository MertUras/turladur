import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { parseJsonArray, parseJsonSchedule } from "@/lib/utils";

// GET /api/experiences/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: params.id },
      include: {
        activityDates: true, // Aktivite tarihlerini de getir
      },
    });

    if (!experience) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Json alanları (null / stringify edilmiş veri) her zaman dizi olarak normalize edilir
    // ve düzenleme formunun beklediği `images` alanına eşlenir; aksi halde form boş
    // görsellerle açılır ve kaydedildiğinde mevcut fotoğraflar silinir.
    const gallery = parseJsonArray<string>(experience.gallery);

    return NextResponse.json({
      ...experience,
      images: gallery.length > 0 ? gallery : (experience.imageUrl ? [experience.imageUrl] : []),
      gallery,
      included: parseJsonArray<string>(experience.included),
      notIncluded: parseJsonArray<string>(experience.notIncluded),
      highlights: parseJsonArray<string>(experience.highlights),
      schedule: parseJsonSchedule(experience.schedule),
    });
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}

// PUT /api/experiences/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    
    const updatedExperience = await prisma.$transaction(async (tx) => {
      // 1. Önce ana aktivite bilgilerini güncelle
      const experience = await tx.experience.update({
        where: {
          id: params.id,
          userId: session.user.id, // Yetkilendirme
        },
        data: {
          title: json.name, // Formdan 'name' gelir, db'de 'title'
          description: json.description,
          category: json.category,
          duration: json.duration.toString(),
          price: json.price,
          ageRestriction: json.ageRestriction,
          longDescription: json.longDescription || '',
          location: json.location || '',
          included: json.included || [],
          notIncluded: json.notIncluded || [],
          highlights: json.highlights || [],
          schedule: json.schedule || [],
          userId: session.user.id,
          imageUrl: json.images?.[0] || '',
          gallery: json.images || [],
          meetingPoint: json.meetingPoint,
        },
      });

      // 2. Bu aktiviteye ait tüm eski tarihleri sil
      await tx.activityDate.deleteMany({
        where: { experienceId: params.id },
      });

      // 3. Formdan gelen yeni tarihleri ekle
      if (Array.isArray(json.activityDates) && json.activityDates.length > 0) {
        await tx.activityDate.createMany({
          data: json.activityDates.map((date: any) => ({
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            availableSeats: date.availableSeats,
            experienceId: experience.id,
            price: experience.price, // Ana fiyati kullan
          })),
        });
      }

      return experience;
    });

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

// DELETE /api/experiences/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.experience.delete({
      where: {
        id: params.id,
        userId: session.user.id, // Yetkilendirme
      },
    });

    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
} 