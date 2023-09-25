import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

    const { name, type } = await req.json();
    if (name === 'general') return new NextResponse("Name cannot be 'general'", { status: 400 });

    console.log('params.channelId', params.channelId);
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: 'general'
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_ID_PATCH', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
