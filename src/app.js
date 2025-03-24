const express = require('express');
const cors = require('cors');
const sequelize = require('./util/db.js');

const controllerErrors = require('./middleware/catchControllerErrors.js')

const activityRoutes = require('./routes/activity.js');
const authRoutes = require('./routes/auth.js');
const taskRoutes = require('./routes/task.js');
const habitRoutes = require('./routes/habit.js');
const areaOfLifeRoutes = require('./routes/areaOfLife.js');



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


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
app.use('/api', taskRoutes)
app.use('/api', habitRoutes);
app.use('/api', areaOfLifeRoutes);

app.use(controllerErrors);







sequelize.authenticate().then(function(){
  console.log("Connected successfully!")
}).catch(function(erro){
  console.log("Failed to connect: "+erro)
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server online on port ${process.env.PORT || 3000}`);
});