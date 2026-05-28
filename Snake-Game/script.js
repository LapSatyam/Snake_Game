const board = document.getElementById("board");
const fragment = document.createDocumentFragment();
const cols = Math.floor(board.clientWidth / 50);
const rows = Math.floor(board.clientHeight / 50);
const modal = document.getElementById("modal");
const startBtn = document.getElementById("start-btn");
const modal_title = document.getElementById("modal-title");
const moda_ds = document.getElementById("modal-description");

let score = 0;
let Interval;

let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let direction = null;

const directions = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
];
const blocks = {};
const snake = [{
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
}];

// Start Modal
startBtn?.addEventListener("click", () => {
    if (score !== 0) {
        window.location.reload();
        return;
    };

    modal.classList.add("hidden");

    Interval = setInterval(() => {
        render();
    }, 500);
});

// Generate Board
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        fragment.appendChild(block);
        blocks[`${col}-${row}`] = block;
    };
};

// Generates food
blocks[`${food.x}-${food.y}`].classList.add("food");


window.addEventListener("keydown", (e) => {
    if (directions.includes(e.key)) {
        direction = e.key;
    }
});


board.appendChild(fragment);

function render() {
    const head = snake[0];

    // Clear old snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]?.classList.remove("fill");
    });

    const tail = snake[snake.length - 1];
    const oldTail = {
        x: tail.x,
        y: tail.y
    };

    // Move body
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    // Move head
    if (direction === "ArrowDown") head.y++;
    if (direction === "ArrowUp") head.y--;
    if (direction === "ArrowRight") head.x++;
    if (direction === "ArrowLeft") head.x--;

    // Boundary check
    if (
        head.x < 0 ||
        head.x >= cols ||
        head.y < 0 ||
        head.y >= rows
    ) {
        clearInterval(Interval);
        modal_title.textContent = "Game Over!";
        moda_ds.textContent = "Don't Give Up, Just Try Again."
        startBtn.textContent = "Start Again!"
        startBtn.className = "rounded-xl cursor-pointer bg-red-600 px-4 py-2 font-semibold text-black hover:bg-red-500 transition-all duration-300";
        modal.classList.toggle("hidden");
        return;
    };

    // Food check
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score
        snake.push({
            x: oldTail.x,
            y: oldTail.y
        });

        blocks[`${food.x}-${food.y}`].classList.remove("food");

        food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };

        blocks[`${food.x}-${food.y}`].classList.add("food");
    };

    // Draw snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]?.classList.add("fill");
    });
}