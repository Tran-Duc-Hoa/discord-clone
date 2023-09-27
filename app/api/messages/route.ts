import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';

const MESSAGES_BATH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');
    if (!channelId) return new NextResponse('Channel ID missing', { status: 400 });

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATH,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          channelId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATH,
        where: {
          channelId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATH) {
      nextCursor = messages[MESSAGES_BATH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.error('[MESSAGES_GET]', error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
