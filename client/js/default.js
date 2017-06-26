
var serverGame;
var username, playerColor;
var usersOnline = [];
var socket = io();

var login = function(){
    username = document.getElementById('username').value;
    if(username.length > 0){
        document.getElementById('user').innerText = username;
        socket.emit('login', username);
    }
};

socket.on('login', function(users) {
    usersOnline = users;
    updateUserList();

    hide('login');
    show('lobby');
});

socket.on('joinlobby', function (userId) {
    usersOnline.push(userId);
    updateUserList();
});

socket.on('leavelobby', function (data) {
    removeUser(data);
});

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

socket.on('joingame', function(data) {
    console.log("joined as game id: " + data.game.id );   
    serverGame = data.game;
    playerColor = data.color;
    gameStart('gameBoard', playerColor);

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
    socket.emit('login', username);

    clearGame();

    hide('game');
};

socket.on('resign', function(msg) {
    if (msg.gameId == serverGame.id) {
        socket.emit('login', username);

        clearGame();

        hide('game');
    }            
});

socket.on('logout', function (msg) {
    removeUser(msg.username);
    
    if (msg.gameId == serverGame.id) {
        socket.emit('login', username);

        clearGame();

        hide('game');
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

var hide = function(div){
    var element = document.getElementById(div);
    element.style.display = 'none';
}

var show = function(div){
    var element = document.getElementById(div);
    element.style.display = 'block';
}