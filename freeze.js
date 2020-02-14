
var gameBlocks = [];
var currentID = 0;
var blocksRemaining = 0;
var score = 0;
var totalArea = null;
bestScore = localStorage.bestScore || null;
if (bestScore == "null") {
	bestScore = null;
}

function addBlock(block) {
	document.getElementById("gamearea").innerHTML += block.render();
}

function onComplete() {
	document.getElementById("reset").removeAttribute("hidden");
	if (!bestScore || score < bestScore) {
		bestScore = score;
		localStorage.bestScore = bestScore;
		document.getElementById("best").innerHTML = bestScore;
	}
}

function addBlocks() {
	for (i=0; i<gameBlocks.length; i++) {
		addBlock(gameBlocks[i]);
		gameBlocks[i].randomiseColor();
	}
	blocksRemaining = gameBlocks.length;
}

function freezeBlock(block) {
	if (block.deleted) return;
	blocksRemaining--;
	document.getElementById("block_" + block.id).style.zIndex = -1;
	document.getElementById("block_" + block.id).style.background = "rgba(0,255,0,0.8)";
	block.speed = 0;
	score += Math.ceil(totalArea*Math.abs(block.width * block.height));
	block.deleted = true;
	if (blocksRemaining == 0) onComplete();
}

function renderBlock(block) {
	var cBlock = document.getElementById("block_" + block.id);
	var left = block.left;
	var top = block.top;
	var height = block.height;
	var width = block.width;
	if (height < 0) {
		top += height;
	}
	if (width < 0) {
		left += width;
	}

	cBlock.style.top = top + "px";
	cBlock.style.left = left + "px";
	cBlock.style.height = Math.abs(height) + "px";
	cBlock.style.width = Math.abs(width) + "px";
	cBlock.style.background = block.getColor();
}

function renderBlocks() {
	document.getElementById("score").innerHTML = score;
	for (i=0; i<gameBlocks.length; i++) {
		if (gameBlocks[i].deleted) continue;
		renderBlock(gameBlocks[i]);
	}
}

function clearBlocks() {
	gameBlocks = [];
	currentID = 0;
	document.getElementById("gamearea").innerHTML = "";
}

function tick() {
	for (i=0; i<gameBlocks.length; i++) {
		if (gameBlocks[i].deleted) continue;
		gameBlocks[i].move();
	}

	renderBlocks();
}

function gameBlock() {
	var block = {
		deleted: false,
		left: window.innerWidth/2,
		top: window.innerHeight/2,
		speed: 5,
		height: 10,
		width: 10,
		directionX: 1,
		directionY: 1,
		id: currentID++,
		move: function() {
			if( this.top + this.height <= 0 && this.directionY != 1) {
				this.directionY = 1;
				//this.randomiseColor();
			}
			if( this.top + this.height >= window.innerHeight && this.directionY != -1) {
				this.directionY = -1;
				//this.randomiseColor();
			}
			if (this.left + this.width <= 0 && this.directionX != 1 ) {
				this.directionX = 1;
				//this.randomiseColor();
			}
			if (this.left + this.width >= window.innerWidth && this.directionX != -1 ) {
				this.directionX = -1;
				//this.randomiseColor();
			}

			this.left += this.directionX*2;
			this.top += this.directionY*2;

			if (Math.random() < 0.01) {
				this.directionX *= -1;
			}

			if (Math.random() < 0.01) {
				this.directionY *= -1;
			}

			this.width += this.directionX*this.speed;
			this.height += this.directionY*this.speed;


		},
		color: [0,0,0],
		randomiseColor: function() {
			this.color = [Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256)];
		},
		getColor: function() {
			return "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + ", 0.6)";
		},
		render: function() {
			return "<div id=\"block_" + this.id + "\" onclick=\"freezeBlock(gameBlocks[" + this.id + "]);\"  onmousedown=\"freezeBlock(gameBlocks[" + this.id + "]);\" style=\"position:absolute; background:" + this.getColor() + "; top:" + this.top + "px; left:" + this.left + "px; height:" + this.height + "px; width: " + this.width + "px; z-index:" + this.id + ";\"></div>";
		}
	}
	gameBlocks.push(block);
	return block;
}

function loadLevel(lv) {
	clearBlocks();
	document.getElementById("reset").setAttribute("hidden", "");
	document.getElementById("best").innerHTML = bestScore;

	for(i=0; i < lv; i++) gameBlock();

	addBlocks();

}

window.onload = function() {

	totalArea = 1000/Math.abs(window.innerHeight*window.innerWidth);
	loadLevel(25);

	setInterval(tick, 20);
}

