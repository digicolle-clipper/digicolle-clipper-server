var koa = require('koa');
var views = require('koa-views');
var jade = require('jade');
var router = require('koa-router');
var body = require('koa-body-parser');
var koaPg = require('koa-pg');
var settings = require('./settings.js');

var app = koa();

app.use(views('views', {
  default: 'jade'
}));
app.use(require('koa-static')('static'));
app.use(body());
app.use(koaPg(settings.pg_connection));
app.use(router(app));
require('koa-qs')(app);;
 
app.get('/list', function *(next) {
  var parsed = this.query;
  var limit = this.query.limit ? parseInt(this.query.limit) : 20;
  var offset = this.query.of ? parseInt(this.query.of) : 0;
  var photos = yield this.pg.db.client.query_('SELECT * FROM photo LIMIT $1 OFFSET $2', [limit, offset]);
  this.body = photos.rows;
});

app.get('/random', function *(next) {
  var photos = yield this.pg.db.client.query_('SELECT * FROM photo ORDER BY random() LIMIT 1', []);
  this.body = photos.rows[0];
});

app.post('/upload', function *(next) {
  var ndl_id = this.request.body.ndl_id;
  var url = this.request.body.photo;
  var description = this.request.body.description ? this.request.body.description : '';
	var insert_result = yield this.pg.db.client.query_('INSERT INTO photo (pid, photo_url, description) values ($1, $2, $3)', [ndl_id, url, description]);
  this.body = insert_result.rows;
});

app.get('/', function *(next) {
  var photos = yield this.pg.db.client.query_('SELECT * FROM photo', []);
  yield this.render('show', {photos: photos.rows});
});

app.get('/tinder', function *(next) {
  var photos = yield this.pg.db.client.query_('SELECT * FROM photo', []);
  yield this.render('tinder', {photos: photos.rows});
});
app.listen(3000);
