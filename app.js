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

serv.listen(2000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 2000);
});

/**
 * package communication(socket.io)
 *  client sends data to server
 *  server sends data to client
 */
var lobbyUsers = {};
var users = {};
var activeGames = {};
var id = 0;

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
    console.log('new connection ' + socket);

    socket.on('login', function(username){
        socket.userId = username;
        //if username is abailable
        if (!users[username]) {    
            console.log('creating new user: ' + socket.userId);
            users[username] = {userId: socket.userId, games:{}};
			
			socket.emit('login', Object.keys(lobbyUsers));
			lobbyUsers[username] = socket;
        
			socket.broadcast.emit('joinlobby', socket.userId);
        } else {
            console.log('user found!');
			
			socket.emit('duplicate');
        }
    });

    socket.on('invite', function(opponentId) {
        console.log('got an invitation: ' + socket.userId + ' --> ' + opponentId);
        
        socket.broadcast.emit('leavelobby', socket.userId);
        socket.broadcast.emit('leavelobby', opponentId);
      
       
        var game = {
            id: id++,
            board: null, 
            users: {white: socket.userId, black: opponentId}
        };
        
        activeGames[game.id] = game;
        
        users[game.users.white].games[game.id] = game.id;
        users[game.users.black].games[game.id] = game.id;
  
        lobbyUsers[game.users.white].emit('joingame', {game: game, color: 'white', oppName: opponentId, oppColor: 'black'});
        lobbyUsers[game.users.black].emit('joingame', {game: game, color: 'black', oppName: socket.userId, oppColor: 'white'});
        
        delete lobbyUsers[game.users.white];
        delete lobbyUsers[game.users.black];   
    });
	
	socket.on('entergame', function(data){
		socket.gameId = data;
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
	
	socket.on('relogin', function(gameId){
		delete users[gameId];
	});

    socket.on('disconnect', function() {
		socket.broadcast.emit('logout', {
            userId: socket.userId,
            gameId: socket.gameId
        });
		
        if (socket && socket.userId) {
            console.log('[' + socket.gameId + '] ' + socket.userId + ' disconnected');
        }
      
        delete lobbyUsers[socket.userId];
		delete users[socket.userId];
    });
	
	socket.on('send', function(data){
		socket.broadcast.emit('sendMessage', data);
	});
});