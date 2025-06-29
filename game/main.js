// Hop Hop Puff - Mobile-First Phaser.js Game Engine
// Phase 0.2: Mobile-First Phaser.js Setup

console.log('🐱 Hop Hop Puff - Loading mobile-first game engine...');

class HopHopPuffGame {
    constructor() {
        this.config = null;
        this.game = null;
        this.isLoading = true;
        
        // Mobile-first configuration
        this.mobileConfig = {
            width: 320,        // iPhone base width from spec
            height: 568,       // Adjusted for better mobile fit
            targetFPS: 60      // 60 FPS requirement
        };
        
        this.init();
    }
    
    init() {
        console.log('🎮 Initializing mobile-first Phaser.js configuration...');
        this.detectDevice();
        this.setupPhaserConfig();
        this.createGame();
    }
    
    detectDevice() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        console.log(`📱 Device detected: ${width}x${height}`);
        console.log(`🖥️ Device pixel ratio: ${window.devicePixelRatio || 1}`);
        console.log(`👆 Touch support: ${'ontouchstart' in window ? 'Yes' : 'No'}`);
        
        // Update UI with device info
        this.updateLoadingInfo(`Device: ${width}x${height}`);
    }
    
    setupPhaserConfig() {
        // Mobile-first Phaser.js configuration matching todo.md Phase 0.2
        this.config = {
            type: Phaser.AUTO,
            width: this.mobileConfig.width,
            height: this.mobileConfig.height,
            parent: 'game-container',
            backgroundColor: '#2D1B69', // Kitchen theme background
            
            // Mobile-first responsive scaling (spec requirement)
            scale: {
                mode: Phaser.Scale.FIT,
                parent: 'game-container',
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: this.mobileConfig.width,
                height: this.mobileConfig.height
            },
            
            // Performance settings for mobile
            render: {
                antialias: false,        // Better mobile performance
                pixelArt: true,         // Crisp sprite rendering
                roundPixels: true       // Prevent sub-pixel rendering
            },
            
            // Physics for future platform/ladder collision
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },  // Gravity for falling mechanics
                    debug: false          // Turn on for debugging
                }
            },
            
            // Game scenes (will be expanded in Phase 1+)
            scene: [
                LoadingScene,
                MainMenuScene,
                GameScene,
                PauseScene,
                GameOverScene
            ]
        };
        
        console.log('⚙️ Phaser.js config created for mobile-first rendering');
    }
    
    createGame() {
        try {
            console.log('🚀 Creating Phaser.js game instance...');
            this.game = new Phaser.Game(this.config);
            
            // Game creation successful
            this.updateLoadingInfo('Game engine loaded ✅');
            
            // Hide loading screen after short delay
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Failed to create Phaser.js game:', error);
            this.updateLoadingInfo('Failed to load game engine ❌');
        }
    }
    
    updateLoadingInfo(message) {
        const loadingElement = document.querySelector('#loading-screen p');
        if (loadingElement) {
            loadingElement.textContent = message;
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
                console.log('🎮 Game ready for mobile and desktop play!');
            }, 500);
        }
    }
}

// Loading Scene - First scene to load
class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }
    
    preload() {
        console.log('📦 Loading Scene: Preparing game assets...');
        
        // Create loading bar
        this.createLoadingBar();
        
        // Load placeholder assets (will be replaced with real assets in Phase 1+)
        this.loadPlaceholderAssets();
    }
    
    create() {
        console.log('✅ Loading Scene: Assets loaded, transitioning to menu...');
        
        // Transition to main menu after brief delay
        this.time.delayedCall(1000, () => {
            this.scene.start('MainMenuScene');
        });
    }
    
    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Loading bar background
        const bgBar = this.add.graphics();
        bgBar.fillStyle(0x000000, 0.3);
        bgBar.fillRect(width * 0.1, height * 0.5, width * 0.8, 20);
        
        // Loading bar fill
        const fillBar = this.add.graphics();
        
        // Update loading bar as assets load
        this.load.on('progress', (value) => {
            fillBar.clear();
            fillBar.fillStyle(0x00ffff, 1);
            fillBar.fillRect(width * 0.1, height * 0.5, width * 0.8 * value, 20);
        });
        
        // Loading text
        this.add.text(width * 0.5, height * 0.4, 'Loading Puffy\'s Kitchen Adventure...', {
            fontSize: '16px',
            color: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    loadPlaceholderAssets() {
        console.log('📦 Loading placeholder assets...');
        
        // Note: Puffy sprite will be loaded in GameScene
        
        // Keep platform and other placeholders for now (Phase 3)
        this.add.graphics()
            .fillStyle(0x8b4513)
            .fillRect(0, 0, 200, 20)
            .generateTexture('platform-placeholder', 200, 20);
        
        this.add.graphics()
            .fillStyle(0xdaa520)
            .fillRect(0, 0, 20, 100)
            .generateTexture('ladder-placeholder', 20, 100);
        
        this.add.graphics()
            .fillStyle(0x654321)
            .fillRect(0, 0, 32, 16)
            .generateTexture('jerky-placeholder', 32, 16);
        
        console.log('✅ Real Puffy sprite sheet loaded with 16 frames!');
    }
}

// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }
    
    create() {
        console.log('🏠 Main Menu: Creating mobile-first menu interface...');
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Game title
        this.add.text(width * 0.5, height * 0.2, '🐱 Hop Hop Puff', {
            fontSize: '32px',
            color: '#00ffff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(width * 0.5, height * 0.3, 'Help Puffy reach the beef jerky!', {
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Play button (touch-friendly size)
        const playButton = this.add.text(width * 0.5, height * 0.5, '▶️ PLAY', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#00ffff',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5);
        
        // Make play button interactive
        playButton.setInteractive({ useHandCursor: true });
        
        // Touch and mouse support
        playButton.on('pointerdown', () => {
            console.log('🎮 Starting game...');
            this.scene.start('GameScene');
        });
        
        // Touch feedback
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
        });
        
        playButton.on('pointerout', () => {
            playButton.setScale(1);
        });
        
        // Instructions for mobile/desktop
        const isMobile = 'ontouchstart' in window;
        const controlText = isMobile ? 
            'Use virtual D-pad to move Puffy' : 
            'Use WASD keys to move Puffy';
            
        this.add.text(width * 0.5, height * 0.7, controlText, {
            fontSize: '12px',
            color: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);
    }
}

// Game Scene (simplified - basic movement only)
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Initialize basic game state
        this.puffy = null;
        this.ground = null;
        this.blocks = null; // Physics group for blocks
        this.blockArray = []; // Array to track individual blocks
        this.cursors = null;
        this.isMoving = false;
        this.currentDirection = null;
        
        // Block properties
        this.blockSize = 24; // Half of Puffy's display size
    }
    
    create() {
        console.log('🎮 Basic Movement Scene: Just Puffy walking around...');
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Set scene background
        this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue
        
        // Create simple ground
        this.ground = this.add.rectangle(width * 0.5, height - 20, width, 40, 0x8b4513);
        this.ground.setStrokeStyle(2, 0x654321);
        this.physics.add.existing(this.ground, true); // Static body
        
        // Initialize blocks group for collision detection
        this.blocks = this.physics.add.staticGroup();
        
        // Create some test blocks to demonstrate functionality
        this.createTestBlocks(width, height);
        
        // Create Puffy sprite
        console.log('🐱 Creating Puffy sprite...');
        this.puffy = new PuffySprite(this);
        
        // Set up Puffy positioning and controls immediately after creation
        this.setupPuffyWhenReady(width, height);
        
        // Add simple UI text
        this.add.text(width * 0.5, 30, 'Hop Hop Puff - Basic Movement', {
            fontSize: '24px',
            color: '#000080',
            align: 'center',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(width * 0.5, 60, 'Use WASD or virtual D-pad to move around', {
            fontSize: '16px',
            color: '#000080',
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(width * 0.5, 80, '🧱 Jump on blocks and platforms! 🧱', {
            fontSize: '14px',
            color: '#8B4513',
            align: 'center'
        }).setOrigin(0.5);
        
        // Back to menu button
        const backButton = this.add.text(width * 0.5, height * 0.05, '← Menu', {
            fontSize: '12px',
            color: '#ffffff',
            backgroundColor: '#666666',
            padding: { x: 8, y: 4 },
            align: 'center'
        }).setOrigin(0.5);
        
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }

    setupPuffyWhenReady(width, height) {
        // Check if Puffy is ready immediately, or wait for it
        const checkPuffyReady = () => {
            if (this.puffy.isReady) {
                console.log('✅ Puffy is ready! Setting up on ground level...');
                
                // Position Puffy on the ground (not above it)
                this.puffy.sprite.setPosition(width * 0.5, height - 60);
                
                // Set up collision with ground and blocks
                this.physics.add.collider(this.puffy.sprite, this.ground);
                this.physics.add.collider(this.puffy.sprite, this.blocks);
                
                // Set up movement controls
                this.setupMovementControls();
                
                console.log('🎮 Basic movement ready! Use WASD or virtual D-pad to move.');
            } else {
                // Check again in 100ms if not ready yet
                this.time.delayedCall(100, checkPuffyReady);
            }
        };
        
        // Start checking immediately
        checkPuffyReady();
    }

    makeBlock(x, y, color = 0x8B4513) {
        console.log(`🧱 Creating block at (${x}, ${y})`);
        
        // Create a rectangular block sprite
        const block = this.add.rectangle(x, y, this.blockSize, this.blockSize, color);
        
        // Add visual styling
        block.setStrokeStyle(2, 0x654321); // Darker brown border
        
        // Add physics body as static (won't move)
        this.physics.add.existing(block, true);
        
        // Add to blocks group for collision detection
        this.blocks.add(block);
        
        // Store in array for easy access
        this.blockArray.push(block);
        
        console.log(`✅ Block created at (${x}, ${y}) - Total blocks: ${this.blockArray.length}`);
        
        return block;
    }

    createTestBlocks(width, height) {
        console.log('🧱 Creating single test block on ground...');
        
        // Create just one block on the ground level
        this.makeBlock(width * 0.5 + 60, height - 40 - this.blockSize/2);
        
        console.log(`✅ Created ${this.blockArray.length} test block`);
    }

    clearAllBlocks() {
        console.log('🗑️ Clearing all blocks...');
        
        // Remove all blocks from the scene
        this.blockArray.forEach(block => {
            block.destroy();
        });
        
        // Clear the blocks group
        this.blocks.clear(true);
        
        // Reset the array
        this.blockArray = [];
        
        console.log('✅ All blocks cleared');
    }

    setupMovementControls() {
        // Desktop keyboard controls (WASD)
        this.cursors = this.input.keyboard.addKeys('W,S,A,D');
        
        // Mobile virtual joystick
        this.setupVirtualJoystick();
        this.setupJumpButton();
        
        // Initialize joystick state
        this.joystickState = {
            active: false,
            x: 0,
            y: 0,
            centerX: 0,
            centerY: 0,
            maxDistance: 35 // Half of joystick base radius (60px)
        };
    }
    
    setupVirtualJoystick() {
        console.log('🔍 Setting up virtual joystick...');
        
        const joystickBase = document.getElementById('joystick-base');
        const joystickKnob = document.getElementById('joystick-knob');
        
        console.log('🔍 Joystick base element:', joystickBase);
        console.log('🔍 Joystick knob element:', joystickKnob);
        
        if (!joystickBase || !joystickKnob) {
            console.log('⚠️ Virtual joystick elements not found, retrying in 500ms...');
            // Retry after a delay to ensure DOM is fully loaded
            setTimeout(() => {
                this.setupVirtualJoystick();
            }, 500);
            return;
        }
        
        // Get joystick center position
        const updateJoystickCenter = () => {
            const rect = joystickBase.getBoundingClientRect();
            this.joystickState.centerX = rect.left + rect.width / 2;
            this.joystickState.centerY = rect.top + rect.height / 2;
        };
        
        updateJoystickCenter();
        window.addEventListener('resize', updateJoystickCenter);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateJoystickCenter, 200);
        });
        
        // Touch events for joystick
        const handleTouchStart = (e) => {
            e.preventDefault();
            this.joystickState.active = true;
            joystickKnob.classList.add('dragging');
            updateJoystickCenter();
            
            // Immediately position knob at touch location
            const touch = e.touches ? e.touches[0] : e;
            const deltaX = touch.clientX - this.joystickState.centerX;
            const deltaY = touch.clientY - this.joystickState.centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const limitedDistance = Math.min(distance, this.joystickState.maxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            
            const finalX = Math.cos(angle) * limitedDistance;
            const finalY = Math.sin(angle) * limitedDistance;
            
            joystickKnob.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;
            
            this.joystickState.x = finalX / this.joystickState.maxDistance;
            this.joystickState.y = finalY / this.joystickState.maxDistance;
            
            // Apply movement immediately
            this.handleJoystickMovement();
            
            // Add haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(30);
            }
            
            console.log('🕹️ Joystick activated - touch detected!');
        };
        
        const handleTouchMove = (e) => {
            if (!this.joystickState.active) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.joystickState.centerX;
            const deltaY = touch.clientY - this.joystickState.centerY;
            
            // Calculate distance from center
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Limit to joystick bounds
            const limitedDistance = Math.min(distance, this.joystickState.maxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            
            // Calculate final position
            const finalX = Math.cos(angle) * limitedDistance;
            const finalY = Math.sin(angle) * limitedDistance;
            
            // Update knob position
            joystickKnob.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;
            
            // Update joystick state (normalized -1 to 1)
            this.joystickState.x = finalX / this.joystickState.maxDistance;
            this.joystickState.y = finalY / this.joystickState.maxDistance;
            
            // Apply movement
            this.handleJoystickMovement();
        };
        
        const handleTouchEnd = (e) => {
            e.preventDefault();
            this.joystickState.active = false;
            joystickKnob.classList.remove('dragging');
            
            // Reset knob position
            joystickKnob.style.transform = 'translate(-50%, -50%)';
            
            // Reset joystick state
            this.joystickState.x = 0;
            this.joystickState.y = 0;
            
            // Stop movement
            this.stopMovement();
            
            console.log('🕹️ Joystick deactivated');
        };
        
        // Add touch event listeners to the BASE (larger touch area), not just the knob
        joystickBase.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Mouse events for desktop testing - also attach to base for larger click area
        joystickBase.addEventListener('mousedown', handleTouchStart);
        document.addEventListener('mousemove', (e) => {
            if (!this.joystickState.active) return;
            
            const deltaX = e.clientX - this.joystickState.centerX;
            const deltaY = e.clientY - this.joystickState.centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const limitedDistance = Math.min(distance, this.joystickState.maxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            
            const finalX = Math.cos(angle) * limitedDistance;
            const finalY = Math.sin(angle) * limitedDistance;
            
            joystickKnob.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;
            
            this.joystickState.x = finalX / this.joystickState.maxDistance;
            this.joystickState.y = finalY / this.joystickState.maxDistance;
            
            this.handleJoystickMovement();
        });
        
        document.addEventListener('mouseup', handleTouchEnd);
        
        console.log('🕹️ Virtual joystick setup complete');
    }
    
    setupJumpButton() {
        console.log('🔍 Setting up jump button...');
        
        const jumpBtn = document.getElementById('jump-btn');
        
        console.log('🔍 Jump button element:', jumpBtn);
        
        if (!jumpBtn) {
            console.log('⚠️ Jump button not found, retrying in 500ms...');
            // Retry after a delay to ensure DOM is fully loaded
            setTimeout(() => {
                this.setupJumpButton();
            }, 500);
            return;
        }
        
        // Touch events
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jumpBtn.classList.add('pressed');
            this.handleJump();
        }, { passive: false });
        
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            jumpBtn.classList.remove('pressed');
        }, { passive: false });
        
        // Mouse events for desktop testing
        jumpBtn.addEventListener('mousedown', (e) => {
            jumpBtn.classList.add('pressed');
            this.handleJump();
        });
        
        jumpBtn.addEventListener('mouseup', (e) => {
            jumpBtn.classList.remove('pressed');
        });
        
        console.log('⬆️ Jump button setup complete');
    }
    
    handleJoystickMovement() {
        if (!this.puffy || !this.puffy.sprite || !this.puffy.sprite.body) {
            console.log('⚠️ Puffy not ready for joystick movement');
            return;
        }
        
        const speed = this.puffy.speed || 100;
        const deadZone = 0.2; // Prevent tiny movements
        
        console.log('🕹️ Joystick movement:', this.joystickState.x.toFixed(2), this.joystickState.y.toFixed(2));
        
        // Handle horizontal movement
        if (Math.abs(this.joystickState.x) > deadZone) {
            const velocityX = this.joystickState.x * speed;
            this.puffy.sprite.body.setVelocityX(velocityX);
            
            // Set animation based on direction
            if (this.joystickState.x < 0) {
                this.puffy.playAnimation('walk_left');
                this.currentDirection = 'left';
            } else {
                this.puffy.playAnimation('walk_right');
                this.currentDirection = 'right';
            }
            
            this.isMoving = true;
        } else {
            // Stop horizontal movement if joystick is centered
            this.puffy.sprite.body.setVelocityX(0);
            
            if (this.isMoving) {
                const lastDirection = this.currentDirection || 'down';
                this.puffy.playAnimation(`idle_${lastDirection}`);
                this.isMoving = false;
            }
        }
        
        // Note: Vertical movement (jumping) is handled by separate jump button
        // This allows for more precise jump control while maintaining movement
    }
    
    handleJump() {
        if (!this.puffy || !this.puffy.sprite || !this.puffy.sprite.body) return;
        
        // Only jump if on ground or platform
        if (this.puffy.sprite.body.touching.down || this.puffy.sprite.body.blocked.down) {
            this.puffy.sprite.body.setVelocityY(-250); // Strong jump
            this.puffy.playAnimation('walk_up');
            
            console.log('🐱 Puffy jumping!');
            
            // Haptic feedback for jump (if supported)
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }
    }

    startMovement(direction) {
        if (!this.puffy || !this.puffy.sprite) return;
        
        this.currentDirection = direction;
        this.isMoving = true;
        
        // Simple movement without ladder logic
        this.handleBasicMovement(direction);
        
        console.log(`🐱 Puffy moving ${direction}`);
    }

    handleBasicMovement(direction) {
        if (!this.puffy || !this.puffy.sprite || !this.puffy.sprite.body) return;
        
        const speed = this.puffy.speed || 100;
        
        switch (direction) {
            case 'left':
                this.puffy.sprite.body.setVelocityX(-speed);
                this.puffy.playAnimation('walk_left');
                break;
                
            case 'right':
                this.puffy.sprite.body.setVelocityX(speed);
                this.puffy.playAnimation('walk_right');
                break;
                
            case 'up':
                // Small jump for keyboard/legacy controls
                if (this.puffy.sprite.body.touching.down) {
                    this.puffy.sprite.body.setVelocityY(-200);
                    this.puffy.playAnimation('walk_up');
                }
                break;
                
            case 'down':
                // Just play animation, let gravity handle downward movement
                this.puffy.playAnimation('walk_down');
                break;
        }
    }
    
    stopMovement() {
        if (!this.puffy || !this.puffy.sprite) return;
        
        this.isMoving = false;
        
        // Stop horizontal movement only
        this.puffy.sprite.body.setVelocityX(0);
        
        // Switch to idle animation based on last direction
        const lastDirection = this.currentDirection || 'down';
        this.puffy.playAnimation(`idle_${lastDirection}`);
        
        console.log(`🐱 Puffy stopped`);
    }
    
    update() {
        // Handle keyboard input (desktop) with new joystick-style controls
        if (!this.puffy || !this.puffy.sprite || !this.puffy.sprite.body) return;
        
        const speed = this.puffy.speed || 100;
        let isMovingHorizontally = false;
        
        // Handle horizontal movement
        if (this.cursors && this.cursors.A.isDown) {
            this.puffy.sprite.body.setVelocityX(-speed);
            this.puffy.playAnimation('walk_left');
            this.currentDirection = 'left';
            isMovingHorizontally = true;
        } else if (this.cursors && this.cursors.D.isDown) {
            this.puffy.sprite.body.setVelocityX(speed);
            this.puffy.playAnimation('walk_right');
            this.currentDirection = 'right';
            isMovingHorizontally = true;
        } else {
            // Stop horizontal movement if no keys pressed
            this.puffy.sprite.body.setVelocityX(0);
            
            if (this.isMoving && !isMovingHorizontally) {
                const lastDirection = this.currentDirection || 'down';
                this.puffy.playAnimation(`idle_${lastDirection}`);
            }
        }
        
        // Handle jump (W key)
        if (this.cursors && Phaser.Input.Keyboard.JustDown(this.cursors.W)) {
            this.handleJump();
        }
        
        // Handle down movement (S key) - just animation for now
        if (this.cursors && this.cursors.S.isDown) {
            this.puffy.playAnimation('walk_down');
            this.currentDirection = 'down';
        }
        
        // Update movement state
        this.isMoving = isMovingHorizontally;
        
        // Pause functionality (P key)
        if (this.cursors && Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('P'))) {
            this.scene.pause();
            this.scene.launch('PauseScene');
        }
    }
}

// Pause Scene (placeholder)
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }
    
    create() {
        console.log('⏸️ Pause Scene: Game paused');
        // Placeholder for Phase 5: Game State Management
    }
}

// Game Over Scene (placeholder)
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    create() {
        console.log('💀 Game Over Scene: Showing results');
        // Placeholder for Phase 5: Game State Management
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, creating mobile-first Hop Hop Puff game...');
    window.hopHopPuffGame = new HopHopPuffGame();
});

// Handle window resize for responsive scaling
window.addEventListener('resize', () => {
    if (window.hopHopPuffGame && window.hopHopPuffGame.game) {
        console.log('📐 Window resized, updating game scale...');
        // Phaser will handle responsive scaling automatically
    }
});

console.log('✅ Hop Hop Puff main.js loaded successfully!'); 