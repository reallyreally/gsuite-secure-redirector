var express = require('express');
var router = express.Router();

var serviceMap = {
  "mail": {
    "raw": "https://mail.google.com/a/{{domain}}",
    "extra": "https://mail.google.com/a/{{domain}}{{extra}}"
  },
  "webmail": {
    "raw": "https://mail.google.com/a/{{domain}}",
    "extra": "https://mail.google.com/a/{{domain}}{{extra}}"
  },
  "email": {
    "raw": "https://mail.google.com/a/{{domain}}",
    "extra": "https://mail.google.com/a/{{domain}}{{extra}}"
  },
  "calendar": {
    "raw": "https://www.google.com/calendar/hosted/{{domain}}",
    "extra": "https://www.google.com/calendar/hosted/{{domain}}{{extra}}"
  },
  "cal": {
    "raw": "https://www.google.com/calendar/hosted/{{domain}}",
    "extra": "https://www.google.com/calendar/hosted/{{domain}}{{extra}}"
  },
  "calender": {
    "raw": "https://www.google.com/calendar/hosted/{{domain}}",
    "extra": "https://www.google.com/calendar/hosted/{{domain}}{{extra}}"
  },
  "schedule": {
    "raw": "https://www.google.com/calendar/hosted/{{domain}}",
    "extra": "https://www.google.com/calendar/hosted/{{domain}}{{extra}}"
  },
  "webcal": {
    "raw": "https://www.google.com/calendar/hosted/{{domain}}",
    "extra": "https://www.google.com/calendar/hosted/{{domain}}{{extra}}"
  },
  "drive": {
    "raw": "https://drive.google.com/a/{{domain}}",
    "extra": "https://drive.google.com/a/{{domain}}{{extra}}"
  },
  "docs": {
    "raw": "https://drive.google.com/a/{{domain}}",
    "extra": "https://drive.google.com/a/{{domain}}{{extra}}"
  },
  "files": {
    "raw": "https://drive.google.com/a/{{domain}}",
    "extra": "https://drive.google.com/a/{{domain}}{{extra}}"
  },
  "sites": {
    "raw": "https://sites.google.com/a/{{domain}}/sites/system/app/pages/meta/dashboard",
    "extra": "https://sites.google.com/a/{{domain}}{{extra}}"
  },
  "groups": {
    "raw": "https://groups.google.com/a/{{domain}}",
    "extra": "https://groups.google.com/a/{{domain}}{{extra}}"
  }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* GET home page. */
router.get('*', function(req, res, next) {
  var hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host;
  var pathname = req.path;
  var hostSplit = hostname.split(/\.(.+)/);
  var service = hostSplit[0];
  var domain = hostSplit[1];

  if(serviceMap[service] !== undefined) {
    if(pathname === '/') {
      var redirectURL = serviceMap[service].raw;
    } else {
      var redirectURL = serviceMap[service].extra;
      redirectURL = redirectURL.replaceAll('{{extra}}', pathname);
    }

    redirectURL = redirectURL.replaceAll('{{domain}}', domain);

    //res.render('index', { title: redirectURL });
    return res.redirect(301, redirectURL);
  } else {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
});

module.exports = router;
