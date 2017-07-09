
var serverGame;
var username, playerColor;
var oppName, oppColor;
var usersOnline = [];
var socket = io();

var login = function(){
    username = document.getElementById('username').value;
    if(username.length > 0){
        socket.emit('login', username);
		
		var element = document.getElementById('gameBoard');
		element.innerHTML = '';
		
		loadBoard(element);
    }else{
		alert("Please enter your username in order to play in multiplayer!");
	}
};

socket.on('login', function(users) {
    usersOnline = users;
    updateUserList();

    hide('login');
    show('lobby');
	hide('game');
});

socket.on('duplicate', function(){
	alert('Username already used. Please enter new username!');
});

socket.on('joinlobby', function (userId) {
    usersOnline.push(userId);
    updateUserList();
});

socket.on('leavelobby', function (data) {
    removeUser(data);
});

socket.on('joingame', function(data) {
	serverGame = data.game;
    console.log("joined as game id: " + serverGame.id );  
	
	socket.emit('entergame', serverGame.id);
	
    playerColor = data.color;
	oppName = data.oppName;
	oppColor = data.oppColor;
    gameStart(username, playerColor, oppName, oppColor);

    hide('lobby');
    show('game');
});

socket.on('putColor', function(data){
    if(serverGame.id === data.gameId){
        putColor(data.x, data.y, data.playerColor);
    }
});

var resign = function(){
    socket.emit('resign', {userId: username, gameId: serverGame.id});

    clearGame();
	
	socket.emit('relogin', username);
	socket.emit('login', username);
};

socket.on('resign', function(data) {
    if (data.gameId == serverGame.id) {
        clearGame();

		socket.emit('relogin', username);
		socket.emit('login', username);
    }            
});

socket.on('logout', function (data) {
    removeUser(data.userId);
    
    if (data.gameId == serverGame.id) {
		console.log('restart game');
		
		clearGame();

		socket.emit('relogin', username);
		socket.emit('login', username);
    }     
});

var removeUser = function(userId) {
    for (var i = 0; i < usersOnline.length; i++) {
        if (usersOnline[i] === userId) {
            usersOnline.splice(i, 1);
        }
    }     
    updateUserList();
};

var updateUserList = function() {
    var userList = document.getElementById('userList');
    userList.innerHTML = '';

    usersOnline.forEach(function(user) {
        var button = document.createElement('button');
        var text = document.createTextNode(user);
        button.appendChild(text);
        button.onclick = function(){
            socket.emit('invite', user);
        };
        userList.appendChild(button);
    });
};

var hide = function(div){
    var element = document.getElementById(div);
    element.style.display = 'none';
}

var show = function(div){
    var element = document.getElementById(div);
    element.style.display = 'block';
}

var send = function(){
    message = document.getElementById('message').value;
    if(message.length > 0){
        socket.emit('send', {msg: message, gameId: serverGame.id});
		
		sendMessage(message, 'self');
    }
};

socket.on('sendMessage', function(data){
	if (data.gameId == serverGame.id) {
		sendMessage(data.msg, 'friend');
    }  
});

var sendMessage = function(msg, sender){
	var chat = document.createElement('div');
	chat.setAttribute("class", "chat " + sender);
	
	var photo = document.createElement('div');
	photo.setAttribute("class", "user-photo");
	
	var img = document.createElement('img');
	if(sender == "self"){
		img.setAttribute("src", picture[player]);
	}else{
		img.setAttribute("src", picture[opponent]);
	}
	photo.appendChild(img);
	
	var message = document.createElement('p');
	message.setAttribute("class", "chat-message");
	
	var text = document.createTextNode(msg);
	message.appendChild(text);
	
	chat.appendChild(photo);
	chat.appendChild(message);
	
	document.getElementById('chatlog').appendChild(chat);
	
	document.getElementById('message').value = '';
}