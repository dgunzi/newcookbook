/*!
 * cookbook - route.js
 * 
 */

var site = require('./controllers/site');
var cookbook = require('./controllers/cookbook');

module.exports = function (app) {
  // home page
  app.get('/', site.index);
  //view
  app.get('/:post', cookbook.cookbook_view);
  
};  