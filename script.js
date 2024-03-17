const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{x: 200, y: 200}, {x: 190, y: 200}, {x: 180, y: 200}];
let food = {x: 0, y: 0};
let dx = box;
let dy = 0;
let score = 0;

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = (index === 0) ? '#008000' : '#00ff00';
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
    // Teleporte para o lado oposto quando atinge a borda
    if (head.x >= canvas.width) head.x = 0;
    else if (head.x < 0) head.x = canvas.width - box;
    if (head.y >= canvas.height) head.y = 0;
    else if (head.y < 0) head.y = canvas.height - box;
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, box, box);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(food.x, food.y, box, box);
}

function generateFood() {
    food.x = Math.floor(Math.random() * 20) * box;
    food.y = Math.floor(Math.random() * 20) * box;
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    if (snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y)) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        window.location.reload();
    }
    moveSnake();
}

generateFood();
const gameInterval = setInterval(draw, 100);

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if ((key === 'ArrowUp' || key === 'w') && dy === 0) {
        dx = 0;
        dy = -box;
    } else if ((key === 'ArrowDown' || key === 's') && dy === 0) {
        dx = 0;
        dy = box;
    } else if ((key === 'ArrowLeft' || key === 'a') && dx === 0) {
        dx = -box;
        dy = 0;
    } else if ((key === 'ArrowRight' || key === 'd') && dx === 0) {
        dx = box;
        dy = 0;
    }
});

// Adiciona controle por toque
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && dx !== box) {
            dx = -box;
            dy = 0;
        } else if (diffX < 0 && dx !== -box) {
            dx = box;
            dy = 0;
        }
    } else {
        if (diffY > 0 && dy !== box) {
            dx = 0;
            dy = -box;
        } else if (diffY < 0 && dy !== -box) {
            dx = 0;
            dy = box;
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}