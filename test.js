//get the canvas
var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext("2d");
const tile_size = 24
//dimensions of map in amount of tiles
const width = 26
const height = 20
//create image
const tileset = new Image();   // Create new img element
//use base64 https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#embedding_an_image_via_data_url https://ezgif.com/image-to-datauri/ezgif-2-08a7ed4685.png
tileset.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVAAAAAYBAMAAABeurhfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURb29Ojq9vVpjWhkpId46KZw6vVprSpS9vTrWOjo6jDqMOt46vZw6Ot69vTo63mMpMbMsG/UAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAGhSURBVFjDxdc7ksMgDADQnIVCF9DMptrOJ1FmdIGtc8otUvkuizFEMj/LONmoIh5FPLCx4TI/sBL32a0BzIzIIcIFTA0dPsc1QleNuUts8rFScolJxaXq9NIOlD4C/U0MHYjfLSjXodyCSlHiZ8UcClK/Cf2pOH2dq+onQekclNtQNkDxqwa9YQmleKF0Lp2boa4FdS+GVpz/A+VqYOi+Am1xDFDXhQINQ5fuFdTL21KwQ6EOrfz3CFRWPYUZPhwl1J2HLixIUJCiZ6HkNtAweEcjUAKQ3BUqr02B0iA0NrZQkbEdqgvGZ4jX1fMKKMWqOZRSxiFofGkDCZQTOkKH4jl8lz2jMoDnrNigroSmhdV6z5mgZStB5YcVqpK4DfUf69FpDQE5VDqw3nqSJ70HPTGvmxiHskBJVv04lEagZIKqTzich3azgOpQtkFVoRx6Q71x2WcC7+0Lson4EBT4fVAqnLoQXvXm2uTsQbkFpWPQopA/lujjig3KewPBtKk4DdUHvUd+QOtDEffGs62PtqNInlFA77M+Uu9B+S3QafoD02+JLmDjNHkAAAAASUVORK5CYII=';

//TEST MAP
let test_map = maps[0][0][3]

//use two for loops to go through entire map
function render_tiles(map) {
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            //get the current position on the map
            let map_index = map[i + j * width]
            //check if there is ground
            if (map_index !== 0) {
                //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

                ctx.drawImage(tileset, (map_index - 1) * tile_size, 0, tile_size, tile_size, i * tile_size, j * tile_size, tile_size, tile_size)
            }
        }
    }
}

const player_height = 32;
const player_width = 16;

//if they key is pressed or not
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

//player position. filled in with temporary testing start position
var px = 440;
var py = 70;

//player velocity
var px_velocity = 0;
var py_velocity = 0;

//player nearby tiles
var tile_left = 0;
var tile_right = 0;
var tile_up = 0;
var tile_down = 0;

var inair = true

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

//function for calculating collision
function collision(direction, change, map) {
    //return true if it can move in that direction, false if it can not
    //if it is moving a tile further left
    if (direction == "right") {
        //new_right is the potential new position
        let new_right = Math.floor((px + player_width + change) / tile_size)
        // if it is going into a new block
        if (new_right > tile_right) {
            //check at all heights that the player is in
            for (let i = tile_up; i <= tile_down; i++) {
                //this is the tile the player will be going into
                let tile_hit = map[new_right + i * width]
                //if it is not "air"
                if (tile_hit !== 0) {
                    return false
                }
            }
        }
        //it is not hitting anything
        return true
    }
    else if (direction == "left") {
        let new_left = Math.floor((px - change) / tile_size)
        if (new_left < tile_left) {
            for (let i = tile_up; i <= tile_down; i++) {
                let tile_hit = map[new_left + i * width]
                if (tile_hit !== 0) {
                    return false
                }
            }
        }
        return true

    }
    else if (direction == "up") {
        let new_up = Math.floor((py - change) / tile_size)
        if (new_up < tile_up) {
            for (let i = tile_left; i <= tile_right; i++) {
                let tile_hit = map[i + new_up * width]
                if (tile_hit !== 0) {
                    return false
                }
            }
        }
        return true
    }
    else if (direction == "down") {
        let new_down = Math.floor((py + player_height + change) / tile_size)
        if (new_down > tile_down) {
            for (let i = tile_left; i <= tile_right; i++) {
                let tile_hit = map[i + new_down * width]
                if (tile_hit !== 0) {
                    return false
                }
            }
        }
        return true
    }
}

//game rendering / loop
function game(map) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render_tiles(map);

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
        if (collision("right", px_velocity, map)) {
            px += px_velocity
        }
        else {
            px_velocity = 0
        }
    }
    else if (px_velocity < 0) {
        if (collision("left", -px_velocity,map)) {
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
        if (collision("down", py_velocity*1.1,map)) {
            inair=true
            py += py_velocity
        }
        else {
            inair = false
            py_velocity = 0
        }
    }
    else if (py_velocity < 0) {
        if (collision("up", -py_velocity,map)) {
            py += py_velocity
        }
        else {
            py_velocity = 0
        }
    }

    //debug info on screen
    document.getElementById("px").innerHTML = px;
    document.getElementById("py").innerHTML = py;

    document.getElementById("py v").innerHTML = py_velocity;

    //store covered tile boundaries
    tile_left = Math.floor(px / tile_size)
    tile_right = Math.floor((px + player_width) / tile_size)
    tile_up = Math.floor(py / tile_size)
    tile_down = Math.floor((py + player_height) / tile_size)

    document.getElementById("blocks").innerHTML = [tile_left, tile_right, tile_up, tile_down];
    ctx.drawImage(player_sprite, px, py)
    //ctx.drawImage(img, , ,24,24,i*24,j*24,24,24)}
}

//how many times a second render the game
setInterval(game, 1000 / 60, test_map)