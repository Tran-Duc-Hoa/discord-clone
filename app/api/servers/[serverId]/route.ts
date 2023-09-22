import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    if (!params.serverId) return new NextResponse('Server ID Missing', { status: 400 });

    const { name, imageUrl } = await req.json();
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data: {
        name,
        imageUrl
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error('[SERVER_ID]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
