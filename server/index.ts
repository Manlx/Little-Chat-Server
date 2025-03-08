import chalk from "chalk";
import {WebSocketServer } from "ws"
import http from "http"
import fs from "fs"
import path from "path";

const server = new WebSocketServer({
  port: 5000
})

const HTTPServerPort = 3000

const htmlServer = http.createServer((req,res)=>{

  var filePath = './client' + req.url;
  if (filePath == './client/')
      filePath = './client/index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
      case '.js':
          contentType = 'text/javascript';
          break;
      case '.css':
          contentType = 'text/css';
          break;
      case '.json':
          contentType = 'application/json';
          break;
      case '.png':
          contentType = 'image/png';
          break;      
      case '.jpg':
          contentType = 'image/jpg';
          break;
      case '.wav':
          contentType = 'audio/wav';
          break;
  }

  fs.readFile(filePath, function(error, content) {
      if (error) {
          if(error.code == 'ENOENT'){
              fs.readFile('./client/404.html', function(error, content) {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
              });
          }
          else {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            res.end(); 
          }
      }
      else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
  });
});

htmlServer.listen(HTTPServerPort,()=>{
  console.log(chalk.cyanBright(`listening on http://localhost:${HTTPServerPort}`))
})

const logUserCount = (message: string, count: number) => console.log(`${chalk.green(message)} ${chalk.red(count)}`)

const logUserMessage = (userName: string, message: string) => console.log(`${chalk.cyan(userName)}: ${chalk.green(message)}`)

const logUserJoin = (userName: string) => console.log(`${chalk.yellow(userName)} ${chalk.magenta('Joined')}`)

server.on('connection', function connection(newClientConnection) {

  newClientConnection.on('message', function message(data) {

    // console.log('received: %s', data);

    const message: MessageFormat = JSON.parse(data.toString());

    if (message.method === 'TextMessage') {
      logUserMessage(message.name, message.payLoad)
    }

    if (message.method === 'Joining') {
      logUserJoin(message.payLoad.name)
    }

    server.clients.forEach((clientConnection)=>{

      if (clientConnection !== newClientConnection){

        clientConnection.send(data)
      }
    })
  });

  logUserCount(`Currently sitting at:`, server.clients.size)

  newClientConnection.on('close', ()=>{

    const dcMessage: TextMessage = {
      method: 'TextMessage',
      payLoad: 'User Disconnected',
      name: 'Server'
    }

    logUserCount(`Remaining Clients:`, server.clients.size)

    const dcMessageText = JSON.stringify(dcMessage)

    server.clients.forEach((clientConnection)=>{

      if (clientConnection !== newClientConnection){

        clientConnection.send(dcMessageText)
      }
    })
  })
});