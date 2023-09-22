import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const serverId = searchParams.get('serverId');
    if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

    if (name === 'general') return new NextResponse("Name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }
          }
        }
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
