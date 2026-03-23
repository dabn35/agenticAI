const cvs = document.getElementById("board");
const ctx = cvs.getContext("2d");
const nextCvs = document.getElementById("next-piece");
const nextCtx = nextCvs.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const linesElement = document.getElementById("lines");
const gameOverModal = document.getElementById("game-over-modal");
const finalScoreElement = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

const ROW = 20;
const COL = 10;
const SQ = 30; // Square size in Main Board
const NEXT_SQ = 30; // Square size in Next Piece Preview
const EMPTY = "transparent"; // Empty square color

// --- Tetrominoes Matrices ---
const I = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	]
];

const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

const O = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	]
];

const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const T = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const Z = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
];

const PIECES = [
    [Z, "#ef4444"], // Red
    [S, "#22c55e"], // Green
    [T, "#a855f7"], // Purple
    [O, "#eab308"], // Yellow
    [L, "#f97316"], // Orange
    [I, "#06b6d4"], // Cyan
    [J, "#3b82f6"]  // Blue
];

// --- Variables ---
let board = [];
let score = 0;
let totalLines = 0;
let level = 1;
let gameOver = false;
let animationFrameId;
let dropStart;
let dropInterval = 1000;

// Draw a single square with a bevel effect
function drawSquare(x, y, color, context = ctx, size = SQ) {
    if (color === EMPTY) return;
    
    context.fillStyle = color;
    context.fillRect(x * size, y * size, size, size);

    // Inner shadow details for a 3D blocky look
    context.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Top/Left highlight
    context.fillRect(x * size, y * size, size, size * 0.15); // Top
    context.fillRect(x * size, y * size, size * 0.15, size); // Left
    
    context.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Bottom/Right shadow
    context.fillRect(x * size, y * size + size * 0.85, size, size * 0.15); // Bottom
    context.fillRect(x * size + size * 0.85, y * size, size * 0.15, size); // Right

    // Optional border
    context.strokeStyle = "rgba(0, 0, 0, 0.5)";
    context.lineWidth = 1;
    context.strokeRect(x * size, y * size, size, size);
}

// Draw a "ghost" square (projection)
function drawGhostSquare(x, y, color, context = ctx, size = SQ) {
    if (color === EMPTY) return;
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.strokeRect(x * size + 1, y * size + 1, size - 2, size - 2);
    context.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba'); // Make translucent
    context.fillRect(x * size + 2, y * size + 2, size - 4, size - 4);
}

// Initialize Board
function initBoard() {
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = EMPTY;
        }
    }
}

// Draw the Board Canvas
function drawBoard() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    
    // Draw subtle grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let c = 0; c <= COL; c++) {
        ctx.beginPath();
        ctx.moveTo(c * SQ, 0);
        ctx.lineTo(c * SQ, ROW * SQ);
        ctx.stroke();
    }
    for (let r = 0; r <= ROW; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * SQ);
        ctx.lineTo(COL * SQ, r * SQ);
        ctx.stroke();
    }

    // Draw landed blocks
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

// --- Piece Object ---
class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        
        this.tetrominoN = 0; // We start from the first pattern
        this.activeTetromino = this.tetromino[this.tetrominoN];
        
        // Spawn coordinates
        this.x = 3;
        this.y = -2; // Start above the board
    }
    
    // Fill piece function
    fill(color, drawFunc = drawSquare) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                // Return if square is 0
                if (this.activeTetromino[r][c]) {
                    drawFunc(this.x + c, this.y + r, color);
                }
            }
        }
    }
    
    // Draw the piece
    draw() {
        this.fill(this.color);
    }
    
    // Undraw the piece
    unDraw() {
        // We actually just redraw the board to clear its previous pos, 
        // but for specific updates, this might be useful
        // For simplicity, we just rely on drawing the board before drawing the piece.
    }
    
    // Move Down
    moveDown() {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.y++;
        } else {
            // Lock piece and generate new
            this.lock();
            p = nextP;
            nextP = randomPiece();
            drawNextPiece();
        }
    }
    
    // Move Right
    moveRight() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.x++;
        }
    }
    
    // Move Left
    moveLeft() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.x--;
        }
    }
    
    // Rotate 
    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let kick = 0;
        
        if (this.collision(0, 0, nextPattern)) {
            // Very simple wall kick attempt (right/left)
            if (this.x > COL / 2) {
                kick = -1; // try left
            } else {
                kick = 1; // try right
            }
        }
        
        if (!this.collision(kick, 0, nextPattern)) {
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
        }
    }

    // Hard drop
    hardDrop() {
        while (!this.collision(0, 1, this.activeTetromino)) {
            this.y++;
        }
        this.lock();
        p = nextP;
        nextP = randomPiece();
        drawNextPiece();
    }
    
    // Lock piece
    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                // pieces to lock on top = game over
                if (this.y + r < 0) {
                    gameOver = true;
                    showGameOver();
                    return;
                }
                // Lock it
                board[this.y + r][this.x + c] = this.color;
            }
        }
        
        // Remove full rows
        let linesCleared = 0;
        for (let r = 0; r < ROW; r++) {
            let isRowFull = true;
            for (let c = 0; c < COL; c++) {
                if (board[r][c] === EMPTY) {
                    isRowFull = false;
                    break;
                }
            }
            if (isRowFull) {
                linesCleared++;
                // Move all rows above down
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                // Top row empty
                for (let c = 0; c < COL; c++) {
                    board[0][c] = EMPTY;
                }
            }
        }
        
        if (linesCleared > 0) {
            updateScore(linesCleared);
        }
    }
    
    // Collision detection
    collision(x, y, pieceToHalt) {
        for (let r = 0; r < pieceToHalt.length; r++) {
            for (let c = 0; c < pieceToHalt.length; c++) {
                // Ignore empty squares
                if (!pieceToHalt[r][c]) {
                    continue;
                }
                // Coordinates after move
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                
                // Conditions for collision
                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true; // Wall or bottom collision
                }
                // Skip newY < 0; board bounds above are ok during spawn
                if (newY < 0) {
                    continue;
                }
                // Existing piece check
                if (board[newY][newX] !== EMPTY) {
                    return true;
                }
            }
        }
        return false;
    }

    // Calculate ghost piece drop pos
    getGhostY() {
        let ghostY = this.y;
        while (!this.collision(0, ghostY - this.y + 1, this.activeTetromino)) {
            ghostY++;
        }
        return ghostY;
    }

    drawGhost() {
        let originalY = this.y;
        this.y = this.getGhostY();
        this.fill(this.color, drawGhostSquare);
        this.y = originalY; // Restore
    }
}

// Generate random piece
function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length); // 0 to 6
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p;
let nextP;

// Controls
document.addEventListener("keydown", CONTROL);
function CONTROL(event) {
    if (gameOver) return;
    
    if (event.code === "ArrowLeft") {
        p.moveLeft();
        dropStart = Date.now(); // Reset interval
    } else if (event.code === "ArrowUp") {
        p.rotate();
        dropStart = Date.now();
    } else if (event.code === "ArrowRight") {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.code === "ArrowDown") {
        p.moveDown();
        // Don't reset time here to allow scoring fast drops if wanted
    } else if (event.code === "Space") {
        p.hardDrop();
        dropStart = Date.now();
        event.preventDefault(); // Prevent scrolling
    }
    
    render();
}

// Update game stats
function updateScore(linesCleared) {
    const scores = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines
    score += scores[linesCleared] * level;
    totalLines += linesCleared;
    
    // Level up every 10 lines
    level = Math.floor(totalLines / 10) + 1;
    // Speed up
    dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    
    scoreElement.innerText = score;
    levelElement.innerText = level;
    linesElement.innerText = totalLines;
}

// Draw next piece in preview panel
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCvs.width, nextCvs.height);
    
    let active = nextP.tetromino[0]; // Always show first rotation state
    let color = nextP.color;
    
    // Center it in the 4x4 mini grid
    // For O and I piece, offset might be a bit different, but roughly centered
    let offset_x = (4 - active.length) / 2;
    let offset_y = (4 - active.length) / 2;
    
    for (let r = 0; r < active.length; r++) {
        for (let c = 0; c < active.length; c++) {
            if (active[r][c]) {
                drawSquare(c + offset_x, r + offset_y + 0.5, color, nextCtx, NEXT_SQ);
            }
        }
    }
}

function showGameOver() {
    cancelAnimationFrame(animationFrameId);
    finalScoreElement.innerText = score;
    gameOverModal.classList.remove("hidden");
}

function restartGame() {
    score = 0;
    totalLines = 0;
    level = 1;
    dropInterval = 1000;
    gameOver = false;
    
    scoreElement.innerText = score;
    levelElement.innerText = level;
    linesElement.innerText = totalLines;
    
    gameOverModal.classList.add("hidden");
    
    initBoard();
    p = randomPiece();
    nextP = randomPiece();
    drawNextPiece();
    
    dropStart = Date.now();
    gameLoop();
}

// Render once
function render() {
    drawBoard();
    p.drawGhost();
    p.draw();
}

// Game Loop
function gameLoop() {
    if (!gameOver) {
        let now = Date.now();
        let delta = now - dropStart;
        if (delta > dropInterval) {
            p.moveDown();
            dropStart = Date.now();
        }
        
        render();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Listeners
restartBtn.addEventListener("click", restartGame);

// Init
initBoard();
p = randomPiece();
nextP = randomPiece();
drawNextPiece();
dropStart = Date.now();
gameLoop();
