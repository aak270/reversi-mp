
//board size
var width = 8;
var height = 8;

//square size, piece size
var piecewidth = 40;
var pieceheight = 40;

//variable to hold the data
var board = new Array();		//hold the board pieces
var blackPieces = new Array();	//hold the black pieces
var whitePieces = new Array();	//hold the black pieces
var moves = new Array();		//hold the possible moves
var flipColor;					//the opposite color of the player
var pieces;						//2nd save array of player pieces
var score = [];					//hold the score
score["black"] = 0;				//black piece score
score["white"] = 0;				//white piece score

//set picture source
var picture = new Array();
picture["white"] = "/client/img/white.png";
picture["black"] = "/client/img/black.png";
picture["hint"] = "/client/img/hint.png";
picture["trans"] = "/client/img/trans.png";

//settings
var player = "black";
var playerName = "me";
var opponent = "white";
var opponentName = "you";
var turn = "black";

var gameStart = function(username, playerColor, oppName, oppColor){
	playerName = username;
	player = playerColor;
	opponentName = oppName;
	opponent = oppColor;
	
	showInfo(playerName, playerColor, opponentName, oppColor);
	initializeBoard(player);
};

var createInfo = function(username, nameId, playerColor, spanId, scoreId){
	if(playerName == username){
		var name = username + ' (-You-)';
	}else{
		var name = username;
	}
	var text = document.createTextNode(name);
	document.getElementById(nameId).innerHTML = '';
	document.getElementById(nameId).appendChild(text);
	
	var img = document.createElement('img');
	img.src = picture[playerColor];
	
	var span = document.createElement('span');
	span.id = spanId;
	text = document.createTextNode('2');
	span.appendChild(text);

	document.getElementById(scoreId).innerHTML = '';
	document.getElementById(scoreId).appendChild(img);
	document.getElementById(scoreId).appendChild(span);
	
};

var initializeBoard = function(playerColor){
	var id = "[3,3]";
	document.getElementById(id).src = picture["white"];
	board[3][3] = "white";
	id = "[4,4]";
	document.getElementById(id).src = picture["white"];
	board[4][4] = "white";
	id = "[3,4]";
	document.getElementById(id).src = picture["black"];
	board[3][4] = "black";
	id = "[4,3]";
	document.getElementById(id).src = picture["black"];
	board[4][3] = "black";

	//save the black and white piece location
	blackPieces = [[3,4],[4,3]];
	whitePieces = [[3,3],[4,4]];
	
	//set the score
	score['black'] = 2;
	score['white'] = 2;
		
	//show the possible moves
	if(playerColor == "black"){
		showMoves();
	}
	
	return 0;
};

var showInfo = function(username, playerColor, oppName, oppColor){
	createInfo(username, 'user-name', playerColor, 'user-score-text', 'user-score');
	createInfo(oppName, 'opp-name', oppColor, 'opp-score-text', 'opp-score');
	
	if(playerColor == turn){
		document.getElementById("user-score-box").style.border = '2px solid red';
	}else{
		document.getElementById("opp-score-box").style.border = '2px solid red';
	}
};

//load the board
var loadBoard = function(element){
	//create board array with size 8x8
	for(x = 0; x < width; x++){
		board[x] = new Array();
	}
	
	var table = document.createElement('table');
	table.border = '0';
	table.cellPadding = '0';
	table.cellSpacing = '0';
	table.bgColor = 'green';
	//rows
	for(y = 0; y < height; y++){
		var tr = document.createElement('tr');
		//cols
		for(x = 0; x < width; x++){
			var td = document.createElement('td');
			td.innerHTML = '<img src="' + picture["trans"] + '" id="[' + x + ',' + y + ']" onclick="putPiece(' + x + ', ' + y + ')" />';
			tr.appendChild(td);
			board[x][y] = "trans";
		}
		table.appendChild(tr);
	}
	element.appendChild(table);
	
	return 0;
}

//to show all of the possible moves for player
function showMoves(){

	//search the possible moves
	possibleMoves();
	//declare some variables
	var id;
	var x;
	var y;
	
	poscol = picture["hint"];
	
	//look through the array
	for(i = 0; i < moves.length; i++){
		x = moves[i][0];
		y = moves[i][1];
		id = "[" + x + "," + y + "]";
		document.getElementById(id).src = poscol;
		board[x][y] = "grey";
	}
	return 0;
}

//check every possible moves for a color
function possibleMoves(playerColor = player){
	//if black turn the flip piece is white else otherwise
	if(playerColor == "black"){
		flipColor = "white";
		//array contain player pieces
		pieces = blackPieces;
	}else{
		flipColor = "black";
		//array contain player pieces
		pieces = whitePieces;
	}
	
	//index to save the possible move
	var i = 0;
	var x;
	var y;
	
	//look through the player pieces array
	for(j = 0; j < pieces.length; j++){
		x = pieces[j][0];
		y = pieces[j][1];
		
		//if x or y is -1 skip
		if(x == -1 || y == -1){
			continue;
		}
		
		//if the right piece is opposite color, look through to the right
		if(x + 2 < width && board[x + 1][y] == flipColor){
			for(x_pos = x + 2; x_pos < width; x_pos++){
				//if the color is trans put it in the possible moves array
				if(board[x_pos][y] == "trans"){
					moves[i] = [x_pos, y];
					i++;
					break;
				}
				//if same as player
				if(board[x_pos][y] == playerColor){
					break;
				}
			}
		}
		//the same for down, left, and up
		//down
		if(y + 2 < height && board[x][y + 1] == flipColor){
			for(y_pos = y + 2; y_pos < height; y_pos++){
				//if the color is trans put it in the possible moves array
				if(board[x][y_pos] == "trans"){
					moves[i] = [x, y_pos];
					i++;
					break;
				}
				//if same as player
				if(board[x][y_pos] == playerColor){
					break;
				}
			}
		}
		//left
		if(x - 2 >= 0 && board[x - 1][y] == flipColor){
			for(x_pos = x - 2; x_pos >= 0; x_pos--){
				//if the color is trans put it in the possible moves array
				if(board[x_pos][y] == "trans"){
					moves[i] = [x_pos, y];
					i++;
					break;
				}
				//if same as player
				if(board[x_pos][y] == playerColor){
					break;
				}
			}
		}
		//up
		if(y - 2 >= 0 && board[x][y - 1] == flipColor){
			for(y_pos = y - 2; y_pos >= 0; y_pos--){
				//if the color is trans put it in the possible moves array
				if(board[x][y_pos] == "trans"){
					moves[i] = [x, y_pos];
					i++;
					break;
				}
				//if same as player
				if(board[x][y_pos] == playerColor){
					break;
				}
			}
		}
		//for upright
		if(x + 2 < width && y - 2 >= 0 && board[x + 1][y - 1] == flipColor){
			for(x_pos = x + 2, y_pos = y - 2; x_pos < width && y_pos >= 0; x_pos++, y_pos--){
				//if the color is trans put it in the possible moves array
				if(board[x_pos][y_pos] == "trans"){
					moves[i] = [x_pos, y_pos];
					i++;
					break;
				}
				//if same as player
				if(board[x_pos][y_pos] == playerColor){
					break;
				}
			}
		}
		//for downright
		if(x + 2 < width && y + 2 < height && board[x + 1][y + 1] == flipColor){
			for(x_pos = x + 2, y_pos = y + 2; x_pos < width && y_pos < height; x_pos++, y_pos++){
				//if the color is trans put it in the possible moves array
				if(board[x_pos][y_pos] == "trans"){
					moves[i] = [x_pos, y_pos];
					i++;
					break;
				}
				//if same as player
				if(board[x_pos][y_pos] == playerColor){
					break;
				}
			}
		}
		//for upleft
		if(x - 2 >= 0 && y - 2 >= 0 && board[x - 1][y - 1] == flipColor){
			for(x_pos = x - 2, y_pos = y - 2; x_pos >= 0 && y_pos >= 0; x_pos--, y_pos--){
				//if the color is trans put it in the possible moves array
				if(board[x_pos][y_pos] == "trans"){
					moves[i] = [x_pos, y_pos];
					i++;
					break;
				}
				//if same as player
				if(board[x_pos][y_pos] == playerColor){
					break;
				}
			}
		}
		//for downleft
		if(x - 2 >= 0 && y + 2 >= 0 && board[x - 1][y + 1] == flipColor){
			for(x_pos = x - 2, y_pos = y + 2; x_pos >= 0 && y_pos < height; x_pos--, y_pos++){
				//if the color is trans put it in the possible moves array
				if(board[x_pos][y_pos] == "trans"){
					moves[i] = [x_pos, y_pos];
					i++;
					break;
				}
				//if same as player
				if(board[x_pos][y_pos] == playerColor){
					break;
				}
			}
		}
	}
	return 0;
}

//put piece on the clicked square
function putPiece(x, y){
	//check can we put color or no
	if(canPutColor(x, y)){
		//send message to server
		socket.emit('putPiece', {x:x, y:y, playerColor:player, gameId: serverGame.id});
	
		putColor(x, y, player);
	}

}

//change the color on the clicked square
function putColor(x, y, playerColor){
	var id = "[" + x + "," + y + "]";
	document.getElementById(id).src = picture[playerColor];
	score[playerColor]++;
	//flip
	flip(x, y, playerColor);
		
	//if black turn the pieces is black else otherwise
	if(playerColor == "black"){
		//array contain player pieces
		pieces = blackPieces;
	}else{
		//array contain player pieces
		pieces = whitePieces;
	}
	
	board[x][y] = playerColor;
	pieces.push([x, y]);
	endTurn(false);		
}

//check can color be put or not
function canPutColor(x, y){
	if(board[x][y] != "grey") return false;
	if(turn != player) return false;
	return true;
}

//flip the color
function flip(x, y, playerColor){
	//if black turn the flip piece is white else otherwise
	if(playerColor == "black"){
		flipColor = "white";
		//array contain player pieces
		pieces = blackPieces;
	}else{
		flipColor = "black";
		//array contain player pieces
		pieces = whitePieces;
	}
	
	var id;
	
	//save new pieces location
	var newPieces = new Array();
	var p = 0;
	
	//flip direction
	var right = false;
	var left = false;
	var up = false;
	var down = false;
	var upright = false;
	var downleft = false;
	var upleft = false;
	var downright = false;
	
	//find the opposite pieces correspon to the possible moves
	for(i = 0; i < pieces.length; i++){
		//if x or y is -1 skip
		if(pieces[i][0] == -1 || pieces[i][1] == -1){
			continue;
		}
		
		//if it is in the same y axis
		if((!left || !right) && pieces[i][1] == y){
			//check it is on right or left
			if(pieces[i][0] > x && board[pieces[i][0] - 1][pieces[i][1]] == flipColor){
				right = true;
			}
			else if(pieces[i][0] < x && board[pieces[i][0] + 1][pieces[i][1]] == flipColor){
				left = true;
			}
		}
		//if it is in the same x axis
		if((!up || !down) && pieces[i][0] == x){
			//check it is on up or down
			if(pieces[i][1] > y && board[pieces[i][0]][pieces[i][1] - 1] == flipColor){
				down = true;
			}
			else if(pieces[i][1] < y && board[pieces[i][0]][pieces[i][1] + 1] == flipColor){
				up = true;
			}
		}
		//for same diagonal
		if((!upright || !upleft || !downright || !downleft) && Math.abs(pieces[i][0] - x) == Math.abs(pieces[i][1] - y)){
			//chack which direction
			if(pieces[i][0] > x && pieces[i][1] < y && board[pieces[i][0] - 1][pieces[i][1] + 1] == flipColor){
				upright = true;
			}
			else if(pieces[i][0] < x && pieces[i][1] < y && board[pieces[i][0] + 1][pieces[i][1] + 1] == flipColor){
				upleft = true;
			}
			else if(pieces[i][0] > x && pieces[i][1] > y && board[pieces[i][0] - 1][pieces[i][1] - 1] == flipColor){
				downright = true;
			}
			else if(pieces[i][0] < x && pieces[i][1] > y && board[pieces[i][0] + 1][pieces[i][1] - 1] == flipColor){
				downleft = true;
			}
		}
	}
	
	//flip correspon to the direction
	if(right){
		for(x_pos = x + 1; board[x_pos][y] == flipColor; x_pos++){
			//change the color to player color
			id = "[" + x_pos + "," + y + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x_pos][y] = playerColor;
			pieces.push([x_pos, y]);
			newPieces[p] = [x_pos, y];
			p++;
		}
	}
	if(left){
		for(x_pos = x - 1; board[x_pos][y] == flipColor; x_pos--){
			//change the color to player color
			id = "[" + x_pos + "," + y + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x_pos][y] = playerColor;
			pieces.push([x_pos, y]);
			newPieces[p] = [x_pos, y];
			p++;
		}
	}
	if(down){
		for(y_pos = y + 1; board[x][y_pos] == flipColor; y_pos++){
			//change the color to player color
			id = "[" + x + "," + y_pos + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x][y_pos] = playerColor;
			pieces.push([x, y_pos]);
			newPieces[p] = [x, y_pos];
			p++;
		}
	}
	if(up){
		for(y_pos = y - 1; board[x][y_pos] == flipColor; y_pos--){
			//change the color to player color
			id = "[" + x + "," + y_pos + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x][y_pos] = playerColor;
			pieces.push([x, y_pos]);
			newPieces[p] = [x, y_pos];
			p++;
		}
	}
	if(upright){
		for(x_pos = x + 1, y_pos = y - 1; board[x_pos][y_pos] == flipColor; x_pos++, y_pos--){
			//change the color to player color
			id = "[" + x_pos + "," + y_pos + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x_pos][y_pos] = playerColor;
			pieces.push([x_pos, y_pos]);
			newPieces[p] = [x_pos, y_pos];
			p++;
		}
	}
	if(upleft){
		for(x_pos = x - 1, y_pos = y - 1; board[x_pos][y_pos] == flipColor; x_pos--, y_pos--){
			//change the color to player color
			id = "[" + x_pos + "," + y_pos + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x_pos][y_pos] = playerColor;
			pieces.push([x_pos, y_pos]);
			newPieces[p] = [x_pos, y_pos];
			p++;
		}
	}
	if(downright){
		for(x_pos = x + 1, y_pos = y + 1; board[x_pos][y_pos] == flipColor; x_pos++, y_pos++){
			//change the color to player color
			id = "[" + x_pos + "," + y_pos + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x_pos][y_pos] = playerColor;
			pieces.push([x_pos, y_pos]);
			newPieces[p] = [x_pos, y_pos];
			p++;
		}
	}
	if(downleft){
		for(x_pos = x - 1, y_pos = y + 1; board[x_pos][y_pos] == flipColor; x_pos--, y_pos++){
			//change the color to player color
			id = "[" + x_pos + "," + y_pos + "]";
			document.getElementById(id).src = picture[playerColor];
			score[playerColor]++;
			score[flipColor]--;
			board[x_pos][y_pos] = playerColor;
			pieces.push([x_pos, y_pos]);
			newPieces[p] = [x_pos, y_pos];
			p++;
		}
	}
	
	//remove opponent pieces
	removeOpponent(newPieces, playerColor);
	
	//remove the previous possible moves
	removeMoves(x, y, playerColor);
	
	return 0;
}

//remove opponent pieces
function removeOpponent(locs, playerColor){
	//if black turn the flip piece is white else otherwise
	if(playerColor == "black"){
		//array contain opponent pieces
		pieces = whitePieces;
	}else{
		//array contain opponent pieces
		pieces = blackPieces;
	}
	
	//flipped pieces location
	var x;
	var y;
	//opponent pieces location
	var xOpp;
	var yOpp;
	
	//look through the newPieces array
	for(i = 0; i < locs.length; i++){
		x = locs[i][0];
		y = locs[i][1];
		
		//look through opponent pieces array
		for(j = 0; j < pieces.length; j++){
			xOpp = pieces[j][0];
			yOpp = pieces[j][1];
			
			//if it has the same location delete
			if(x == xOpp && y == yOpp){
				//-1 represent empty
				pieces[j][0] = -1;
				pieces[j][1] = -1;
				break;
			}
		}
	}
	return 0;
}

//remove the previous possible moves
function removeMoves(x, y){
	//look through the moves array and remove the grey
	for(i = 0; i < moves.length; i++){
		x_pos = moves[i][0];
		y_pos = moves[i][1];
		
		//except the selected piece
		if(x_pos == x && y_pos == y){
			continue;
		}
		
		id = "[" + x_pos + "," + y_pos + "]";
		document.getElementById(id).src = picture["trans"];
		board[x_pos][y_pos] = "trans";
	}
	
	//clear the array
	moves = [];
	
	return 0;
}

//change the player
function endTurn(finish){
	if(turn == "black"){
		turn = "white";
	}else{
		turn = "black";
	}
	
	//renew the turn
	checkTurn();
	
	//renew the score
	document.getElementById("user-score-text").textContent = score[player];
	document.getElementById("opp-score-text").textContent = score[opponent];
	
	//if board is full game over
	if(score["black"] + score["white"] == 64){
		gameOver();
		return 0;
	}
	
	if(turn == player){
		showMoves();
	}else{
		possibleMoves(turn);
	}
	//if no possible move skip turn and both piece have no possible move
	if(moves.length == 0){
		//if skipped twice game over
		if(finish){
			gameOver();
		}else{
			endTurn(true);
		}
	}
	return 0;
}

var checkTurn = function(){
	if(turn == player){
		document.getElementById("user-score-box").style.border = '2px solid red';
		document.getElementById("opp-score-box").style.border = '1px solid black';
	}else{
		document.getElementById("user-score-box").style.border = '1px solid black';
		document.getElementById("opp-score-box").style.border = '2px solid red';
	}
};

//game is over
function gameOver(){
	if(score["black"] > score["white"]){
		if(player == "black")
			alert(score["black"] + '-' + score['white'] + ", YOU WIN!!!");
		else
			alert(score["white"] + '-' + score['black'] + ", YOU LOSE!!!")
	}else if(score["black"] == score["white"]){
		alert("it's a draw");
	}else{
		if(player == "white")
			alert(score["white"] + '-' + score['black'] + ", YOU WIN!!!");
		else
			alert(score["black"] + '-' + score['white'] + ", YOU LOSE!!!");
	}
	return 0;
}

var clearGame = function(){
	for(y = 0; y < height; y++){
		for(x = 0; x < width; x++){
			id = "[" + x + "," + y + "]";
			document.getElementById(id).src = picture['trans'];
			board[x][y] = "trans";
		}
	}
	document.getElementById("opp-score-box").style.border = '1px solid black';
	document.getElementById("user-score-box").style.border = '1px solid black';
	blackPieces = [];
	whitePieces = [];
	moves = [];
	score["black"] = 0;
	score["white"] = 0;
	player = "black";
	playerName = "me";
	opponent = "white";
	opponentName = "you";
	turn = "black";
};