import express from 'express';

import database from './libs/database.js';

import errorMiddleware from './middlewares/errors.js';

import pizzeriasRoutes from './routes/pizzerias.routes.js';
import customersRoutes from './routes/customers.routes.js';
import ordersRoutes from './routes/orders.routes.js';

database();

const app = express();

app.use(express.json());

app.use('/pizzerias', pizzeriasRoutes);
app.use('/customers', customersRoutes);
app.use('/orders', ordersRoutes);

app.use(errorMiddleware);

export default app;