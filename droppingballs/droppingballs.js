// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("tela"); 
    var context = canvas.getContext("2d");
 
    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;

    var circles = [];
	var radius = 10;
	var g = 10;

	var mousedown = false;
	var newcircle = null;
 
    // Initialize the game
    function init() {
        // Add mouse events
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseout", onMouseOut);
        canvas.addEventListener("click", onClick);
 
        // Enter main loop
        main();
    }
 
    // Main loop
    function main() {
        // Request animation frames
        window.requestAnimationFrame(main);
 
        // Update and render the game
        render();
    }
 
    // Render the game
    function render() {
        // Draw the frame
        applyGravity();
        reflect();
        drawFrame();
    }
 
    // Draw a frame with a border
    function drawFrame() {
        // Draw background and a border
        context.fillStyle = "#d0d0d0";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#e8eaec";
        context.fillRect(1, 1, canvas.width-2, canvas.height-2);

        for (var circ in circles) {
	 		drawCircle(circles[circ]['x'], circles[circ]['y'], circles[circ]['r'], circles[circ]['c']);
	 	}

	 	if (newcircle != null) {
	 		drawCircle(newcircle.x, newcircle.y, newcircle.r, newcircle.c);
	 	}
    }
 
    // Mouse event handlers
    function onMouseMove(e) {
    	var mouse = getMousePos(tela, e);
        if (newcircle != null) {
            newcircle.x = mouse.x;
            newcircle.y = mouse.y;   
        }
    }
    function onMouseDown(e) {
		radius = 10;
		mousedown = true;
		
		var mouse = getMousePos(tela, e);
        var color = "rgb(" + getNumLess(256) + "," + getNumLess(256) + "," + getNumLess(256) + ")";
		
        newcircle = {x:mouse.x, y:mouse.y, r:radius, v:0, c:color}
		
		window.requestAnimationFrame(function(){
			aumenta(e);
		});
    }
    function onMouseUp(e) {
    	mousedown = false;
    }
    function onMouseOut(e) {}
    function onClick(e) {
    	var mouse = getMousePos(tela,e);

        newcircle.x = mouse.x;
        newcircle.y = mouse.y;
		
        circles.push(newcircle);

        newcircle = null;
    }
 
    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }

    var aumenta = function(e){
		var mouse = getMousePos(tela, e);

		if (mousedown) {
            radius += 1;
            newcircle.r = radius;
			window.requestAnimationFrame(function(){
				aumenta(e);
			});
		} else {
			newcircle = null;
		}
	}

    var getNumLess = function (n) {
        return Math.floor(Math.random() * n);
    }

	var drawCircle = function (x, y, r, c) {
		context.fillStyle = c;
		context.beginPath();
		context.arc(x,y,r, 0, 2 * Math.PI);
		context.fill();
	}

    var applyGravity = function () {
		for (var circ in circles) {
	 		circles[circ].v += g/10;
	 		circles[circ].y += circles[circ].v;
	 	}
	}

	var reflect = function () {
		for (var circ in circles) {
			if (circles[circ].y > canvas.height - circles[circ].r) {
				circles[circ].y = canvas.height - circles[circ].r;
				circles[circ].v = -1 * (circles[circ].v);
			}
	 	}
	}
 
    // Call init to start the game
    init();
};
