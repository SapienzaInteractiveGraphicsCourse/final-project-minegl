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

// Varie
var textures = [];
var vBuffer;

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


// texture

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

blu
0
18
179
*/

var texSize = 256;
var image_texture = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ ) {
	for ( var j = 0; j <texSize; j++ ) {
		image_texture[4*i*texSize+4*j] = 0;
		image_texture[4*i*texSize+4*j+1] = 0;
		image_texture[4*i*texSize+4*j+2] = 0;
		image_texture[4*i*texSize+4*j+3] = 0;
		/*
		image_texture[4*i*texSize+4*j] = 255;
		image_texture[4*i*texSize+4*j+1] = 0;
		image_texture[4*i*texSize+4*j+2] = 255;
		image_texture[4*i*texSize+4*j+3] = 255;*/
	}
}

for ( var i = 0; i < 14; i++ ) {
	for ( var j = 0; j <14; j++ ) {
		var temp_x = i*18 + 1;
		var temp_y = j*18 + 1;
		for (var x = 0; x < 16; x++) {
			for (var y = 0; y < 16; y++) {
				var red_variation = Math.floor(Math.random()*20)-10;
				var green_variation = Math.floor(Math.random()*20)-10;
				var blue_variation = Math.floor(Math.random()*20)-10;

				if (i==0&&j==0) {
					// erba
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 82 + red_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 137 + green_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = Math.abs(blue_variation);
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
				} else if (i==0&&j==1) {
					// terra
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 118 + red_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 83 + green_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = Math.abs(blue_variation);
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
				} else if (i==0&&j==2) {
					// terra e erba
					if (x<4) {
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 82 + red_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 137 + green_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = Math.abs(blue_variation);
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
					} else {
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 118 + red_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 83 + green_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = Math.abs(blue_variation);
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
					}
				} else if (i==0&&j==3) {
					// ? pietra

				} else if (i==0&&j==4) {
					// neve
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 219 + red_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 224 + green_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = 230 + blue_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
				} else if (i==0&&j==5) {
					// terra e neve
					if (x<4) {
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 219 + red_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 224 + green_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = 230 + blue_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
					} else {
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 118 + red_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 83 + green_variation;
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = Math.abs(blue_variation);
						image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
					}
				} else if (i==0&&j==6) {
					// acqua
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = Math.abs(red_variation);
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 18 + green_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = 179 + blue_variation;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
				}


				if (x==0) {
					image_texture[4*(temp_x-1)*texSize+4*(temp_y+y)] = image_texture[4*(temp_x)*texSize+4*(temp_y+y)];
					image_texture[4*(temp_x-1)*texSize+4*(temp_y+y)+1] = image_texture[4*(temp_x)*texSize+4*(temp_y+y)+1];
					image_texture[4*(temp_x-1)*texSize+4*(temp_y+y)+2] = image_texture[4*(temp_x)*texSize+4*(temp_y+y)+2];
					image_texture[4*(temp_x-1)*texSize+4*(temp_y+y)+3] = image_texture[4*(temp_x)*texSize+4*(temp_y+y)+3];
				} else if (x==15) {
					image_texture[4*(temp_x+16)*texSize+4*(temp_y+y)] = image_texture[4*(temp_x+15)*texSize+4*(temp_y+y)];
					image_texture[4*(temp_x+16)*texSize+4*(temp_y+y)+1] = image_texture[4*(temp_x+15)*texSize+4*(temp_y+y)+1];
					image_texture[4*(temp_x+16)*texSize+4*(temp_y+y)+2] = image_texture[4*(temp_x+15)*texSize+4*(temp_y+y)+2];
					image_texture[4*(temp_x+16)*texSize+4*(temp_y+y)+3] = image_texture[4*(temp_x+15)*texSize+4*(temp_y+y)+3];
				}


			} // fine for y

			//for (var y = 0; y < 16; y++) {
			image_texture[4*(temp_x+x)*texSize+4*(temp_y-1)] = image_texture[4*(temp_x+x)*texSize+4*(temp_y)]
			image_texture[4*(temp_x+x)*texSize+4*(temp_y-1)+1] = image_texture[4*(temp_x+x)*texSize+4*(temp_y)+1]
			image_texture[4*(temp_x+x)*texSize+4*(temp_y-1)+2] = image_texture[4*(temp_x+x)*texSize+4*(temp_y)+2]
			image_texture[4*(temp_x+x)*texSize+4*(temp_y-1)+3] = image_texture[4*(temp_x+x)*texSize+4*(temp_y)+3]

			image_texture[4*(temp_x+x)*texSize+4*(temp_y+16)] = image_texture[4*(temp_x+x)*texSize+4*(temp_y+15)]
			image_texture[4*(temp_x+x)*texSize+4*(temp_y+16)+1] = image_texture[4*(temp_x+x)*texSize+4*(temp_y+15)+1]
			image_texture[4*(temp_x+x)*texSize+4*(temp_y+16)+2] = image_texture[4*(temp_x+x)*texSize+4*(temp_y+15)+2]
			image_texture[4*(temp_x+x)*texSize+4*(temp_y+16)+3] = image_texture[4*(temp_x+x)*texSize+4*(temp_y+15)+3]

		} // fine for x
	}
}


//		if (i<16) {
//			if (j<16) {
//				// erba
//				image_texture[4*i*texSize+4*j] = 82 + red_variation;
//				image_texture[4*i*texSize+4*j+1] = 137 + green_variation;
//				image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//				image_texture[4*i*texSize+4*j+3] = 255;
//			} else if (j<32) {
//				// terra
//				image_texture[4*i*texSize+4*j] = 118 + red_variation;
//				image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
//				image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//				image_texture[4*i*texSize+4*j+3] = 255;
//			} else if (j<48) {
//				// erba e terra
//				if (i<4) {
//					image_texture[4*i*texSize+4*j] = 82 + red_variation;
//					image_texture[4*i*texSize+4*j+1] = 137 + green_variation;
//					image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//					image_texture[4*i*texSize+4*j+3] = 255;
//				} else {
//					image_texture[4*i*texSize+4*j] = 118 + red_variation;
//					image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
//					image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//					image_texture[4*i*texSize+4*j+3] = 255;
//				}
//			}  else if (j<64) {
//				// pietra
//				image_texture[4*i*texSize+4*j] = 156 + red_variation;
//				image_texture[4*i*texSize+4*j+1] = 156 + green_variation;
//				image_texture[4*i*texSize+4*j+2] = 156 + blue_variation;
//				image_texture[4*i*texSize+4*j+3] = 255;
//			}  else if (j<80) {
//				// neve
//				image_texture[4*i*texSize+4*j] = 219 + red_variation;
//				image_texture[4*i*texSize+4*j+1] = 224 + green_variation;
//				image_texture[4*i*texSize+4*j+2] = 230 + blue_variation;
//				image_texture[4*i*texSize+4*j+3] = 255;
//			}  else if (j<96) {
//				// neve e terra
//				if (i<4) {
//					image_texture[4*i*texSize+4*j] = 219 + red_variation;
//					image_texture[4*i*texSize+4*j+1] = 224 + green_variation;
//					image_texture[4*i*texSize+4*j+2] = 230 + blue_variation;
//					image_texture[4*i*texSize+4*j+3] = 255;
//				} else {
//					image_texture[4*i*texSize+4*j] = 118 + red_variation;
//					image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
//					image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//					image_texture[4*i*texSize+4*j+3] = 255;
//				}
//			}  else if (j<112) {
//				// acqua
//				image_texture[4*i*texSize+4*j] = 0 + Math.abs(red_variation);
//				image_texture[4*i*texSize+4*j+1] = 18 + green_variation;
//				image_texture[4*i*texSize+4*j+2] = 179 + blue_variation;
//				image_texture[4*i*texSize+4*j+3] = 255;
//			} else {
//				/*
//				image_texture[4*i*texSize+4*j] = 255;
//				image_texture[4*i*texSize+4*j+1] = 0;
//				image_texture[4*i*texSize+4*j+2] = 255;
//				image_texture[4*i*texSize+4*j+3] = 255;
//				*/
//				image_texture[4*i*texSize+4*j] = 118 + red_variation;
//				image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
//				image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//				image_texture[4*i*texSize+4*j+3] = 255;
//			}
//		} else if (i<50) {
//			image_texture[4*i*texSize+4*j] = 118 + red_variation;
//			image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
//			image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//			image_texture[4*i*texSize+4*j+3] = 255;
//		} else {
//			/*
//			image_texture[4*i*texSize+4*j] = 255;
//			image_texture[4*i*texSize+4*j+1] = 0;
//			image_texture[4*i*texSize+4*j+2] = 255;
//			image_texture[4*i*texSize+4*j+3] = 255;*/
//			image_texture[4*i*texSize+4*j] = 118 + red_variation;
//			image_texture[4*i*texSize+4*j+1] = 83 + green_variation;
//			image_texture[4*i*texSize+4*j+2] = Math.abs(blue_variation);
//			image_texture[4*i*texSize+4*j+3] = 255;
//		}


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
	//console.log(Date.now()-last_time); last_time = Date.now();

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

	/*
	tmp_x *= 0.035;
	tmp_y *= 0.035;
	tmp_z *= 0.035;*/

	tmp = (tmp_z*tmp_cos)-(tmp_x*tmp_sin);
	tmp_z = (tmp_z*tmp_sin)+(tmp_x*tmp_cos);
	tmp_x = tmp;

	let where_it_wants_to_go = [camera_pos[0] + tmp_z, camera_pos[1] + tmp_y, camera_pos[2] + tmp_x];
	let local_camera_pos = global_coords_to_local_coords(camera_pos[0], camera_pos[2]);
	//let local_where_it_wants_to_go = global_coords_to_local_coords(where_it_wants_to_go);
	let alert_flag = false;
	if (local_camera_pos) {
		if (tmp_z>0) {

			if (local_camera_pos.x==chunk_size-1) {
				//todo
			} else {
				if (chunks[local_camera_pos.id].map[local_camera_pos.x+1][local_camera_pos.z] > chunks[local_camera_pos.id].map[local_camera_pos.x][local_camera_pos.z]) {

					alert_flag = ((chunks[local_camera_pos.id].map[local_camera_pos.x+1][local_camera_pos.z] + 1.8) > camera_pos[1]) ;
				}
			}
			if (alert_flag) {
				let local_where_it_wants_to_go = where_it_wants_to_go[0] % chunk_size;
				if (local_where_it_wants_to_go > local_camera_pos.x + (11/16)) {
					where_it_wants_to_go[0] = where_it_wants_to_go[0] - local_where_it_wants_to_go + local_camera_pos.x + (11/16);
					tmp_z = 0;
				}
			}
		} else if (tmp_z<0) {

		}
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

// chunk
//let squares_size = 1;
let chunk_size = 50;
let chunk_peak = 60;
let snow_level = 35;
let water_level = 20;
let cloud_size = 7;
let noise_reduction = 40; //16 50

function chunkT(offsetX, offsetZ, left_chunk, top_chunk, bottom_chunk, right_chunk) {
	this.offset = [offsetX, offsetZ];
	this.map = [];
	this.cloud_map = [];

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

	function add_vertical_cloud(from_cloud, to_cloud, x, z, which_side) {
		if (from_cloud == to_cloud) return;

		let instance_matrix = scale4(chunk_size/cloud_size/4, 1.0, chunk_size/cloud_size);

		switch (which_side) {
		case 0: //a sinistra
			if (from_cloud) {
				instance_matrix = mult( rotate(-90, 0, 0, 1), instance_matrix );
				instance_matrix_array.push( mult(translate(x,80,z), instance_matrix) );
				shading_array.push(0.5);
				texture_coord_array.push(vec2(4/16+9/256,15/16-1/256));
				polygons++;
			} else {
				instance_matrix = mult( rotate(180, 0, 1, 0), instance_matrix );
				instance_matrix = mult(rotate(90, 0, 0, 1), instance_matrix);
				instance_matrix = mult(translate(x,80,z+(chunk_size/cloud_size)), instance_matrix);
				instance_matrix_array.push(instance_matrix);
				shading_array.push(0.9);
				texture_coord_array.push(vec2(4/16+9/256,15/16-1/256));
				polygons++;
			}
			break;
		case 1: //sotto
			if (from_cloud) {
				instance_matrix = mult( rotate(90, 0, 1, 0), instance_matrix );
				instance_matrix = mult(rotate(90, 1, 0, 0), instance_matrix);
				instance_matrix = mult(translate(x+(chunk_size/cloud_size),80,z), instance_matrix);
				instance_matrix_array.push(instance_matrix);
				shading_array.push(0.7);
				texture_coord_array.push(vec2(4/16+9/256,15/16-1/256));
				polygons++;
			} else {
				instance_matrix = mult( rotate(-90, 0, 1, 0), instance_matrix );
				instance_matrix = mult(rotate(-90, 1, 0, 0), instance_matrix);
				instance_matrix = mult(translate(x,80,z), instance_matrix);
				instance_matrix_array.push(instance_matrix);
				shading_array.push(0.7);
				texture_coord_array.push(vec2(4/16+9/256,15/16-1/256));
				polygons++;
			}
			break;
		case 2:

			break;
		case 3:

			break;
		}


	}


	function add_vertical_terrain(from_y, to_y, x, z, which_side) {
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
							texture_coord_array.push(vec2(5/16+11/256,15/16-1/256)); //terra e neve
						} else {
							texture_coord_array.push(vec2(2/16+5/256,15/16-1/256)); //terra e erba
						}
					} else {
						texture_coord_array.push(vec2(1/16+(3/256),15/16-(1/256))); // terra
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
							texture_coord_array.push(vec2(5/16+11/256,15/16-1/256));
						} else {
							texture_coord_array.push(vec2(2/16+5/256,15/16-1/256));
						}
					} else {
						texture_coord_array.push(vec2(1/16+(3/256),15/16-(1/256))); //vec2(1/16,15/16)
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
							texture_coord_array.push(vec2(5/16+11/256,15/16-1/256));
						} else {
							texture_coord_array.push(vec2(2/16+5/256,15/16-1/256));
						}
					} else {
						texture_coord_array.push(vec2(1/16+(3/256),15/16-(1/256)));
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
							texture_coord_array.push(vec2(5/16+11/256,15/16-1/256));
						} else {
							texture_coord_array.push(vec2(2/16+5/256,15/16-1/256));
						}
					} else {
						texture_coord_array.push(vec2(1/16+(3/256),15/16-(1/256)));
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
			if (this.map[x][z] > snow_level) {
				texture_coord_array.push(vec2(4/16+9/256,15/16-1/256)); // neve
			} else if (this.map[x][z] <= water_level) {
				this.map[x][z] = water_level;
				texture_coord_array.push(vec2(6/16+13/256,15/16-1/256)); // acqua
			} else {
				texture_coord_array.push(vec2(1/256,15/16-(1/256))); //erba
			}
			instance_matrix_array.push(translate(translate_x,this.map[x][z],translate_z));
			shading_array.push(1.0);
			/*
			nuvole
			if (this.map[x][z]>40) {
				instance_matrix_array.push(mult(translate(translate_x,70,translate_z),rotate(180,1,0,0)));
				shading_array.push(1.0);
				texture_coord_array.push(vec2(4/16+9/256,15/16-1/256));
				polygons++;
			}
			*/
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

	for (let x = 0; x < cloud_size; x++) {
		this.cloud_map[x] = [];
		let instance_matrix = rotate(180, 1, 0, 0);
		instance_matrix = mult( scale4(chunk_size/cloud_size, 1.0, chunk_size/cloud_size), instance_matrix );
		for (let z = 0; z < cloud_size; z++) {
			let cloud_x = (x+(offsetX*cloud_size/chunk_size));
			let cloud_z = (z+(offsetZ*cloud_size/chunk_size));
			let translate_x = ((x*chunk_size/cloud_size)+offsetX);
			let translate_z = (((z+1)*chunk_size/cloud_size)+offsetZ);
			this.cloud_map[x][z] = noise(cloud_x*15/noise_reduction, cloud_z*15/noise_reduction) > .65;
			if (this.cloud_map[x][z]) {
				texture_coord_array.push(vec2(4/16+9/256,15/16-1/256));
				instance_matrix_array.push( mult(translate(translate_x,80,translate_z), instance_matrix) );
				shading_array.push(1.0);
				polygons++;
			}

			if (x==0) {
				if (left_chunk) {
					add_vertical_cloud(this.cloud_map[x][z], left_chunk.cloud_map[cloud_size-1][z], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 0);
				}
			}else{
				add_vertical_cloud(this.cloud_map[x][z], this.cloud_map[x-1][z], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 0);
			}
			if (z==0) {
				if (bottom_chunk) {
					add_vertical_cloud(this.cloud_map[x][z], bottom_chunk.cloud_map[x][cloud_size-1], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 1);
				}
			} else {
				add_vertical_cloud(this.cloud_map[x][z], this.cloud_map[x][z-1], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 1);
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

	chunks[0] = new chunkT(0,0);
	chunks[1] = new chunkT(chunk_size,0,chunks[0]);
	chunks[2] = new chunkT(2*chunk_size,0,chunks[1]);
	chunks[3] = new chunkT(0,chunk_size,null,null,chunks[0]);
	chunks[4] = new chunkT(chunk_size,chunk_size,chunks[3],null,chunks[1]);
	chunks[5] = new chunkT(2*chunk_size,chunk_size,chunks[4],null,chunks[2]);
	chunks[6] = new chunkT(0,2*chunk_size,null,null,chunks[3]);
	chunks[7] = new chunkT(chunk_size,2*chunk_size,chunks[6],null,chunks[4]);
	chunks[8] = new chunkT(2*chunk_size,2*chunk_size,chunks[7],null,chunks[5]);

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
		//console.log(Date.now()-last_time); last_time = Date.now();
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

	//var imgList = ["texture0.jpg", "texture1.png", "texture2.jpeg", "texture3.jpg"];
	//loadImages(imgList);
	//render();
	renderS();
}


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
