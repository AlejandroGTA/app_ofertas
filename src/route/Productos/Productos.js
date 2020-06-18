const express = require('express');
const mongo = require('mongoose');
const Prodcutos = require('../../DB/Schemas/Productos');
const route = express.Router();

route.get('/home', async(req, res)=>{
    let productoModel = await Prodcutos.find({});
    // console.log(productoModel);
    // res.json(productoModel);
    res.render('index',{
        productoModel:productoModel
    });
});

route.post('/',async(req, res)=>{
    const {Link,PrecioMasBajo,Precio,FlagEmail} = req.body;
    let productoModel =  new Prodcutos;
    productoModel.Link = Link;
    productoModel.PrecioMasBajo = PrecioMasBajo;
    productoModel.Precio = Precio;
    productoModel.FlagEmail = FlagEmail;
    await productoModel.save();
    res.json(productoModel);
    // console.log("save");
});

route.get('/',async(req, res)=>{
    let productoModel = await Prodcutos.find({});
    // console.log(productoModel);
    res.json(productoModel);
});

route.get('/:id',async(req, res)=>{
    let id = req.params.id;
    let productoModel = await Prodcutos.find({_id:id});
    // console.log(productoModel);
    res.json(productoModel);
});

route.put('/:id',async(req, res)=>{
    let id = req.params.id;
    const {Link,PrecioMasBajo,Precio,FlagEmail} = req.body;
    let productoDomain = await Prodcutos.findByIdAndUpdate(
        id,
        {Link:Link,
        PrecioMasBajo:PrecioMasBajo,
        Precio:Precio,
        FlagEmail:FlagEmail}
    );
    res.json(productoDomain);
});

route.delete('/:id',async(req, res)=>{
    let id = req.params.id;
    let mensaje
    try{
        await Prodcutos.findOneAndDelete({_id:id});
        mensaje ="delete complete";
    }
    catch{
        mensaje = "id invalid";
    }
    // console.log(productoModel);
    res.json(mensaje);
});

module.exports = route;