var express = require('express');
var app = express();
app.use('/', express.static('.'));
app.listen(3000, function () {
  console.log('open browser to http://localhost:3000/demo')
});
