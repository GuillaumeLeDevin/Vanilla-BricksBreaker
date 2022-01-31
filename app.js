const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.querySelector('.score');

const ballRadius = 10, barHeight = 10, barWidth =75,
nbCol = 8, nbRow = 5, brickWidth = 75, brickHeight = 20;

let x = canvas.width/2, y = canvas.height -30,
barX = (canvas.width - barWidth)/2, end = false,
speedX = 5, speedY = -5, score = 0;

function ballDraw(){

    ctx.beginPath();
    ctx.arc(x,y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();

}
ballDraw();


function barDraw(){

    ctx.beginPath();
    ctx.rect(barX, canvas.height - barHeight - 2, barWidth, barHeight)
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();

}
barDraw();

// Tableau avec toutes les bricks
const bricks = [];
for(let i = 0; i < nbRow; i++){

    bricks[i] = [];

    for(let j = 0; j < nbCol; j++){

        bricks[i][j] = {x: 0, y: 0, status: 1}

    }

}
// console.log(bricks);

function bricksDraw(){

    for(let i = 0; i < nbRow; i++){
        for(let j = 0; j < nbCol; j++){

            if(bricks[i][j].status === 1){

                // 75 * 8 + 10 * 8 + 35 = 750
                let brickX = (j * (brickWidth + 10) + 35);
                let brickY = (i * (brickHeight + 10) + 30);

                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();
            }

        }
    }

}
bricksDraw();

function draw(){

    if(end == false){

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bricksDraw();
        ballDraw();
        barDraw();
        collisionDetection();

        if(x + speedX > canvas.width - ballRadius || x + speedX < 0){
            speedX = -speedX
        }

        if(y + speedY < ballRadius){
            speedY = -speedY;
        }
        
        if(y + speedY > canvas.height - ballRadius){

            if(x > barX && x < barX + barWidth){
                speedX = speedX + 0.1;
                speedY = speedY + 0.1;
                speedY = -speedY;

            } else {
                end = true;
                scoreDisplay.innerHTML = `You lose! <br>Click on the Brick Breaker to restart.`;
            }

        }

        x += speedX;
        y += speedY;

        requestAnimationFrame(draw);

    }

}

draw();

// Collision detection
function collisionDetection() {

    for(let i = 0; i < nbRow; i++){
        for(j = 0; j < nbCol; j++){

            let b = bricks[i][j];
            if(b.status === 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    speedY = -speedY;
                    b.status = 0;

                    score++;
                    scoreDisplay.innerHTML = `Score: ${score}`;

                    if(score === nbCol * nbRow){

                        scoreDisplay.innerHTML = `Well done!! You win!
                        <br>Click on the Brick Breaker to restart.`;
                        end = true;
                    }

                }
            }

        }
    }

}


// Bar Movement
document.addEventListener('mousemove', mouseMovement);

function mouseMovement(e) {

    let barCanvasPosition = e.clientX - canvas.offsetLeft;
    // console.log(barCanvasPosition);

     if(barCanvasPosition > 35 && barCanvasPosition < canvas.width -35){
         barX = barCanvasPosition - barWidth / 2;
     }

}

// Restart
canvas.addEventListener('click', () => {
    if(end === true){
        end = false;
        document.location.reload();
    }
})