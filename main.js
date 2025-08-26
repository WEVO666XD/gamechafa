const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
canvas.width = 800;
canvas.height = 300;

// --- Paleta de Colores y Estilos ---
const DINO_COLOR = '#535353';
const GROUND_COLOR = '#535353';
const TEXT_COLOR = '#535353';
const OBSTACLE_COLORS = ['#4CAF50', '#8BC34A', '#558B2F', '#388E3C']; // Varios tonos de verde

// --- Variables del Juego ---
let dino = new Dino(50, canvas.height - 90, 40, 50, DINO_COLOR);
const GROUND_Y = canvas.height - 40;
let obstacles = [];
let score = 0;
let gameSpeed = 5;
let obstacleTimer = 0;
let gameOver = false;

// --- Manejo de Controles ---
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameOver) {
            restartGame();
        } else {
            dino.jump();
        }
    }
});

function restartGame() {
    dino = new Dino(50, canvas.height - 90, 40, 50, DINO_COLOR);
    obstacles = [];
    score = 0;
    gameSpeed = 5;
    obstacleTimer = 0;
    gameOver = false;
    gameLoop();
}

// --- Lógica de Obstáculos ---
function createObstacle() {
    const obstacleType = Math.floor(Math.random() * 4); // 4 tipos de obstáculos
    const color = OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)];
    let newObstacle = { x: canvas.width, parts: [], color: color };

    switch (obstacleType) {
        case 0: // Cactus pequeño
            newObstacle.parts.push({ w: 20, h: 40, y_offset: 0 });
            break;
        case 1: // Cactus alto
            newObstacle.parts.push({ w: 25, h: 60, y_offset: 0 });
            break;
        case 2: // Cactus con brazo
            newObstacle.parts.push({ w: 20, h: 50, y_offset: 0 });
            newObstacle.parts.push({ w: 15, h: 10, y_offset: -30 }); // Brazo
            break;
        case 3: // Grupo de dos cactus
            newObstacle.parts.push({ w: 20, h: 40, y_offset: 0 });
            newObstacle.parts.push({ w: 20, h: 40, y_offset: 0, x_offset: 25 });
            break;
    }
    obstacles.push(newObstacle);
}

function handleObstacles() {
    obstacleTimer++;
    if (obstacleTimer > 80 + Math.random() * 80 - gameSpeed * 5) {
        createObstacle();
        obstacleTimer = 0;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obsGroup = obstacles[i];
        obsGroup.x -= gameSpeed;

        // Eliminar si sale de la pantalla
        if (obsGroup.x < -100) {
            obstacles.splice(i, 1);
            continue;
        }

        // Dibujar y detectar colisión para cada parte del obstáculo
        for (const part of obsGroup.parts) {
            const partX = obsGroup.x + (part.x_offset || 0);
            const partY = GROUND_Y - part.h + (part.y_offset || 0);
            
            ctx.fillStyle = obsGroup.color;
            ctx.fillRect(partX, partY, part.w, part.h);

            if (dino.x < partX + part.w &&
                dino.x + dino.width > partX &&
                dino.y < partY + part.h &&
                dino.y + dino.height > partY) {
                gameOver = true;
            }
        }
    }
}

// --- UI y Dibujo ---
function drawUI() {
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = '20px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`HI ${String(Math.floor(score)).padStart(5, '0')}`, canvas.width - 20, 30);

    if (gameOver) {
        ctx.textAlign = 'center';
        ctx.font = '40px monospace';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px monospace';
        ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 20);
    }
}

// --- Bucle Principal del Juego ---
function gameLoop() {
    if (gameOver) {
        drawUI();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar suelo
    ctx.strokeStyle = GROUND_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    // Actualizar y dibujar todo
    dino.update();
    dino.draw(ctx);
    handleObstacles();

    score += 0.15;
    if (score > 0 && Math.floor(score) % 100 === 0) {
        gameSpeed += 0.2;
    }

    drawUI();
    requestAnimationFrame(gameLoop);
}

// Iniciar el juego
gameLoop();
