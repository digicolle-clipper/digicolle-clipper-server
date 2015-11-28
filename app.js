var koa = require('koa');
var views = require('koa-views');
var jade = require('jade');
var router = require('koa-router');
var body = require('koa-body-parser');
var koaPg = require('koa-pg')
var settings = require('./settings.js');

var app = koa();

app.use(views('views', {
  default: 'jade'
}));
app.use(require('koa-static')('static'));
app.use(body());
app.use(koaPg(settings.pg_connection));
app.use(router(app));
 
app.get('/list', function *(next) {
  var photo = yield this.pg.db.client.query_('SELECT * FROM upload', []);
  this.body = photo.rows;
});

app.post('/upload', function *(next) {
  var ndl_id = this.request.body.ndl_id;
  var url = this.request.body.photo;
	var insert_result = yield this.pg.db.client.query_('INSERT INTO photo (pid, photo_url) values ($1, $2)', [ndl_id, url]);
  console.log(insert_result);
});

app.listen(3000);
