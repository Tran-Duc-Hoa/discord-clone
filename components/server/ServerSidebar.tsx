import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import ServerChannel from './ServerChannel';
import ServerHeader from './ServerHeader';
import ServerMember from './ServerMember';
import ServerSearch from './ServerSearch';
import ServerSection from './ServerSection';

const ICON_MAP = {
  [ChannelType.TEXT]: <Hash className="mr-2 w-4 h-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 w-4 h-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 w-4 h-4" />
};

const ROLE_ICON_MAP = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
};

interface Props {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirect('/');

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });
  if (!server) return redirect('/');

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const members = server?.members.filter((member) => member.profileId !== profile.id);
  const role = server?.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  icon: ICON_MAP[channel.type],
                  name: channel.name,
                  id: channel.id
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  icon: ICON_MAP[channel.type],
                  name: channel.name,
                  id: channel.id
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  icon: ICON_MAP[channel.type],
                  name: channel.name,
                  id: channel.id
                }))
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: ROLE_ICON_MAP[member.role]
                }))
              }
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection label="Text Channels" sectionType="channels" channelType={ChannelType.TEXT} role={role} />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection label="Voice Channels" sectionType="channels" channelType={ChannelType.AUDIO} role={role} />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection label="Video Channels" sectionType="channels" channelType={ChannelType.VIDEO} role={role} />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection label="Members" sectionType="members" server={server} role={role} />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
