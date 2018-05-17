var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  
  if (req.method === 'POST') {
    res.statusCode = 302;
    var body = '';
    req.on('data', chunk => {
      body += chunk;
    })
      .on('end', function() {
        fs.appendFile(archive.paths.list, body.slice(4) + '\n');
        res.end();
      });
    //console.log('This is da body', body);
  } else if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
      res.end(data);
    });
  } else if (req.method === 'GET') {
    res.statusCode = 200;
    //console.log(req.url);
    fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
      if (err) {
        res.statusCode = 404;
        res.end();
      }
      res.end(data);
    });
  } 
  
  // res.end(archive.paths.list);
};
