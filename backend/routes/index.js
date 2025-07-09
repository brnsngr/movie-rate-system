var express = require('express');
var router = express.Router();

const fs = require('fs');
let routes = fs.readdirSync(__dirname);

for(let route of routes){
  if(route.includes('.js') && route != 'index.js'){
    console.log('Mounting route:'+route);
    router.use('/'+route.replace('.js',''),require('./'+route));
  }
}






/* GET  page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

module.exports = router;
