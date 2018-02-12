var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var express = require('express');
var uuidv4 = require('uuid/v4');
var path = require('path')

var NODE_ENV = process.env.NODE_ENV || 'dev'
var config = require('./webpack.' + NODE_ENV);
var indexPath = __dirname + '/dist/' + NODE_ENV + '.html'

var app = new (express)();
var port = process.env.PORT || (process.argv[2] || 3000);

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(express.static('dist'));

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))

app.get('/api/user', async function(req, res) {
    await timeout(1000)
    await res.json({
        name: 'jerry',
        age: 12,
        sex: 'm',
        id: uuidv4(),
    })
})

app.get('/service-worker.js', function(req, res) {
    res.sendFile(path.resolve(__dirname, './service-worker.js'))
})

app.get("/manifest.json", function(req, res) {
  res.sendFile(path.resolve(__dirname, './manifest.json'));
});

app.get("/", function(req, res) {
  res.sendFile(indexPath);
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
