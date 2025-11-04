
import * as Hapi from '@hapi/hapi';
import * as dotenv from 'dotenv';
dotenv.config();
import authRoutes from './api/auth';
import { authPlugin } from './middlewares/auth';
import pino from 'hapi-pino';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
  });

  await server.register(authPlugin);
  await server.register({
    plugin: pino,
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      logEvents: ['response', 'onPostStart'],
    },
  });

  server.route(authRoutes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
