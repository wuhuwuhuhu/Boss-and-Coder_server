 module.exports = function (server) {
     //get IO object
     //socket.io v3 requires the cors
     const io = require('socket.io')(server, {
        cors: {
          origin: '*',
        }
      })
     //listen connection
     io.on('connection', function(socket) {
         console.log('socketio connected')
         //listen socket
         socket.on('sendMsg', function(data){
             console.log('server received: ',data)
             //send msg to client
             io.emit('receiveMsg', 'Hi, all Clients. Server received' + data)
             //socket.emit('receiveMsg', 'Hi, Client. Server received your' + data) //just send to the socket
             console.log('server send to Client:' + data)
         })
     })
 }