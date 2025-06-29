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
class WorkingJoystick {
    constructor(x, y, radius, handleRadius, gameScene) {
        this.pos = new Vector2(x, y);
        this.origin = new Vector2(x, y);
        this.radius = radius;
        this.handleRadius = handleRadius;
        this.handleFriction = 0.25;
        this.ondrag = false;
        this.touchPos = new Vector2(0, 0);
        this.gameScene = gameScene;
        this.listener();
    }

    listener() {
        // Touch Events
        addEventListener('touchstart', e => {
            e.preventDefault();
            this.touchPos = new Vector2(e.touches[0].pageX, e.touches[0].pageY);
            if (this.touchPos.sub(this.origin).mag() <= this.radius) {
                this.ondrag = true;
                if ('vibrate' in navigator) {
                    navigator.vibrate(30);
                }
            }
        }, { passive: false });

        addEventListener('touchend', e => {
            e.preventDefault();
            this.ondrag = false;
        }, { passive: false });

        addEventListener('touchmove', e => {
            e.preventDefault();
            this.touchPos = new Vector2(e.touches[0].pageX, e.touches[0].pageY);
        }, { passive: false });

        // Mouse Events for desktop
        addEventListener('mousedown', e => {
            this.touchPos = new Vector2(e.pageX, e.pageY);
            if (this.touchPos.sub(this.origin).mag() <= this.radius) {
                this.ondrag = true;
            }
        });

        addEventListener('mouseup', () => {
            this.ondrag = false;
        });

        addEventListener('mousemove', e => {
            this.touchPos = new Vector2(e.pageX, e.pageY);
        });
    }

    reposition() {
        if (!this.ondrag) {
            this.pos = this.pos.add(this.origin.sub(this.pos).mul(this.handleFriction));
        } else {
            const diff = this.touchPos.sub(this.origin);
            const maxDist = Math.min(diff.mag(), this.radius);
            this.pos = this.origin.add(diff.normalize().mul(maxDist));
        }
    }

    draw(context) {
        // Draw joystick base (cyan with glow)
        context.shadowColor = '#00ffff';
        context.shadowBlur = 20;
        context.beginPath();
        context.fillStyle = 'rgba(0, 255, 255, 0.3)';
        context.arc(this.origin.x, this.origin.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();

        // Draw joystick border
        context.shadowBlur = 0;
        context.beginPath();
        context.strokeStyle = '#00ffff';
        context.lineWidth = 3;
        context.arc(this.origin.x, this.origin.y, this.radius, 0, Math.PI * 2);
        context.stroke();

        // Draw joystick handle (white)
        context.shadowColor = '#ffffff';
        context.shadowBlur = 10;
        context.beginPath();
        context.fillStyle = '#ffffff';
        context.arc(this.pos.x, this.pos.y, this.handleRadius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.shadowBlur = 0;
    }

    update(context) {
        this.reposition();
        this.draw(context);
        this.controlPuffy();
    }

    controlPuffy() {
        // Get game scene dynamically
        const gameScene = this.gameScene || window.game?.scene?.getScene('GameScene');
        if (!gameScene || !gameScene.puffy || !gameScene.puffy.sprite) return;

        const diff = this.pos.sub(this.origin);
        const normalizedX = diff.x / this.radius;
        const deadZone = 0.2;

        // Handle horizontal movement
        if (Math.abs(normalizedX) > deadZone) {
            const speed = 120;
            const velocityX = normalizedX * speed;
            gameScene.puffy.sprite.body.setVelocityX(velocityX);

            // Set animation based on direction
            if (normalizedX < 0) {
                gameScene.puffy.playAnimation('walk_left');
                gameScene.currentDirection = 'left';
            } else {
                gameScene.puffy.playAnimation('walk_right');
                gameScene.currentDirection = 'right';
            }
            gameScene.isMoving = true;
        } else {
            // Stop horizontal movement
            gameScene.puffy.sprite.body.setVelocityX(0);
            if (gameScene.isMoving) {
                const lastDirection = gameScene.currentDirection || 'down';
                gameScene.puffy.playAnimation(`idle_${lastDirection}`);
                gameScene.isMoving = false;
            }
        }
    }
}

// Working Jump Button class
class WorkingJumpButton {
    constructor(x, y, radius, gameScene) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.pressed = false;
        this.gameScene = gameScene;
        this.listener();
    }

    listener() {
        addEventListener('touchstart', e => {
            const touch = e.touches[0];
            const dist = Math.sqrt((touch.pageX - this.x) ** 2 + (touch.pageY - this.y) ** 2);
            if (dist <= this.radius) {
                e.preventDefault();
                this.pressed = true;
                this.jump();
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            }
        }, { passive: false });

        addEventListener('touchend', () => {
            this.pressed = false;
        }, { passive: false });

        addEventListener('mousedown', e => {
            const dist = Math.sqrt((e.pageX - this.x) ** 2 + (e.pageY - this.y) ** 2);
            if (dist <= this.radius) {
                this.pressed = true;
                this.jump();
            }
        });

        addEventListener('mouseup', () => {
            this.pressed = false;
        });
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
        // Draw jump button (orange with glow)
        context.shadowColor = '#ff6600';
        context.shadowBlur = this.pressed ? 30 : 15;
        context.beginPath();
        context.fillStyle = this.pressed ? 'rgba(255, 102, 0, 0.8)' : 'rgba(255, 102, 0, 0.6)';
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();

        // Draw jump button border
        context.shadowBlur = 0;
        context.beginPath();
        context.strokeStyle = '#ff6600';
        context.lineWidth = 3;
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();

        // Draw "JUMP" text
        context.fillStyle = '#ffffff';
        context.font = 'bold 12px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('JUMP', this.x, this.y);
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
        this.joystick = null;
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

        // Create joystick and jump button
        const joystickX = 100;
        const joystickY = window.innerHeight - 120;
        const jumpButtonX = window.innerWidth - 100;
        const jumpButtonY = window.innerHeight - 120;

        console.log(`🕹️ Creating joystick at (${joystickX}, ${joystickY})`);
        console.log(`⬆️ Creating jump button at (${jumpButtonX}, ${jumpButtonY})`);

        this.joystick = new WorkingJoystick(joystickX, joystickY, 60, 25, null);
        this.jumpButton = new WorkingJumpButton(jumpButtonX, jumpButtonY, 40, null);

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
        if (this.joystick) {
            this.joystick.origin.x = 100;
            this.joystick.origin.y = window.innerHeight - 120;
            this.joystick.pos.x = this.joystick.origin.x;
            this.joystick.pos.y = this.joystick.origin.y;
        }
        if (this.jumpButton) {
            this.jumpButton.x = window.innerWidth - 100;
            this.jumpButton.y = window.innerHeight - 120;
        }
        console.log('📐 Controls repositioned for window resize');
    }

    renderMobileControls() {
        const render = () => {
            if (!this.controlsContext) return;

            // Clear canvas
            this.controlsContext.clearRect(0, 0, this.controlsCanvas.width, this.controlsCanvas.height);

            // Update and draw controls
            if (this.joystick) {
                this.joystick.update(this.controlsContext);
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

        // Create Puffy (position will be set after sprite is ready)
        this.puffy = new PuffySprite(this);
        
        // Wait for Puffy to be ready before setting up collisions
        this.time.delayedCall(100, () => {
            if (this.puffy.isReady && this.puffy.sprite) {
                // Position Puffy
                this.puffy.sprite.setPosition(width * 0.3, height - 60);
                
                // Set up collisions
                this.physics.add.collider(this.puffy.sprite, this.ground);
                this.physics.add.collider(this.puffy.sprite, this.block);
                
                console.log('✅ Puffy positioned and collisions set up');
            } else {
                // Retry if not ready
                this.time.delayedCall(100, () => {
                    if (this.puffy.isReady && this.puffy.sprite) {
                        this.puffy.sprite.setPosition(width * 0.3, height - 60);
                        this.physics.add.collider(this.puffy.sprite, this.ground);
                        this.physics.add.collider(this.puffy.sprite, this.block);
                        console.log('✅ Puffy positioned and collisions set up (retry)');
                    }
                });
            }
        });

        console.log('✅ Game elements created: Puffy, ground, and one block');
    }

    setupKeyboardControls() {
        this.cursors = this.input.keyboard.addKeys('W,S,A,D');
        console.log('⌨️ Keyboard controls ready (WASD)');
    }

    update() {
        if (!this.puffy || !this.puffy.sprite) return;

        const speed = 120;
        let isMovingHorizontally = false;

        // Handle horizontal movement (A/D keys)
        if (this.cursors.A.isDown) {
            this.puffy.sprite.body.setVelocityX(-speed);
            this.puffy.playAnimation('walk_left');
            this.currentDirection = 'left';
            isMovingHorizontally = true;
        } else if (this.cursors.D.isDown) {
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