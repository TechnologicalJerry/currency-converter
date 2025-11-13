
import 'dotenv/config';
import http from 'node:http';

import app from './app.js';

const PORT = Number.parseInt(process.env.PORT ?? '5000', 10);

const server = http.createServer(app);

server.listen(PORT, () => {
  const env = process.env.NODE_ENV ?? 'development';
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on port ${PORT} (${env})`);
});

const gracefulShutdown = (signal: NodeJS.Signals) => {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}. Closing HTTP server…`);
  server.close((error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error during server shutdown', error);
      process.exitCode = 1;
    }
    process.exit();
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
