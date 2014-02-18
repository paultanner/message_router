// REST interface to receive inputs and dispatch
start_htserver=function(route) {
  var handle = {}
    handle["/"] = api;
    handle["/start"] = api;
  var http = require("http");
  var url = require("url");

  function route(handle, pathname, response, postData) {
    if (typeof handle[pathname] === 'function') {
      handle[pathname](response, postData);
    } else {
      console.log("No request handler found for " + pathname);
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not found");
      response.end();
    }
  }
  function api(response, data) {
    console.log("api got",data);
    data=unescape(data).replace("msg=","");
    console.log("api trans",data);
    if (data=="") data="{}";
    var resp={'msg':'default'};
    var parsed={};
    try {
        parsed=JSON.parse(data);
        do_process(parsed,function(msg) {
          console.log("processed to",msg);
          resp=msg;
        });
    } catch (err) {
        console.log("parse error", data, err);
        resp={'msg':'parse error'};
    }
    response.writeHead(200, {"Content-Type": "application/json"});
    resp=JSON.stringify(resp);
    console.log("responding with",resp);
    response.write(resp);
    response.end();
  }

  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    request.setEncoding("utf8");
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
    });

    request.addListener("end", function() {
      route(handle, pathname, response, postData);
    });
  }

  http.createServer(onRequest).listen(8888);
  console.log(timestamp(),"htserver running");
}

function timestamp() {
  var moment=require('moment');
  return moment().format();
}

function do_process(input,func) {
  console.log("input",input);
  switch (input.topic) {
    case 'medical' :
      input.agency="St Anne's Hospital";
      break;
    case 'medical' :
      input.agency="St Anne's Hospital";
      break;
     case 'callback' :
      input.agency="Friendly local person";
      break;
     case 'physical' :
      input.agency="John Doe, hunky guy";
      break;
     case 'materials' :
      input.agency="B&Q";
      break;
     case 'vehicle' :
      input.agency="Fred's Taxi";
      break;
     case 'food' :
      input.agency="Pret a Manger";
      break;
     case 'electrician' :
      input.agency="Eric's Electrics";
      break;
     case '' :
      input.agency="118 998";
      break;
     default:
      input.agency="GCHQ (been hacked)";
  }
  switch (input.location) {
    case 'TA3 6HY':
      input.branch ="Taunton";
      break;
    case 'GU34 3ES':
      input.branch = "Alton";
      break;
    case 'GL50 1LS':
      input.branch = "Gloucester";
      break;
    default:
      input.branch = "Somewhere or other";
  }
  func(input);
}

start_htserver();
