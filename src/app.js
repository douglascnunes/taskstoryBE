import express from 'express';
import cors from 'cors';
import sequelize from './util/db.js';

import controllerErrors from './middleware/catchControllerErrors.js';

import activityRoutes from './routes/activity.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import habitRoutes from './routes/habit.js';
import areaOfLifeRoutes from './routes/areaOfLife.js';
import keywordRouters from './routes/keyword.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://127.0.0.1:5173", // Permite requisições do frontend
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', activityRoutes);
app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', habitRoutes);
app.use('/api', areaOfLifeRoutes);
app.use('/api', keywordRouters);

app.use(controllerErrors);

sequelize.authenticate().then(function () {
  console.log("Connected successfully!");
}).catch(function (erro) {
  console.log("Failed to connect: " + erro);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server online on port ${process.env.PORT || 3000}`);
});