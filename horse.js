"use strict";

var stack = [];
var figure = [];

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 22;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 10;
var earLeftId = 11;
var earRightId = 12;
var noseId = 13;
var mouthId = 14;
var crestId = 15;
var frontHoofLeftId = 16;
var frontHoofRightId = 17;
var rearHoofLeftId = 18;
var rearHoofRightId = 19;
var tail2Id = 20;
var tail3Id = 21;

var torsoHeight = 3.0;
var torsoWidth = 8.0;

var upperArmHeight = 2.5;
var upperArmWidth  = 1.2;
var lowerArmHeight = 1.7;
var lowerArmWidth  = 0.8;

var upperLegHeight = 2.8;
var upperLegWidth  = 1.2;
var lowerLegHeight = 2.0;
var lowerLegWidth  = 0.8;

var tailHeight = 0.9;
var tailWidth = 0.4;

var tailHeight2 = 2.5;
var tailWidth2 = 1.0;

var tailHeight3 = 1.5;
var tailWidth3 = 1.0;

var headHeight = 4.0;
var headWidth = 2.0;
var headDepth = 1.2;

var earHeight = 0.65;
var earWidth = 0.2;
var earDepth = 0.45;

var noseHeight = 1.5;
var noseWidth = 1.0;
var noseDepth = 1.0;

var mouthHeight = 1.2;
var mouthWidth = 0.5;
var mouthDepth = 0.8;

var crestHeight = 4.5;
var crestWidth = 0.8;
var crestDepth = 0.4;

var hoofHeight = 0.7;
var hoofWidth = 1.0;
var hoofDepth = 1.0;

var numNodes = 22;
var numAngles = 23;

var posX = 0.0;
var posY = 0.0;
var posZ = 0.0;



for( var i=0; i<numNodes; i++)  figure[i] = createNode(null, null, null, null);

function createHorse(posXH, posYH, posZH) {

	//this.position = vec3(starting_x, starting_y, starting_z);
	this.direction = vec3(0,0,0);
	this.inerzia = vec3(0,0,0);
	this.climbing = false;
	this.direction_backup;
	this.climbing_target;
	this.axis_climbing;
	this.animation_duration = 1;
	this.animation = 0;
	this.type_entity = 1;

	var theta = [0, -30, 180, 0, 180, 0, 160, 30, 160, 30, 165, 0 , 0 ,   -90 ,  -90 ,  0  , 0,0,0,0,0,10,0];
	this.position = vec3(posXH, posYH, posZH);
	var count = 0.0;
	var forward = true;
	var ond = true;
	var ond1 = true;
	var ond2 = true;
	var ondi = 1;
	var t_headY = 0.0;
	var t_headX = 0.0;
	var neckMoveOn = true;
	var mouthMovOn1 = false;
	var mouthMovOn2 = false;
	var countMouth = 0;
	var numSteps = 100;	//numero di passi che vuoi fare
	this.torsoYH = 0;

	this.test = function() {
		return this.torsoYH;
	}

	this.render = function() {
		for(i=0; i<numNodes; i++){
			//console.log("B",this.torsoYH);
			compute_model_matrices(i,theta,this.position,t_headX,t_headY,this.torsoYH);
		}
		traverse(torsoId);
	}
	this.walking_animation = function() {
		if (count<numSteps) {
				//t_body -= 0.03;
				//trans += 0.03;

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
				}

				else {
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
					}
				}
			}

			else {

				if (theta[rightUpperArmId]>180) {

					//t_body -= 0.03;
					//trans += 0.03;

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
						if (theta[leftUpperArmId]>=165 && theta[leftLowerArmId]<=0)
							theta[leftLowerArmId] += 3.5;
				}
				if (theta[leftUpperLegId]<160) {
					theta[leftUpperLegId] += 1.0;
					if (theta[leftLowerLegId]<30)
						theta[leftLowerLegId] +=1.0;
				}
			}
			if(count == numSteps)
				return true;
			else return false;
		}

		this.rearing_animation = function () {
			if (ond && theta[leftUpperLegId]>130 && theta[rightUpperLegId]>130 && ondi<3) {
				if (theta[mouthId]>-110)
					theta[mouthId] -= 3.5;
				theta[leftUpperLegId] -=1.5;
				theta[rightUpperLegId] -=1.5;
				theta[torsoId] += 2.0;
				theta[leftLowerLegId] -= 0.8;
				theta[rightLowerLegId] -= 0.8;
				theta[tailId] -= 1.5;
				theta[rightUpperArmId] += 1.8;

				if (theta[leftUpperLegId]<132)
					ond=!ond;
			}
			//gamba sinistra risalita
			if (ond1 && ondi<3 && theta[leftUpperArmId]<240) {
				theta[leftUpperArmId] += 2.1;
				if (theta[leftLowerArmId] < 0)
					theta[leftLowerArmId] +=2.2;
				if (theta[leftUpperArmId]>237){
					ondi++;
					ond1 = !ond1;
				}
			}
			if (!ond1 && ondi<3 && theta[leftUpperArmId]>160) {
				theta[leftUpperArmId] -= 2.1;
				if (theta[leftLowerArmId] > -45)
					theta[leftLowerArmId] -=2.2;
				if (theta[leftUpperArmId]<163)
					ond1 = !ond1;
			}
			//gamba destra risalita
			if (!ond2 && ondi<3 && theta[rightUpperArmId]<240) {
				theta[rightUpperArmId] += 2.1;
				if (theta[rightLowerArmId] < 0)
					theta[rightLowerArmId] +=2.2;
				if (theta[rightUpperArmId]>237)
					ond2 = !ond2;
			}
			if (ond2 && ondi<3 && theta[rightUpperArmId]>160) {
				theta[rightUpperArmId] -= 2.1;
				if (theta[rightLowerArmId] > -45)
					theta[rightLowerArmId] -=2.2;
				if (theta[rightUpperArmId]<163) {

					ond2 = !ond2;
				}
			}
			if (!ond && theta[leftUpperLegId]<=160 && theta[rightUpperLegId]<=160 && ondi==3) {
				if (theta[mouthId]<-90)
					theta[mouthId] += 3.5;
				if (theta[leftUpperArmId] > 180)
					 theta[leftUpperArmId] -= 3.2;
				if (theta[rightUpperArmId] < 180)
					 theta[rightUpperArmId] += 2.6;
				theta[leftUpperLegId] +=1.5;
				theta[rightUpperLegId] +=1.5;
				theta[torsoId] -= 2.0;
				theta[leftLowerLegId] += 0.8;
				theta[rightLowerLegId] += 0.8;
				theta[tailId] += 1.5;
				theta[rightUpperArmId] -= 1.8;
				theta[rightLowerArmId] +=2.0;
				/*if (theta[leftUpperLegId]>=160) {
					theta[leftUpperArmId] = 180;
					theta[rightUpperArmId] = 180;
					theta[rightLowerArmId] = 0;
					ond=!ond;
					this.bool_rearingH = true;
				}*/
			}
			if (!ond && theta[leftUpperLegId]>=160 && ondi==3)
				return true;
			else
				return false;
		}

		this.eat_animation = function () {
			if (neckMoveOn && countMouth<3){
				theta[head1Id] -= 1.5;
				t_headY -= 0.055;
				t_headX += 0.003;
				if (theta[head1Id]<-100 && theta[mouthId]>-110 && !mouthMovOn1)
				{
					theta[mouthId] -= 1.5;
					if (theta[mouthId]<-108)
						mouthMovOn1 = !mouthMovOn1;
				}
				if (theta[head1Id]<-118)
					neckMoveOn = !neckMoveOn;
			}
			//Chiudendo bocca
			if (mouthMovOn1 && countMouth<3)
			{
				theta[mouthId] +=0.5;
				t_headY += 0.01;
				theta[head1Id] += 0.3;
				if(theta[mouthId]>-91)
				{
					countMouth++;
					mouthMovOn2 = !mouthMovOn2;
					mouthMovOn1 = !mouthMovOn1;
				}
			}
			//Apri bocca
			if (mouthMovOn2 && countMouth<3)
			{
				theta[mouthId] -=0.5;
				t_headY -= 0.01;
				theta[head1Id] -= 0.3;
				if(theta[mouthId]<-109)
				{
					mouthMovOn1 = !mouthMovOn1;
					mouthMovOn2 = !mouthMovOn2;
				}
			}
			//Salita collo
			if (!neckMoveOn && countMouth >=3)
			{
				theta[head1Id] += 1.5;
				t_headY += 0.055
				t_headX -= 0.003;
				if (theta[head1Id]>-32)
				{
					neckMoveOn = !neckMoveOn;
					t_headY = 0;
					t_headX = 0;
				}
			}
			if (neckMoveOn && countMouth >=3 && theta[head1Id]>-32)
				return true;
			else
				return false;

		}

		this.standH = function(){
			theta = [0, -30, 180, 0, 180, 0, 160, 30, 160, 30, 165, 0 , 0 ,   -90 ,  -90 ,  0  , 0,0,0,0,0,10,0];
			//this.position = [posXH, posYH, posZH];
			count = 0.0;
			forward = true;
			ond = true;
			ond1 = true;
			ond2 = true;
			ondi = 1;
			t_headY = 0.0;
			t_headX = 0.0;
			neckMoveOn = true;
			mouthMovOn1 = false;
			mouthMovOn2 = false;
			countMouth = 0;
			//numSteps = 7;	//numero di passi che vuoi fare
			//this.torsoYH = 0;
		}
}

function createNode(transform, render, sibling, child) {
	var node = {
		transform: transform,
		render: render,
		sibling: sibling,
		child: child,
	}
	return node;
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

function compute_model_matrices(Id,theta,position,t_headX,t_headY,torsoYH) {

	var m = mat4();

	switch(Id) {

	case torsoId:
		//m = translate(-t_body, 0.0, 0.0);
		//m = rotate(-torsoYH,0,1,0);

		m = translate(position[0], position[1], position[2]);
		m = mult(m,scale4(0.2, 0.2, 0.2));
		m = mult(m,rotate(-torsoYH,0,1,0));
		m = mult(m, rotate(-theta[torsoId], 0, 0, 1));
		figure[torsoId] = createNode( m, torso, null, headId );
		break;

	case headId:
		m = translate((torsoWidth+headWidth)*0.45+t_headX, headHeight*0.4 + t_headY, 0.0);
		m = mult(m, rotate(-theta[head1Id], 0, 0, 1));
		m = mult(m, rotate(-theta[head2Id], 0, 1, 0));
		figure[headId] = createNode( m, head, tailId, earLeftId);
		break;

	//FRONT LEGS
	case leftUpperArmId:
		m = translate((torsoWidth+upperArmWidth)*0.5-1.4, torsoHeight*0.1, -torsoHeight*0.31);
		m = mult(m, rotate(-theta[leftUpperArmId], 0, 0, 1));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
		break;

	case rightUpperArmId:
		m = translate((torsoWidth+upperArmWidth)*0.5-1.4, torsoHeight*0.1, torsoHeight*0.31);
		m = mult(m, rotate(-theta[rightUpperArmId], 0, 0, 1));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
		break;

	//REAR LEGS
	case leftUpperLegId:
		m = translate(-torsoWidth*0.35, torsoHeight*0.1, -torsoHeight*0.35);
		m = mult(m , rotate(-theta[leftUpperLegId], 0, 0, 1));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
		break;

	case rightUpperLegId:
		m = translate(-torsoWidth*0.35, torsoHeight*0.1, torsoHeight*0.35);
		m = mult(m, rotate(-theta[rightUpperLegId], 0, 0, 1));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
		break;

	case leftLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(-theta[leftLowerArmId], 0, 0, 1));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, frontHoofLeftId );
		break;

	case frontHoofLeftId:
		m = translate(0.0, lowerArmHeight, 0.0);
		m = mult(m, rotate(-theta[frontHoofLeftId], 0, 0, 1));
		figure[frontHoofLeftId] = createNode( m, hoof, null, null );
		break;

	case rightLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(-theta[rightLowerArmId], 0, 0, 1));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, frontHoofRightId );
		break;

	case frontHoofRightId:
		m = translate(0.0, lowerArmHeight, 0.0);
		m = mult(m, rotate(-theta[frontHoofRightId], 0, 0, 1));
		figure[frontHoofRightId] = createNode( m, hoof, null, null );
		break;

	case leftLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(-theta[leftLowerLegId], 0, 0, 1));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, rearHoofLeftId );
		break;

	case rearHoofLeftId:
		m = translate(0.0, lowerLegHeight, 0.0);
		m = mult(m, rotate(-theta[rearHoofLeftId], 0, 0, 1));
		figure[rearHoofLeftId] = createNode( m, hoof, null, null );
		break;

	case rightLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(-theta[rightLowerLegId], 0, 0, 1));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, rearHoofRightId );
		break;

	case rearHoofRightId:
		m = translate(0.0, lowerLegHeight, 0.0);
		m = mult(m, rotate(-theta[rearHoofRightId], 0, 0, 1));
		figure[rearHoofRightId] = createNode( m, hoof, null, null );
		break;

	case tailId:
		m = translate(-torsoWidth*0.5, torsoHeight*0.51, 0.0);
		m = mult(m, rotate(-theta[tailId], 0, 0, 1));
		figure[tailId] = createNode( m, tail, leftUpperArmId, tail2Id );
		break;

	case tail2Id:
		m = translate(0.0, tailHeight*2.2, 0.0);
		m = mult(m, rotate(-theta[tail2Id], 0, 0, 1));
		figure[tail2Id] = createNode( m, tail2, null, tail3Id );
		break;

	case tail3Id:
		m = translate(-tailWidth2*0.12, tailHeight2*0.7, 0.0);
		m = mult(m, rotate(-theta[tail3Id], 0, 0, 1));
		figure[tail3Id] = createNode( m, tail3, null, null );
		break;

	case earLeftId:
		m = translate(-headWidth*0.9, headHeight*0.55, -headDepth *0.25);
		m = mult(m, rotate(-theta[earLeftId], 0, 0, 1));
		figure[earLeftId] = createNode( m, earLeft, earRightId, null );
		break;

	case earRightId:
		m = translate(-headWidth*0.9, headHeight*0.55, headDepth *0.25);
		m = mult(m, rotate(-theta[earRightId], 0, 0, 1));
		figure[earRightId] = createNode( m, earRight, noseId, null );
		break;

	case noseId:
		m = translate(headWidth*0.3, headHeight*0.35, 0.0);
		m = mult(m, rotate(-theta[noseId], 0, 0, 1));
		figure[noseId] = createNode( m, nose, mouthId, null );
		break;

	case mouthId:
		m = translate(-headWidth*0.25, headHeight*0.2, 0.0);
		m = mult(m, rotate(-theta[mouthId], 0, 0, 1));
		figure[mouthId] = createNode( m, mouth, crestId, null );
		break;

	case crestId:
		m = translate(-headWidth*1.15, headHeight*0.03, 0.0);
		m = mult(m, rotate(-theta[crestId], 0, 0, 1));
		figure[crestId] = createNode( m, crest, null, null );
		break;
	}

}


function torso() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoHeight));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function head() {
	instanceMatrix = mult(modelViewMatrix, translate(-1.0, 0.0, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headDepth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
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
	instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.4 * lowerLegHeight, 0.0) );
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
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.4 * lowerLegHeight, 0.0) );
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

function tail2() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth2, tailHeight2, tailWidth2));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail3() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth3, tailHeight3, tailWidth3));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function earLeft() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earDepth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function earRight() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earDepth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function nose() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(noseWidth, noseHeight, noseDepth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function mouth() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 1.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(mouthWidth, mouthHeight, mouthDepth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function crest() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(crestWidth, crestHeight, crestDepth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function hoof() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(hoofWidth, hoofHeight, hoofDepth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
