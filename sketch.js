//DEFAULT settings
var x = 0, y = 0;

var targetX = 0, targetY = 0;

var mouseIsClicked = false;

var currShape = "square";
var currAction = "restricted";
var currLock = "unlocked";
var currGrid = "grid off";
var currPixelSize = "small pixel";
var randomDrawing = "random drawing: off";
var reflectHoriz = "horizontal reflection: off";
var reflectVert = "vertical reflection: off";

var elSize = 10; //default pixel size of 10

//declaring the global variables for the canvas the graphics buffers we will use
//throughout the application
var canv;
var currGraph;
var gridGraph;

var imgURL;
var takeImg = false;

var fillBg = "pick background: off";
var bgColor = {
	"red" : 255,
	"green" : 255,
	"blue" : 255
}

function setup() {
	canv = createCanvas(640, 480);
	canv.parent("canvas-container");

	//two separate graphics buffer, one for the current artboard
	//and one for the grid 
	currGraph = createGraphics(640, 480);
	gridGraph = createGraphics(640, 480);
}

//draw a shape to a specific graphics renderer (`gr`)
//at positions (`x`,`y`) of the size `elSize`
//Null `gr` means the shape is drawn to the main canvas
//which is used for the shape following the cursor
function drawShape(gr, x, y, elSize){
	if(currShape == "square")
		if(gr === null)
			rect(x, y, elSize, elSize);
		else
			gr.rect(x, y, elSize, elSize);
	else{
		if(gr === null)
			ellipse(x, y, elSize, elSize);
		else
			gr.ellipse(x, y, elSize, elSize);
	}
}

function drawReflections(posX, posY){
	//draw horizontal AND vertical reflection
	if(reflectHoriz == "horizontal reflection: on" && reflectVert == "vertical reflection: on")
	{
		drawShape(currGraph, (640 - elSize)-posX, posY, elSize);
		drawShape(currGraph, posX, (480 - elSize)-posY, elSize);
		drawShape(currGraph, (640 - elSize)-posX, (480 - elSize)-posY, elSize);
	}
	else
	{
		//draw horizontal reflection
		if(reflectHoriz == "horizontal reflection: on")
		  	drawShape(currGraph, posX, (480 - elSize)-posY, elSize);
		else
		//draw vertical reflection
		if(reflectVert == "vertical reflection: on")
			drawShape(currGraph, (640 - elSize)-posX, posY, elSize);
	}
}

//draws random pixels to the artboard
function randomizeDrawing(){
  	currGraph.fill(random(0, 255), random(0, 255), random(0, 255));
  	currGraph.noStroke();

  	var randXPos = random(0, 640);

  	var randYPos = random(0, 480);

  	if(currLock == "grid-locked"){
  		randXPos = randXPos - (randXPos%elSize);
  		randYPos = randYPos - (randYPos%elSize);
  	}

  	drawShape(currGraph, randXPos, randYPos, elSize);
}

function draw() {
  if(randomDrawing == "random drawing: on")
  	randomizeDrawing();

  var posX = mouseX;
  var posY = mouseY;

  //locks the position of the pixel being placed to a grid cell
  if(currLock == "grid-locked"){
  	//updates the x-position for drawing to the nearest leftmost grid cell
  	posX = posX - (posX%elSize);

  	//updates the y-position for drawing to the nearest topmost grid cell
  	posY = posY - (posY%elSize);
  }

  //allows free-flowing drawing. Simply click and drag to
  //draw a trail of pixels
  if(currAction == "free"){
  		if(mouseIsPressed){
  			currGraph.noStroke();
	  		currGraph.fill(currColor.red, currColor.green, currColor.blue);

	  		drawShape(currGraph, posX, posY, elSize);
			drawReflections(posX, posY);
  		}
	  	
  }

  //makes drawing restricted. Hover over a spot you want to draw on and click
  //to place the pixel at a specific location
  else if(currAction == "restricted"){
	  	if (mouseIsClicked == true) {
		  	//console.log(currColor.red + " , " + currColor.blue + " , " + currColor.green);
		  	currGraph.noStroke();
		  	currGraph.fill(currColor.red, currColor.green, currColor.blue);
			
			drawShape(currGraph, posX, posY, elSize);
			drawReflections(posX, posY);
			
			mouseIsClicked = false;
	  }
  }
  	//allows the user to set the pick background if the
  	//toggle is set to on
  	if(fillBg == "pick background: on"){
  		bgColor.red = currColor.red;
  		bgColor.green = currColor.blue;
  		bgColor.blue = currColor.green;
  	}
  	
  	//sets the canvas background color
  	background(bgColor.red, bgColor.blue, bgColor.green); 

  	//clears the grid which is then redrawn continously
  	gridGraph.clear();

  	gridGraph.stroke(100,100,100);
  	//draws the grid
  	for(var i = 0; i < 640; i+=elSize)
	{
		for(var j = 0; j < 480; j+=elSize){
				drawShape(gridGraph, i, j, elSize);
		}
	}

	if(takeImg == true){
		gridGraph.clear();
		takeImg = false;
	}

	//places the grid on the canvas
	if(currGrid == "grid on"){
		image(gridGraph, 0, 0);
	}

	//places the current drawing on the canvas
	image(currGraph, 0, 0);

	//draws the shape following the cursor of the selected color
	fill(currColor.red, currColor.green, currColor.blue);

	//draws the shape on the cursor location
	drawShape(null, x, y, elSize);

	//displays coordinates - if-else conditions 
	//to prevent displaying coordinates outside of bounds of the canvas
	//x coordinate
	if(posX < 640)
		if(posX < elSize)
			var xCoor = elSize;
		else
			var xCoor = posX - (posX%elSize) + elSize;
	else
		var xCoor = 640;

	//y coordinate
	if(posY < 480)
		if(posY < elSize)
			var yCoor = elSize;
		else
			var yCoor = posY - (posY%elSize) + elSize;
	else
		var yCoor = 480;

	document.getElementById("pos-counter").innerHTML = "( " + xCoor + ", " + yCoor +")";

	x += mouseX - x;
	y += mouseY - y;
}

function mouseClicked() {
	//only change `mouseIsClicked` state if the mode is restricted
	if(currAction == "restricted")
		mouseIsClicked = (mouseIsClicked == true) ? false : true;
}

//BUTTONS

//clears the canvas of all pixel drawings (minus the grid)
document.getElementById("clear-canvas").addEventListener("click", function(){
	clear();
	currGraph.clear();
});

//Helper function for toggle buttons 
//`tEl` is the clicked element (`this`)
//`varN` is the global variable we want to update
//`strA` is the first string for evaluation
//`strB` is the second string for evaluation
//`func` is an OPTIONAL function parameter for any added unique behavior
var btn_action = function(tEl, varN, strA, strB, func){
	if(varN == strA)
	{
		tEl.className = "toggle_selected";
		varN = strB;

		if(func !== undefined)
			func();
	}
	else
	{
		tEl.className = "";
		varN = strA;

		if(func !== undefined)
			func();
	}

	tEl.innerHTML = varN;
	return varN;
}

//adds a `click` event listener that toggles between a circle
//and a square for the pixel shape
document.getElementById("toggle-shape").addEventListener("click", function(){
	currShape = btn_action(this, currShape, "square", "circle");
});

//adds a `click` event listener that toggles between restricted
//drawing (one pixel per click) or free (click and drag to draw continuosly)
document.getElementById("toggle-action").addEventListener("click", function(){
	currAction = btn_action(this, currAction, "restricted", "free");
});

//adds a `click` event listener that toggles between unlocked
//pixel placement (place a pixel anywhere in the canvas) or 
//grid-locked (each pixel is drawn to a specific grid box)
document.getElementById("toggle-grid-lock").addEventListener("click", function(){
	currLock = btn_action(this, currLock, "unlocked", "grid-locked");
});

//adds a `click` event listener that toggles between a grid
//being displayed and a grid hidden
document.getElementById("toggle-grid").addEventListener("click", function(){
	currGrid = btn_action(this, currGrid, "grid off", "grid on")
});

//adds a `click` event listener that toggles between a large
//pixel tool (draw with a large 20x20 sized pixel) or a
//small pixel tool (draw with the default 10x10 pixel)
document.getElementById("toggle-pixel_s").addEventListener("click", function(){
	
	//Helper function that sets the size of the pixel for the global
	//variable `elSize`
	var set_size = function(){
		if(currPixelSize == "small pixel")
			elSize = 20;
		else
			elSize = 10;
	}

	currPixelSize = btn_action(this, currPixelSize, "small pixel", "large pixel", set_size());
});

//adds a `click` event listener that toggles between a an automatic random
//drawing being drawn on the board or a static board
document.getElementById("toggle-random").addEventListener("click", function(){
	randomDrawing = btn_action(this, randomDrawing, "random drawing: off", "random drawing: on");
});


document.getElementById("toggle-fill").addEventListener("click", function(){
	fillBg = btn_action(this, fillBg, "pick background: off", "pick background: on");
});

document.getElementById("toggle-horiz-refl").addEventListener("click", function(){
	reflectHoriz = btn_action(this, reflectHoriz, "horizontal reflection: off", "horizontal reflection: on");
});

document.getElementById("toggle-vert-refl").addEventListener("click", function(){
	reflectVert = btn_action(this, reflectVert, "vertical reflection: off", "vertical reflection: on");
});

document.getElementById('save-art').addEventListener("click", function(){
	takeImg = true;
	draw();
	save(canv, 'pixelate-pic.jpg');
});