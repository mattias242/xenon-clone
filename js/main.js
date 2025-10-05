// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element
    const canvas = document.getElementById('game-canvas');
    
    // Create a new game instance
    const game = new Game(canvas);
    
    // Get UI elements
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    
    // Start button click handler
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        game.start();
    });
    
    // Restart button click handler
    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        game.reset();
        game.start();
    });
    
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        // R key to restart when game is over
        if (e.code === 'KeyR' && game.gameOver) {
            gameOverScreen.style.display = 'none';
            game.reset();
            game.start();
        }
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, false);
    
    canvas.addEventListener('touchend', (e) => {
        if (game.gameOver && gameOverScreen.style.display === 'flex') {
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;
            
            // Check if it's a tap (not a swipe)
            if (Math.abs(touchEndX - touchStartX) < 10 && Math.abs(touchEndY - touchStartY) < 10) {
                gameOverScreen.style.display = 'none';
                game.reset();
                game.start();
            }
        }
    }, false);
    
    // Show start screen by default
    startScreen.style.display = 'flex';
});
