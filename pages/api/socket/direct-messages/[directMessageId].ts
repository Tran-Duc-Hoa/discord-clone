import { NextApiRequest } from 'next';

import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { NextApiResponseServerIo } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const profile = await currentProfilePages(req);
    if (!profile) return res.status(401).json({ error: 'Unauthorized' });
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!conversationId) return res.status(400).json({ error: 'Conversation ID missing' });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id
            }
          },
          {
            memberTwo: {
              profileId: profile.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    });
    if (!conversation) return res.status(400).json({ message: 'Conversation not found' });

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;
    if (!member) return res.status(404).json({ message: 'Member not found' });
  } catch (error) {
    console.error('[MESSAGE_ID]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
