const http = require('http');

const timeout = process.env.TIMEOUT || 5000;
const interval = process.env.INTERVAL || 500;

http.createServer((req, res) => {
  if (req.url === '/') {
    console.log('server start');

    let run = true;

    setTimeout(() => {
      run = false;
    }, timeout);

    const timer = setInterval(() => {
      if (run) {
        console.log(Date());
      } else {
        clearInterval(timer);
        console.log('Finish server');
        res.writeHead(200, { 'Content-type': 'text/plain' });
        res.end(Date());
      }
    }, interval);
  }
}).listen(8080);
