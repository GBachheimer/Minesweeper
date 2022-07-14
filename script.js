// 15 x 15 patratele
//genereaza un numar random de bombe
//foloseste numarul asta pentru bombe si pozitioneaza-le aleatoriu pe canvas
//clculeaza patratelele adiacente cu numar de la 1-5, acest numar nu se vede initial si patratele goale acolo unde nu sunt bombe ADIACENTE
//numarul sa apara cand se da click pe patratel
//foloseste mousul si coordonatele unde se da click pt event
//click-dreapta pentru a marca mina cu stegulet
//la sfarsit verifica minele marcate
//
let gameUnit = 40;
let minesScore = 0;
let mainScore = 0;
let allBombs = [];
let allNumbers = [];
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
const bombImg = new Image();
bombImg.src = "bomb.png";

canvas.addEventListener("mousedown", getMouseCoords);

function startGame() {
    allBombs = [];
    ctx.clearRect(0, 0, 600, 600);
    let bombsNr = Math.floor(Math.random() * 20) + 10;
    document.getElementById("minesScore").innerHTML = bombsNr;
    for (let i = bombsNr; i > 0; --i) {
        generateBomb();
    }
    generateNumbers();
    generateGrid();
}

function generateBomb() {
    let xBomb, yBomb;
    do {
        xBomb = Math.floor(Math.random() * 15) * gameUnit;
        yBomb = Math.floor(Math.random() * 15) * gameUnit;
    } while (checkCollision(xBomb, yBomb));
    allBombs.unshift({x: xBomb, y: yBomb});
}

function checkCollision(xBomb, yBomb) {
    for (let i = 0; i < allBombs.length; ++i) {
        if (allBombs[i].x === xBomb && allBombs[i].y === yBomb) {
            return true;
        }
    }
    return false;
}

function generateNumbers() {
    allNumbers = [];
    for (let checkY = 0; checkY < 600; checkY += gameUnit) {
        for (let checkX = 0; checkX < 600; checkX += gameUnit) {
            const spiral = [{x: checkX - gameUnit, y: checkY - gameUnit}, {x: checkX, y: checkY - gameUnit}, {x: checkX + gameUnit, y: checkY - gameUnit},
                          {x: checkX + gameUnit, y: checkY}, {x: checkX + gameUnit, y: checkY + gameUnit},
                          {x: checkX, y: checkY + gameUnit}, {x: checkX - gameUnit, y: checkY + gameUnit},
                          {x: checkX - gameUnit, y: checkY}];
            let bombsFound = 0;
            for (let j = 0; j < spiral.length; ++j) {
                for (let i = 0; i < allBombs.length; ++i) {
                    if (allBombs[i].x === spiral[j].x && allBombs[i].y === spiral[j].y) {
                        ++bombsFound;
                    }
                }
            }
            if (bombsFound > 0) {
                allNumbers.unshift({x: checkX, y: checkY, z: bombsFound});
            }
        }
    }
    console.log(allNumbers);
}

function generateGrid() {
    for (let checkY = 0; checkY < 600; checkY += gameUnit) {
        for (let checkX = 0; checkX < 600; checkX += gameUnit) {
            ctx.globalAlpha = 1;
            ctx.strokestyle = "black";
            ctx.strokeRect(checkX, checkY, gameUnit, gameUnit);
        }
    }
}

function getMouseCoords (event) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    while (mouseX % gameUnit != 0) {
        --mouseX;
    }
    while (mouseY % gameUnit != 0) {
        --mouseY;
    }
    if (checkGameOver(mouseX, mouseY)) {
        document.getElementById("minesScore").innerHTML = "Game over!";
        return;
    }
    discoverLeftRight(mouseX, mouseY);
}

function discoverLeftRight(mouseX, mouseY) {
    for (let i = mouseX; i < 600; i += gameUnit) { //descopera dreapta
        if (checkForNumber(i, mouseY)) {
            break;
        }
        discoverUpDown(i, mouseY);
    }
    for (let i = mouseX; i >= 0; i -= gameUnit) { //descopera stanga
        if (checkForNumber(i, mouseY)) {
            break;
        }
        discoverUpDown(i, mouseY);
    }
}

function discoverUpDown(i, mouseY) {
    for (let j = mouseY - gameUnit; j >= 0; j -= gameUnit) { //descopera sus
        if (checkForNumber(i, j)) {
            break;
        }
        //discoverLeftRight(i, j);
    }
    for(let k = mouseY + gameUnit; k < 600; k += gameUnit) {//descopera jos
        if (checkForNumber(i, k)) {
            break;
        }
        //discoverLeftRight(i, k);
    }
}

function checkForNumber(i, y) {
    for (let j = 0; j < allNumbers.length; ++j) {
        if (i === allNumbers[j].x && y === allNumbers[j].y) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            let centerTextX = gameUnit - 25;
            let centerTextY = gameUnit - 15;
            ctx.fillText(allNumbers[j].z, i + centerTextX, y + centerTextY);
            return true;
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(i, y, gameUnit, gameUnit);
        }
    }
    return false;
}

function checkGameOver(mouseX, mouseY) {
    for (let i = 0; i < allBombs.length; ++i) {
        if (mouseX === allBombs[i].x && mouseY === allBombs[i].y) {
            ctx.drawImage(bombImg, mouseX, mouseY, 40, 40);
            return true;
        }
    }
    return false;
}
