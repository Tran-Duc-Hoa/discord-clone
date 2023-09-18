import { redirect } from 'next/navigation';

import InitialModal from '@/components/modals/InitialModal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';

const HomePage = async () => {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) redirect(`/servers/${server.id}`);

  return <InitialModal />;
};

export default HomePage;
