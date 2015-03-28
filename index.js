var express = require('express');
var app = express();
var parseArgs = require('minimist');
var RoomStatus = require('./queries').RoomStatus;

var args = parseArgs(process.argv.slice(2));

app.listen(args.port, function() {
  console.log('listening at :%s', args.port)
});

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/list', function(req, res) {
  var end = new Date();
  var start = new Date(end);
  start.setDate(start.getDate() - 1);
  RoomStatus.query(start, end, req.query.page || 0).then(function(results) {
    var mapped = results.map(function(result) {
      return {
        temp: result.attributes.temperature,
        humi: result.attributes.humidity,
        ts: result.createdAt.toISOString()
      }
    });
    res.send({results: mapped});
  }, function(error) {
    console.dir(error);
  });
});

