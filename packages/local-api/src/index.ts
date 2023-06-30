import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { cellRoutes } from './routes/cellRoutes';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(express.json());
  // wire up the cells router
  app.use('/cells', cellRoutes(filename, dir));

  // app.use('/cells', createCellsRouter(filename, dir));

  if (useProxy) {
    // used to allow development in local machine
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:5173',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    // grab build files for users to access react app when running the cli
    const packagePath = require.resolve(
      '@notasjs/local-client/dist/index.html'
    );
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
