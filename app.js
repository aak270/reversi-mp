/**
 * file communication(express)
 *  client asks server for a file
 */
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000); 
console.log("Server started on port: 2000")

/**
 * package communication(socket.io)
 *  client sends data to server
 *  server sends data to client
 */
var lobbyUsers = {};
var users = {};
var activeGames = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
    console.log('new connection ' + socket);

    socket.on('login', function(username){
        socket.userId = username;
        //if username is abailable
        if (!users[username]) {    
            console.log('creating new user');
            users[username] = {userId: socket.userId, games:{}};
        } else {
            console.log('user found!');
            Object.keys(users[username].games).forEach(function(gameId) {
                console.log('gameid - ' + gameId);
            });
        }
        
        socket.emit('login', Object.keys(lobbyUsers));
        lobbyUsers[username] = socket;
        
        socket.broadcast.emit('joinlobby', socket.userId);
    });

    socket.on('invite', function(opponentId) {
        console.log('got an invitation: ' + socket.userId + ' --> ' + opponentId);
        
        socket.broadcast.emit('leavelobby', socket.userId);
        socket.broadcast.emit('leavelobby', opponentId);
      
       
        var game = {
            id: Math.floor((Math.random() * 100) + 1),
            board: null, 
            users: {white: socket.userId, black: opponentId}
        };
        
        socket.gameId = game.id;
        activeGames[game.id] = game;
        
        users[game.users.white].games[game.id] = game.id;
        users[game.users.black].games[game.id] = game.id;
  
        console.log('starting game: ' + game.id);
        lobbyUsers[game.users.white].emit('joingame', {game: game, color: 'white'});
        lobbyUsers[game.users.black].emit('joingame', {game: game, color: 'black'});
        
        delete lobbyUsers[game.users.white];
        delete lobbyUsers[game.users.black];   
    });

    socket.on('putPiece', function(data){
        socket.broadcast.emit('putColor', data);
    });

    socket.on('resign', function(data) {
        console.log("resign: " + data);

        delete users[activeGames[data.gameId].users.white].games[data.gameId];
        delete users[activeGames[data.gameId].users.black].games[data.gameId];
        delete activeGames[data.gameId];

        socket.broadcast.emit('resign', data);
    });

    socket.on('disconnect', function(data) {
        console.log(data);
      
        if (socket && socket.userId && socket.gameId) {
            console.log(socket.userId + ' disconnected');
            console.log(socket.gameId + ' disconnected');
        }
      
        delete lobbyUsers[socket.userId];
      
        socket.broadcast.emit('logout', {
            userId: socket.userId,
            gameId: socket.gameId
        });
    });
});