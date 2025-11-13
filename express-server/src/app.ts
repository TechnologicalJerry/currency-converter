
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { indexRouter } from './routes/index.routes.js';

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: (process.env.CLIENT_ORIGIN ?? '*').split(','),
  credentials: true,
};

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api', indexRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
  });
});

export default app;
