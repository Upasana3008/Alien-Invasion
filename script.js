document.addEventListener("DOMContentLoaded", function () {
    const gameArea = document.querySelector(".game_area");
    const player = document.querySelector(".player");

    let score = 0;
    let level = 1;
    let alienSpeed = 2;
    let alienSpawnRate = 3000;
    let bullets = [];
    let aliens = [];

    const scoreDisplay = document.createElement("div");
    scoreDisplay.classList.add("score");
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "10px"; 
    scoreDisplay.style.left = "10px";
    scoreDisplay.style.color = "white";
    scoreDisplay.style.fontSize = "20px";
    scoreDisplay.innerText = `Score: ${score} | Level: ${level}`;
    gameArea.appendChild(scoreDisplay);

    let playerX = 150;
    let moveLeft = false;
    let moveRight = false;
    let moveSpeed = 10;

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            moveLeft = true;
        }
        else if (event.key === "ArrowRight"){
            moveRight = true;
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === "ArrowLeft") moveLeft = false;
        else if (event.key === "ArrowRight") moveRight = false;
    });

    function movePlayer() {
        if (moveLeft && playerX > 0) playerX -= moveSpeed;
        if (moveRight && playerX < 300) playerX += moveSpeed;
        player.style.left = `${playerX}px`;
    }

    function shootBullet() {
        const bullet = document.createElement("img");
        bullet.src = "Assets/fire.png";
        bullet.classList.add("bullet");
        bullet.style.position = "absolute";
        bullet.style.left = `${playerX + 35}px`;
        bullet.style.top = "450px";
        gameArea.appendChild(bullet);
        bullets.push(bullet);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === " ") {
            shootBullet();
        }
    });

    function moveBullets() {
        bullets.forEach((bullet, index) => {
            let bulletTop = parseInt(bullet.style.top);
            bullet.style.top = `${bulletTop - 5}px`;

            if (bulletTop < 0) {
                bullet.remove();
                bullets.splice(index, 1);
            }
        });
    }

    function createAlienRow(rowIndex) {
        let alienCount = 4;
        let spacing = 300 / (alienCount + 1); // Distribute evenly in a row

        for (let i = 0; i < alienCount; i++) {
            const alien = document.createElement("img");
            alien.src = "Assets/alien.png";
            alien.classList.add("alien");
            alien.style.position = "absolute";
            alien.style.top = `${rowIndex * 60}px`;
            alien.style.left = `${(i + 1) * spacing}px`;
            gameArea.appendChild(alien);
            aliens.push(alien);
        }
    }

    function spawnAliens() {
        if (aliens.length > 0) return; // Prevent spawning if aliens are still present
    
        let rows = level;
        for (let i = 0; i < rows; i++) {
            createAlienRow(i);
        }
    }
    

    function moveAliens() {
        aliens.forEach((alien, index) => {
            let alienTop = parseInt(alien.style.top);
            alien.style.top = `${alienTop + alienSpeed}px`;
    
            if (alienTop > 550) {
                gameOver();
            }
    
            if (alienTop > 600) {
                alien.remove();
                aliens.splice(index, 1);
            }
        });
    }
    

    function checkCollisions() {
        bullets.forEach((bullet, bulletIndex) => {
            let bulletRect = bullet.getBoundingClientRect();
            aliens.forEach((alien, alienIndex) => {
                let alienRect = alien.getBoundingClientRect();

                if (
                    bulletRect.left < alienRect.right &&
                    bulletRect.right > alienRect.left &&
                    bulletRect.top < alienRect.bottom &&
                    bulletRect.bottom > alienRect.top
                ) {
                    bullet.remove();
                    alien.remove();
                    bullets.splice(bulletIndex, 1);
                    aliens.splice(alienIndex, 1);
                    score += 10;
                    updateLevel();
                    scoreDisplay.innerText = `Score: ${score} | Level: ${level}`;
                }
            });
        });

        if (aliens.length === 0) {
            spawnAliens();
        }
    }

    function updateLevel() {
        if (aliens.length === 0) { // Only level up if no aliens are left
            level++;
            alienSpeed += 0.2; // Increase speed gradually
            alienSpawnRate = Math.max(1000, alienSpawnRate - 100); // Reduce spawn rate slowly
            spawnAliens();
            scoreDisplay.innerText = `Score: ${score} | Level: ${level}`;
        }   
    }
    

    function gameOver() {
        clearInterval(gameLoop);
        gameArea.innerHTML = `<div class="game-over" style="color: red; font-size: 30px; text-align: center; margin-top: 200px;">
            GAME OVER! <br> Press F5 to Restart
        </div>`;
    }

    spawnAliens();

    let gameLoop = setInterval(() => {
        movePlayer();
        moveBullets();
        moveAliens();
        checkCollisions();
    }, 30);
});





