
import 'dotenv/config';
import http from 'node:http';

import app from './app.js';
import { connectDatabase, disconnectDatabase } from './configs/database.js';

const PORT = Number.parseInt(process.env.PORT ?? '5000', 10);

let server: http.Server | undefined;

const startServer = async () => {
  try {
    await connectDatabase();

    server = http.createServer(app);
    server.listen(PORT, () => {
      const env = process.env.NODE_ENV ?? 'development';
      // eslint-disable-next-line no-console
      console.log(`🚀 Server listening on port ${PORT} (${env})`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to start server', error);
    process.exit(1);
  }
};

void startServer();

const gracefulShutdown = (signal: NodeJS.Signals) => {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}. Closing HTTP server…`);
  const closeServer = async () => {
    if (!server) {
      return;
    }

    await new Promise<void>((resolve) => {
      server?.close((closeError) => {
        if (closeError) {
          // eslint-disable-next-line no-console
          console.error('Error during server shutdown', closeError);
          process.exitCode = 1;
        }
        resolve();
      });
    });
  };

  void closeServer()
    .then(() => disconnectDatabase())
    .finally(() => {
      process.exit();
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
