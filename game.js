//get the canvas
var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext("2d");
const tile_size = 24
//dimensions of map in amount of tiles
const map_tile_width = 26
const map_tile_height = 20
//create image
const tileset = new Image();   // Create new img element
//use base64 https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#embedding_an_image_via_data_url https://ezgif.com/image-to-datauri/ezgif-2-08a7ed4685.png
tileset.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVAAAAAYBAMAAABeurhfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURb29Ojq9vVpjWhkpId46KZw6vVprSpS9vTrWOjo6jDqMOt46vZw6Ot69vTo63mMpMbMsG/UAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAGhSURBVFjDxdc7ksMgDADQnIVCF9DMptrOJ1FmdIGtc8otUvkuizFEMj/LONmoIh5FPLCx4TI/sBL32a0BzIzIIcIFTA0dPsc1QleNuUts8rFScolJxaXq9NIOlD4C/U0MHYjfLSjXodyCSlHiZ8UcClK/Cf2pOH2dq+onQekclNtQNkDxqwa9YQmleKF0Lp2boa4FdS+GVpz/A+VqYOi+Am1xDFDXhQINQ5fuFdTL21KwQ6EOrfz3CFRWPYUZPhwl1J2HLixIUJCiZ6HkNtAweEcjUAKQ3BUqr02B0iA0NrZQkbEdqgvGZ4jX1fMKKMWqOZRSxiFofGkDCZQTOkKH4jl8lz2jMoDnrNigroSmhdV6z5mgZStB5YcVqpK4DfUf69FpDQE5VDqw3nqSJ70HPTGvmxiHskBJVv04lEagZIKqTzich3azgOpQtkFVoRx6Q71x2WcC7+0Lson4EBT4fVAqnLoQXvXm2uTsQbkFpWPQopA/lujjig3KewPBtKk4DdUHvUd+QOtDEffGs62PtqNInlFA77M+Uu9B+S3QafoD02+JLmDjNHkAAAAASUVORK5CYII=';

//TEST MAP
let test_map = maps[0][0][3]

//use two for loops to go through entire map
function render_tiles(map) {
    for (let j = 0; j < map_tile_height; j++) {
        for (let i = 0; i < map_tile_width; i++) {
            //get the current position on the map
            let map_index = map[i + j * map_tile_width]
            //check if there is ground
            if (map_index !== 0) {
                //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

                ctx.drawImage(tileset, (map_index - 1) * tile_size, 0, tile_size, tile_size, i * tile_size, j * tile_size, tile_size, tile_size)
            }
        }
    }
}

//if they key is pressed or not
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

//create the player sprite
const player_sprite = new Image();
player_sprite.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgAQMAAAAhR2qPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURQD/DD3ojIMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBjTY6ApYGAAAABgAAGtYAWpAAAAAElFTkSuQmCC';

//check for key up or down
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = true;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = false;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
    }
}

let secondsPassed;
let oldTimeStamp;
let fps;

//player constants
const player_height = 32;
const player_width = 16;

//px and py are player position. filled in with temporary testing start position
var px = 400;
var py = 80;

//player velocity
var px_velocity = 0;
var py_velocity = 0;

//player nearby tiles
var tile_left = 0;
var tile_right = 0;
var tile_up = 0;
var tile_down = 0;

//used for physics/ prevening jumping - might not be necessary
var inair = true

//function for calculating map_collision with a given potential offset - might need to change
function map_collision_allow_distance(change_x, change_y, map) {
    //create array of map collisions [up,down,left,right]
    let up_distance = 10
    let down_distance = 0
    let left_distance = 0
    let right_distance = 0

    

    //done looking for tile
    let hit = true
    //up_distance is the distance it is allowed to move up
    up_distance = change_y
    console.log(up_distance)
    //while it is not 0 and hitting something. If it reaches 0 it means it can't "not move" any further
    while (up_distance > 0 && hit) {
        let new_up = Math.floor((py - up_distance) / tile_size)
        for (let i = tile_left; i <= tile_right; i++) {
            let tile_hit = map[i + new_up * map_tile_width]
            if (tile_hit == 0) {
                console.log("not hitting")
                hit = false
            }
            //try moving less far
            console.log("hit")
            up_distance -= 1

        }
        console.log(up_distance)
    }
    //if it didn't hit, restore change y
    console.log(hit)
    /*
    if (!hit){
        up_distance = change_y
    }
    */
    console.log(change_y)

    console.log(up_distance)
    //now we should have a new up_distance that doesn't go into a tile. return this so that it can move this distance
    /*
    let new_down = Math.floor((py + player_height + change_y) / tile_size)
    for (let i = tile_left; i <= tile_right; i++) {
        let tile_hit = map[i + new_down * map_tile_width]
        if (tile_hit !== 0) {
            array[1] = false
        }
    }
    let new_left = Math.floor((px - change_x) / tile_size)
    for (let i = tile_up; i <= tile_down; i++) {
        let tile_hit = map[new_left + i * map_tile_width]
        if (tile_hit !== 0) {
            array[2] = false
        }
    }
    let new_right = Math.floor((px + player_width + change_x) / tile_size)
    //check at all heights that the player is in
    for (let i = tile_up; i <= tile_down; i++) {
        //this is the tile the player will be going into
        let tile_hit = map[new_right + i * map_tile_width]
        //if it is not "air"
        if (tile_hit !== 0) {
            array[3] = false
        }
    }
    */
    let array = [up_distance, down_distance, left_distance, right_distance]
    return array
}

//game rendering / loop
function game(timestamp) {
    //time / fps related
    secondsPassed = (timestamp - oldTimeStamp) / 1000;
    oldTimeStamp = timestamp;
    //console.log(secondsPassed)
    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    //set map
    map = test_map
    //clear sceen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //render map
    render_tiles(map);

    /* temporarily commenting out existing physics
    const px_ac = 0.5
    const friction = 1.2
    const max_velocity_x = 5

    //movement left and right
    if (rightPressed) {
        px_velocity += px_ac;

        if (px_velocity > max_velocity_x) {
            px_velocity = max_velocity_x;
        }
    }
    else if (leftPressed) {
        px_velocity -= px_ac;

        if (px_velocity < -max_velocity_x) {
            px_velocity = -max_velocity_x;
        }
    }
    else {
        if (px_velocity < 0) {
            px_velocity += friction;
            if (px_velocity >= 0) {
                px_velocity = 0;
            }
        }
        else {
            px_velocity -= friction;
            if (px_velocity <= 0) {
                px_velocity = 0;
            }
        }
    }
    //update position
    if (px_velocity > 0) {
        if (map_collision_allow(map)[3]) {
            px += px_velocity
        }
        else {
            px_velocity = 0
        }
    }
    else if (px_velocity < 0) {
        if (map_collision_allow(map)[2]) {
            px += px_velocity
        }
        else {
            px_velocity = 0
        }
    }

    //movement up and down still need to do
    const gravity = 0.6
    var jump = 9 + Math.abs(px_velocity / 3.5)
    const max_fall_velocity = 10



    if (upPressed && !inair) {
        inair = true;
        py_velocity -= jump;
    }
    else {

        py_velocity += gravity;
        if (py_velocity > max_fall_velocity) {
            py_velocity = max_fall_velocity;
        }

    }

    //update position
    if (py_velocity > 0) {
        //don't know why it only works at 1.1 and not 1
        if (map_collision_allow(map)[1]) {
            inair = true
            py += py_velocity
        }
        else {
            inair = false
            py_velocity = 0
        }
    }
    else if (py_velocity < 0) {
        if (map_collision_allow(map)[0]) {
            py += py_velocity
        }
        else {
            py_velocity = 0
        }
    }
    */

    //temporary movement
    /*
    if (rightPressed && map_collision_allow_distance(0, 0, map)[3])
        px += 1
    if (leftPressed && map_collision_allow_distance(0, 0, map)[2])
        px -= 1
    */
        if (upPressed) {
        console.log("up")
        //have to add 2 for some reason???
        distance = map_collision_allow_distance(0,22,map)[0]
        console.log(distance)
        py -= Math.min(20,distance)
    }
    /*
    if (downPressed && map_collision_allow_distance(0, 0, map)[1])
        py += 1
*/
    //debug info on screen
    document.getElementById("px").innerHTML = px;
    document.getElementById("py").innerHTML = py;

    document.getElementById("py v").innerHTML = py_velocity;

    //document.getElementById("collision").innerHTML = map_collision_allow_distance(0, 0, map);

    //store covered tile boundaries
    tile_left = Math.floor((px + 1) / tile_size)
    tile_right = Math.floor((px + player_width - 1) / tile_size)
    tile_up = Math.floor((py + 1) / tile_size)
    tile_down = Math.floor((py + player_height - 1) / tile_size)

    document.getElementById("blocks").innerHTML = [tile_up, tile_down, tile_left, tile_right];
    ctx.drawImage(player_sprite, px, py)
    //ctx.drawImage(img, , ,24,24,i*24,j*24,24,24)}
    window.requestAnimationFrame(game)
}

//how many times a second render the game
//setInterval(game, 1000 / 60, test_map)
window.requestAnimationFrame(game)