const http = require('http');
const url = require('url');
const fs = require('fs');
const { getPlayerDetails } = require('./js/cricket_api');

http
  .createServer(function(req, res) {
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname == '/') {
      parsedUrl.pathname = '/index.html';
    }
    console.log(parsedUrl.query.player_name);
    if (parsedUrl.pathname == '/find_player') {
      getPlayerDetails(parsedUrl.query.player_name, res);
    } else {
      const filename = '.' + parsedUrl.pathname;
      console.log(filename);
      fs.readFile(filename, function(err, data) {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end('404 Not Found');
        }
        let contentType = 'text/html';
        if (filename.endsWith('.css')) {
          contentType = 'text/css';
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        return res.end();
      });
    }
  })
  .listen(8888);
