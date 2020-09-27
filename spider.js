var stackS = [];
var figureS = [];

var torsoIdS = 0;
var headIdS = 1;
var tailIdS = 2;
var arm1Id = 3;
var forearm1Id = 4;
var arm2Id = 5;
var forearm2Id = 6;
var arm3Id = 7;
var forearm3Id = 8;
var arm4Id = 9;
var forearm4Id = 10;
var arm5Id = 11;
var forearm5Id = 12;
var arm6Id = 13;
var forearm6Id = 14;
var arm7Id = 15;
var forearm7Id = 16;
var arm8Id = 17;
var forearm8Id = 18;
var headYId = 19;
var arm1XId = 20;
var arm2XId = 21;
var arm3XId = 22;
var arm4XId = 23;
var arm5XId = 24;
var arm6XId = 25;
var arm7XId = 26;
var arm8XId = 27;

var torsoHeightS = 1.5;
var torsoWidthS = 2.0;
var torsoDepth = 1.5;

var forearmHeightS = 3.0;
var forearmWidthS = 0.4;
var forearmDepthS = 0.4;

var armHeight = 2.2;
var armWidth = 0.5;
var armDepth = 0.5;

var tailHeightS = 2.8;
var tailWidthS = 3.2;
var tailDepthS = 2.8;

var headHeightS = 2.2;
var headWidthS = 2.2;
var headDepthS = 2.2;


var numNodesS = 19;
var numAngles = 28;

for( var i=0; i<numNodesS; i++)  figureS[i] = createNodeS(null, null, null, null);

function createSpider(posXH, posYH, posZH) {
	this.direction = vec3(0,0,0);
	this.inerzia = vec3(0,0,0);
	this.climbing = false;
	this.direction_backup;
	this.climbing_target;
	this.axis_climbing;
	this.animation_duration = 1;
	this.animation = 0;
	this.type_entity = 2;

	var theta = [0, 0, 0, -30, -70, -10, -70, 10, -70, 30, -70, 30, -70, 10, -70, -10, -70, -30, -70, 0, -70, -70, -70, -70, -70, -70, -70, -70];
	this.position = [posXH, posYH, posZH];
	var c = 0.0;
	var y1 = 0.0;
	var y2 = 0.0;
	var y3 = 0.0;
	var y4 = 0.0;
	var c1= 0.0;
	var c2= 0.0;
	var c3= 0.0;
	var c4= 0.0;
	var c1_sin = 0.0;
	var c2_sin = 0.0;
	var c3_sin = 0.0;
	var c4_sin = 0.0;
	var ratioDiv = 4.0;
	var ratioAng = 6.0;
	var ratioBeg = 60.0;
	var w = 0.0;
	var numStepsSpider = 100;
	this.torsoYH = 0;

	this.render = function() {
		for(i=0; i<numNodesS; i++){
			initNodesS(i,theta,this.position,y1,y2,y3,y4,this.torsoYH);
		}
		traverseS(torsoIdS);
	}

	this.walking_animation = function() {

		c1_sin = Math.sin(radians(c1));
		c2_sin = Math.sin(radians(c2));
		c3_sin = Math.sin(radians(c3));
		c4_sin = Math.sin(radians(c4));

		if (w < numStepsSpider) {
			c1 += ratioAng;
			theta[arm1XId] += c1_sin/2;
			theta[arm7XId] += c1_sin/2;
			y1=c1_sin/ratioDiv;
			theta[arm1Id] -= c1_sin;
			theta[arm7Id] += c1_sin;
			if(c1_sin==1)
				w++;
			if (c1>ratioBeg) {
				c2 += ratioAng;
				theta[arm2XId] += c2_sin/2;
				theta[arm6XId] += c2_sin/2;
				y2 = c2_sin/ratioDiv;
				theta[arm2Id] -= c2_sin;
				theta[arm6Id] += c2_sin;
			}

			if (c1>ratioBeg*2) {
				c3 += ratioAng;
				theta[arm3XId] += c3_sin/2;
				theta[arm5XId] += c3_sin/2;
				y3 = c3_sin/ratioDiv;
				theta[arm3Id] -= c3_sin;
				theta[arm5Id] += c3_sin;
			}

			if (c1>ratioBeg) {
				c4 += ratioAng;
				theta[arm4XId] += c4_sin/2;
				theta[arm8XId] += c4_sin/2;
				y4 = c4_sin/ratioDiv;
				theta[arm4Id] -= c4_sin;
				theta[arm8Id] += c4_sin;
			}
		}

		if(w == numStepsSpider && c1/360<numStepsSpider){
			c1 += ratioAng;
			theta[arm1XId] += c1_sin/2;
			theta[arm7XId] += c1_sin/2;
			y1=c1_sin/ratioDiv;
			theta[arm1Id] -= c1_sin;
			theta[arm7Id] += c1_sin;
		}

		if(w == numStepsSpider && c2/360<numStepsSpider){
			c2 += ratioAng;
			theta[arm2XId] += c2_sin/2;
			theta[arm6XId] += c2_sin/2;
			y2 = c2_sin/ratioDiv;
			theta[arm2Id] -= c2_sin;
			theta[arm6Id] += c2_sin;
		}

		if(w == numStepsSpider && c3/360<numStepsSpider){
			c3 += ratioAng;
			theta[arm3XId] += c3_sin/2;
			theta[arm5XId] += c3_sin/2;
			y3 = c3_sin/ratioDiv;
			theta[arm3Id] -= c3_sin;
			theta[arm5Id] += c3_sin;
		}

		if(w == numStepsSpider && c4/360<numStepsSpider){
			c4 += ratioAng;
			theta[arm4XId] += c4_sin/2;
			theta[arm8XId] += c4_sin/2;
			y4 = c4_sin/ratioDiv;
			theta[arm4Id] -= c4_sin;
			theta[arm8Id] += c4_sin;
		}

		if(w == numStepsSpider && c1/360>=numStepsSpider && c2/360>=numStepsSpider && c3/360>=numStepsSpider && c4/360>=numStepsSpider)
			return true;
		else
			return false;
	}

	this.standH = function() {
		theta = [0, 0, 0, -30, -70, -10, -70, 10, -70, 30, -70, 30, -70, 10, -70, -10, -70, -30, -70, 0, -70, -70, -70, -70, -70, -70, -70, -70];
		//this.position = [posXH, posYH, posZH];
		c = 0.0;
		y1 = 0.0;
		y2 = 0.0;
		y3 = 0.0;
		y4 = 0.0;
		c1= 0.0;
		c2= 0.0;
		c3= 0.0;
		c4= 0.0;
		c1_sin = 0.0;
		c2_sin = 0.0;
		c3_sin = 0.0;
		c4_sin = 0.0;
		ratioDiv = 4.0;
		ratioAng = 6.0;
		ratioBeg = 60.0;
		w = 0.0;
		//numStepsSpider = 3.0;
		//this.angle_torso_y = 0;
	}

}

function createNodeS(transform, render, sibling, child) {
	var node = {
		transform: transform,
		render: render,
		sibling: sibling,
		child: child,
	}
	return node;
}

function traverseS(Id) {
	if(Id == null) return;
	stackS.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, figureS[Id].transform);
	figureS[Id].render();
	if(figureS[Id].child != null) traverseS(figureS[Id].child);
	modelViewMatrix = stackS.pop();
	if(figureS[Id].sibling != null) traverseS(figureS[Id].sibling);
}

function initNodesS(Id,theta,position,y1,y2,y3,y4,angle_torso_y) {

	var m = mat4();
	var foreamsZ = -1.25;
	switch(Id) {

	case torsoIdS:

		m = translate(position[0], position[1]-0.6, position[2]);
		m = mult(m, scale4(0.2, 0.2, 0.2));
		m = mult(m, rotate(-angle_torso_y,0,1,0));
		m = mult(m, rotate(-theta[torsoIdS], 0, 0, 1));
		figureS[torsoIdS] = createNodeS( m, torsoS, null, headIdS );
		break;

	case headIdS:
		m = translate(torsoWidthS, 0.0, 0.0);
		m = mult(m, rotate(-theta[headIdS], 1, 0, 0));
		m = mult(m, rotate(-theta[headYId], 0, 1, 0));
		figureS[headIdS] = createNodeS( m, headS, tailIdS, null);
		break;

	case tailIdS:
		m = translate(-torsoWidthS*1.3, 0.0, 0.0);
		m = mult(m, rotate(-theta[tailIdS], 0, 0, 1));
		figureS[tailIdS] = createNodeS( m, tailS, arm1Id, null );
		break;

	//LEFT LEGS
	case arm1Id:
		m = translate(torsoWidthS*0.4, y1, -torsoDepth*1.1);

		m = mult(m, rotate(-theta[arm1XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm1Id], 0, 0, 1));
		figureS[arm1Id] = createNodeS( m, arm, arm2Id, forearm1Id );
		break;

	case forearm1Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm1Id], 1, 0, 0));
		figureS[forearm1Id] = createNodeS( m, forearm, null, null );
		break;

	case arm2Id:
		m = translate(torsoWidthS*0.14, y2, -torsoDepth*1.15);
		m = mult(m, rotate(-theta[arm2XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm2Id], 0, 0, 1));
		figureS[arm2Id] = createNodeS( m, arm, arm3Id, forearm2Id );
		break;

	case forearm2Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm2Id], 1, 0, 0));
		figureS[forearm2Id] = createNodeS( m, forearm, null, null );
		break;

	case arm3Id:
		m = translate(-torsoWidthS*0.14, y3, -torsoDepth*1.15);
		m = mult(m, rotate(-theta[arm3XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm3Id], 0, 0, 1));
		figureS[arm3Id] = createNodeS( m, arm, arm4Id, forearm3Id );
		break;

	case forearm3Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm3Id], 1, 0, 0));
		figureS[forearm3Id] = createNodeS( m, forearm, null, null );
		break;

	case arm4Id:
		m = translate(-torsoWidthS*0.4, y4, -torsoDepth*1.1);
		m = mult(m, rotate(-theta[arm4XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm4Id], 0, 0, 1));
		figureS[arm4Id] = createNodeS( m, arm, arm5Id, forearm4Id );
		break;

	case forearm4Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm4Id], 1, 0, 0));
		figureS[forearm4Id] = createNodeS( m, forearm, null, null );
		break;

	//RIGHT LEGS
	case arm5Id:
		m = translate(torsoWidthS*0.4, y3, torsoDepth*1.1);
		m = mult(m, rotate(180, 0, 1, 0));
		m = mult(m, rotate(-theta[arm5XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm5Id], 0, 0, 1));
		figureS[arm5Id] = createNodeS( m, arm, arm6Id, forearm5Id );
		break;

	case forearm5Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm5Id], 1, 0, 0));
		figureS[forearm5Id] = createNodeS( m, forearm, null, null );
		break;

	case arm6Id:
		m = translate(torsoWidthS*0.14, y2, torsoDepth*1.15);
		m = mult(m, rotate(180, 0, 1, 0));
		m = mult(m, rotate(-theta[arm6XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm6Id], 0, 0, 1));
		figureS[arm6Id] = createNodeS( m, arm, arm7Id, forearm6Id );
		break;

	case forearm6Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm6Id], 1, 0, 0));
		figureS[forearm6Id] = createNodeS( m, forearm, null, null );
		break;

	case arm7Id:
		m = translate(-torsoWidthS*0.14, y1, torsoDepth*1.15);
		m = mult(m, rotate(180, 0, 1, 0));
		m = mult(m, rotate(-theta[arm7XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm7Id], 0, 0, 1));
		figureS[arm7Id] = createNodeS( m, arm, arm8Id, forearm7Id );
		break;

	case forearm7Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm7Id], 1, 0, 0));
		figureS[forearm7Id] = createNodeS( m, forearm, null, null );
		break;

	case arm8Id:
		m = translate(-torsoWidthS*0.4, y4, torsoDepth*1.1);
		m = mult(m, rotate(180, 0, 1, 0));
		m = mult(m, rotate(-theta[arm8XId], 1, 0, 0));
		m = mult(m, rotate(-theta[arm8Id], 0, 0, 1));
		figureS[arm8Id] = createNodeS( m, arm, null, forearm8Id );
		break;

	case forearm8Id:
		m = translate(0.0, armHeight*0.65, foreamsZ);
		m = mult(m, rotate(-theta[forearm8Id], 1, 0, 0));
		figureS[forearm8Id] = createNodeS( m, forearm, null, null );
		break;
	}

}





function torsoS() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4( torsoWidthS, torsoHeightS, torsoDepth));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function headS() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidthS, headHeightS, headDepthS) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailS() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tailWidthS, tailHeightS, tailDepthS));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function arm() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(armWidth, armHeight, armDepth) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function forearm() {
	instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(forearmWidthS, forearmHeightS, forearmDepthS) );
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
