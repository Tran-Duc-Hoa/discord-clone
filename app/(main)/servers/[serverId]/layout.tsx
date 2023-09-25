import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import ServerSidebar from '@/components/server/ServerSidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

interface Props {
  children: ReactNode;
  params: { serverId: string };
}

const ServerIdLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId
    }
  });

  if (!server) return redirect('/');

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
