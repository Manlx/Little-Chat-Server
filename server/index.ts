import {WebSocketServer } from "ws"

const server = new WebSocketServer({
  port: 5000
})

server.on('connection', function connection(newClientConnection) {

  newClientConnection.on('message', function message(data) {

    console.log('received: %s', data);

    server.clients.forEach((clientConnection)=>{

      if (clientConnection !== newClientConnection){

        clientConnection.send(data)
      }
    })
  });


  newClientConnection.on('close', ()=>{

    const dcMessage: TextMessage = {
      method: 'TextMessage',
      payLoad: 'User Disconnected',
      name: 'Server'
    }

    console.log(`Remaining Clients: ${server.clients.size}`)

    const dcMessageText = JSON.stringify(dcMessage)

    server.clients.forEach((clientConnection)=>{

      if (clientConnection !== newClientConnection){

        clientConnection.send(dcMessageText)
      }
    })
  })
});