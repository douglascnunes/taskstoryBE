const express = require('express');

const sequelize = require('./util/db.js');


const overviewRoutes = require('./routes/overview.js')


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(overviewRoutes);


sequelize.authenticate().then(function(){
  console.log("Conectado com sucesso!")
}).catch(function(erro){
  console.log("Falha ao se conectar: "+erro)
})

sequelize.sync({force: (process.env.SYNC_FORCE === 'true')})


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server online on port ${process.env.PORT || 3000}`);
});