import express from 'express';

import database from './libs/database.js';

import errorMiddleware from './middlewares/errors.js';

import planetsRoutes from './routes/planets.routes.js';
import explorationsRoutes from './routes/explorations.routes.js';

database();

const app = express();

app.use(express.json());

// TODO: Ajouter le path de base pour les différentes routes
app.use('/planets', planetsRoutes);
app.use('/explorations', explorationsRoutes);

app.use(errorMiddleware);

export default app;