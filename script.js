let gameUnit = 40;
let minesScore = 0;
let mainScore = 0;
let bombsNr = 0;
let winScore = 0;
const tiles = [];
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
const bombImg = new Image();
bombImg.src = "bomb.png";
const flagImg = new Image();
flagImg.src = "flag.png";
canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    checkMouseCoords(event);
});

function startGame() {
    winScore = 0;
    mainScore = 0;
    tiles.length = 0;
    ctx.clearRect(0, 0, 600, 600);
    for (let i = 0; i < 600; i += gameUnit) {
        for (let j = 0; j < 600; j += gameUnit) {
            const tile = {x: j, y: i, number: 0, clicked: "no", flagged: "no"};
            tiles.unshift(tile);
            ctx.strokeStyle = "white";
            ctx.strokeRect(i, j, gameUnit, gameUnit);
        }
    }
    bombsNr = Math.floor(Math.random() * 20) + 10;
    document.getElementById("minesScore").innerHTML = "Total bombs: " + bombsNr;
    document.getElementById("mainScore").innerHTML = "Score: " + mainScore;
    for (let i = bombsNr; i > 0; --i) {
        generateBomb();
    }
    canvas.addEventListener("click", checkMouseCoords);
}

function generateBomb() {
    let xBomb, yBomb;
    do {
        xBomb = Math.floor(Math.random() * 15) * gameUnit;
        yBomb = Math.floor(Math.random() * 15) * gameUnit;
    } while (checkCollision(xBomb, yBomb));
    for (let i = 0; i < tiles.length; ++i) {
        if (xBomb == tiles[i].x && yBomb == tiles[i].y) {
            tiles[i].number = -1;
            generateNumbers(tiles[i].x, tiles[i].y);
        }
    }
}

function checkCollision(xBomb, yBomb) {
    for (let i = 0; i < tiles.length; ++i) {
        if (xBomb == tiles[i].x && yBomb == tiles[i].y && tiles[i].number == -1) {
            return true;
        }
    }
    return false;
}

function generateNumbers(x, y) {
    for (let i = 0; i < tiles.length; ++i) {
        if (tiles[i].x == x - gameUnit && tiles[i].y == y && tiles[i].number != -1 || //stanga
            tiles[i].x == x - gameUnit && tiles[i].y == y - gameUnit && tiles[i].number != -1 || //stanga-sus
            tiles[i].x == x && tiles[i].y == y - gameUnit && tiles[i].number != -1 || //sus
            tiles[i].x == x + gameUnit && tiles[i].y == y - gameUnit && tiles[i].number != -1 || //dreapta-sus
            tiles[i].x == x + gameUnit && tiles[i].y == y && tiles[i].number != -1 || //dreapta
            tiles[i].x == x + gameUnit && tiles[i].y == y + gameUnit && tiles[i].number != -1 || //dreapta-jos
            tiles[i].x == x && tiles[i].y == y + gameUnit && tiles[i].number != -1 || //jos
            tiles[i].x == x - gameUnit && tiles[i].y == y + gameUnit && tiles[i].number != -1) { //stanga-jos
            ++tiles[i].number;
        }
    }
}

function checkMouseCoords (event) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    while (mouseX % gameUnit != 0) {
        --mouseX;
    }
    while (mouseY % gameUnit != 0) {
        --mouseY;
    }
    for (let i = 0; i < tiles.length; ++i) {
        if (tiles[i].x == mouseX && tiles[i].y == mouseY) {
            if (event.which === 1) {
                if (tiles[i].clicked == "yes" || tiles[i].flagged == "yes") {
                    return;
                }
                ++mainScore;
                if (mainScore === 225) {
                    checkWin();
                }
                if (checkNumber(i)) {
                    discover(i);
                }
                document.getElementById("mainScore").innerHTML = "Score: " + mainScore;
            } else if (event.which === 3) {
                drawFlag(i);
            }
        }
    }
}

function drawNumber(x, y, z) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, gameUnit, gameUnit);
    if (z === 0) {
        return;
    } else if (z === 1) {
        ctx.fillStyle = "#0000FF";
    } else if (z === 2) {
        ctx.fillStyle = "#FF0000";
    } else if (z === 3) {
        ctx.fillStyle = "#FF00FF";
    } else if (z === 4) {
        ctx.fillStyle = "#006400";
    } else if (z === 5) {
        ctx.fillStyle = "#FF1493";
    } else if (z === 6) {
        ctx.fillStyle = "#DC143C";
    } else if (z === 7) {
        ctx.fillStyle = "#00FFFF";
    } else if (z === 8) {
        ctx.fillStyle = "#000000";
    }
    ctx.font = "20px Arial";
    let centerTextX = gameUnit - 25;
    let centerTextY = gameUnit - 15;
    ctx.fillText(z, x + centerTextX, y + centerTextY);
}

function discover(i) {
    if (tiles[i].x == 0) {
        checkTile(i - 15); //jos
        checkTile(i + 15); //sus
        checkTile(i - 1); //drepta
        checkTile(i + 15 - 1); //dreapta-sus
        checkTile(i - 15 - 1); //dreapta-jos
    } else if (tiles[i].x == 560) {
        checkTile(i + 1); //stanga
        checkTile(i + 15); //sus
        checkTile(i + 15 + 1); //stanga-sus
        checkTile(i - 15); //jos
        checkTile(i - 15 + 1); //stanga-jos
    } else if (tiles[i].y == 0) {
        checkTile(i - 15); //jos
        checkTile(i - 15 + 1); //stanga-jos
        checkTile(i - 15 - 1); //dreapta-jos
        checkTile(i - 1); //drepta
        checkTile(i + 1); //stanga
    } else if (tiles[i].y == 560) {
        checkTile(i + 15); //sus
        checkTile(i + 15 + 1); //stanga-sus
        checkTile(i + 15 - 1); //dreapta-sus
        checkTile(i - 1); //drepta
        checkTile(i + 1); //stanga
    } else {
        checkTile(i - 1); //drepta
        checkTile(i + 1); //stanga
        checkTile(i + 15); //sus
        checkTile(i + 15 + 1); //stanga-sus
        checkTile(i + 15 - 1); //dreapta-sus
        checkTile(i - 15); //jos
        checkTile(i - 15 + 1); //stanga-jos
        checkTile(i - 15 - 1); //dreapta-jos
    }
}

function checkTile(index) {
    if (index < 0 || index > 224) {
        return;
    }
    if (tiles[index].clicked == "yes" || tiles[index].flagged == "yes") {
        return;
    }
    ++mainScore;
    if (mainScore === 225) {
        checkWin();
    }
    tiles[index].clicked = "yes";
    if (tiles[index].number > 0) {
        drawNumber(tiles[index].x, tiles[index].y, tiles[index].number);
    } else if (tiles[index].number == 0) {
        ctx.fillStyle = "white";
        ctx.fillRect(tiles[index].x, tiles[index].y, gameUnit, gameUnit);
        discover(index);
    }
}

function checkNumber(i) {
    if (tiles[i].number == -1) {
        tiles[i].clicked = "yes";
        ctx.fillStyle = "white";
        ctx.fillRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        ctx.drawImage(bombImg, tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        document.getElementById("minesScore").innerHTML = "Game over!";
        canvas.removeEventListener("click", checkMouseCoords);
        for (let i = 0; i < tiles.length; ++i) {
            if (tiles[i].number == -1) {
                ctx.fillStyle = "white";
                ctx.fillRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
                ctx.drawImage(bombImg, tiles[i].x, tiles[i].y, gameUnit, gameUnit);
            }
        }
        return false;
    } else if (tiles[i].number > 0) {
        tiles[i].clicked = "yes";
        drawNumber(tiles[i].x, tiles[i].y, tiles[i].number);
        return false;
    } else {
        tiles[i].clicked = "yes";
        ctx.fillStyle = "white";
        ctx.fillRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        return true;
    }
}

function drawFlag(i) {
    if (tiles[i].clicked == "no" && tiles[i].flagged == "no") {
        tiles[i].flagged = "yes";
        ctx.fillStyle = "white";
        ctx.fillRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        ctx.drawImage(flagImg, tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        ++mainScore;
        if (mainScore === 225) {
            checkWin();
        }
    } else if (tiles[i].flagged == "yes") {
        if (tiles[i].clicked == "no") {
            tiles[i].flagged = "no";
            --mainScore;
            ctx.fillStyle = "beige";
            ctx.strokeStyle = "white";
            ctx.fillRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
            ctx.strokeRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        } else {
            --mainScore;
            tiles[i].flagged = "no";
            drawNumber(tiles[i].x, tiles[i].y, tiles[i].number);
        }
    }
}

function checkWin() {
    for (let i = 0; i < tiles.length; ++i) {
        if (tiles[i].flagged == "yes" && tiles[i].number == -1) {
            ++winScore;
            ctx.fillStyle = "green";
            ctx.fillRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
            ctx.drawImage(bombImg, tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        } else if (tiles[i].flagged == "no" && tiles[i].number == -1) {
            --winScore;
            ctx.fillStyle = "red";
            ctx.fillRect(tiles[i].x, tiles[i].y, gameUnit, gameUnit);
            ctx.drawImage(bombImg, tiles[i].x, tiles[i].y, gameUnit, gameUnit);
        } else if (tiles[i].flagged == "yes" && tiles[i].number > -1) {
            --winScore;
        }
    }
    if (winScore === bombsNr) {
        document.getElementById("minesScore").innerHTML = "Win!";
        document.getElementById("mainScore").innerHTML = "Win!";
    } else {
        document.getElementById("minesScore").innerHTML = "You lose!";
        document.getElementById("mainScore").innerHTML = "You lose!";
    }
}
