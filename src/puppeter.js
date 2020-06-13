const puppeteer = require('puppeteer');
const extrac = require('cheerio');

var url =  
[ 
    "https://www.amazon.com.mx/Gateron-RGB-Interruptor-mec%C3%A1nico-Transparente/dp/B083F4M9LQ/ref=sr_1_6?__mk_es_MX=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=gateron&qid=1591072189&sr=8-6&th=1",
    "https://www.amazon.com.mx/Dioche-Respaldo-inal%C3%A1mbrica-Impermeable-autom%C3%B3viles/dp/B07TVLL2DX/ref=sr_1_17_sspa?__mk_es_MX=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=dioche+cam&qid=1591073205&sr=8-17-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyVkhSMjRCTEVFQ1ZYJmVuY3J5cHRlZElkPUEwMDM3NDYxMUVDSUpXSVcwU1JFSyZlbmNyeXB0ZWRBZElkPUEwMjgzOTg5M0s1RUI0OEpZMElZNSZ3aWRnZXROYW1lPXNwX2F0Zl9uZXh0JmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=="
];

var time = 3600000;
var time2 = (50 * 1000);
setInterval(function(){revisar();}, time);

function revisar(){
  (async () => {
    const browser = await puppeteer.launch();
    for(var i = 0; i < url.length; i++){
      const page = await browser.newPage();
      await page.goto(url[i]);
      await page.screenshot({path: 'page_'+i+'.png'});
      let html = await page.evaluate(()=> document.body.innerHTML);
      //console.log(html);

      extrac('#priceblock_ourprice', html).each(function(){
          let precio = extrac(this).text();
          console.log(precio);
      });
    }
    await browser.close();
  })();
}