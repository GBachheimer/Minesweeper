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
const allBombs = [];
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
const bombImg = new Image();
bombImg.src = "bomb.png";

function resetGame() {
    let bombsNr = Math.floor(Math.random() * 20) + 15;
    document.getElementById("minesScore").innerHTML = bombsNr;
    for (let i = bombsNr; i > 0; --i) {
        generateBomb();
    }
    generateNumbers();
}

function generateBomb() {
    let xBomb, yBomb;
    do {
        xBomb = Math.floor(Math.random() * 15) * gameUnit;
        yBomb = Math.floor(Math.random() * 15) * gameUnit;
    } while (checkCollision(xBomb, yBomb));
    allBombs.unshift({x: xBomb, y: yBomb});
    ctx.drawImage(bombImg, xBomb, yBomb, 40, 40);
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
    for (let checkY = 0; checkY < 600; checkY += gameUnit) {
        for (let checkX = 0; checkX < 600; checkX += gameUnit) {
            let spiral = [{x: checkX - gameUnit, y: checkY - gameUnit}, {x: checkX, y: checkY - gameUnit}, {x: checkX + gameUnit, y: checkY - gameUnit},
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
            ctx.font = "20px Arial";
            centerTextX = gameUnit - 25;
            centerTextY = gameUnit - 15;
            ctx.fillText(bombsFound, checkX + centerTextX, checkY + centerTextY);
        }
    }
}
