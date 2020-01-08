var http = require('http'),
    connect = require('connect'),
    bodyParser = require('body-parser'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({});


//restream parsed body before proxying
proxy.on('proxyReq', function(proxyReq, req, res, options) {
    if (!req.body || !Object.keys(req.body).length) {
      return;
    }
  
    var contentType = proxyReq.getHeader('Content-Type');
    var bodyData;
  
    if (contentType === 'application/json') {
      bodyData = JSON.stringify(req.body);
    }
  
    if (contentType === 'application/x-www-form-urlencoded') {
      bodyData = queryString.stringify(req.body);
    }
  
    if (bodyData) {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  });
  
  
  //
  //  Basic Http Proxy Server
  //
  var app = connect()
    .use(bodyParser.json())//json parser
    .use(bodyParser.urlencoded())//urlencoded parser
    .use(function(req, res){
      // modify body here,
      // eg: req.body = {a: 1}.
      console.log('URL:', req.originalUrl, ', BODY:',JSON.stringify(req.body, true, 2))
      proxy.web(req, res, {
        target: 'http://127.0.0.1:9200'
      })
    });
  
  http.createServer(app).listen(8013, function(){
    console.log('proxy linsten 8013');
  });
