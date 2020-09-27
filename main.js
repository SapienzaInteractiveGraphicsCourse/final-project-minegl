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
var fs_sunlinght_direction;
var fs_sunlinght_color;

// Navigate
var mouse_x;
var mouse_y;
var mouse_alfa;
var mouse_beta;
var mouse_pressing = false;

var camera_pos = vec3(75,70,75);
var camera_lookat = vec3(0,0,0);
var camera_alfa = 0;
var camera_beta = -1.0;
var time = Math.PI/4; //check

var key_pressed = new Array(7);
for (var i = 0; i < 4; i++) {
	key_pressed[i] = false;
}

// Controllo prestazioni
var last_time = -1;

// Misc
//var textures = [];

function scale4(a, b, c) {
	var result = mat4();
	result[0][0] = a;
	result[1][1] = b;
	result[2][2] = c;
	return result;
}


// texture

var texSize = 256;
var image_texture = new Uint8Array(4*texSize*texSize);
var bordo = 8; //max 8

var textures = {
	grass: vec2(bordo/256,15/16-(bordo/256)),
	dirty_grass: vec2(2/16+(5*bordo/256),15/16-bordo/256),
	cloud: vec2(3/16+(7*bordo/256),15/16-bordo/256),
	snow: vec2(4/16+9*bordo/256,15/16-bordo/256),
	dirty_snow: vec2(5/16+11*bordo/256,15/16-bordo/256),
	dirt: vec2(1/16+(3*bordo/256),15/16-(bordo/256)),
	water: vec2(6/16+13*bordo/256,15/16-bordo/256)
};

for ( var i = 0; i < texSize; i++ ) {
	for ( var j = 0; j <texSize; j++ ) {
		image_texture[4*i*texSize+4*j] = 130;
		image_texture[4*i*texSize+4*j+1] = 130;
		image_texture[4*i*texSize+4*j+2] = 130;
		image_texture[4*i*texSize+4*j+3] = 255;
	}
}

function copia(da_x, da_y, a_x, a_y) {
	image_texture[4*a_x*texSize+4*a_y] = image_texture[4*da_x*texSize+4*da_y];
	image_texture[4*a_x*texSize+4*a_y+1] = image_texture[4*da_x*texSize+4*da_y+1];
	image_texture[4*a_x*texSize+4*a_y+2] = image_texture[4*da_x*texSize+4*da_y+2];
	image_texture[4*a_x*texSize+4*a_y+3] = image_texture[4*da_x*texSize+4*da_y+3];
}

function intorno(offx, offy) {
	for (var x = 0; x < 16; x++) {
		for (var y = -bordo; y < 0; y++) {
			copia(offx+x, offy, offx+x, offy+y);
		}
		for (var y = 16; y < 16+bordo; y++) {
			copia(offx+x, offy+15, offx+x, offy+y);
		}
	}

	for (var y = 0; y < 16; y++) {
		for (var x = -bordo; x < 0; x++) {
			copia(offx, offy+y, offx+x, offy+y);
		}
		for (var x = 16; x < 16+bordo; x++) {
			copia(offx+15, offy+y, offx+x, offy+y);
		}
	}

	for (var x = -bordo; x < 0; x++) {
		for (var y = -bordo; y < 0; y++) {
			copia(offx, offy, offx+x, offy+y);
		}
	}

	for (var x = 16; x < 16+bordo; x++) {
		for (var y = -bordo; y < 0; y++) {
			copia(offx+15, offy, offx+x, offy+y);
		}
	}

	for (var x = -bordo; x < 0; x++) {
		for (var y = 16; y < 16+bordo; y++) {
			copia(offx, offy+15, offx+x, offy+y);
		}
	}

	for (var x = 16; x < 16+bordo; x++) {
		for (var y = 16; y < 16+bordo; y++) {
			copia(offx+15, offy+15, offx+x, offy+y);
		}
	}

}

for ( var i = 0; i < 1; i++ ) {
	for ( var j = 0; j <8; j++ ) {
		var temp_x = i*(16 + (bordo*2)) + bordo;
		var temp_y = j*(16 + (bordo*2)) + bordo;
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
					// nuvole
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)] = 255;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+1] = 255;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+2] = 255;
					image_texture[4*(temp_x+x)*texSize+4*(temp_y+y)+3] = 255;
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
			}
		}
		intorno(temp_x, temp_y);
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

//creature_center_y = {human: 1.8, horse: 0, spider: 0};

var human_height = 1.5;



function physics_engine(starting_vector, displacement_vector, creature_id) {
	var height;
	var min_boundary;
	var max_boundary;
	if (creature_id==-1) {
		height = human_height;
		min_boundary = 5/16;
		max_boundary = 11/16;
	} else {
		height = 1;
		min_boundary = 8/16;
		max_boundary = 8/16;
	}
	var local_starting_object = global_coords_to_local_coords(starting_vector[0], starting_vector[2]);
	if (!local_starting_object) {
		starting_vector[0] += displacement_vector[0];
		starting_vector[1] += displacement_vector[1];
		starting_vector[2] += displacement_vector[2];
		return true;
	}
	var current_chunk = chunks[local_starting_object.id];
	var y_value_block_ahead;
	var tmp1_chunk;
	var tmp2_chunk;
	var near_blocks = [
		[-1, -1, -1],
		[-1, -1, -1],
		[-1, -1, -1]
	];

	near_blocks[1][1] = current_chunk.map[local_starting_object.x][local_starting_object.z];

	tmp1_chunk = current_chunk;
	if (local_starting_object.x==chunk_size-1) {
		tmp1_chunk = current_chunk.right_chunk;
		if (tmp1_chunk) {
			near_blocks[1][2] = tmp1_chunk.map[0][local_starting_object.z];
			if (local_starting_object.z==chunk_size-1) {
				tmp2_chunk = tmp1_chunk.top_chunk;
				if (tmp2_chunk) {
					near_blocks[0][2] = tmp2_chunk.map[0][0];
				}
			} else {
				near_blocks[0][2] = tmp1_chunk.map[0][local_starting_object.z+1];
			}
			if (local_starting_object.z==0) {
				tmp2_chunk = tmp1_chunk.bottom_chunk;
				if (tmp2_chunk) {
					near_blocks[2][2] = tmp2_chunk.map[0][chunk_size-1];
				}
			} else {
				near_blocks[2][2] = tmp1_chunk.map[0][local_starting_object.z-1];
			}
		}
	} else {
		near_blocks[1][2] = current_chunk.map[local_starting_object.x+1][local_starting_object.z];
		if (local_starting_object.z==chunk_size-1) {
			tmp2_chunk = current_chunk.top_chunk;
			if (tmp2_chunk) {
				near_blocks[0][2] = tmp2_chunk.map[local_starting_object.x+1][0];
			}
		} else {
			near_blocks[0][2] = current_chunk.map[local_starting_object.x+1][local_starting_object.z+1];
		}
		if (local_starting_object.z==0) {
			tmp2_chunk = current_chunk.bottom_chunk;
			if (tmp2_chunk) {
				near_blocks[2][2] = tmp2_chunk.map[local_starting_object.x+1][chunk_size-1];
			}
		} else {
			near_blocks[2][2] = current_chunk.map[local_starting_object.x+1][local_starting_object.z-1];
		}
	}

	tmp1_chunk = current_chunk;
	if (local_starting_object.x==0) {
		tmp1_chunk = current_chunk.left_chunk;
		if (tmp1_chunk) {
			near_blocks[1][0] = tmp1_chunk.map[chunk_size-1][local_starting_object.z];
			if (local_starting_object.z==chunk_size-1) {
				tmp2_chunk = tmp1_chunk.top_chunk;
				if (tmp2_chunk) {
					near_blocks[0][0] = tmp2_chunk.map[chunk_size-1][0];
				}
			} else {
				near_blocks[0][0] = tmp1_chunk.map[chunk_size-1][local_starting_object.z+1];
			}
			if (local_starting_object.z==0) {
				tmp2_chunk = tmp1_chunk.bottom_chunk;
				if (tmp2_chunk) {
					near_blocks[2][0] = tmp2_chunk.map[chunk_size-1][chunk_size-1];
				}
			} else {
				near_blocks[2][0] = tmp1_chunk.map[chunk_size-1][local_starting_object.z-1];
			}
		}
	} else {
		near_blocks[1][0] = current_chunk.map[local_starting_object.x-1][local_starting_object.z];
		if (local_starting_object.z==chunk_size-1) {
			tmp2_chunk = current_chunk.top_chunk;
			if (tmp2_chunk) {
				near_blocks[0][0] = tmp2_chunk.map[local_starting_object.x-1][0];
			}
		} else {
			near_blocks[0][0] = current_chunk.map[local_starting_object.x-1][local_starting_object.z+1];
		}
		if (local_starting_object.z==0) {
			tmp2_chunk = current_chunk.bottom_chunk;
			if (tmp2_chunk) {
				near_blocks[2][0] = tmp2_chunk.map[local_starting_object.x-1][chunk_size-1];
			}
		} else {
			near_blocks[2][0] = current_chunk.map[local_starting_object.x-1][local_starting_object.z-1];
		}
	}

	if (local_starting_object.z==chunk_size-1) {
		tmp1_chunk = current_chunk.top_chunk;
		if (tmp1_chunk) {
			near_blocks[0][1] = tmp1_chunk.map[local_starting_object.x][0];
		}
	} else {
		near_blocks[0][1] = current_chunk.map[local_starting_object.x][local_starting_object.z+1];
	}

	if (local_starting_object.z==0) {
		tmp1_chunk = current_chunk.bottom_chunk;
		if (tmp1_chunk) {
			near_blocks[2][1] = tmp1_chunk.map[local_starting_object.x][chunk_size-1];
		}
	} else {
		near_blocks[2][1] = current_chunk.map[local_starting_object.x][local_starting_object.z-1];
	}

	//--------------------- x movement
	if (displacement_vector[0] > 0) {
		y_value_block_ahead = near_blocks[1][2];
		y_value_block_ahead += height;
		if (y_value_block_ahead > starting_vector[1]) {
			var boundary = Math.floor(starting_vector[0]) + (max_boundary);
			if (starting_vector[0] + displacement_vector[0] > boundary) {
				displacement_vector[0] = boundary - starting_vector[0];
				if (creature_id!=-1) {
					entities[creature_id].direction_backup = entities[creature_id].direction;
					displacement_vector[0] = 0;
					displacement_vector[1] = 0;
					entities[creature_id].direction = vec3(0,0.05,0);
					entities[creature_id].climbing = true;
					entities[creature_id].climbing_target = near_blocks[1][2];
					entities[creature_id].axis_climbing = 0;
					return true;
				}
			}
		}
	} else if (displacement_vector[0] < 0) {
		y_value_block_ahead = near_blocks[1][0];
		y_value_block_ahead += height;
		if (y_value_block_ahead > starting_vector[1]) {
			var boundary = Math.floor(starting_vector[0]) + (min_boundary);
			if (starting_vector[0] + displacement_vector[0] < boundary) {
				displacement_vector[0] = boundary - starting_vector[0];
				if (creature_id!=-1) {
					entities[creature_id].direction_backup = entities[creature_id].direction;
					displacement_vector[0] = 0;
					displacement_vector[1] = 0;
					entities[creature_id].direction = vec3(0,0.05,0);
					entities[creature_id].climbing = true;
					entities[creature_id].climbing_target = near_blocks[1][0];
					entities[creature_id].axis_climbing = 1;
					return true;
				}
			}
		}
	}
	starting_vector[0] += displacement_vector[0];

	//--------------------- z movement
	if (displacement_vector[2] > 0) {
		y_value_block_ahead = near_blocks[0][1];
		y_value_block_ahead += height;
		if (y_value_block_ahead > starting_vector[1]) {
			var boundary = Math.floor(starting_vector[2]) + (max_boundary);
			if (starting_vector[2] + displacement_vector[2] > boundary) {
				displacement_vector[2] = boundary - starting_vector[2];
				if (creature_id!=-1) {
					entities[creature_id].direction_backup = entities[creature_id].direction;
					displacement_vector[0] = 0;
					displacement_vector[1] = 0;
					entities[creature_id].direction = vec3(0,0.05,0);
					entities[creature_id].climbing = true;
					entities[creature_id].climbing_target = near_blocks[0][1];
					entities[creature_id].axis_climbing = 2;
					return true;
				}
			}
		}
	} else if (displacement_vector[2] < 0) {
		y_value_block_ahead = near_blocks[2][1];
		y_value_block_ahead += height;
		if (y_value_block_ahead > starting_vector[1]) {
			var boundary = Math.floor(starting_vector[2]) + (min_boundary);
			if (starting_vector[2] + displacement_vector[2] < boundary) {
				displacement_vector[2] = boundary - starting_vector[2];
				if (creature_id!=-1) {
					entities[creature_id].direction_backup = entities[creature_id].direction;
					displacement_vector[0] = 0;
					displacement_vector[1] = 0;
					entities[creature_id].direction = vec3(0,0.05,0);
					entities[creature_id].climbing = true;
					entities[creature_id].climbing_target = near_blocks[2][1];
					entities[creature_id].axis_climbing = 3;
					return true;
				}
			}
		}
	}
	starting_vector[2] += displacement_vector[2];

	//--------------------- y movement

	if (displacement_vector[1] < 0) {
		var y_value_block_below = near_blocks[1][1];
		var boundary = Math.floor(starting_vector[0]) + (min_boundary);
		if (starting_vector[0] < boundary) {
			if (near_blocks[1][0] > y_value_block_below) {
				if (near_blocks[1][0] < starting_vector[1] - human_height) {
					y_value_block_below = near_blocks[1][0];
				}
			}
			boundary = Math.floor(starting_vector[2]) + (min_boundary);
			if (starting_vector[2] < boundary) {
				if (near_blocks[2][0] > y_value_block_below) {
					if (near_blocks[2][0] < starting_vector[1] - human_height) {
						y_value_block_below = near_blocks[2][0];
					}
				}
			}
			boundary = Math.floor(starting_vector[2]) + (max_boundary);
			if (starting_vector[2] > boundary) {
				if (near_blocks[0][0] > y_value_block_below) {
					if (near_blocks[0][0] < starting_vector[1] - human_height) {
						y_value_block_below = near_blocks[0][0];
					}
				}
			}
		}

		boundary = Math.floor(starting_vector[0]) + (max_boundary);
		if (starting_vector[0] > boundary) {
			if (near_blocks[1][2] > y_value_block_below) {
				if (near_blocks[1][2] < starting_vector[1] - human_height) {
					y_value_block_below = near_blocks[1][2];
				}
			}
			boundary = Math.floor(starting_vector[2]) + (min_boundary);
			if (starting_vector[2] < boundary) {
				if (near_blocks[2][2] > y_value_block_below) {
					if (near_blocks[2][2] < starting_vector[1] - human_height) {
						y_value_block_below = near_blocks[2][2];
					}
				}
			}
			boundary = Math.floor(starting_vector[2]) + (max_boundary);
			if (starting_vector[2] > boundary) {
				if (near_blocks[0][2] > y_value_block_below) {
					if (near_blocks[0][2] < starting_vector[1] - human_height) {
						y_value_block_below = near_blocks[0][2];
					}
				}
			}
		}

		boundary = Math.floor(starting_vector[2]) + (min_boundary);
		if (starting_vector[2] < boundary) {
			if (near_blocks[2][1] > y_value_block_below) {
				if (near_blocks[2][1] < starting_vector[1] - human_height) {
					y_value_block_below = near_blocks[2][1];
				}
			}
		}

		boundary = Math.floor(starting_vector[2]) + (max_boundary);
		if (starting_vector[2] > boundary) {
			if (near_blocks[0][1] > y_value_block_below) {
				if (near_blocks[0][1] < starting_vector[1] - human_height) {
					y_value_block_below = near_blocks[0][1];
				}
			}
		}
		//--------------------------
		y_value_block_below += height;

		if (starting_vector[1] + displacement_vector[1] < y_value_block_below) {
			displacement_vector[1] = y_value_block_below - starting_vector[1];

			starting_vector[1] = y_value_block_below;
			return true;
		}
	} else if (displacement_vector[1] > 0) {
		if (creature_id!=-1) {
			if (near_blocks[1][1] == entities[creature_id].climbing_target) {
				entities[creature_id].direction = entities[creature_id].direction_backup;
				entities[creature_id].climbing = false;
				return true;
			} else {
				if (starting_vector[1] >= entities[creature_id].climbing_target + height) {
					if (entities[creature_id].axis_climbing==0) {
						starting_vector[0] += 0.01;
					} else if (entities[creature_id].axis_climbing==1) {
						starting_vector[0] -= 0.01;
					} else if (entities[creature_id].axis_climbing==2) {
						starting_vector[2] += 0.01;
					} else {
						starting_vector[2] -= 0.01;
					}
					starting_vector[1] = entities[creature_id].climbing_target + height;
					return true;
				}
			}
		}
	}


	starting_vector[1] += displacement_vector[1];
	return false;

}

var can_jump = false;
var inerzia = vec3(0,0.001,0);
var entities = [];

function parabola2(x, a) {
	var b = -a*Math.PI;
	return a*x*x + b*x;
}

function onTimer() {
	//console.log(Date.now()-last_time); last_time = Date.now();

	let tmp_sin = Math.sin(camera_alfa);
	let tmp_cos = Math.cos(camera_alfa);
    var rotation_matrix = mat3(
		tmp_sin,	0,	tmp_cos,
        0,			1,		0,
        tmp_cos,	0,	-tmp_sin
    );
	var displacement = vec3(0,0,0);
	let number_of_axis_displacements = 0;

	//--------------
	if (key_pressed[0] && !key_pressed[2]) {
		displacement[0] = 1.0;
		number_of_axis_displacements++;
	} else if (key_pressed[2] && !key_pressed[0]) {
		displacement[0] = -1.0;
		number_of_axis_displacements++;
	}

	if (key_pressed[1] && !key_pressed[3]) {
		displacement[2] = 1.0;
		number_of_axis_displacements++;
	} else if (key_pressed[3] && !key_pressed[1]) {
		displacement[2] = -1.0;
		number_of_axis_displacements++;
	}

	if (key_pressed[5]) {
		if (can_jump) {
			inerzia[1]=0.1;
		}
	}

	if (key_pressed[4]) {
		time += 0.005;
	}

	time += 0.0001;
	time = time % (2 * Math.PI);
	time = time + (2 * Math.PI);
	time = time % (2 * Math.PI);
	var time_cos = Math.cos(time);
	var time_sin = Math.sin(time);
	gl.uniform3f(fs_sunlinght_direction, time_cos, time_sin, 0.0);

	var sun_red_color = parabola2(time, -1);
	var sun_green_color = parabola2(time, -.6);
	var sun_blue_color = parabola2(time, -.45);
	sun_red_color = Math.max(sun_red_color, 0.0);
	sun_red_color = Math.min(sun_red_color, 1.0);
	sun_green_color = Math.max(sun_green_color, 0.0);
	sun_green_color = Math.min(sun_green_color, 1.0);
	sun_blue_color = Math.max(sun_blue_color, 0.0);
	sun_blue_color = Math.min(sun_blue_color, 1.0);
	gl.uniform3f(fs_sunlinght_color, sun_red_color, sun_green_color, sun_blue_color);

	gl.uniform3f(fs_moonlinght_direction, -time_cos, -time_sin, 0.0);
	var moonlinght_color = mult( 1.0 - sun_red_color, vec3(.105882353, .125490196, .308627451) );
	gl.uniform3fv(fs_moonlinght_color, moonlinght_color);


	if (number_of_axis_displacements!=0||inerzia[0]!=0||inerzia[1]!=0||inerzia[2]!=0) {
		if (number_of_axis_displacements==2) {
			//0.70710678118 is equal to 1/(2^0.5)
			displacement = mult(0.70710678118, displacement);
		}

		displacement = mult(0.05, displacement); //slow down
		displacement = mult(rotation_matrix, displacement);
		displacement = add(inerzia, displacement);

		if (physics_engine(camera_pos, displacement, -1)) {
			inerzia[0] = 0;
			inerzia[1] = 0;
			inerzia[2] = 0;
			can_jump = true;
		} else {
			can_jump = false;
			if (inerzia[1]> -1.0) {
				inerzia[1] -= 0.003;
			}
		}
		camera_lookat = add(camera_lookat, displacement);
		gl.uniform3fv(fs_camera_pos, camera_pos);
		compute_camera_matrix();
	}

	for (var entity_id=0; entity_id<entities.length; entity_id++) {
		entities[entity_id].animation_duration -= 0.01
		if (entities[entity_id].animation_duration < 0 && !entities[entity_id].climbing) {
			entities[entity_id].animation_duration = Math.random()*10 + 3;
			if (entities[entity_id].type_entity==1) {
				// horse
				entities[entity_id].animation = Math.floor(Math.random() * 4);     // returns a random integer from 0 to 3
			} else {
				// spider
				entities[entity_id].animation = Math.floor(Math.random() * 2);     // returns a random integer from 0 to 1
			}

			//entities[entity_id].animation = 1;
			entities[entity_id].standH();
			entities[entity_id].animation == 1;
			if (entities[entity_id].animation == 1) {
				var angolo = Math.random();
				entities[entity_id].torsoYH = - angolo * 360;
				angolo *= 2 * Math.PI;
				entities[entity_id].direction = vec3(Math.cos(angolo)*.01,0,Math.sin(angolo)*.01);
			} else {
				entities[entity_id].direction = vec3(0,0,0);

			}
		}

		switch (entities[entity_id].animation) {
		case 1:
			entities[entity_id].walking_animation();
			break;
		case 2:
			entities[entity_id].rearing_animation();
			break;
		case 3:
			entities[entity_id].eat_animation();
			break;
		}





		if (physics_engine(entities[entity_id].position, add(entities[entity_id].inerzia, entities[entity_id].direction), entity_id)) {
			entities[entity_id].inerzia[1] = 0;
		} else {
			if (entities[entity_id].inerzia[1]> -1.0) {
				if (!entities[entity_id].climbing)
						entities[entity_id].inerzia[1] -= 0.003;
			}
		}
	}


	/*
	genera nuovi chunk
	if (camera_pos[2]>50) {
		if (!chunks[3]) {
			chunks[3] = new chunk(50,50);
		}
	}*/


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

// CHUNK
var chunk_size = 50;
var chunk_peak = 60;
var snow_level = 35;
var water_level = 20;
var cloud_size = 7;
var noise_reduction = 40;

function chunkT(offsetX, offsetZ, left_chunk, top_chunk, bottom_chunk, right_chunk) {
	this.offset = [offsetX, offsetZ];
	this.map = [];
	this.cloud_map = [];
	this.near_chunks = [false, false, false, false];
	if (left_chunk) {
		this.near_chunks[0] = !left_chunk.near_chunks[3];
	}
	if (right_chunk) {
		this.near_chunks[3] = !right_chunk.near_chunks[0];
	}
	if (top_chunk) {
		this.near_chunks[1] = !top_chunk.near_chunks[2];
	}
	if (bottom_chunk) {
		this.near_chunks[2] = !bottom_chunk.near_chunks[1];
	}
	this.left_chunk = left_chunk;
	this.top_chunk = top_chunk;
	this.bottom_chunk = bottom_chunk;
	this.right_chunk = right_chunk;

	this.texture_coord_buffer;
	var texture_coord_array = [];
	var shading_buffer;
	var shading_array = [];
	this.instance_matrix_buffer;
	let instance_matrix_array = [];

	let polygons = chunk_size*chunk_size;

	function add_vertical_cloud(from_cloud, to_cloud, x, z, which_side) {
		if (from_cloud == to_cloud) return;

		let instance_matrix = scale4(chunk_size*.5/cloud_size, 1.0, chunk_size/cloud_size);

		switch (which_side) {
		case 0: //a sinistra
			if (from_cloud) {
				instance_matrix = mult( rotate(-90, 0, 0, 1), instance_matrix );
				instance_matrix_array.push( mult(translate(x,80,z), instance_matrix) );
				shading_array.push(0.0);
				texture_coord_array.push(textures.cloud);
				polygons++;
			} else {
				instance_matrix = mult( rotate(180, 0, 1, 0), instance_matrix );
				instance_matrix = mult(rotate(90, 0, 0, 1), instance_matrix);
				instance_matrix = mult(translate(x,80,z+(chunk_size/cloud_size)), instance_matrix);
				instance_matrix_array.push(instance_matrix);
				shading_array.push(0.0);
				texture_coord_array.push(textures.cloud);
				polygons++;
			}
			break;
		case 1: //sotto
			if (from_cloud) {
				instance_matrix = mult( rotate(90, 0, 1, 0), instance_matrix );
				instance_matrix = mult(rotate(90, 1, 0, 0), instance_matrix);
				instance_matrix = mult(translate(x+(chunk_size/cloud_size),80,z), instance_matrix);
				instance_matrix_array.push(instance_matrix);
				shading_array.push(0.0);
				texture_coord_array.push(textures.cloud);
				polygons++;
			} else {
				instance_matrix = mult( rotate(-90, 0, 1, 0), instance_matrix );
				instance_matrix = mult(rotate(-90, 1, 0, 0), instance_matrix);
				instance_matrix = mult(translate(x,80,z), instance_matrix);
				instance_matrix_array.push(instance_matrix);
				shading_array.push(0.0);
				texture_coord_array.push(textures.cloud);
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
					shading_array.push(0.0);
					if (y==from_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(textures.dirty_snow);
						} else {
							texture_coord_array.push(textures.dirty_grass);
						}
					} else {
						texture_coord_array.push(textures.dirt);
					}
					polygons++;
				}
			} else {
				for (let y = from_y; y < to_y; y++) {
					let instance_matrix = rotate(180, 0, 1, 0);
					instance_matrix = mult(rotate(90, 0, 0, 1), instance_matrix);
					instance_matrix = mult(translate(x,y-1,z+1), instance_matrix);
					instance_matrix_array.push(instance_matrix);
					shading_array.push(0.0);
					if (y==to_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(textures.dirty_snow);
						} else {
							texture_coord_array.push(textures.dirty_grass);
						}
					} else {
						texture_coord_array.push(textures.dirt);
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
					shading_array.push(0.0);
					if (y==from_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(textures.dirty_snow);
						} else {
							texture_coord_array.push(textures.dirty_grass);
						}
					} else {
						texture_coord_array.push(textures.dirt);
					}
					polygons++;
				}
			} else {
				for (let y = from_y; y < to_y; y++) {
					let instance_matrix = rotate(-90, 0, 1, 0);
					instance_matrix = mult(rotate(-90, 1, 0, 0), instance_matrix);
					instance_matrix = mult(translate(x,y-1,z), instance_matrix);
					instance_matrix_array.push(instance_matrix);
					shading_array.push(0.0);
					if (y==to_y-1) {
						if (y>snow_level) {
							texture_coord_array.push(textures.dirty_snow);
						} else {
							texture_coord_array.push(textures.dirty_grass);
						}
					} else {
						texture_coord_array.push(textures.dirt);
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
				texture_coord_array.push(textures.snow);
				shading_array.push(0.0);
			} else if (this.map[x][z] <= water_level) {
				this.map[x][z] = water_level;
				texture_coord_array.push(textures.water);
				shading_array.push(3.5);
			} else {
				texture_coord_array.push(textures.grass);
				shading_array.push(0.0);
			}
			instance_matrix_array.push(translate(translate_x,this.map[x][z],translate_z));


			if (x==0) {
				if (this.near_chunks[0]) {
					add_vertical_terrain(this.map[0][z], left_chunk.map[chunk_size-1][z], translate_x, translate_z, 0);
				}
			}else{
				add_vertical_terrain(this.map[x][z], this.map[x-1][z], translate_x, translate_z, 0);
			}
			if (z==0) {
				if (this.near_chunks[2]) {
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
				texture_coord_array.push(textures.cloud);
				instance_matrix_array.push( mult(translate(translate_x,80,translate_z), instance_matrix) );
				shading_array.push(0.0);
				polygons++;
			}

			if (x==0) {
				if (this.near_chunks[0]) {
					add_vertical_cloud(this.cloud_map[x][z], left_chunk.cloud_map[cloud_size-1][z], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 0);
				}
			}else{
				add_vertical_cloud(this.cloud_map[x][z], this.cloud_map[x-1][z], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 0);
			}
			if (z==0) {
				if (this.near_chunks[2]) {
					add_vertical_cloud(this.cloud_map[x][z], bottom_chunk.cloud_map[x][cloud_size-1], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 1);
				}
			} else {
				add_vertical_cloud(this.cloud_map[x][z], this.cloud_map[x][z-1], translate_x, ((z*chunk_size/cloud_size)+offsetZ), 1);
			}

		}
	}

	// TEXTURE COORDINATE BUFFER
	this.texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texture_coord_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texture_coord_array), gl.STATIC_DRAW);

	// SHADING BUFFER
	var floats = new Float32Array( shading_array.length  );
	for (var i = 0; i < shading_array.length; i++) {
		floats[i] = shading_array[i];
	}
	shading_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, shading_buffer );
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
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instance_matrix_array, 0, this.instance_matrix_array.length * 16 * 4); // questo a quanto pare gli passa effettivamente i dati
	?? gl.bufferSubData(gl.ARRAY_BUFFER, 0, superfloat); ??
	void gl.bufferData(target, ArrayBufferView srcData, usage, srcOffset, length);
	void gl.bufferSubData(target, dstByteOffset, ArrayBufferView srcData, srcOffset, length);
	void gl.bufferData(target, ArrayBufferView srcData, usage);
	void gl.bufferSubData(target, offset, ArrayBufferView srcData);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, superfloat);

	*/

	this.render = function() {
		// TEXTURE COORDINATE BUFFER
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texture_coord_buffer);
		gl.vertexAttribPointer( vs_texture_coord, 2, gl.FLOAT, false, 8, 0 );
		//gl.vertexAttribPointer( vs_texture_coord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vs_texture_coord );
		gl.vertexAttribDivisor(vs_texture_coord, 1);

		// SHADING BUFFER
		gl.bindBuffer( gl.ARRAY_BUFFER, shading_buffer);
		gl.vertexAttribPointer( vs_shading, 1, gl.FLOAT, false, 4, 0 );
		gl.enableVertexAttribArray( vs_shading );
		gl.vertexAttribDivisor(vs_shading, 1);

		// INSTANCE MATRICES BUFFER
		gl.bindBuffer(gl.ARRAY_BUFFER, this.instance_matrix_buffer);
		// tutto il blocco seguente serve al posto del normale gl.vertexAttribPointer()
		const bytesPerMatrix = 4 * 16;
		for (let i = 0; i < 4; ++i) {
		  let loc = vs_model_matrix + i;
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

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, polygons);
		// mode, offset, num vertices per instance, num instances
	};
}

var chunks = [];
var vPosition;
var vs_texture_coord;
var vs_shading;
var vs_model_matrix;
var vs_normal;
var fs_moonlinght_direction;
var fs_moonlinght_color;
var fs_camera_pos;

// main

var entity_vertex_array = [];
var entity_normal_array = [];
var entity_vertex_buffer;
var entity_normal_buffer;
var terrain_vertex_buffer;
var terrain_normal_buffer;

/*
var vertices = [
	vec4( 0.0, -1.0,  1.0, 1.0 ),
	vec4( 0.0,  0.0,  1.0, 1.0 ),
	vec4( 1.0,  0.0,  1.0, 1.0 ),
	vec4( 1.0, -1.0,  1.0, 1.0 ),
	vec4( 0.0, -1.0, 0.0, 1.0 ),
	vec4( 0.0,  0.0, 0.0, 1.0 ),
	vec4( 1.0,  0.0, 0.0, 1.0 ),
	vec4( 1.0, -1.0, 0.0, 1.0 )
];*/

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

var texCoord = [
	vec2(0, 0),
	vec2(0, 1),
	vec2(1, 1),
	vec2(1, 0)
];

var cavalo_texture = [];
var cavalo_shading = [];
var cavalo_texture_buffer;
var cavalo_shading_buffer;
var cavalo_matrice_buffer;

function cube()
{
	quad( 6, 5, 1, 2 );
	for (var i = 0; i < 4; i++)  {
		entity_normal_array.push(vec3(0,1,0));
		cavalo_texture.push(textures.water);
		cavalo_shading.push(3.5);
	}


	quad( 1, 0, 3, 2 );
	for (var i = 0; i < 4; i++)  {
		entity_normal_array.push(vec3(0,0,1));
		cavalo_texture.push(textures.water);
		cavalo_shading.push(3.5);
	}


	quad( 2, 3, 7, 6 );
	for (var i = 0; i < 4; i++)  {
		entity_normal_array.push(vec3(1,0,0));
		cavalo_texture.push(textures.water);
		cavalo_shading.push(3.5);
	}


	quad( 3, 0, 4, 7 );
	for (var i = 0; i < 4; i++)  {
		entity_normal_array.push(vec3(0,-1,0));
		cavalo_texture.push(textures.water);
		cavalo_shading.push(3.5);
	}


	quad( 4, 5, 6, 7 );
	for (var i = 0; i < 4; i++)  {
		entity_normal_array.push(vec3(0,0,-1));
		cavalo_texture.push(textures.water);
		cavalo_shading.push(3.5);
	}


	quad( 5, 4, 0, 1 );
	for (var i = 0; i < 4; i++)  {
		entity_normal_array.push(vec3(-1,0,0));
		cavalo_texture.push(textures.water);
		cavalo_shading.push(3.5);
	}

}

function quad(a, b, c, d) {
	entity_vertex_array.push(vertices[b]);
	//texCoordsArray.push(texCoord[1]);
	entity_vertex_array.push(vertices[a]);
	//texCoordsArray.push(texCoord[0]);
	entity_vertex_array.push(vertices[d]);
	//texCoordsArray.push(texCoord[3]);
	entity_vertex_array.push(vertices[c]);
	//texCoordsArray.push(texCoord[2]);
}

function entity(starting_x, starting_y, starting_z) {
	this.position = vec3(starting_x, starting_y, starting_z);
	this.direction = vec3(0,0,0);
	this.inerzia = vec3(0,0,0);
	this.climbing = false;
	this.direction_backup;
	this.climbing_target;
	this.axis_climbing;

	this.animation_duration = 1;
	this.animation = 0;



	this.render = function () {
		var matrice = translate(this.position[0], this.position[1]-0.5, this.position[2]);
		gl.bindBuffer( gl.ARRAY_BUFFER, cavalo_texture_buffer );
		gl.vertexAttribPointer( vs_texture_coord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vs_texture_coord );

		gl.bindBuffer( gl.ARRAY_BUFFER, cavalo_shading_buffer);
		gl.vertexAttribPointer( vs_shading, 1, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vs_shading );


		gl.bindBuffer(gl.ARRAY_BUFFER, cavalo_matrice_buffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(matrice));


		// tutto il blocco seguente serve al posto del normale gl.vertexAttribPointer()

		const bytesPerMatrix = 4 * 16;
		for (let i = 0; i < 4; ++i) {
		  let loc = vs_model_matrix + i;
		  gl.enableVertexAttribArray(loc);
		  // note the stride and offset
		  const offset = i * 16;  // 4 floats per row, 4 bytes per float

		  gl.vertexAttribPointer(
			  loc,              // location
			  4,                // size (num values to pull from buffer per iteration)
			  gl.FLOAT,         // type of data in buffer
			  false,            // normalize
			  0,   // stride, num bytes to advance to get to next set of values
			  offset,           // offset in buffer
		  );
		  // this line says this attribute only changes for each 1 instance

	  }


		for (var i = 0; i < 6; i++)  {
			gl.drawArrays(gl.TRIANGLE_FAN, i*4, 4);
		}
	}



}

var identita_buffer;

function identita() {
	gl.bindBuffer(gl.ARRAY_BUFFER, identita_buffer);
	const bytesPerMatrix = 4 * 16;
	for (let i = 0; i < 4; ++i) {
		let loc = vs_model_matrix + i;
		gl.enableVertexAttribArray(loc);
		// note the stride and offset
		const offset = i * 16;  // 4 floats per row, 4 bytes per float
		gl.vertexAttribPointer(
			loc,              // location
			4,                // size (num values to pull from buffer per iteration)
			gl.FLOAT,         // type of data in buffer
			false,            // normalize
			0,   // stride, num bytes to advance to get to next set of values
			offset,           // offset in buffer
		);
		// this line says this attribute only changes for each 1 instance
	}
}


window.onload = function init() {
	canvas = document.getElementById( "gl-canvas" );
	gl = canvas.getContext('webgl2');
	if ( !gl ) {
		alert( "WebGL isn't available" );
		return;
	}

	canvas.width = (document.getElementsByTagName('body')[0]).clientWidth;
	canvas.height = document.documentElement.clientHeight-20;

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.7, 0.8, 1.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.FRONT);
	program = initShaders( gl, "vertex-shader", "fragment-shader");
	gl.useProgram( program);

	// initialization of some variables
	var terrain_vertex_array = [];
	terrain_vertex_array.push(vec4(0,0,0,1));
	terrain_vertex_array.push(vec4(1,0,0,1));
	terrain_vertex_array.push(vec4(1,0,1,1));
	terrain_vertex_array.push(vec4(0,0,1,1));
	var terrain_normal_array = [];
	terrain_normal_array.push(vec3(0,1,0));
	terrain_normal_array.push(vec3(0,1,0));
	terrain_normal_array.push(vec3(0,1,0));
	terrain_normal_array.push(vec3(0,1,0));
	instanceMatrix = mat4();
	modelViewMatrix = mat4();
	projectionMatrix = perspective(60.0, canvas.width/canvas.height, 0.01, 2000.0);
	//modelViewMatrix = translate(0.0, 0.0, -3.0);

	cube();

	cavalo_texture_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cavalo_texture_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(cavalo_texture), gl.STATIC_DRAW);
	//-
	var floats = new Float32Array( cavalo_shading.length  );
	for (var i = 0; i < cavalo_shading.length; i++) {
		floats[i] = cavalo_shading[i];
	}
	cavalo_shading_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cavalo_shading_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, floats, gl.STATIC_DRAW);
	//-
	cavalo_matrice_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cavalo_matrice_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(mat4()), gl.STATIC_DRAW);

	identita_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, identita_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(mat4()), gl.STATIC_DRAW);



	// entities
	//entities.push(new entity(75.5, -1, 75.5));
	entities.push(new createHorse(71.5, -1, 75.5));
	entities.push(new createHorse(77.5, -1, 77.5));
	entities.push(new createHorse(60.5, -1, 75.5));
	entities.push(new createSpider(75.5, -1, 58.5));
	entities.push(new createSpider(75.5, -1, 71.5));
	//new createHorse(75, 50, 75);
	//entities.push(new entity(70.5, -1, 70.5));

	// attributes locations
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix")
	vPosition = gl.getAttribLocation( program, "vPosition" );
	vs_texture_coord = gl.getAttribLocation( program, "vs_texture_coord" );
	vs_shading = gl.getAttribLocation( program, "vs_shading" );
	vs_model_matrix = gl.getAttribLocation( program, "vs_model_matrix" );
	vs_normal = gl.getAttribLocation( program, "vs_normal" );
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

	// uniforms locations
	fs_sunlinght_direction = gl.getUniformLocation(program, "fs_sunlinght_direction");
	fs_sunlinght_color = gl.getUniformLocation(program, "fs_sunlinght_color");
	fs_moonlinght_direction = gl.getUniformLocation(program, "fs_moonlinght_direction");
	fs_moonlinght_color = gl.getUniformLocation(program, "fs_moonlinght_color");
	fs_camera_pos = gl.getUniformLocation(program, "fs_camera_pos");

	// uniforms initialization
	gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
	gl.uniform3f(fs_sunlinght_direction, 1.0, 0.0, 0.0);
	gl.uniform3f(fs_sunlinght_color, 1.0, 0.0, 1.0);
	gl.uniform3f(fs_moonlinght_direction, 0.0, 0.0, 0.0);
	gl.uniform3f(fs_moonlinght_color, 0.0, 0.0, 0.0);
	gl.uniform3fv(fs_camera_pos, camera_pos);

	// TERRAIN VERTICES
	terrain_vertex_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, terrain_vertex_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(terrain_vertex_array), gl.STATIC_DRAW);
	//gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	//gl.enableVertexAttribArray( vPosition );

	// TERRAIN NORMALS
	terrain_normal_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, terrain_normal_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(terrain_normal_array), gl.STATIC_DRAW);
	//gl.vertexAttribPointer( vs_normal, 3, gl.FLOAT, false, 0, 0 );
	//gl.enableVertexAttribArray( vs_normal );

	// ENTITY VERTICES
	entity_vertex_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, entity_vertex_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(entity_vertex_array), gl.STATIC_DRAW);
	//gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	//gl.enableVertexAttribArray( vPosition );

	// ENTITY NORMALS
	entity_normal_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, entity_normal_buffer );
	gl.bufferData(gl.ARRAY_BUFFER, flatten(entity_normal_array), gl.STATIC_DRAW);
	//gl.vertexAttribPointer( vs_normal, 3, gl.FLOAT, false, 0, 0 );
	//gl.enableVertexAttribArray( vs_normal );


	// TEXTURE
	texture1 = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_texture);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	//gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	//gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);


	// GENERATE CHUNKS
	chunks[0] = new chunkT(0,0);
	chunks[1] = new chunkT(chunk_size,0,chunks[0]);
	chunks[2] = new chunkT(2*chunk_size,0,chunks[1]);
	chunks[3] = new chunkT(0,chunk_size,null,null,chunks[0]);
	chunks[4] = new chunkT(chunk_size,chunk_size,chunks[3],null,chunks[1]);
	chunks[5] = new chunkT(2*chunk_size,chunk_size,chunks[4],null,chunks[2]);
	chunks[6] = new chunkT(0,2*chunk_size,null,null,chunks[3]);
	chunks[7] = new chunkT(chunk_size,2*chunk_size,chunks[6],null,chunks[4]);
	chunks[8] = new chunkT(2*chunk_size,2*chunk_size,chunks[7],null,chunks[5]);

	chunks[0].right_chunk = chunks[1];
	chunks[0].top_chunk = chunks[3];

	chunks[1].right_chunk = chunks[2];
	chunks[1].top_chunk = chunks[4];

	chunks[2].top_chunk = chunks[5];

	chunks[3].right_chunk = chunks[4];
	chunks[3].top_chunk = chunks[6];

	chunks[4].right_chunk = chunks[5];
	chunks[4].top_chunk = chunks[7];

	chunks[5].top_chunk = chunks[8];

	chunks[6].right_chunk = chunks[7];

	chunks[7].right_chunk = chunks[8];

	document.onkeydown = function(e){
		if (e.key=="w"||e.key=="W") {
			key_pressed[0] = true;
		} else if (e.key=="a"||e.key=="A") {
			key_pressed[1] = true;
		} else if (e.key=="s"||e.key=="S") {
			key_pressed[2] = true;
		} else if (e.key=="d"||e.key=="D") {
			key_pressed[3] = true;
		} else if (e.key=="t"||e.key=="T") {
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
		} else if (e.key=="t"||e.key=="T") {
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
		update_lookAt();
		compute_camera_matrix();
	};

	update_lookAt();
	compute_camera_matrix();
	window.setInterval(onTimer, 10);
	modelViewMatrix = mat4();

	//var imgList = ["texture0.jpg", "texture1.png", "texture2.jpeg", "texture3.jpg"];
	//loadImages(imgList);

	renderS();
}


var renderS = function() {
	//console.log(Date.now()-last_time); last_time = Date.now();
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// TERRAIN VERTICES
	gl.bindBuffer( gl.ARRAY_BUFFER, terrain_vertex_buffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	// TERRAIN NORMALS
	gl.bindBuffer( gl.ARRAY_BUFFER, terrain_normal_buffer );
	gl.vertexAttribPointer( vs_normal, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vs_normal );

	for (var i = 0; i < chunks.length; i++) {
		chunks[i].render();
	}

	// ENTITY VERTICES
	gl.bindBuffer( gl.ARRAY_BUFFER, entity_vertex_buffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	// ENTITY NORMALS
	gl.bindBuffer( gl.ARRAY_BUFFER, entity_normal_buffer );
	gl.vertexAttribPointer( vs_normal, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vs_normal );


	identita();

	for (var i = 0; i < entities.length; i++) {
		entities[i].render();
	}

	modelViewMatrix = mat4();
	gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );

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
