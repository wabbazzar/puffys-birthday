// Hop Hop Puff - Mobile-First Phaser.js Game Engine
// Simplified version - straight to gameplay

console.log('🐱 Hop Hop Puff - Loading mobile-first game engine...');

// Vector2 class for joystick math
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }
    sub(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }
    mul(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    div(n) {
        return new Vector2(this.x / n, this.y / n);
    }
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        return this.mag() === 0 ? new Vector2(0, 0) : this.div(this.mag());
    }
}

// Working Joystick class (canvas-based)
// Simple Movement Button class
class MovementButton {
    constructor(x, y, width, height, direction, gameScene) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction; // 'left' or 'right'
        this.pressed = false;
        this.gameScene = gameScene;
        this.listener();
    }

    listener() {
        addEventListener('touchstart', e => {
            for (let touch of e.touches) {
                if (this.isInside(touch.pageX, touch.pageY)) {
                    e.preventDefault();
                    this.pressed = true;
                    if ('vibrate' in navigator) {
                        navigator.vibrate(30);
                    }
                    break;
                }
            }
        }, { passive: false });

        addEventListener('touchend', e => {
            // Check if any remaining touches are still on this button
            let stillPressed = false;
            for (let touch of e.touches) {
                if (this.isInside(touch.pageX, touch.pageY)) {
                    stillPressed = true;
                    break;
                }
            }
            if (!stillPressed) {
                this.pressed = false;
            }
        }, { passive: false });

        addEventListener('touchmove', e => {
            // Check if any touches are on this button
            let isPressed = false;
            for (let touch of e.touches) {
                if (this.isInside(touch.pageX, touch.pageY)) {
                    isPressed = true;
                    break;
                }
            }
            this.pressed = isPressed;
        }, { passive: false });

        // Mouse events for desktop testing
        addEventListener('mousedown', e => {
            if (this.isInside(e.pageX, e.pageY)) {
                this.pressed = true;
            }
        });

        addEventListener('mouseup', () => {
            this.pressed = false;
        });
    }

    isInside(x, y) {
        return x >= this.x && x <= this.x + this.width && 
               y >= this.y && y <= this.y + this.height;
    }

    draw(context) {
        // Unobtrusive design - subtle colors
        const fillColor = this.pressed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)';
        const borderColor = this.pressed ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)';
        
        // Draw button background
        context.fillStyle = fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw button border
        context.strokeStyle = borderColor;
        context.lineWidth = 1;
        context.strokeRect(this.x, this.y, this.width, this.height);

        // Draw arrow indicator
        context.fillStyle = this.pressed ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)';
        context.font = 'bold 16px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const arrow = this.direction === 'left' ? '←' : '→';
        context.fillText(arrow, centerX, centerY);
    }

    update(context) {
        this.draw(context);
    }
}

// Simple Jump Button class
class JumpButton {
    constructor(x, y, width, height, gameScene) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pressed = false;
        this.gameScene = gameScene;
        this.listener();
    }

    listener() {
        addEventListener('touchstart', e => {
            for (let touch of e.touches) {
                if (this.isInside(touch.pageX, touch.pageY)) {
                    e.preventDefault();
                    this.pressed = true;
                    this.jump();
                    if ('vibrate' in navigator) {
                        navigator.vibrate(50);
                    }
                    break;
                }
            }
        }, { passive: false });

        addEventListener('touchend', e => {
            // Check if any remaining touches are still on this button
            let stillPressed = false;
            for (let touch of e.touches) {
                if (this.isInside(touch.pageX, touch.pageY)) {
                    stillPressed = true;
                    break;
                }
            }
            if (!stillPressed) {
                this.pressed = false;
            }
        }, { passive: false });

        addEventListener('touchmove', e => {
            // Check if any touches are on this button
            let isPressed = false;
            for (let touch of e.touches) {
                if (this.isInside(touch.pageX, touch.pageY)) {
                    isPressed = true;
                    break;
                }
            }
            this.pressed = isPressed;
        }, { passive: false });

        // Mouse events for desktop testing
        addEventListener('mousedown', e => {
            if (this.isInside(e.pageX, e.pageY)) {
                this.pressed = true;
                this.jump();
            }
        });

        addEventListener('mouseup', () => {
            this.pressed = false;
        });
    }

    isInside(x, y) {
        return x >= this.x && x <= this.x + this.width && 
               y >= this.y && y <= this.y + this.height;
    }

    jump() {
        const gameScene = this.gameScene || window.game?.scene?.getScene('GameScene');
        if (!gameScene || !gameScene.puffy || !gameScene.puffy.sprite) return;

        // Only jump when on ground/platform
        if (gameScene.puffy.sprite.body.touching.down || gameScene.puffy.sprite.body.blocked.down) {
            gameScene.puffy.sprite.body.setVelocityY(-300);
            gameScene.puffy.playAnimation('walk_up');
        }
    }

    draw(context) {
        // Unobtrusive design - subtle colors with slight orange tint for jump
        const fillColor = this.pressed ? 'rgba(255, 180, 100, 0.4)' : 'rgba(255, 180, 100, 0.2)';
        const borderColor = this.pressed ? 'rgba(255, 180, 100, 0.8)' : 'rgba(255, 180, 100, 0.4)';
        
        // Draw button background
        context.fillStyle = fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw button border
        context.strokeStyle = borderColor;
        context.lineWidth = 1;
        context.strokeRect(this.x, this.y, this.width, this.height);

        // Draw jump indicator
        context.fillStyle = this.pressed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)';
        context.font = 'bold 16px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        context.fillText('↑', centerX, centerY);
    }

    update(context) {
        this.draw(context);
    }
}

// Main Game Class
class HopHopPuffGame {
    constructor() {
        console.log('🎮 Initializing Hop Hop Puff...');
        this.game = null;
        this.isMobile = 'ontouchstart' in window;
        this.leftButton = null;
        this.rightButton = null;
        this.jumpButton = null;
        this.controlsCanvas = null;
        this.controlsContext = null;
        this.init();
    }

    init() {
        console.log('📱 Device detected:', this.isMobile ? 'Mobile' : 'Desktop');
        this.setupPhaserConfig();
        this.createGame();
        
        // Always set up mobile controls on small screens
        if (this.isMobile || window.innerWidth <= 768) {
            console.log('🎮 Setting up mobile controls...');
            // Wait a bit for DOM to be ready
            setTimeout(() => {
                this.setupMobileControls();
            }, 100);
        }
    }

    setupPhaserConfig() {
        const baseWidth = 320;
        const baseHeight = 568;
        
        this.config = {
            type: Phaser.AUTO,
            width: baseWidth,
            height: baseHeight,
            parent: 'game-container',
            backgroundColor: '#87CEEB', // Sky blue
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 400 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 320,
                    height: 480
                },
                max: {
                    width: 800,
                    height: 1200
                }
            },
            render: {
                antialias: false,
                pixelArt: true
            },
            scene: [LoadingScene, GameScene]
        };
    }

    createGame() {
        console.log('🎮 Creating Phaser game...');
        this.game = new Phaser.Game(this.config);
        window.game = this.game;
        window.hopHopPuffGame = this;
    }

    setupMobileControls() {
        console.log('📱 Setting up mobile controls...');
        
        // Find or wait for canvas element
        this.controlsCanvas = document.getElementById('controls-canvas');
        if (!this.controlsCanvas) {
            console.error('❌ Controls canvas not found! Retrying in 500ms...');
            setTimeout(() => {
                this.setupMobileControls();
            }, 500);
            return;
        }

        console.log('✅ Controls canvas found, initializing...');
        this.controlsContext = this.controlsCanvas.getContext('2d');
        this.resizeCanvas();

        // Position buttons below ground level (unobtrusive)
        const buttonWidth = 60;
        const buttonHeight = 50;
        const bottomMargin = 40;
        const buttonSpacing = 10;
        
        // Left and right buttons on the left side
        const leftButtonX = 20;
        const rightButtonX = leftButtonX + buttonWidth + buttonSpacing;
        const movementButtonY = window.innerHeight - bottomMargin - buttonHeight;
        
        // Jump button on the right side, same level
        const jumpButtonX = window.innerWidth - 20 - buttonWidth;
        const jumpButtonY = movementButtonY;

        console.log(`⬅️ Creating left button at (${leftButtonX}, ${movementButtonY})`);
        console.log(`➡️ Creating right button at (${rightButtonX}, ${movementButtonY})`);
        console.log(`⬆️ Creating jump button at (${jumpButtonX}, ${jumpButtonY})`);

        this.leftButton = new MovementButton(leftButtonX, movementButtonY, buttonWidth, buttonHeight, 'left', null);
        this.rightButton = new MovementButton(rightButtonX, movementButtonY, buttonWidth, buttonHeight, 'right', null);
        this.jumpButton = new JumpButton(jumpButtonX, jumpButtonY, buttonWidth, buttonHeight, null);

        // Start rendering loop
        this.renderMobileControls();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.repositionControls();
        });
        
        console.log('✅ Mobile controls setup complete!');
    }

    resizeCanvas() {
        this.controlsCanvas.width = window.innerWidth;
        this.controlsCanvas.height = window.innerHeight;
        this.controlsCanvas.style.width = window.innerWidth + 'px';
        this.controlsCanvas.style.height = window.innerHeight + 'px';
    }

    repositionControls() {
        const buttonWidth = 60;
        const buttonHeight = 50;
        const bottomMargin = 40;
        const buttonSpacing = 10;
        
        // Reposition movement buttons
        const leftButtonX = 20;
        const rightButtonX = leftButtonX + buttonWidth + buttonSpacing;
        const movementButtonY = window.innerHeight - bottomMargin - buttonHeight;
        
        // Reposition jump button
        const jumpButtonX = window.innerWidth - 20 - buttonWidth;
        const jumpButtonY = movementButtonY;

        if (this.leftButton) {
            this.leftButton.x = leftButtonX;
            this.leftButton.y = movementButtonY;
        }
        if (this.rightButton) {
            this.rightButton.x = rightButtonX;
            this.rightButton.y = movementButtonY;
        }
        if (this.jumpButton) {
            this.jumpButton.x = jumpButtonX;
            this.jumpButton.y = jumpButtonY;
        }
        console.log('📐 Controls repositioned for window resize');
    }

    renderMobileControls() {
        const render = () => {
            if (!this.controlsContext) return;

            // Clear canvas
            this.controlsContext.clearRect(0, 0, this.controlsCanvas.width, this.controlsCanvas.height);

            // Update and draw all three buttons
            if (this.leftButton) {
                this.leftButton.update(this.controlsContext);
            }
            if (this.rightButton) {
                this.rightButton.update(this.controlsContext);
            }
            if (this.jumpButton) {
                this.jumpButton.update(this.controlsContext);
            }

            requestAnimationFrame(render);
        };
        render();
    }
}

// Loading Scene
class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        console.log('📦 Loading Scene: Basic assets...');
        
        // Create loading bar
        const { width, height } = this.cameras.main;
        const loadingText = this.add.text(width * 0.5, height * 0.4, '🐱 Hop Hop Puff', {
            fontSize: '24px',
            color: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);

        const progressBar = this.add.rectangle(width * 0.5, height * 0.6, 200, 20, 0x333333).setOrigin(0.5);
        const progressFill = this.add.rectangle(width * 0.5, height * 0.6, 0, 16, 0x00ffff).setOrigin(0.5);

        // Note: PuffySprite handles its own loading
        // Just load any basic assets here if needed

        // Update loading progress
        this.load.on('progress', (progress) => {
            progressFill.width = 196 * progress;
        });

        this.load.on('complete', () => {
            console.log('✅ Basic assets loaded, starting game...');
            this.scene.start('GameScene');
        });
        
        // Start loading (even if no assets, this will trigger complete)
        this.load.start();
    }
}

// Game Scene (simplified)
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.puffy = null;
        this.ground = null;
        this.block = null;
        this.cursors = null;
        this.isMoving = false;
        this.currentDirection = 'down';
        this.puffyCollisionsSetup = false; // Track collision setup
    }

    create() {
        const { width, height } = this.cameras.main;
        console.log(`🎮 Game Scene: Creating simplified game (${width}x${height})`);

        this.setupGameElements(width, height);
        this.setupKeyboardControls();
    }

    setupGameElements(width, height) {
        // Create ground (simple green rectangle)
        this.ground = this.add.rectangle(width * 0.5, height - 20, width, 40, 0x228B22);
        this.physics.add.existing(this.ground, true); // Static body

        // Create single block platform
        this.block = this.add.rectangle(width * 0.7, height - 80, 60, 24, 0x8B4513);
        this.block.setStrokeStyle(2, 0x654321);
        this.physics.add.existing(this.block, true); // Static body

        // Create Puffy and set up collision checking
        this.puffy = new PuffySprite(this);
        this.setupPuffyWhenReady(width, height);

        console.log('✅ Game elements created: Puffy, ground, and one block');
    }

    setupPuffyWhenReady(width, height) {
        // Check for Puffy sprite sheet readiness and create sprite
        const checkPuffyReady = () => {
            if (this.puffy && this.puffy.spriteSheetReady && !this.puffy.sprite) {
                console.log('✅ Puffy sprite sheet is ready! Creating sprite...');
                
                // Create sprite at correct position
                const targetX = width * 0.3;
                const targetY = height - 60;
                this.puffy.createSprite(targetX, targetY);
                this.puffy.startInitialAnimation();
                
                // Set up collisions (only once)
                if (!this.puffyCollisionsSetup) {
                    this.physics.add.collider(this.puffy.sprite, this.ground);
                    this.physics.add.collider(this.puffy.sprite, this.block);
                    this.puffyCollisionsSetup = true;
                    console.log('✅ Puffy sprite created and collisions set up successfully');
                }
                
            } else if (!this.puffy || !this.puffy.spriteSheetReady) {
                // Check again in 100ms if not ready yet
                this.time.delayedCall(100, checkPuffyReady);
            }
        };
        
        // Start checking immediately
        checkPuffyReady();
    }

    setupKeyboardControls() {
        this.cursors = this.input.keyboard.addKeys('W,S,A,D');
        console.log('⌨️ Keyboard controls ready (WASD)');
    }

    update() {
        if (!this.puffy || !this.puffy.sprite) return;

        const speed = 120;
        let isMovingHorizontally = false;

        // Check mobile button states
        const hopHopPuffGame = window.hopHopPuffGame;
        const leftPressed = hopHopPuffGame && hopHopPuffGame.leftButton && hopHopPuffGame.leftButton.pressed;
        const rightPressed = hopHopPuffGame && hopHopPuffGame.rightButton && hopHopPuffGame.rightButton.pressed;

        // Handle horizontal movement (keyboard OR mobile buttons)
        if (this.cursors.A.isDown || leftPressed) {
            this.puffy.sprite.body.setVelocityX(-speed);
            this.puffy.playAnimation('walk_left');
            this.currentDirection = 'left';
            isMovingHorizontally = true;
        } else if (this.cursors.D.isDown || rightPressed) {
            this.puffy.sprite.body.setVelocityX(speed);
            this.puffy.playAnimation('walk_right');
            this.currentDirection = 'right';
            isMovingHorizontally = true;
        } else {
            this.puffy.sprite.body.setVelocityX(0);
            if (this.isMoving && !isMovingHorizontally) {
                const lastDirection = this.currentDirection || 'down';
                this.puffy.playAnimation(`idle_${lastDirection}`);
            }
        }

        // Handle jump (W key)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.W)) {
            if (this.puffy.sprite.body.touching.down || this.puffy.sprite.body.blocked.down) {
                this.puffy.sprite.body.setVelocityY(-300);
                this.puffy.playAnimation('walk_up');
            }
        }

        // Handle down movement (S key)
        if (this.cursors.S.isDown) {
            this.puffy.playAnimation('walk_down');
            this.currentDirection = 'down';
        }

        this.isMoving = isMovingHorizontally;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, starting Hop Hop Puff...');
    
    // Hide loading screen immediately since we're going straight to game
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    window.hopHopPuffGame = new HopHopPuffGame();
});

console.log('✅ Hop Hop Puff main.js loaded successfully!'); 