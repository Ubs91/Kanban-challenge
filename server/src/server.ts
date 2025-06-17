const forceDatabaseRefresh = false;
import path from 'node:path';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
// Serves static files in the entire client's dist folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.use(routes);
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
} else {
  app.use(express.static('../client/dist'));
  app.use(routes);
}

sequelize.sync({force: forceDatabaseRefresh}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
