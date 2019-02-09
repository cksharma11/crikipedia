const http = require('http');
const url = require('url');
const fs = require('fs');
const { getPlayerDetails } = require('./js/cricket_api');
const PORT = process.env.PORT || 8000;

const parseURL = req => url.parse(req.url, true);

const getHomePage = () => '/index.html';
const getFindPlayerPage = () => '/find_player';

const setPath = parsedURL => '.' + parsedURL.pathname;

const setContentTypeHTML = () => 'text/html';
const setContentTypeCSS = () => 'text/css';

const writeHead = (res, data, contentType) => {
  res.writeHead(200, { 'Content-Type': contentType });
  res.write(data);
  return res.end();
};
const getNotFoundCode = res => {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  return res.end('404 Not Found');
};

const getContentType = filename => {
  let contentType = setContentTypeHTML();
  if (filename.endsWith('.css')) {
    contentType = setContentTypeCSS();
  }
  return contentType;
};

const readHTML = (filename, res) => {
  fs.readFile(filename, function(err, data) {
    if (err) {
      return getNotFoundCode(res);
    }
    const contentType = getContentType(filename);
    return writeHead(res, data, contentType);
  });
};

const requestHandler = function(req, res) {
  const parsedURL = parseURL(req);

  if (parsedURL.pathname == '/') {
    parsedURL.pathname = getHomePage();
  }

  if (parsedURL.pathname == getFindPlayerPage()) {
    return getPlayerDetails(parsedURL.query.player_name, res);
  }
  const filename = setPath(parsedURL);
  return readHTML(filename, res);
};

const server = http.createServer(requestHandler);
server.listen(8000, () => console.log('Listening on port', PORT));
