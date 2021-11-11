const canvas = document.querySelector('canvas');
const newGameBtn = document.querySelector('button');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;

const cw = canvas.width;
const ch = canvas.height;

const ballSize = 20;
let ballX = cw / 2 - ballSize / 2;
let ballY = ch / 2 - ballSize / 2;

const paddelHeight = 100;
const paddelWidth = 20;

const playerX = 70;
const aiX = cw - 90;
let playerY = 200;
let aiY = 200;

const lineWidth = 6;
const lineHeight = 16;

let acctualPlayerMove = null;
let acctualUIMove = null;

let ballSpeedX = 5;
let ballSpeedY = -0.5;

let lastClientY = null;

let interval = null;

resetGame = () => {
    ballX = cw / 2 - ballSize / 2;
    ballY = ch / 2 - ballSize / 2;
    playerY = 200;
    aiY = 200;
    acctualPlayerMove = null;
    acctualUIMove = null;
    ballSpeedX = 5;
    ballSpeedY = -0.5;
    lastClientY = null;
}

newGameBtn.addEventListener('click', () => {
    clearInterval(interval);
    resetGame();
    interval = setInterval(game, 1000 / 60);
})

table = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cw, ch);
    for (let linePosition = 20; linePosition < ch; linePosition += 30) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(cw / 2 - lineWidth / 2, linePosition, lineWidth, lineHeight);
    }
}
playerpaddle = () => {
    ctx.fillStyle = 'green';
    ctx.fillRect(playerX, playerY, paddelWidth, paddelHeight);
}
aipaddle = () => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(aiX, aiY, paddelWidth, paddelHeight);
}
ball = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(ballX, ballY, ballSize, ballSize)

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (Math.floor(ballX) <= 0 || Math.floor(ballX) >= cw - ballSize) {
        interval = clearInterval(interval);
    }
    if ((Math.floor(ballX) <= playerX + paddelWidth && Math.floor(ballX) >= playerX + paddelWidth - ballSize / 2) && (Math.floor(ballY) >= playerY && Math.floor(ballY) <= playerY + paddelHeight)) {
        ballSpeedX = -ballSpeedX;
        switch (acctualPlayerMove) {
            case 'top':
                ballSpeedY = Math.abs(ballSpeedY) * -1;
                break
            case 'bottom':
                ballSpeedY = Math.abs(ballSpeedY);
                break;
        }
        speedUp();
    }
    if ((Math.floor(ballX) + ballSize >= aiX && Math.floor(ballX) + ballSize <= aiX + ballSize / 2) && (Math.floor(ballY) + ballSize >= aiY && Math.floor(ballY) <= aiY + paddelHeight)) {
        ballSpeedX = -ballSpeedX;
        switch (acctualUIMove) {
            case 'top':
                ballSpeedY = Math.abs(ballSpeedY) * -1;
                break
            case 'bottom':
                ballSpeedY = Math.abs(ballSpeedY);
                break;
        }
        speedUp();
    }
    if (ballY <= 0 || ballY >= ch - ballSize) {
        ballSpeedY = -ballSpeedY;
        speedUp();
    }
}
speedUp = () => {
    if (ballSpeedX > 0 && ballSpeedX < 16) {
        ballSpeedX += 0.3;
    } else if (ballSpeedX < 0 && ballSpeedX > -16) {
        ballSpeedX -= 0.3;
    }
    if (ballSpeedY > 0 && ballSpeedY < 16) {
        ballSpeedY += 0.2;
    } else if (ballSpeedY < 0 && ballSpeedY > -16) {
        ballSpeedY -= 0.2;
    }
}
playerPosition = (e) => {
    playerY = e.clientY - canvas.offsetTop - paddelHeight / 2;
    if (e.clientY < lastClientY) {
        acctualPlayerMove = 'top';
    } else if (e.clientY > lastClientY) {
        acctualPlayerMove = 'bottom';
    }
    lastClientY = e.clientY;
    if (playerY <= 0) {
        return playerY = 0;
    }
    if (playerY >= ch - paddelHeight) {
        return playerY = ch - paddelHeight;
    }
}
aiPosition = () => {
    const differenceX = (ballX + ballSize) - aiX;
    const differenceYFromTop = (ballY + ballSize / 2) - aiY + paddelHeight / 2;
    const differenceYFromBottom = (ballY + ballSize / 2) - (aiY + paddelHeight / 2);

    if (ballX < 400) {
        if (differenceYFromTop <= 100) {
            aiY -= 2;
            if (aiY <= 0) {
                acctualUIMove = 'top';
                return aiY = 0;
            }
            return acctualUIMove = 'top';
        } else if (differenceYFromBottom >= -100) {
            aiY += 2;
            if (aiY + paddelHeight >= ch) {
                acctualUIMove = 'bottom';
                return aiY = aiY;
            }
            return acctualUIMove = 'bottom';
        }
    } else if (ballX > 800) {
        if (differenceYFromTop <= 100) {
            aiY -= 7;
            if (aiY <= 0) {
                acctualUIMove = 'top';
                return aiY = 0;
            }
            return acctualUIMove = 'top';
        } else if (differenceYFromBottom >= -100) {
            aiY += 7;
            if (aiY + paddelHeight >= ch) {
                acctualUIMove = 'bottom';
                return aiY = aiY;
            }
            return acctualUIMove = 'bottom';
        }
    } else if (ballX > 500) {
        if (differenceYFromTop <= 100) {
            aiY -= 6;
            if (aiY <= 0) {
                acctualUIMove = 'top';
                return aiY = 0;
            }
            return acctualUIMove = 'top';
        } else if (differenceYFromBottom >= -100) {
            aiY += 6;
            if (aiY + paddelHeight >= ch) {
                acctualUIMove = 'bottom';
                return aiY = aiY;
            }
            return acctualUIMove = 'bottom';
        }
    }
}
game = () => {
    table();
    ball();
    aipaddle();
    playerpaddle();
    aiPosition();
}

canvas.addEventListener('mousemove', playerPosition)

interval = setInterval(game, 1000 / 60);