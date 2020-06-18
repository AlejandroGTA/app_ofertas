const express = require('express');
const app = express();
var nodemailer = require('nodemailer');
const path = require('path');
const engine = require('ejs-mate');

const MongoClient = require('mongoose');
const uri = "mongodb+srv://Ale_dbuser:Alex12345678@cluster0-sas3p.mongodb.net/test?retryWrites=true&w=majority";

const connectMongo = async () => {
   await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
   console.log("mogno conect");
}
connectMongo();

const prodcutos = require('../src/DB/Schemas/Productos');

app.use(express.json());
app.use('/productos', require('../src/route/Productos/Productos'));
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine);
app.set('view engine','ejs');
app.use('/public',express.static(path.join(__dirname,'public')));

const port = process.env.port || 5000;
// process.env.PORT, '0.0.0.0'
app.listen(process.env.PORT, '0.0.0.0',function (){
    console.log("Started");
    
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ofertasalex1927@gmail.com',
    pass: 'AlejandroOfertas'
  }
});

const puppeteer = require('puppeteer');
const extrac = require('cheerio');

var Link_default = "https://www.amazon.com.mx/Echo-Dot-3ra-generaci%C3%B3n-inteligente/dp/B07PDHT86G/ref=sr_1_1_sspa?__mk_es_MX=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=alexa&qid=1592067159&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyRVdVM1A3WDBFVjdEJmVuY3J5cHRlZElkPUEwMTMzMjMwM1FSMlhIMVdVR0NHRCZlbmNyeXB0ZWRBZElkPUEwNjM4MDQwMzJGT05MQTQyWkc2RSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=";
var flag_link = 0;
var flagNull = 0;
var time = 1800000;
var time2 = (50 * 1000);

setInterval(function(){revisar();}, 90000);

function revisar(){
  var producto = async()=> { 
    var productosArray = await prodcutos.find({});
     console.log("Process find offerts");
    if(productosArray.length>0){
      (async () => {
        const browser = await puppeteer.launch({
           headless: true,
           args: ['--no-sandbox'],
        });
        const page = await browser.newPage();
        flagNull = 0;
        for(var i = 0; i < productosArray.length; i++){
            flag_link = 0;
            if(productosArray[i].Link == ""){
              flag_link = 1;
            }
            
            if(flag_link == 0){
              await page.goto(productosArray[i].Link);
            }
            else if(flag_link == 1){
              console.log("bad link");
              await page.goto(Link_default);
            }

            await page.screenshot({path: path.join(__dirname, 'public',`page_${i}.png`)});
            var html = await page.evaluate(()=> document.body.innerHTML);
            var precio = null;
            extrac('#priceblock_ourprice', html).each(function(){
                precio = extrac(this).text();
            });
            if(precio == null){
              extrac('#priceblock_saleprice', html).each(function(){
                precio = extrac(this).text();
              });
            }
            html = "";
            if(precio == null){
              flagNull = 1;
            }
            else{
              precio = precio.replace("$","");
              precio = precio.replace(",","");
              productosArray[i].Precio = precio;
              precio = precio * 1;
            }
            if(precio <= (productosArray[i].PrecioMasBajo*1) && productosArray[i].FlagEmail == false && flagNull == 0){
              productosArray[i].FlagEmail = true;

              var mailOptions = {
                from: 'ofertasalex1927@gmail.com',
                to: 'aguilar_1927@hotmail.com',
                subject: 'Sending Email using Node.js',
                text: 'Oferta!  '+precio+' Link: ' +productosArray[i].Link,
                attachments: [{
                  filename: 'page_'+i+'.png',
                  path: path.join(__dirname,'public','page_'+i+'.png'),
                  cid: 'img' 
                }]
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }
            if(precio == productosArray[i].precio){
            }
            else{
              if(flagNull == 0){
                var productoDomain = await prodcutos.findByIdAndUpdate(
                  productosArray[i]._id,{
                    Link:productosArray[i].Link,
                    PrecioMasBajo:productosArray[i].PrecioMasBajo,
                    Precio:productosArray[i].Precio,
                    FlagEmail:productosArray[i].FlagEmail  
                  }
                );
              }
            }
          await productoDomain.save();
        }
        productosArray = "";
        html = "";
        await browser.close();
      })();
    }
  }
  producto();
  };
