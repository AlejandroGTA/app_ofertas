const MongoClient = require('mongoose');
const prodcutos = require('../../DB/Schemas/Productos');
const uri = "mongodb+srv://Ale_dbuser:Alex12345678@cluster0-sas3p.mongodb.net/test?retryWrites=true&w=majority";

const connectMongo = async () => {
   await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
   console.log("mogno conect");
}

function findAll (){
   let Productos = new prodcutos();
   Productos = MongoClient.Collection.find();
   return Productos;
}

module.exports = connectMongo;
