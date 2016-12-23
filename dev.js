var express = require('express')
var app = express()
var path = require('path');

// Helpers

// Index Pages
// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));
// });

// Mocked Data
// app.get('/api/...', function(req, res) {
//     res.sendFile(path.join(__dirname + '/data/....json'));
// });

// Static Files
app.use('/', express.static('.'));

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})