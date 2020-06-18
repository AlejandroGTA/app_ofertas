
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoSchema = new mongoose.Schema({
    Link:String,
    PrecioMasBajo:String,
    Precio:String,
    FlagEmail:Boolean
});

module.exports = ProductosModel = mongoose.model('ProductosModel', ProductoSchema);