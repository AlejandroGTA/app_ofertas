
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoSchema = new mongoose.Schema({
    Link:String,
    Precio:String,
    PrecioAnterior:String
});

module.exports = ProductosModel = mongoose.model('ProductosModel', ProductoSchema);