var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, function(err, data) {
    data = data + '';
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  this.readListOfUrls(array => callback(array.includes(url)));
};

exports.addUrlToList = function(url, callback) {
  this.isUrlInList(url, (exists) => {
    if (!exists) {
      callback(fs.appendFile(this.paths.list, url + '\n'));
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(this.paths.archivedSites, (err, files) => {
    callback(files.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  var self = this;
  
  urls.forEach(function(url) {
    http.get('http://' + url, function(resp) {
      var body = '';
      
      resp.on('data', function(chunk) {
        body += chunk; 
      });
      
      resp.on('end', function() {
        fs.writeFile(self.paths.archivedSites + '/' + url, body);
      });
      
      resp.on('error', function(err) {
        console.log('error: ' + err.message);
      });
    });
  });
};
