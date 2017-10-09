var gl;
var canvas;
var shaderProgram;
var squareVertexPositionBuffer;
var startTime = new Date().getTime();

var aspectRatio = 1.0;

function render() {
    resize(canvas);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderSquare();
}

function tick() {
    requestAnimFrame(tick);
    render();
    animate();
}

var lastTime = 0;
function animate () {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
    }
    lastTime = timeNow;
}

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function initBuffers() {
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "a_VertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.timeUniform = gl.getUniformLocation(shaderProgram, "u_time");
    gl.enableVertexAttribArray(shaderProgram.timeUniform);

    // initialize buffers...
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
         1.0,  1.0,  -1.0,
        -1.0,  1.0,  -1.0,
         1.0, -1.0,  -1.0,
        -1.0, -1.0,  -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}

function webGLStart() {
    canvas = document.getElementById("gl-canvas");
    initGL(canvas);
    shaderProgram = initShaders(gl, 'shader-vs', 'shader-fs');

    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}

function renderSquare() {
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform1f(shaderProgram.timeUniform, (new Date().getTime() - startTime)/1000);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

/*****************************************************************
 * Method for dynamically resizing the canvas to the window size.
 *****************************************************************/
function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.width / canvas.height;
  }
}