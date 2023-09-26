import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';

import { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';

    const httpServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path,
      // @ts-ignore
      addTrailingSlash: false
    });

    res.socket.server.io = io;
    res.end();
  }
}
