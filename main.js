"use strict";
// WebGL
var canvas;
var gl;
var program;

// Matrices
var projectionMatrix;
var projectionMatrixLoc;
var modelViewMatrix;
var modelViewMatrixLoc;
var instanceMatrix;

// Navigate
var mouse_x;
var mouse_y;
var mouse_alfa;
var mouse_beta;
var mouse_pressing = false;

var camera_pos = vec3(25,50,25);
//var camera_pos = vec3(0,10,0);
var camera_lookat = vec3(0,0,0);

var camera_alfa = 0; //Math.PI/2;
var camera_beta = -1.0;
//var camera_alfa = 2.438;
//var camera_beta = -1.0;
//var camera_alfa = radians(180);
//var camera_beta = 0;

var key_pressed = new Array(7);
for (var i = 0; i < 4; i++) {
	key_pressed[i] = false;
}

// Controllo prestazioni
var last_time = -1;

// Animation
var upSc = true;
var flag = false;
var flag2 = false;
var rising = true;
var scratch = false;
var forward = true;
var t_torso = 4.5;
var trans = 0.0;
var t_scratch = 0.0;
var trans_scratch = 0.0;
var count = 0.0;

// OLD Camera
var radius = 25;
var angrad = Math.PI/180;
var angleX = 0.0;
var angleY = 0.0;
var fovy = 45.0;
var aspect = 1.0;
var near = 1.0;
var far = 70.5;
var cameraPos = [];

// Varie
var textures = [];
var vBuffer;
var cylinder_precision = 10;
var cone_precision = 10;
var stack = [];
var figure = [];
var pointsArray = [];
var texCoordsArray = [];
var numNodes = 13;
var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 11;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 10;
var trunkId = 11;
var leavesID = 12;
var torsoHeight = 4.0;
var torsoWidth = 8.0;
var upperArmHeight = 3.3;
var upperArmWidth  = 1.4;
var lowerArmHeight = 1.0;
var lowerArmWidth  = 0.9;
var upperLegHeight = 3.1;
var upperLegWidth  = 1.5;
var lowerLegHeight = 1.3;
var lowerLegWidth  = 1.0;
var tailHeight = 1.0;
var tailWidth = 1.5;
var headHeight = 3.0;
var headWidth = 2.5;
var theta = [0, 0, 180, 0, 180, 0, 160, 30, 160, 30, 60, 0];

for( var i=0; i<numNodes; i++)  figure[i] = createNode(null, null, null, null);

var vertexColors = [
	vec4(0.32156862745, 0.53725490196, 0.0, 1.0 ),  // verdognolo
	vec4(0.46274509803, 0.32549019607, 0.0, 1.0 ),  // marrone
	vec4(0.85882352941, 0.87843137254, 0.90196078431, 1.0 ),  // bianco neve
	vec4(0.06274509803, 0.32156862745, 0.83137254902, 1.0 ),  // blu
	vec4( 0.0, 0.0, 1.0, 1.0 ),  //
	vec4( 1.0, 0.0, 1.0, 1.0 ),  //
	vec4( 0.0, 1.0, 1.0, 1.0 ),  //
	vec4( 0.0, 1.0, 1.0, 1.0 )   //
];

var texCoord = [
	vec2(0, 0),
	vec2(0, 1),
	vec2(1, 1),
	vec2(1, 0)
];

var vertices = [
	vec4( -0.5, -0.5,  0.5, 1.0 ),
	vec4( -0.5,  0.5,  0.5, 1.0 ),
	vec4( 0.5,  0.5,  0.5, 1.0 ),
	vec4( 0.5, -0.5,  0.5, 1.0 ),
	vec4( -0.5, -0.5, -0.5, 1.0 ),
	vec4( -0.5,  0.5, -0.5, 1.0 ),
	vec4( 0.5,  0.5, -0.5, 1.0 ),
	vec4( 0.5, -0.5, -0.5, 1.0 )
];

/*
verde
82
137
0

marrone
118
83
0

bianco
219
224
230

blu
16
82
212

grigio
156
156
156
*/

// texture

var texSize = 256;
var image_texture = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ ) {
	for ( var j = 0; j <texSize; j++ ) {
		let red_variation = Math.floor(Math.random()*20)-10;
		let green_variation = Math.floor(Math.random()*20)-10;
		let blue_variation = Math.floor(Math.random()*20)-10;
		if (i<16) {
			if (j<16) {
				// erba
				image_texture[4*i*texSize+4*j] = 82 + red_variation;
				image_texture[4*i*texSize+4*j+1] = 137 + green_variation;
				image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
				image_texture[4*i*texSize+4*j+3] = 255;
			} else if (j<32) {
				// terra
				image_texture[4*i*texSize+4*j] = 118 + red_variation;
				image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
				image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
				image_texture[4*i*texSize+4*j+3] = 255;
			} else if (j<48) {
				// erba e terra
				if (i<4) {
					image_texture[4*i*texSize+4*j] = 82 + red_variation;
					image_texture[4*i*texSize+4*j+1] = 137 + green_variation;
					image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
					image_texture[4*i*texSize+4*j+3] = 255;
				} else {
					image_texture[4*i*texSize+4*j] = 118 + red_variation;
					image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
					image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
					image_texture[4*i*texSize+4*j+3] = 255;
				}
			}  else if (j<64) {
				// pietra
				image_texture[4*i*texSize+4*j] = 156 + red_variation;
				image_texture[4*i*texSize+4*j+1] = 156 + green_variation;
				image_texture[4*i*texSize+4*j+2] = 156 + blue_variation;
				image_texture[4*i*texSize+4*j+3] = 255;
			}  else if (j<80) {
				// neve
				image_texture[4*i*texSize+4*j] = 219 + red_variation;
				image_texture[4*i*texSize+4*j+1] = 224 + green_variation;
				image_texture[4*i*texSize+4*j+2] = 230 + blue_variation;
				image_texture[4*i*texSize+4*j+3] = 255;
			}  else if (j<96) {
				// neve e terra
				if (i<4) {
					image_texture[4*i*texSize+4*j] = 219 + red_variation;
					image_texture[4*i*texSize+4*j+1] = 224 + green_variation;
					image_texture[4*i*texSize+4*j+2] = 230 + blue_variation;
					image_texture[4*i*texSize+4*j+3] = 255;
				} else {
					image_texture[4*i*texSize+4*j] = 118 + red_variation;
					image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
					image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
					image_texture[4*i*texSize+4*j+3] = 255;
				}
			} else {
				/*
				image_texture[4*i*texSize+4*j] = 255;
				image_texture[4*i*texSize+4*j+1] = 0;
				image_texture[4*i*texSize+4*j+2] = 255;
				image_texture[4*i*texSize+4*j+3] = 255;
				*/
				image_texture[4*i*texSize+4*j] = 118 + red_variation;
				image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
				image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
				image_texture[4*i*texSize+4*j+3] = 255;
			}
		} else if (i<50) {
			image_texture[4*i*texSize+4*j] = 118 + red_variation;
			image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
			image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
			image_texture[4*i*texSize+4*j+3] = 255;
		} else {
			/*
			image_texture[4*i*texSize+4*j] = 255;
			image_texture[4*i*texSize+4*j+1] = 0;
			image_texture[4*i*texSize+4*j+2] = 255;
			image_texture[4*i*texSize+4*j+3] = 255;*/
			image_texture[4*i*texSize+4*j] = 118 + red_variation;
			image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
			image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
			image_texture[4*i*texSize+4*j+3] = 255;
		}
	}
}

var texture1;
/*
function configureTexture() {
	texture1 = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_texture);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
					  gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	texture2 = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, texture2 );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
					  gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}
*/

// SHAPES------------------really long

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function createNode(transform, render, sibling, child){
	var node = {
	transform: transform,
	render: render,
	sibling: sibling,
	child: child,
	}
	return node;
}


function initNodes(Id) {
	var m = mat4();
	switch(Id) {
		case trunkId:
			m = translate(-2.5, 0.5, -2.5);
			m = mult(m, rotate(0, 0, 0, 1));
			figure[trunkId] = createNode( m, trunk, null, leavesID );
			break;

		case leavesID:
			m = translate(0.0, 9, 0.0);
			m = mult(m, rotate(0, 0, 0, 1));
			figure[leavesID] = createNode( m, leaves, null, null );
			break;

		case torsoId:
			m = translate(-t_torso, t_scratch, 0.0);
			m = mult(m, rotate(-theta[torsoId], 0, 0, 1));
			figure[torsoId] = createNode( m, torso, trunkId, headId );
			break;

		case headId:
		case head1Id:
		case head2Id:
			m = translate((torsoWidth+headWidth)*0.5, -headHeight*0.1, 0.0);
			m = mult(m, rotate(-theta[head1Id], 1, 0, 0));
			m = mult(m, rotate(-theta[head2Id], 0, 1, 0));
			figure[headId] = createNode( m, head, tailId, null);
			break;

		case leftUpperArmId:
			m = translate((torsoWidth+upperArmWidth)*0.5-1.5, -torsoHeight*0.3, -torsoHeight*0.5);
			m = mult(m, rotate(-theta[leftUpperArmId], 0, 0, 1));
			figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
			break;

		case rightUpperArmId:
			m = translate((torsoWidth+upperArmWidth)*0.5-1.5, -torsoHeight*0.3, torsoHeight*0.5);
			m = mult(m, rotate(-theta[rightUpperArmId], 0, 0, 1));
			figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
			break;

		case leftUpperLegId:
			m = translate(-(torsoWidth+upperLegWidth)*0.5+1.5, -torsoHeight*0.3, -torsoHeight*0.5);
			m = mult(m , rotate(-theta[leftUpperLegId], 0, 0, 1));
			figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
			break;

		case rightUpperLegId:
			m = translate(-(torsoWidth+upperLegWidth)*0.5+1.5, -torsoHeight*0.3, torsoHeight*0.5);
			m = mult(m, rotate(-theta[rightUpperLegId], 0, 0, 1));
			figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
			break;

		case leftLowerArmId:
			m = translate(0.0, upperArmHeight, 0.0);
			m = mult(m, rotate(-theta[leftLowerArmId], 0, 0, 1));
			figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
			break;

		case rightLowerArmId:
			m = translate(0.0, upperArmHeight, 0.0);
			m = mult(m, rotate(-theta[rightLowerArmId], 0, 0, 1));
			figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
			break;

		case leftLowerLegId:
			m = translate(0.0, upperLegHeight, 0.0);
			m = mult(m, rotate(-theta[leftLowerLegId], 0, 0, 1));
			figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
			break;

		case rightLowerLegId:
			m = translate(0.0, upperLegHeight, 0.0);
			m = mult(m, rotate(-theta[rightLowerLegId], 0, 0, 1));
			figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
			break;

		case tailId:
			m = translate(-torsoWidth*0.45, torsoHeight*0.3, 0.0);
			m = mult(m, rotate(-theta[tailId], 0, 0, 1));
			figure[tailId] = createNode( m, tail, leftUpperArmId, null );
			break;
	}
}


function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
	modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function trunk() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4( 1, 12, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, textures[2] );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 24, (cylinder_precision+1)*2);
	gl.drawArrays(gl.TRIANGLE_FAN, 24 + ((cylinder_precision+1)*2), cylinder_precision+2);
	gl.drawArrays(gl.TRIANGLE_FAN, 24 + ((cylinder_precision+1)*3) + 1, cylinder_precision+2);
}

function leaves() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4( 4, 8, 4));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, textures[3] );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
	gl.drawArrays(gl.TRIANGLE_FAN, 24 + ((cylinder_precision+1)*4) + 2, cone_precision+2);
	gl.drawArrays(gl.TRIANGLE_FAN, 24 + ((cylinder_precision+1)*4) + 2 + cone_precision + 2, cone_precision+2);
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, textures[0] );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

}

function torso() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoHeight));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) {
		if (i==1) {
			gl.activeTexture( gl.TEXTURE0 );
			gl.bindTexture( gl.TEXTURE_2D, textures[1] );
			gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
			gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
			gl.activeTexture( gl.TEXTURE0 );
			gl.bindTexture( gl.TEXTURE_2D, textures[0] );
			gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
		} else {
			gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
		}
	}
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, textures[0] );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
}

function leftUpperArm() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {
	instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
	 pointsArray.push(vertices[a]);
	 texCoordsArray.push(texCoord[0]);
	 pointsArray.push(vertices[b]);
	 texCoordsArray.push(texCoord[1]);
	 pointsArray.push(vertices[c]);
	 texCoordsArray.push(texCoord[2]);
	 pointsArray.push(vertices[d]);
	 texCoordsArray.push(texCoord[3]);
}

function cube() {
	quad( 1, 0, 3, 2 );
	quad( 2, 3, 7, 6 );
	quad( 3, 0, 4, 7 );
	quad( 6, 5, 1, 2 );
	quad( 4, 5, 6, 7 );
	quad( 5, 4, 0, 1 );
}

// navigation

function global_coords_to_local_coords(x, z) {
	let chunk_x, chunk_z;
	chunk_x = Math.floor(x/chunk_size);
	chunk_z = Math.floor(z/chunk_size);
	if (chunk_x<0||chunk_x>2) return null;
	if (chunk_z<0||chunk_z>2) return null;
	let chunk_ID = chunk_z*3 + chunk_x;
	let local_x = Math.floor(x);
	let local_z = Math.floor(z);
	local_x -= chunk_x*chunk_size;
	local_z -= chunk_z*chunk_size;
	return {x: local_x, z: local_z, id: chunk_ID}
}

function onTimer() {
	console.log(Date.now()-last_time); last_time = Date.now();

	let tmp_sin = Math.sin(camera_alfa);
	let tmp_cos = Math.cos(camera_alfa);
	let tmp_x = 0.0;
	let tmp_y = 0.0;
	let tmp_z = 0.0;
	let tmp_movs = 0;
	let tmp;

	if (key_pressed[0] && !key_pressed[2]) {
		tmp_z = 1.0;
		tmp_movs++;
	} else if (key_pressed[2] && !key_pressed[0]) {
		tmp_z = -1.0;
		tmp_movs++;
	}

	if (key_pressed[1] && !key_pressed[3]) {
		tmp_x = 1.0;
		tmp_movs++;
	} else if (key_pressed[3] && !key_pressed[1]) {
		tmp_x = -1.0;
		tmp_movs++;
	}

	if (key_pressed[4] && !key_pressed[5]) {
		tmp_y = -1.0;
		tmp_movs++;
	} else if (key_pressed[5] && !key_pressed[4]) {
		tmp_y = 1.0;
		tmp_movs++;
	}

	if (tmp_movs==0) return;
	else if (tmp_movs==2) {
		//0.70710678118 is equal to 1/(2^0.5)
		tmp_x *= 0.70710678118;
		tmp_y *= 0.70710678118;
		tmp_z *= 0.70710678118;
	} else if (tmp_movs==3) {
		//0.57735026919 is equal to 1/(3^0.5)
		tmp_x *= 0.57735026919;
		tmp_y *= 0.57735026919;
		tmp_z *= 0.57735026919;
	}


	tmp_x *= 0.035;
	tmp_y *= 0.035;
	tmp_z *= 0.035;

	tmp = (tmp_z*tmp_cos)-(tmp_x*tmp_sin);
	tmp_z = (tmp_z*tmp_sin)+(tmp_x*tmp_cos);
	tmp_x = tmp;

	let where_it_wants_to_go = [camera_pos[0] + tmp_z, camera_pos[1] + tmp_y, camera_pos[2] + tmp_x];
	let local_camera_pos = global_coords_to_local_coords(camera_pos[0], camera_pos[2]);
	//let local_where_it_wants_to_go = global_coords_to_local_coords(where_it_wants_to_go);
	let alert_flag = false;
	if (tmp_z>0) {

		if (local_camera_pos.x==chunk_size-1) {
			//todo
		} else {
			if (chunks[local_camera_pos.id].map[local_camera_pos.x+1][local_camera_pos.z] > chunks[local_camera_pos.id].map[local_camera_pos.x][local_camera_pos.z]) {

				alert_flag = ((chunks[local_camera_pos.id].map[local_camera_pos.x+1][local_camera_pos.z] + 1.8) > camera_pos[1]) ;
			}
		}
		if (alert_flag) {
			if (where_it_wants_to_go[0] > local_camera_pos.x + (11/16)) {
				where_it_wants_to_go[0] = local_camera_pos.x + (11/16);
				tmp_z = 0;
			}
		}
	} else if (tmp_z<0) {

	}


	camera_pos[0] = where_it_wants_to_go[0];
	camera_pos[1] = where_it_wants_to_go[1];
	camera_pos[2] = where_it_wants_to_go[2];
	/*
	camera_pos[0] += tmp_z;
	camera_pos[1] += tmp_y;
	camera_pos[2] += tmp_x;
	*/
	camera_lookat[0] += tmp_z;
	camera_lookat[1] += tmp_y;
	camera_lookat[2] += tmp_x;

	/*
	if (camera_pos[2]>50) {
		if (!chunks[3]) {
			chunks[3] = new chunk(50,50);
		}
	}*/

	compute_camera_matrix();

}

function update_lookAt() {
	camera_lookat[0] = 8*Math.sin(camera_alfa)*Math.cos(camera_beta);
	camera_lookat[1] = 8*Math.sin(camera_beta);
	camera_lookat[2] = 8*Math.cos(camera_alfa)*Math.cos(camera_beta);
	camera_lookat[0] += camera_pos[0];
	camera_lookat[1] += camera_pos[1];
	camera_lookat[2] += camera_pos[2];
}

function compute_camera_matrix() {
	let camera_matrix = lookAt(camera_pos, camera_lookat, vec3(0,1,0));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(mult(projectionMatrix, camera_matrix)));
}

// noise function
const openSimplex = openSimplexNoise(Date.now());
function noise(nx, ny) {
  // Rescale from -1.0:+1.0 to 0.0:1.0
  return openSimplex.noise2D(nx, ny) / 2 + 0.5;
}

// terrain
let squares_size = 1;

let chunk_size = 50;
let chunk_peak = 60;
let snow_level = 35;
let noise_reduction = 40; //16 50

function chunk(offsetX, offsetZ, left_chunk) {
	//let privato = "?"; //le variabili private sono comunque dinamiche
	this.offset = [offsetX, offsetZ];
	//this.center = [offsetX+(chunk_size/2), offsetZ+(chunk_size/2)];
	this.map = [];
	this.vertex_buffer;
	this.vertex_array = [];
	this.texture_coord_buffer;
	this.texture_coord_array = [];
	this.shading_buffer;
	this.shading_array = [];
	this.polygons = chunk_size*chunk_size;

	for (let x = 0; x < chunk_size; x++) {
		this.map[x] = [];
		for (let z = 0; z < chunk_size; z++) {
			let translate_x = (x+offsetX);
			let translate_z = (z+offsetZ);
			this.map[x][z] =  Math.floor(noise(translate_x/noise_reduction, translate_z/noise_reduction)*chunk_peak);

			/*
			code for generating trees or horses

			let tttmp = Math.sin(12.9898*x+78.233*y) * 43758.5453;
			tttmp = tttmp % 1;
			tttmp = tttmp + 1;
			tttmp = tttmp % 1;
			if (Math.cos(tttmp)>=.999999) value[y][x] = 80;
			value[y][x] *= squares_size;
			*/
			/*
			for texture coordinate
			texCoordsArray.push(vec2(0,0));
			texCoordsArray.push(vec2(1,0));
			texCoordsArray.push(vec2(1,1));
			texCoordsArray.push(vec2(0,1));*/
			//this.polygons++;
			this.vertex_array.push(vec4(    translate_x * squares_size,  this.map[x][z],      translate_z * squares_size, 1.0 ));
			this.vertex_array.push(vec4((translate_x+1) * squares_size,  this.map[x][z],      translate_z * squares_size, 1.0 ));
			this.vertex_array.push(vec4((translate_x+1) * squares_size,  this.map[x][z],  (translate_z+1) * squares_size, 1.0 ));
			this.vertex_array.push(vec4(    translate_x * squares_size,  this.map[x][z],  (translate_z+1) * squares_size, 1.0 ));
			this.texture_coord_array.push(vec2(0,15/16));
			this.texture_coord_array.push(vec2(0,16/16));
			this.texture_coord_array.push(vec2(1/16,16/16));
			this.texture_coord_array.push(vec2(1/16,15/16));
			this.shading_array.push(1.0);
			this.shading_array.push(1.0);
			this.shading_array.push(1.0);
			this.shading_array.push(1.0);

			/*
			texture[0:16,48:64] pietra
			this.texture_coord_array.push(vec2(3/16,15/16));
			this.texture_coord_array.push(vec2(3/16,16/16));
			this.texture_coord_array.push(vec2(4/16,16/16));
			this.texture_coord_array.push(vec2(4/16,15/16));

			texture[0:16,32:48] erba e terra
			this.texture_coord_array.push(vec2(2/16,15/16));
			this.texture_coord_array.push(vec2(2/16,16/16));
			this.texture_coord_array.push(vec2(3/16,16/16));
			this.texture_coord_array.push(vec2(3/16,15/16));

			texture[0:16,16:32] terra
			this.texture_coord_array.push(vec2(1/16,15/16));
			this.texture_coord_array.push(vec2(1/16,16/16));
			this.texture_coord_array.push(vec2(2/16,16/16));
			this.texture_coord_array.push(vec2(2/16,15/16));

 			texture[0:16,0:16] erba
			this.texture_coord_array.push(vec2(0,15/16));
			this.texture_coord_array.push(vec2(0,16/16));
			this.texture_coord_array.push(vec2(1/16,16/16));
			this.texture_coord_array.push(vec2(1/16,15/16));*/

			// poligoni laterali
			/*
			if (x==0) {
				for (let y = this.map[x][z]-3; y < this.map[x][z]; y++) {
					this.polygons++;
					this.vertex_array.push(vec4( translate_x * squares_size,    y,      translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4( translate_x * squares_size,    y,  (translate_z+1) * squares_size, 1.0 ));
					this.vertex_array.push(vec4( translate_x * squares_size,  y+1,  (translate_z+1) * squares_size, 1.0 ));
					this.vertex_array.push(vec4( translate_x * squares_size,  y+1,      translate_z * squares_size, 1.0 ));
					if (y == this.map[x][z]-1) {
						this.texture_coord_array.push(vec2(3/16,15/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(3/16,16/16));
					} else {
						this.texture_coord_array.push(vec2(1/16,15/16));
						this.texture_coord_array.push(vec2(1/16,16/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
					}
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
				}
			} else {
				let lower_cube_y;
				let higher_cube_y;
				if (this.map[x-1][z] > this.map[x][z]) {
					higher_cube_y = this.map[x-1][z];
					lower_cube_y = this.map[x][z];
				} else {
					lower_cube_y = this.map[x-1][z];
					higher_cube_y = this.map[x][z];
				}

				for (let y = lower_cube_y; y < higher_cube_y; y++) {
					this.polygons++;
					this.vertex_array.push(vec4( translate_x * squares_size,    y,      translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4( translate_x * squares_size,    y,  (translate_z+1) * squares_size, 1.0 ));
					this.vertex_array.push(vec4( translate_x * squares_size,  y+1,  (translate_z+1) * squares_size, 1.0 ));
					this.vertex_array.push(vec4( translate_x * squares_size,  y+1,      translate_z * squares_size, 1.0 ));
					if (y == (higher_cube_y-1)) {
						this.texture_coord_array.push(vec2(3/16,15/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(3/16,16/16));
					} else if (y == (higher_cube_y-2)) {
						this.texture_coord_array.push(vec2(1/16,15/16));
						this.texture_coord_array.push(vec2(1/16,16/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
					} else {
						this.texture_coord_array.push(vec2(3/16,15/16));
						this.texture_coord_array.push(vec2(3/16,16/16));
						this.texture_coord_array.push(vec2(4/16,16/16));
						this.texture_coord_array.push(vec2(4/16,15/16));
					}
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
				}
			}

			if (z==0) {
				for (let y = this.map[x][z]-3; y < this.map[x][z]; y++) {
					this.polygons++;
					this.vertex_array.push(vec4(     translate_x * squares_size,    y,  translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,    y,  translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,  y+1,  translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4(     translate_x * squares_size,  y+1,  translate_z * squares_size, 1.0 ));
					if (y == this.map[x][z]-1) {
						this.texture_coord_array.push(vec2(3/16,15/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(3/16,16/16));
					} else {
						this.texture_coord_array.push(vec2(1/16,15/16));
						this.texture_coord_array.push(vec2(1/16,16/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
					}
					this.shading_array.push(0.5);
					this.shading_array.push(0.5);
					this.shading_array.push(0.5);
					this.shading_array.push(0.5);
				}
			} else {
				let lower_cube_y;
				let higher_cube_y;
				let shading_color;
				if (this.map[x][z-1] > this.map[x][z]) {
					higher_cube_y = this.map[x][z-1];
					lower_cube_y = this.map[x][z];
					shading_color = 0.9;
				} else {
					lower_cube_y = this.map[x][z-1];
					higher_cube_y = this.map[x][z];
					shading_color = 0.5;
				}

				for (let y = lower_cube_y; y < higher_cube_y; y++) {
					this.polygons++;
					this.vertex_array.push(vec4(     translate_x * squares_size,    y,  translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,    y,  translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,  y+1,  translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4(     translate_x * squares_size,  y+1,  translate_z * squares_size, 1.0 ));
					if (y == (higher_cube_y-1)) {
						this.texture_coord_array.push(vec2(3/16,15/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(3/16,16/16));
					} else if (y == (higher_cube_y-2)) {
						this.texture_coord_array.push(vec2(1/16,15/16));
						this.texture_coord_array.push(vec2(1/16,16/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
					} else {
						this.texture_coord_array.push(vec2(3/16,15/16));
						this.texture_coord_array.push(vec2(3/16,16/16));
						this.texture_coord_array.push(vec2(4/16,16/16));
						this.texture_coord_array.push(vec2(4/16,15/16));
					}
					this.shading_array.push(shading_color);
					this.shading_array.push(shading_color);
					this.shading_array.push(shading_color);
					this.shading_array.push(shading_color);
				}
			}

			if (x==(chunk_size-1)) {
				for (let y = this.map[x][z]-3; y < this.map[x][z]; y++) {
					this.polygons++;
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,    y,      translate_z * squares_size, 1.0 ));
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,    y,  (translate_z+1) * squares_size, 1.0 ));
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,  y+1,  (translate_z+1) * squares_size, 1.0 ));
					this.vertex_array.push(vec4( (translate_x+1) * squares_size,  y+1,      translate_z * squares_size, 1.0 ));
					if (y == this.map[x][z]-1) {
						this.texture_coord_array.push(vec2(3/16,15/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(3/16,16/16));
					} else {
						this.texture_coord_array.push(vec2(1/16,15/16));
						this.texture_coord_array.push(vec2(1/16,16/16));
						this.texture_coord_array.push(vec2(2/16,16/16));
						this.texture_coord_array.push(vec2(2/16,15/16));
					}
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
					this.shading_array.push(0.7);
				}
			}*/

		}
	}


	this.vertex_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertex_array), gl.STATIC_DRAW);

	this.texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texture_coord_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texture_coord_array), gl.STATIC_DRAW);

	var floats = new Float32Array( this.shading_array.length  );
	for (var i = 0; i < this.shading_array.length; i++) {
		floats[i] = this.shading_array[i];
	}
	this.shading_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.shading_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, floats, gl.STATIC_DRAW);


	this.render = function() {
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.texture_coord_buffer);
		gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vTexCoord );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.shading_buffer);
		gl.vertexAttribPointer( vs_shading, 1, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vs_shading );

		for(let i=0; i<this.polygons; i++) {
			gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
		}
		//gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, this.polygons);
		// mode, offset, num vertices per instance, num instances

	};
}



function chunkT(offsetX, offsetZ, left_chunk, top_chunk, bottom_chunk, right_chunk) {
	this.offset = [offsetX, offsetZ];
	this.map = [];

	this.vertex_buffer;
	this.vertex_array = [];
	this.texture_coord_buffer;
	let texture_coord_array = [];
	this.shading_buffer;
	let shading_array = [];
	this.instance_matrix_buffer;
	let instance_matrix_array = [];

	let polygons = chunk_size*chunk_size;

	this.vertex_array.push(vec4(0,0,0,1));
	this.vertex_array.push(vec4(1,0,0,1));
	this.vertex_array.push(vec4(1,0,1,1));
	this.vertex_array.push(vec4(0,0,1,1));

	function add_vertical_terrain(from_y, to_y, x, z, which_side) {
		/*
		instance_matrix_array.push(mult(translate(x,from_y,z), rotate(90, 0, 0, 1)));
		instance_matrix_array.push(mult(translate(x+1,from_y,z), rotate(90, 0, 0, 1)));
		instance_matrix_array.push(mult(translate(x,from_y,z), rotate(-90, 1, 0, 0)));
		instance_matrix_array.push(mult(translate(x,from_y,z+1), rotate(-90, 1, 0, 0)));
		*/
		from_y++;
		to_y++;
		switch (which_side) {
		case 0: //a sinistra
			if (from_y>to_y) {
				for (let y = to_y; y < from_y; y++) {
					instance_matrix_array.push(mult(translate(x,y-1,z), rotate(-90, 0, 0, 1)));
					shading_array.push(0.5);
					if (y==from_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(vec2(5/16,15/16));
						} else {
							texture_coord_array.push(vec2(2/16,15/16));
						}
					} else {
						texture_coord_array.push(vec2(1/16,15/16));
					}
					polygons++;
				}
			} else {
				for (let y = from_y; y < to_y; y++) {
					let instance_matrix = rotate(180, 0, 1, 0);
					instance_matrix = mult(rotate(90, 0, 0, 1), instance_matrix);
					instance_matrix = mult(translate(x,y-1,z+1), instance_matrix);
					instance_matrix_array.push(instance_matrix);
					shading_array.push(0.9);
					if (y==to_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(vec2(5/16,15/16));
						} else {
							texture_coord_array.push(vec2(2/16,15/16));
						}
					} else {
						texture_coord_array.push(vec2(1/16,15/16));
					}
					polygons++;
				}
			}
			break;
		case 1: //sotto
			if (from_y>to_y) {
				for (let y = to_y; y < from_y; y++) {
					let instance_matrix = rotate(90, 0, 1, 0);
					instance_matrix = mult(rotate(90, 1, 0, 0), instance_matrix);
					instance_matrix = mult(translate(x+1,y-1,z), instance_matrix);
					instance_matrix_array.push(instance_matrix);
					shading_array.push(0.7);
					if (y==from_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(vec2(5/16,15/16));
						} else {
							texture_coord_array.push(vec2(2/16,15/16));
						}
					} else {
						texture_coord_array.push(vec2(1/16,15/16));
					}
					polygons++;
				}
			} else {
				for (let y = from_y; y < to_y; y++) {
					let instance_matrix = rotate(-90, 0, 1, 0);
					instance_matrix = mult(rotate(-90, 1, 0, 0), instance_matrix);
					instance_matrix = mult(translate(x,y-1,z), instance_matrix);
					instance_matrix_array.push(instance_matrix);
					shading_array.push(0.7);
					if (y==to_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(vec2(5/16,15/16));
						} else {
							texture_coord_array.push(vec2(2/16,15/16));
						}
					} else {
						texture_coord_array.push(vec2(1/16,15/16));
					}
					polygons++;
				}
			}
			break;
		case 2:

			break;
		case 3:

			break;
		}

	}

	for (let x = 0; x < chunk_size; x++) {
		this.map[x] = [];
		for (let z = 0; z < chunk_size; z++) {
			let translate_x = (x+offsetX);
			let translate_z = (z+offsetZ);
			this.map[x][z] =  Math.floor(noise(translate_x/noise_reduction, translate_z/noise_reduction)*chunk_peak);
			instance_matrix_array.push(translate(translate_x,this.map[x][z],translate_z));
			shading_array.push(1.0);
			if (this.map[x][z]>snow_level) {
				texture_coord_array.push(vec2(4/16,15/16));
			} else {
				texture_coord_array.push(vec2(0,15/16));
			}
			/*
			nuvole*/
			if (this.map[x][z]>40) {
				instance_matrix_array.push(mult(translate(translate_x,70,translate_z),rotate(180,1,0,0)));
				shading_array.push(1.0);
				texture_coord_array.push(vec2(4/16,15/16));
				polygons++;
			}

			if (x==0) {
				if (left_chunk) {
					add_vertical_terrain(this.map[0][z], left_chunk.map[chunk_size-1][z], translate_x, translate_z, 0);
				}
			}else{
				add_vertical_terrain(this.map[x][z], this.map[x-1][z], translate_x, translate_z, 0);
			}
			if (z==0) {
				if (bottom_chunk) {
					add_vertical_terrain(this.map[x][z], bottom_chunk.map[x][chunk_size-1], translate_x, translate_z, 1);
				}
			} else {
				add_vertical_terrain(this.map[x][z], this.map[x][z-1], translate_x, translate_z, 1);
			}
		}
	}

	// VERTICES BUFFER
	this.vertex_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertex_array), gl.STATIC_DRAW);

	// TEXTURE COORDINATE BUFFER
	this.texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texture_coord_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texture_coord_array), gl.STATIC_DRAW);

	// SHADING BUFFER
	var floats = new Float32Array( shading_array.length  );
	for (var i = 0; i < shading_array.length; i++) {
		floats[i] = shading_array[i];
	}
	this.shading_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.shading_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, floats, gl.STATIC_DRAW);

	// INSTANCE MATRICES BUFFER
	this.instance_matrix_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.instance_matrix_buffer);
	var superfloat = new Float32Array( instance_matrix_array.length * 16 );
	for (var i = 0; i < instance_matrix_array.length; i++) {
		let float_tmp = flatten(instance_matrix_array[i]);
		for (var j = 0; j < 16; j++) {
			superfloat[i*16+j] = float_tmp[j];
		}
	}
	gl.bufferData(gl.ARRAY_BUFFER, superfloat, gl.STATIC_DRAW);
	/*
	gl.bindBuffer(gl.ARRAY_BUFFER, this.instance_matrix_buffer ); // TODO forse non serve ribindarlo subito, fare un test commentando questa riga
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instance_matrix_array, 0, this.instance_matrix_array.length * 16 * 4); // questo a quanto pare gli passa effettivamente i dati
	?? gl.bufferSubData(gl.ARRAY_BUFFER, 0, superfloat); ??
	*/

	this.render = function() {
		// VERTICES BUFFER
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );

		// TEXTURE COORDINATE BUFFER
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texture_coord_buffer);
		gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 8, 0 );
		//gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vTexCoord );
		gl.vertexAttribDivisor(vTexCoord, 1);

		// SHADING BUFFER
		gl.bindBuffer( gl.ARRAY_BUFFER, this.shading_buffer);
		gl.vertexAttribPointer( vs_shading, 1, gl.FLOAT, false, 4, 0 );
		gl.enableVertexAttribArray( vs_shading );
		gl.vertexAttribDivisor(vs_shading, 1);

		// INSTANCE MATRICES BUFFER
		gl.bindBuffer(gl.ARRAY_BUFFER, this.instance_matrix_buffer);
		// tutto il blocco seguente serve al posto del normale gl.vertexAttribPointer()
		const bytesPerMatrix = 4 * 16;
		for (let i = 0; i < 4; ++i) {
		  let loc = vs_matrix + i;
		  gl.enableVertexAttribArray(loc);
		  // note the stride and offset
		  const offset = i * 16;  // 4 floats per row, 4 bytes per float

		  gl.vertexAttribPointer(
		      loc,              // location
		      4,                // size (num values to pull from buffer per iteration)
		      gl.FLOAT,         // type of data in buffer
		      false,            // normalize
		      bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
		      offset,           // offset in buffer
		  );
		  // this line says this attribute only changes for each 1 instance
		  gl.vertexAttribDivisor(loc, 1);

		}



		//for(let i=0; i<this.polygons; i++) {
		/*
		for(let i=0; i<1; i++) {
			gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
		}*/
		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, polygons);
		// mode, offset, num vertices per instance, num instances

	};
}


var chunks = [];
var vPosition;
var vTexCoord;
var vs_shading;
var vs_matrix;
// main

window.onload = function init() {
	canvas = document.getElementById( "gl-canvas" );
	gl = canvas.getContext('webgl2');
	if ( !gl ) { alert( "WebGL isn't available" ); }

	canvas.width = (document.getElementsByTagName('body')[0]).clientWidth;
	//canvas.height = window.innerHeight; //(document.getElementsByTagName('body')[0]).clientHeight;
	canvas.height = document.documentElement.clientHeight-20; //(document.getElementsByTagName('body')[0]).clientHeight;

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.7, 0.8, 1.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	program = initShaders( gl, "vertex-shader", "fragment-shader");
	gl.useProgram( program);


	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.FRONT);

	/*
	cube();
	cylinder(cylinder_precision);
	cone(cone_precision);*/

	instanceMatrix = mat4();
	modelViewMatrix = mat4();

	projectionMatrix = perspective(60.0, canvas.width/canvas.height, 0.01, 2000.0);
	modelViewMatrix = translate(0.0, 0.0, -3.0);

	gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix")

	vPosition = gl.getAttribLocation( program, "vPosition" );
	vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
	vs_shading = gl.getAttribLocation( program, "vs_shading" );
	vs_matrix = gl.getAttribLocation( program, "matrix" );

	texture1 = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_texture);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
					  gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

	/*
	for (let i=0; i<3; i++) {
		for (let j=0; j<3; j++) {
			chunks[i*3+j] = new chunkT(chunk_size*i,chunk_size*j);
		}
	}*/
//function chunkT(offsetX, offsetZ, left_chunk, top_chunk, bottom_chunk, right_chunk) {
	chunks[0] = new chunkT(0,0); //chunk_size
	chunks[1] = new chunkT(chunk_size,0,chunks[0]);
	chunks[2] = new chunkT(2*chunk_size,0,chunks[1]);
	chunks[3] = new chunkT(0,chunk_size,null,null,chunks[0]);
	chunks[4] = new chunkT(chunk_size,chunk_size,chunks[3],null,chunks[1]);
	chunks[5] = new chunkT(2*chunk_size,chunk_size,chunks[4],null,chunks[2]);
	chunks[6] = new chunkT(0,2*chunk_size,null,null,chunks[3]);
	chunks[7] = new chunkT(chunk_size,2*chunk_size,chunks[6],null,chunks[4]);
	chunks[8] = new chunkT(2*chunk_size,2*chunk_size,chunks[7],null,chunks[5]);

	//chunks[0] = new chunk(0,0);
	/*
	document.getElementById("AnimationId").onclick = function(){flag = !flag;};
	document.getElementById("InitParamId").onclick = function(){flag2 = !flag2;};
	document.getElementById("radius").oninput = function() {
		document.getElementById("radius_value").innerHTML = this.value;
		radius = Number(event.srcElement.value);
	};
	document.getElementById("angleY").oninput = function() {
		document.getElementById("angleY_value").innerHTML = this.value;
		angleY = Number(event.srcElement.value);
	};
	document.getElementById("angleX").oninput = function() {
		document.getElementById("angleX_value").innerHTML = this.value;
		angleX = Number(event.srcElement.value);
	};*/

	document.onkeydown = function(e){
		if (e.key=="w"||e.key=="W") {
			key_pressed[0] = true;
		} else if (e.key=="a"||e.key=="A") {
			key_pressed[1] = true;
		} else if (e.key=="s"||e.key=="S") {
			key_pressed[2] = true;
		} else if (e.key=="d"||e.key=="D") {
			key_pressed[3] = true;
		} else if (e.key=="Shift") {
			key_pressed[4] = true;
		} else if (e.key==" ") {
			key_pressed[5] = true;
		} else if (e.key=="e"||e.key=="E") {
			key_pressed[6] = true;
		}
	};

	document.onkeyup = function(e){
		if (e.key=="w"||e.key=="W") {
			key_pressed[0] = false;
		} else if (e.key=="a"||e.key=="A") {
			key_pressed[1] = false;
		} else if (e.key=="s"||e.key=="S") {
			key_pressed[2] = false;
		} else if (e.key=="d"||e.key=="D") {
			key_pressed[3] = false;
		} else if (e.key=="Shift") {
			key_pressed[4] = false;
		} else if (e.key==" ") {
			key_pressed[5] = false;
		} else if (e.key=="e"||e.key=="E") {
			key_pressed[6] = false;
		}

	};

	canvas.onmousedown = function(e){
		mouse_x = e.offsetX;
		mouse_y = e.offsetY;
		mouse_pressing = true;
		mouse_alfa = camera_alfa;
		mouse_beta = camera_beta;
	}

	canvas.onmouseup = function(e){
		mouse_pressing = false;
	}

	canvas.onmousemove = function(e){
		if (!mouse_pressing) {return;}
		let alfa = mouse_x - e.offsetX;
		let beta = mouse_y - e.offsetY;
		alfa = alfa/100;
		beta = beta/100;
		camera_alfa = mouse_alfa + alfa;
		camera_beta = mouse_beta + beta;
		if (camera_beta<-1.56) { //1.56 is almost equal to pi/2
			camera_beta = -1.56;
			mouse_beta = -1.56;
			mouse_y = e.offsetY;
		}
		else if (camera_beta>1.56) {
			camera_beta = 1.56;
			mouse_beta = 1.56;
			mouse_y = e.offsetY;
		}
		/*
		camera_alfa = camera_alfa % (2 * Math.PI);
		camera_alfa = (2 * Math.PI) + camera_alfa;
		camera_alfa = camera_alfa % (2 * Math.PI);
		*/
		//camera_alfa = camera_alfa % Math.PI;
		//camera_beta = camera_beta % Math.PI;
		update_lookAt();
		compute_camera_matrix();
	};

	update_lookAt();
	compute_camera_matrix();
	window.setInterval(onTimer, 10);
	modelViewMatrix = mat4();

	//for(i=0; i<numNodes; i++)
	//	initNodes(i);
	//var imgList = ["texture0.jpg", "texture1.png", "texture2.jpeg", "texture3.jpg"];
	//loadImages(imgList);
	//render();
	renderS();
}


//let num_of_squares = 6;

var renderS = function() {
	//console.log(Date.now()-last_time); last_time = Date.now();
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	for (var i = 0; i < chunks.length; i++) {
		chunks[i].render();
	}

	requestAnimationFrame(renderS);
}




































// TEXTURE OLD
/*
function loadImage(url, callback) {
	var image = new Image();
	image.onload = callback;
	image.src = url;
	return image;
}

function loadImages(urls) {
	var images = [];
	var imagesStillToLoad = urls.length;
	var onImageLoad = function() {
		imagesStillToLoad--;
		if (imagesStillToLoad == 0) {
			loadTextures(images);
		}
	};
	for (var i = 0; i < urls.length; i++) {
		var image = loadImage(urls[i], onImageLoad);
		images.push(image);
	}
}

function loadTextures(images) {
	for (var i=0; i< images.length; i++) {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
		textures.push(texture);
	}
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, textures[0] );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

	render();
}*/

// RENDER OLD
/*
var render = function() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	instanceMatrix = mat4();
	projectionMatrix=perspective(fovy, aspect, near, far);
	modelViewMatrix = mat4();
	modelViewLoc = gl.getUniformLocation( program, "modelViewMatrix" );
	projMatrixLoc  = gl.getUniformLocation (program, "projectionMatrix");

	var eye = vec3(radius*Math.sin(angleY*angrad)*Math.cos(angleX*angrad),
					radius*Math.sin(angleX*angrad),
					radius*Math.cos(angleY*angrad)*Math.cos(angleX*angrad));
	var at = vec3(0.0, 0.0, 0.0);
	var up = vec3(0.0, 1.0, 0.0);
	cameraPos = lookAt(eye,at,up);
	modelViewMatrix = mult(modelViewMatrix, cameraPos);
	gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv(projMatrixLoc, false, flatten(projectionMatrix) );
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

	for(i=0; i<numNodes; i++)
		initNodes(i);
		traverse(torsoId);
		if (flag) {
			document.getElementById("AnimSpan").innerHTML = "Animation Ongoing";
			if (count<5) {
				t_torso -= 0.03;
				trans += 0.03;

				if (forward) {
					if (theta[rightUpperArmId]<205) {
						theta[rightUpperArmId] += 1.0;
						if (theta[rightUpperArmId]<190 && theta[rightLowerArmId]>-45)
							theta[rightLowerArmId] -= 3.5;
						else
							if (theta[rightUpperArmId]>=195 && theta[rightLowerArmId]<0)
								theta[rightLowerArmId] += 3.5;
					}

					if (theta[rightUpperLegId]<185) {
						theta[rightUpperLegId] += 1.0;
						if (theta[rightUpperLegId]<165 && theta[rightLowerLegId]<40)
							theta[rightLowerLegId] += 2.0;
						else
							if (theta[rightUpperLegId]>=175 && theta[rightLowerLegId]>15)
								theta[rightLowerLegId] -= 2.5;
					}

					if (theta[leftUpperArmId]>155) {
						theta[leftUpperArmId] -= 1.0;
						if (theta[leftUpperArmId]<175 && theta[leftLowerArmId]<35)
							theta[leftLowerArmId] += 1.5;
						else
							if (theta[leftUpperArmId]<=165 && theta[leftLowerArmId]>20)
								theta[leftLowerArmId] -= 1.0;
					}
					if (theta[leftUpperLegId]>135) {
						theta[leftUpperLegId] -= 1;
						if (theta[leftUpperLegId]<165 && theta[leftLowerLegId]>5)
							theta[leftLowerLegId] -=1.0;
					}

					if (theta[rightUpperArmId]>=205) {
						forward = false;
						count++;
					}
				} else {
					if (theta[rightUpperArmId]>155) {
						theta[rightUpperArmId] -= 1.0;
						if (theta[rightUpperArmId]<195 && theta[rightLowerArmId]<15)
							theta[rightLowerArmId] += 0.5;
						else
							if (theta[rightUpperArmId]<=165 && theta[rightLowerArmId]<20)
								theta[rightLowerArmId] += 3.0;
					}

					if (theta[rightUpperLegId]>135) {
						theta[rightUpperLegId] -= 1.0;
						if (theta[rightUpperLegId]<165 && theta[rightLowerLegId]>5)
							theta[rightLowerLegId] -= 1.0;
					}

					if (theta[leftUpperArmId]<205) {
						theta[leftUpperArmId] += 1.0;
						if (theta[leftUpperArmId]<190 && theta[leftLowerArmId]>-45)
							theta[leftLowerArmId] -= 3.5;
						else
							if (theta[leftUpperArmId]>=190 && theta[leftLowerArmId]<0)
								theta[leftLowerArmId] += 3.5;
					}
					if (theta[leftUpperLegId]<185) {
						theta[leftUpperLegId] += 1.0;
						if (theta[leftUpperLegId]<170 && theta[leftLowerLegId]<35)
							theta[leftLowerLegId] +=1.5;
						else
							if(theta[leftUpperLegId]>=175 && theta[leftLowerLegId]>15)
								theta[leftLowerLegId] -=2.5;
					}

					if (theta[rightUpperArmId]<=155) {
						forward = true;
						count++;
						if (count == 5)
							rising = true;
					}
				}
			} else if (rising) {
					if (theta[rightUpperArmId]>180) {
						t_torso -= 0.03;
						trans += 0.03;
						theta[rightUpperArmId] -= 1.0;
						if (theta[rightUpperArmId]<195 && theta[rightLowerArmId]<15)
							theta[rightLowerArmId] += 0.5;
						else
							if (theta[rightUpperArmId]<=165 && theta[rightLowerArmId]<20)
								theta[rightLowerArmId] += 3.0;
					}
					if (theta[rightUpperLegId]>160) {
						theta[rightUpperLegId] -= 1.0;
						if (theta[rightLowerLegId]<30)
							theta[rightLowerLegId] += 1.0;
					}
					if (theta[leftUpperArmId]<180) {
						theta[leftUpperArmId] += 1.0;
						if (theta[leftUpperArmId]<165 && theta[leftLowerArmId]>-45)
							theta[leftLowerArmId] -= 3.5;
						else
							if (theta[leftUpperArmId]>=165 && theta[leftLowerArmId]<=0){
								theta[leftLowerArmId] += 3.5;
							}
					}
					if (theta[leftUpperLegId]<160) {
						theta[leftUpperLegId] += 1.0;
						if (theta[leftLowerLegId]<30)
							theta[leftLowerLegId] +=1.0;
					}
					if (t_torso <= -2.99) {
						rising = false;
						scratch = true;
					}
			}
			if (scratch) {
				if (theta[torsoId]<90) {
					t_scratch += 0.02;
					trans_scratch -=0.02;
					t_torso += 0.03;
					trans -= 0.03;
					theta[torsoId] += 1.0;

					theta[leftUpperArmId] -= 0.25;
					theta[leftLowerArmId] -= 0.25;
					theta[rightUpperArmId] -= 0.25;
					theta[rightLowerArmId] -= 0.25;

					theta[leftUpperLegId] -= 0.25;
					theta[leftLowerLegId] -= 1.15;
					theta[rightUpperLegId] -= 0.25;
					theta[rightLowerLegId] -= 1.15;
				} else {
					if (upSc) {
						t_scratch += 0.01;
						trans_scratch -=0.01;
						theta[leftUpperLegId] -= 0.45;
						theta[leftLowerLegId] += 0.85;
						theta[rightUpperLegId] -= 0.45;
						theta[rightLowerLegId] += 0.85;
						if (t_scratch >= 2.3){
							upSc=false;
						}
					}
					else {
						t_scratch -= 0.01;
						trans_scratch +=0.01;
						theta[leftUpperLegId] += 0.45;
						theta[leftLowerLegId] -= 0.85;
						theta[rightUpperLegId] += 0.45;
						theta[rightLowerLegId] -= 0.85;
						if (t_scratch <= 1.8)
							upSc=true;
					}
				}
			}
		} else
			document.getElementById("AnimSpan").innerHTML = "Animation Stopped";
		if (flag2) {
			forward = true;
			count = 0.0;
			t_torso += trans;
			trans = 0.0;
			var currenttorso = theta[torsoId];
			theta = [0, 0, 180, 0, 180, 0, 160, 30, 160, 30, 60, 0];
			flag2 = !flag2;
			t_scratch += trans_scratch;
			trans_scratch = 0.0;
			scratch = false;
			upSc = true;
			rising = true;
		}
		requestAnimationFrame(render);
}
*/
