import { NextResponse } from 'next/server';
import { resolvePartnerContext } from '@/lib/partner/auth';
import { getPartnerUsersProvider } from '@/lib/partner/users';

function toUsersContext(partner: NonNullable<Awaited<ReturnType<typeof resolvePartnerContext>>>) {
  if (partner.type !== 'tour') return null;
  return {
    operatorType: 'tour' as const,
    tourOperatorId: partner.tourOperatorId,
    userId: partner.userId,
  };
}

export async function GET() {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = toUsersContext(partner);
    if (!context) {
      return NextResponse.json(
        { error: 'Alt kullanıcı yönetimi yalnızca tur operatörleri için kullanılabilir' },
        { status: 403 }
      );
    }

    const provider = getPartnerUsersProvider();
    const users = await provider.list(context);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching sub-users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = toUsersContext(partner);
    if (!context) {
      return NextResponse.json(
        { error: 'Alt kullanıcı yönetimi yalnızca tur operatörleri için kullanılabilir' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const provider = getPartnerUsersProvider();
    const user = await provider.create(context, body);
    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message === 'Bu email adresi zaten kullanımda' ? 400 : 500;
    console.error('Error creating sub-user:', error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = toUsersContext(partner);
    if (!context) {
      return NextResponse.json(
        { error: 'Alt kullanıcı yönetimi yalnızca tur operatörleri için kullanılabilir' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const provider = getPartnerUsersProvider();
    const user = await provider.update(context, body);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating sub-user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = toUsersContext(partner);
    if (!context) {
      return NextResponse.json(
        { error: 'Alt kullanıcı yönetimi yalnızca tur operatörleri için kullanılabilir' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const provider = getPartnerUsersProvider();
    await provider.delete(context, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sub-user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
