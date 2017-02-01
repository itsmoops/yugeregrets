var express = require('express');
var app = express();
var cors = require('cors')

app.set('port', (process.env.PORT || 5000));

app.use(cors());

app.use(express.static(__dirname + '/src'));

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
