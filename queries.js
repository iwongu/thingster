var Parse = require('parse').Parse;
var parseArgs = require('minimist');

var args = parseArgs(process.argv.slice(2));

Parse.initialize(args.parseappid, args.parsejskey);

var RoomStatus = Parse.Object.extend('RoomStatus', {
  initialize: function(attrs, options) {
  },
}, {
  query: function(start, end, page) {
    var q = new Parse.Query(RoomStatus);
    q.greaterThanOrEqualTo('createdAt', start);
    q.lessThan('createdAt', end);
    q.ascending('createdAt');
    q.limit(1000);
    q.skip(page * 1000);
    return q.find();
  }
});

module.exports.RoomStatus = RoomStatus;
