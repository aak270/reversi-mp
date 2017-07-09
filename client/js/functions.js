var popup = function(show){
	var dis;
	
	if(show){
		dis = 'block';
	}else{
		dis = 'none';
	}
	
	document.getElementById('modal').style.display = dis;
}

// Get the modal
var modal = document.getElementById('modal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

document.getElementById('username').onkeyup = function(event){
	if (event.keyCode == 13) {
		login();
	}
};

document.getElementById('message').onkeyup = function(event){
	if (event.keyCode == 13) {
		send();
	}
};