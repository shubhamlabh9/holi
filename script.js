const bubbleGen = document.querySelector( "#bubbleGen" );
const colorful = document.querySelector( "input" );
const bubbles = new Map();
const colors = [
    "deeppink", "magenta",          // Vibrant pinks
    "gold", "yellow",              // Bright yellows
    "limegreen", "springgreen",    // Electric greens
    "orangered", "coral",          // Fiery oranges
    "crimson", "red",              // Passionate reds
    "blue", "dodgerblue",          // Bold blues
    "mediumorchid", "violet",      // Royal purples
    "darkviolet", "turquoise",     // Jewel tones
    "fuchsia"                      // Bright pink-purple
];

let bubbleIdMax = 0;
let secForNextBubble = 0;
let currentTime = Date.now();
let previousTime = currentTime;
let bubbleGenX;
let bubbleGenY;
let bubbleGenW;
let dragging;

function lg( a ) { return console.log.apply( console, arguments ), a; }

window.onresize = () => {
	const bcr = bubbleGen.getBoundingClientRect();

	bubbleGenX = bcr.left + bcr.width / 2;
	bubbleGenY = bcr.top + bcr.width / 2;
	bubbleGenW = bcr.width;
};

bubbleGen.onmousedown = () => {
	dragging = true;
	bubbleGen.classList.add( "dragging" );
};

document.onmousemove = e => {
	if ( dragging ) {
		const st = bubbleGen.style;

		bubbleGenX += e.movementX;
		bubbleGenY += e.movementY;
		st.left = bubbleGenX + "px";
		st.top = bubbleGenY + "px";
	}
};
document.onmouseup = e => {
	if ( dragging ) {
		dragging = false;
		bubbleGen.classList.remove( "dragging" );
	}
};

function createBubble() {
	const bb = document.createElement( "bubble" ),
		st = bb.style,
		id = ++bubbleIdMax;

	bb.className = "bubble";
	bb.dataset.id = id;
	bb.dataset.speed = 2 + Math.random();
	bb.dataset.poptime = currentTime + ( 3 + 2 * Math.random() ) * 1000;
	bb.dataset.wave = Math.random();
	st.top = bubbleGenY + "px";
	st.left = bubbleGenX + ( bubbleGenW / -2 + Math.random() * bubbleGenW ) + "px";
	st.width =
	st.height = "0px";
	if ( colorful.checked ) {
		st.backgroundColor = colors[ Math.floor( colors.length * Math.random() ) ];
	}
	bubbles.set( id, bb );
	document.body.append( bb );
}

function frame() {
	currentTime = Date.now();
	if ( currentTime - previousTime > secForNextBubble * 1000 ) {
		createBubble();
		previousTime = currentTime;
		secForNextBubble = .1 * Math.random();
	}
	bubbles.forEach( ( bb, id ) => {
		const st = bb.style,
			y = parseFloat( st.top ),
			x = parseFloat( st.left ),
			w = parseFloat( st.width ),
			poptime = +bb.dataset.poptime,
			bbWave = +bb.dataset.wave,
			yInc = +bb.dataset.speed,
			wInc = .2;

		st.top = y - wInc / 2 - yInc + "px";
		st.left = x - wInc / 2 + ( w / 64 * Math.sin( bbWave ) ) + "px";
		st.width =
		st.height = w + wInc + "px";
		bb.dataset.wave = bbWave + .1;
		bb.dataset.speed = Math.max( .04, yInc - .005 );
		if ( poptime < currentTime ) {
			bb.remove();
			bubbles.delete( id );
		} else if ( poptime - 1 * 1000 < currentTime ) {
			bb.classList.add( "pop" );
		}
	} );
	requestAnimationFrame( frame );
}



// run ................................................
window.onresize();
frame();
