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
const allBombs = [{x: 0, y: 0}];
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

function resetGame() {
    let bombsNr = Math.floor(Math.random() * 20) + 15;
    ctx.fillStyle = "green";
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
    ctx.fillRect(xBomb, yBomb, gameUnit, gameUnit);
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
    //verifica spatiul din jurul bombelor, pt fiecare spatiu verifica spatiul din jurul lui
    //verifica sa nu fie deja un numar sau o bomba
    //pune nr corespunzator bombelor gasite
}
