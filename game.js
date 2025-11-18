// Memory Game JavaScript
class MemoryGame {
    constructor() {
        this.cards = [];
        this.revealedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.startTime = null;
        this.timerInterval = null;
        
        // Symbols for the cards
        this.symbols = ['🎯', '🎨', '🎪', '🎭', '🎸', '🎹', '🎺', '🎻'];
        
        this.initializeElements();
        this.bindEvents();
        this.createGameGrid();
    }
    
    initializeElements() {
        this.gameGrid = document.getElementById('gameGrid');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.statusMessage = document.getElementById('statusMessage');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.resetBtn = document.getElementById('resetBtn');
    }
    
    bindEvents() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    createGameGrid() {
        this.gameGrid.innerHTML = '';
        
        // Create pairs of symbols
        const cardSymbols = [...this.symbols, ...this.symbols];
        
        // Shuffle the symbols
        this.shuffleArray(cardSymbols);
        
        // Create card elements
        cardSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'game-cell';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.addEventListener('click', () => this.handleCardClick(card));
            this.gameGrid.appendChild(card);
        });
        
        this.cards = Array.from(this.gameGrid.children);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    startNewGame() {
        this.resetGame();
        this.gameStarted = true;
        this.startTime = Date.now();
        this.startTimer();
        this.updateStatus('Game started! Find matching pairs.');
        this.newGameBtn.textContent = 'Restart Game';
    }
    
    resetGame() {
        this.gameStarted = false;
        this.gameCompleted = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.revealedCards = [];
        this.startTime = null;
        
        this.stopTimer();
        this.updateScore();
        this.updateMoves();
        this.updateTimer();
        this.updateStatus('Click "New Game" to start playing!');
        this.newGameBtn.textContent = 'New Game';
        
        // Reset all cards
        this.cards.forEach(card => {
            card.className = 'game-cell';
            card.textContent = '';
        });
        
        this.createGameGrid();
    }
    
    handleCardClick(card) {
        if (!this.gameStarted || this.gameCompleted) return;
        if (card.classList.contains('revealed') || card.classList.contains('matched')) return;
        if (this.revealedCards.length >= 2) return;
        
        this.revealCard(card);
        this.revealedCards.push(card);
        
        if (this.revealedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            
            setTimeout(() => {
                this.checkForMatch();
            }, 500);
        }
    }
    
    revealCard(card) {
        card.classList.add('revealed');
        card.textContent = card.dataset.symbol;
    }
    
    checkForMatch() {
        const [card1, card2] = this.revealedCards;
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Match found!
            card1.classList.remove('revealed');
            card1.classList.add('matched');
            card2.classList.remove('revealed');
            card2.classList.add('matched');
            
            this.matchedPairs++;
            this.score += 10;
            this.updateScore();
            
            if (this.matchedPairs === this.symbols.length) {
                this.completeGame();
            } else {
                this.updateStatus(`Great! ${this.symbols.length - this.matchedPairs} pairs remaining.`);
            }
        } else {
            // No match
            card1.classList.remove('revealed');
            card2.classList.remove('revealed');
            card1.classList.add('mismatch');
            card2.classList.add('mismatch');
            
            setTimeout(() => {
                card1.classList.remove('mismatch');
                card2.classList.remove('mismatch');
                card1.textContent = '';
                card2.textContent = '';
            }, 600);
            
            this.updateStatus('No match. Try again!');
        }
        
        this.revealedCards = [];
    }
    
    completeGame() {
        this.gameCompleted = true;
        this.stopTimer();
        
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Calculate bonus points based on time and moves
        const timeBonus = Math.max(0, 60 - timeElapsed) * 2;
        const moveBonus = Math.max(0, 16 - this.moves) * 5;
        this.score += timeBonus + moveBonus;
        this.updateScore();
        
        this.updateStatus(`🎉 Congratulations! Game completed in ${timeString} with ${this.moves} moves! Final score: ${this.score}`);
        
        // Add confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        const colors = ['#6366f1', '#8b5cf6', '#fbbf24', '#f59e0b', '#10b981', '#ef4444'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = 'confettiFall 3s linear forwards';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.startTime) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateMoves() {
        this.movesElement.textContent = this.moves;
    }
    
    updateTimer() {
        this.timerElement.textContent = '00:00';
    }
    
    updateStatus(message) {
        this.statusMessage.textContent = message;
        
        // Add visual feedback
        this.statusMessage.className = 'status-message';
        if (message.includes('Congratulations') || message.includes('Great!')) {
            this.statusMessage.classList.add('status-success');
        } else if (message.includes('No match')) {
            this.statusMessage.classList.add('status-info');
        }
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        // Restart game with R key
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            newGameBtn.click();
        }
    } else if (e.key === 'n' || e.key === 'N') {
        // New game with N key
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.click();
        }
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', (e) => {
    // Prevent double-tap zoom
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Add haptic feedback for mobile (if supported)
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50); // Short vibration
    }
}

// Add sound effects (optional)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playMatchSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    playMismatchSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
}

// Initialize sound effects
const soundEffects = new SoundEffects();

