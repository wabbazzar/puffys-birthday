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

        // Position buttons INSIDE THE GREEN GROUND AREA (taller ground: 60px)
        // The ground is now 60px tall (from height-60 to height)
        // But we need to map this to screen coordinates, not game coordinates
        const gameContainer = document.getElementById('game-container');
        const gameCanvas = gameContainer ? gameContainer.querySelector('canvas') : null;
        
        // Calculate the actual rendered ground area on screen
        const windowHeight = window.innerHeight;
        const groundHeightPx = 60; // Ground is now 60px tall
        const groundScreenTop = windowHeight - groundHeightPx;
        const groundScreenBottom = windowHeight;
        
        const buttonWidth = 60;
        const buttonHeight = 40; // Increased to fit better in 60px ground area  
        const groundMargin = 10; // Margin from ground edges
        const buttonSpacing = 10;
        
        // Position buttons within the visual ground area on screen
        const leftButtonX = 20;
        const rightButtonX = leftButtonX + buttonWidth + buttonSpacing;
        // Position in the lower part of the ground area for better visibility
        const movementButtonY = groundScreenTop + groundMargin;
        
        // Jump button on the right side, within ground area
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
        // Reposition buttons INSIDE THE GREEN GROUND AREA (consistent with setupMobileControls)
        const windowHeight = window.innerHeight;
        const groundHeightPx = 60; // Taller ground area
        const groundScreenTop = windowHeight - groundHeightPx;
        
        const buttonWidth = 60;
        const buttonHeight = 40;
        const groundMargin = 10;
        const buttonSpacing = 10;
        
        // Reposition movement buttons within visual ground area
        const leftButtonX = 20;
        const rightButtonX = leftButtonX + buttonWidth + buttonSpacing;
        const movementButtonY = groundScreenTop + groundMargin;
        
        // Reposition jump button within ground area
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
        console.log('📦 Loading Scene: Basic assets + birthday assets...');
        
        // Create loading bar
        const { width, height } = this.cameras.main;
        const loadingText = this.add.text(width * 0.5, height * 0.4, '🐱 Hop Hop Puff', {
            fontSize: '24px',
            color: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);

        const progressBar = this.add.rectangle(width * 0.5, height * 0.6, 200, 20, 0x333333).setOrigin(0.5);
        const progressFill = this.add.rectangle(width * 0.5, height * 0.6, 0, 16, 0x00ffff).setOrigin(0.5);

        // Load birthday assets - Following Phaser.js Framework Priority (Rule 3)
        this.load.image('gift', 'assets/gift.png');
        this.load.image('puffy_winks', 'assets/puffy_winks.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('background', 'assets/background.png');

        // Note: PuffySprite handles its own loading
        // Basic assets loaded here for birthday feature

        // Update loading progress
        this.load.on('progress', (progress) => {
            progressFill.width = 196 * progress;
        });

        this.load.on('complete', () => {
            console.log('✅ Assets loaded (including birthday assets), starting game...');
            this.scene.start('GameScene');
        });
        
        // Start loading
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
        this.gift = null; // Birthday gift sprite
        this.overlayScreen = null; // Birthday invitation overlay
        this.invitationShown = false; // Track if invitation has been shown
        
        // Development grid overlay
        this.showGrid = false; // Grid toggle state
        this.gridGraphics = null; // Grid graphics object
        this.isMobile = 'ontouchstart' in window; // Detect mobile
        
        // Grid development system
        this.gridSystem = null;
        this.gridPlacement = null;
        this.gridValidator = null;
    }
    
    create() {
        const { width, height } = this.cameras.main;
        console.log(`🎮 Game Scene: Creating simplified game (${width}x${height})`);

        this.setupGridSystem(width, height);
        this.setupGameElements(width, height);
        this.setupKeyboardControls();
        this.setupDevGrid(width, height);
    }

    setupGridSystem(width, height) {
        // Initialize grid development system
        this.gridSystem = new GridSystem(width, height);
        this.gridPlacement = new GridPlacement(this.gridSystem, this);
        this.gridValidator = new GridValidator(this.gridSystem, this.gridPlacement);
        
        // Make grid system globally accessible for console commands
        window.gameGrid = this.gridSystem;
        window.gamePlacement = this.gridPlacement;
        window.gameValidator = this.gridValidator;
        
        console.log('🎯 Grid development system initialized');
        console.log('💡 Try these console commands:');
        console.log('   gamePlacement.placePlatform("B12", "D12", {useBlocks: true})');
        console.log('   gameValidator.validateAll()');
        console.log('   gamePlacement.listObjects()');
        
        // Add global helper functions for easy console access
        this.setupGridHelpers();
    }
    
    setupGridHelpers() {
        // Quick platform placement function
        window.quickPlatform = (startCoord, endCoord, id) => {
            const platformId = id || `platform_${startCoord}_${endCoord}`;
            return this.gridPlacement.placePlatform(startCoord, endCoord, {
                useBlocks: true,
                id: platformId
            });
        };
        
        // Quick object placement function  
        window.quickObject = (coord, type, scale = 0.2) => {
            const objectId = `${type}_${coord}`;
            return this.gridPlacement.placeObject(coord, type, {
                scale: scale,
                id: objectId
            });
        };
        
        // Quick validation function
        window.checkPlacement = (id, startCoord, endCoord = null) => {
            return this.gridValidator.validatePlacement(id, startCoord, endCoord);
        };
        
        // Grid coordinate converter
        window.gridToPixel = (coord) => {
            return this.gridSystem.gridToPixel(coord);
        };
        
        // Pixel to grid converter
        window.pixelToGrid = (x, y) => {
            return this.gridSystem.pixelToGrid(x, y);
        };
        
        // Quick moving block creation
        window.quickMovingBlock = (startCoord, endCoord, speed = 120) => {
            const id = `moving_block_${startCoord}_${endCoord}`;
            return this.gridPlacement.createMovingBlock(startCoord, startCoord, endCoord, {
                speed: speed,
                id: id
            });
        };
        
        // Debug function to check moving block status
        window.checkMovingBlock = () => {
            const gameScene = window.game?.scene?.getScene('GameScene');
            if (gameScene?.movingBlock) {
                const block = gameScene.movingBlock;
                console.log('🚀 Moving block found (D11↔G11):', {
                    position: `(${block.x.toFixed(1)}, ${block.y.toFixed(1)})`,
                    visible: block.visible,
                    scale: block.scaleX.toFixed(3),
                    depth: block.depth,
                    tint: `0x${block.tint.toString(16)}`,
                    direction: block.direction,
                    speed: block.speed,
                    range: `${block.startX}-${block.endX}`,
                    alpha: block.alpha,
                    inBounds: block.x >= 0 && block.x <= 320 && block.y >= 0 && block.y <= 568,
                    isDynamic: block.body?.moves !== false
                });
                // Flash the block to make it easier to spot
                block.setAlpha(0.5);
                setTimeout(() => block.setAlpha(1), 500);
                return gameScene.movingBlock;
            } else {
                console.log('❌ Moving block not found!');
                return null;
            }
        };
        
        console.log('🛠️ Grid helper functions added:');
        console.log('   quickPlatform("B12", "D12") - Quick block platform');
        console.log('   quickObject("E10", "gift") - Quick object placement');
        console.log('   quickMovingBlock("B11", "I11") - Quick moving block');
        console.log('   checkMovingBlock() - Check moving block D11↔G11');
        console.log('   checkPlacement("platform_B12_D12", "B12", "D12") - Validate');
        console.log('   gridToPixel("B12") - Convert to pixels');
        console.log('   pixelToGrid(64, 352) - Convert to grid');
    }

    setupGameElements(width, height) {
        // Add kitchen background with subtle opacity
        this.background = this.add.image(width * 0.5, height * 0.5, 'background');
        this.background.setDisplaySize(width, height); // Scale to fit game dimensions
        this.background.setAlpha(0.4); // 40% opacity for subtle background effect
        this.background.setDepth(-100); // Ensure it's behind everything
        
        // Create styled ground (grey with embossed effect) - 50% taller to accommodate mobile controls
        this.createStyledGround(width, height);

        // Create tiered platform structure (4 levels total) using block sprites
        // Following Phaser.js Framework Priority (Rule 3) - using Phaser physics groups
        this.platforms = this.physics.add.staticGroup();
        
        // Get block dimensions from loaded texture
        const blockTexture = this.textures.get('block').getSourceImage();
        
        // Analyze block to find content boundaries (non-transparent area)
        // This is needed because block.png has transparent padding
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = blockTexture.width;
        canvas.height = blockTexture.height;
        ctx.drawImage(blockTexture, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, blockTexture.width, blockTexture.height);
        const data = imageData.data;
        
        // Find content boundaries
        let minX = blockTexture.width;
        let maxX = 0;
        let minY = blockTexture.height;
        let maxY = 0;
        
        for (let y = 0; y < blockTexture.height; y++) {
            for (let x = 0; x < blockTexture.width; x++) {
                const idx = (y * blockTexture.width + x) * 4;
                const alpha = data[idx + 3];
                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        }
        
        // Calculate actual content dimensions
        const contentWidth = maxX - minX + 1;
        const contentHeight = maxY - minY + 1;
        
        // NEW: Scale blocks to fit single grid cell (32x32px)
        // Use the larger dimension to ensure block fits within 32x32 grid cell
        const maxContentDimension = Math.max(contentWidth, contentHeight);
        const blockScale = 32 / maxContentDimension; // Scale to fit 32px grid cell
        const scaledContentWidth = contentWidth * blockScale;
        const scaledContentHeight = contentHeight * blockScale;
        
        // Calculate total platform width for symmetry calculations
        const totalPlatformWidth = scaledContentWidth * 3;
        console.log(`📐 Block measurements: original=${contentWidth}x${contentHeight}px, scaled=${scaledContentWidth.toFixed(1)}x${scaledContentHeight.toFixed(1)}px, scale=${blockScale.toFixed(2)}`);
        console.log(`📐 Platform measurements: scaledContentWidth=${scaledContentWidth.toFixed(1)}, totalPlatformWidth=${totalPlatformWidth.toFixed(1)}`);
        
        // Calculate symmetric positions with equal gaps from centerline
        const centerline = width / 2; // 160px
        const symmetricGap = 32; // 32px gap between platform edge and centerline
        const leftPlatformCenterX = centerline - symmetricGap - (totalPlatformWidth / 2);
        const rightPlatformCenterX = centerline + symmetricGap + (totalPlatformWidth / 2);
        console.log(`📐 Symmetric positions: left=${leftPlatformCenterX.toFixed(1)}, right=${rightPlatformCenterX.toFixed(1)}, gap=${symmetricGap}px`);
        
        // Helper function to create a platform of 3 blocks
        const createPlatform = (centerX, centerY) => {
            // Position blocks so they touch at content boundaries
            for (let i = 0; i < 3; i++) {
                // Calculate position for snug fit using content width
                const blockX = centerX - (1.5 * scaledContentWidth) + (i * scaledContentWidth);
                const block = this.add.image(blockX, centerY, 'block').setScale(blockScale);
                this.physics.add.existing(block, true);
                this.platforms.add(block);
            }
        };
        
        // Platform positions using calculated symmetric coordinates:
        // True mirror layout with equal gaps from centerline to platform edges
        
        // Platform 1: Bottom left - Row 16 = 512px
        createPlatform(leftPlatformCenterX, 512);

        // Platform 2: Second from bottom right - Row 15 = 480px  
        createPlatform(rightPlatformCenterX, 480);

        // Platform 3: Third level left - Row 13.5 = 432px (up half cell) - moved right 0.5 grid spaces (was 1.5, moved left by 1)
        const leftEdgePlatformCenterX = totalPlatformWidth / 2; // Platform center when left edge touches screen edge
        const platform3CenterX = leftEdgePlatformCenterX + (0.5 * 32); // Move right by 0.5 grid spaces (16px) - spans A14-C14
        createPlatform(platform3CenterX, 432);

        // Platform 4: Top right - Row 12.5 = 400px (up half cell) - touching right edge
        const rightEdgePlatformCenterX = width - (totalPlatformWidth / 2); // Platform center when right edge touches screen edge
        createPlatform(rightEdgePlatformCenterX, 400);
        
        // Store the top platform position for gift placement (top right platform)
        this.topPlatformX = rightEdgePlatformCenterX; // Platform touching right edge
        this.topPlatformY = 400;  // Row 12.5

        // Create moving block that travels from B11 to I11
        this.createMovingBlock(blockScale, width, height);

        // Add birthday gift on top platform (top right platform)
        // Make the gift much smaller and align its bottom with the top of the platform
        const giftScale = 0.1;
        const giftImage = this.textures.get('gift').getSourceImage();
        const giftDisplayHeight = giftImage.height * giftScale;
        const platformTop = this.topPlatformY - 16; // platforms are now 32px tall, so top is y-16
        const giftY = platformTop - giftDisplayHeight / 2 + giftDisplayHeight * 0.10; // sink by 10%
        this.gift = this.add.image(this.topPlatformX, giftY, 'gift');
        this.gift.setScale(giftScale);
        this.physics.add.existing(this.gift, true); // STATIC body
        this.gift.body.setSize(giftDisplayHeight, giftDisplayHeight); // collision box matches display size

        // Create Puffy and set up collision checking
        this.puffy = new PuffySprite(this);
        this.setupPuffyWhenReady(width, height);

        console.log('✅ Game elements created: Puffy, styled ground, tiered platforms, and birthday gift');
    }

    createMovingBlock(blockScale, width, height) {
        // Set up movement between D11 and G11
        const startPos = this.gridSystem.gridToPixel('D11'); // D11 = column 3, row 11
        const endPos = this.gridSystem.gridToPixel('G11');   // G11 = column 6, row 11
        
        console.log(`🚀 Creating moving block: D11(${startPos.x}, ${startPos.y}) to G11(${endPos.x}, ${endPos.y})`);
        
        // Create the moving block starting at D11
        this.movingBlock = this.add.image(startPos.x, startPos.y, 'block');
        // Use the same scale as platform blocks to match size
        this.movingBlock.setScale(blockScale); // Same as platform blocks for consistent 1 grid cell size
        this.movingBlock.setDepth(10); // Ensure it's visible above background but below UI
        this.movingBlock.setTint(0xff00ff); // Add magenta tint to make it easily visible for debugging
        
        // Add physics body for collision detection
        this.physics.add.existing(this.movingBlock, false); // Dynamic body (can move)
        this.movingBlock.body.setImmovable(true); // Block doesn't move when hit by Puffy
        this.platforms.add(this.movingBlock); // Add to platforms group for collision
        
        // Set up movement properties
        this.movingBlock.startX = startPos.x;  // D11 position
        this.movingBlock.endX = endPos.x;      // G11 position
        this.movingBlock.y = startPos.y;       // Y stays constant at row 11
        this.movingBlock.direction = 1;        // 1 = moving right (toward G11), -1 = moving left (toward D11)
        this.movingBlock.speed = 120;          // Same speed as Puffy's walking
        
        console.log(`✅ Moving block created: D11→G11 at speed ${this.movingBlock.speed}px/s`);
        console.log(`📐 Block properties: scale=${blockScale.toFixed(3)}, range=${this.movingBlock.startX}-${this.movingBlock.endX}`);
    }

    createStyledGround(width, height) {
        // Create ground graphics for custom styling
        this.groundGraphics = this.add.graphics();
        this.groundGraphics.setDepth(-50); // Behind platforms but above background
        
        // Ground only occupies row 18 of the grid (24px at bottom)
        const groundY = height - 24;  // Row 18 starts at 544px (568-24)
        const groundHeight = 24;      // Row 18 is 24px tall
        
        // Main ground color - warm grey to match kitchen tones
        const groundColor = 0x8B7D6B; // Warm grey-brown
        const shadowColor = 0x5D5248; // Darker for shadows
        const highlightColor = 0xB5A898; // Lighter for highlights
        
        // Fill main ground area
        this.groundGraphics.fillStyle(groundColor);
        this.groundGraphics.fillRect(0, groundY, width, groundHeight);
        
        // Add embossed top edge (highlight)
        this.groundGraphics.lineStyle(2, highlightColor, 0.8);
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(0, groundY);
        this.groundGraphics.lineTo(width, groundY);
        this.groundGraphics.strokePath();
        
        // Add inner highlight line
        this.groundGraphics.lineStyle(1, highlightColor, 0.4);
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(0, groundY + 2);
        this.groundGraphics.lineTo(width, groundY + 2);
        this.groundGraphics.strokePath();
        
        // Add shadow on sides and bottom
        this.groundGraphics.lineStyle(2, shadowColor, 0.6);
        
        // Left shadow
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(0, groundY);
        this.groundGraphics.lineTo(0, height);
        this.groundGraphics.strokePath();
        
        // Right shadow
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(width, groundY);
        this.groundGraphics.lineTo(width, height);
        this.groundGraphics.strokePath();
        
        // Bottom shadow (if visible)
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(0, height);
        this.groundGraphics.lineTo(width, height);
        this.groundGraphics.strokePath();
        
        // Add subtle texture lines (fewer for thinner ground)
        this.groundGraphics.lineStyle(1, shadowColor, 0.2);
        // Only add one texture line in the middle for thin ground
        const y = groundY + (groundHeight / 2);
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(0, y);
        this.groundGraphics.lineTo(width, y);
        this.groundGraphics.strokePath();
        
        // Create invisible physics ground (same dimensions as visual)
        this.ground = this.add.rectangle(width * 0.5, height - 12, width, 24, 0x000000, 0);
        this.physics.add.existing(this.ground, true); // Static body
        
        console.log('✅ Styled ground created with embossed effects');
    }

    setupPuffyWhenReady(width, height) {
        // Check for Puffy sprite sheet readiness and create sprite
        const checkPuffyReady = () => {
            if (this.puffy && this.puffy.spriteSheetReady && !this.puffy.sprite) {
                console.log('✅ Puffy sprite sheet is ready! Creating sprite...');
                
                // Create sprite at correct position - above the 24px ground
                const targetX = width * 0.3; // 30% from left (96px)
                const targetY = height - 24 - 24; // Ground height (24px) + Puffy height (24px) above ground
                this.puffy.createSprite(targetX, targetY);
                this.puffy.startInitialAnimation();
                
                                // Set up collisions (only once) - Using Phaser.js Framework Priority (Rule 3)
                if (!this.puffyCollisionsSetup) {
                    this.physics.add.collider(this.puffy.sprite, this.ground);
                    this.physics.add.collider(this.puffy.sprite, this.platforms);
                    
                    // Birthday gift collision - triggers invitation overlay
                    this.physics.add.overlap(this.puffy.sprite, this.gift, () => {
                        this.showBirthdayInvitation();
                    });
                    
                    this.puffyCollisionsSetup = true;
                    console.log('✅ Puffy sprite created and collisions set up with platforms and birthday gift');
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
        
        // Add grid toggle key (G key) - desktop only
        if (!this.isMobile) {
            this.gridKey = this.input.keyboard.addKey('G');
        }
        
        console.log('⌨️ Keyboard controls ready (WASD)');
    }

    setupDevGrid(width, height) {
        // Create grid graphics object
        this.gridGraphics = this.add.graphics();
        this.gridGraphics.setDepth(1000); // Ensure grid is on top
        
        // Make grid invisible by default
        this.gridGraphics.setVisible(false);
        
        console.log('📐 Development grid ready (10x18, 32px cells)');
    }

    toggleGrid() {
        // Only allow on desktop
        if (this.isMobile) return;
        
        this.showGrid = !this.showGrid;
        this.gridGraphics.setVisible(this.showGrid);
        
        if (this.showGrid) {
            this.drawGrid();
            console.log('📐 Development grid: ON');
        } else {
            this.hideGridLabels();
            console.log('📐 Development grid: OFF');
        }
        
        // Update desktop UI button state if it exists
        const gridButton = document.getElementById('grid-toggle');
        if (gridButton) {
            gridButton.textContent = this.showGrid ? 'Hide Grid' : 'Show Grid';
            gridButton.style.backgroundColor = this.showGrid ? '#4CAF50' : '#666';
        }
    }

    drawGrid() {
        const { width, height } = this.cameras.main;
        
        // Clear previous grid
        this.gridGraphics.clear();
        
        // Grid settings
        const cellWidth = 32;  // 320px / 10 columns = 32px
        const cellHeight = 32; // Standard cell height
        const lastRowHeight = height - (17 * cellHeight); // Remainder for row 18
        
        // Grid style
        this.gridGraphics.lineStyle(1, 0x00ffff, 0.3); // Cyan, 30% opacity
        
        // Draw vertical lines (columns A-J)
        for (let col = 0; col <= 10; col++) {
            const x = col * cellWidth;
            this.gridGraphics.beginPath();
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, height);
            this.gridGraphics.strokePath();
        }
        
        // Draw horizontal lines (rows 1-18)
        for (let row = 0; row <= 18; row++) {
            let y;
            if (row <= 17) {
                y = row * cellHeight;
            } else {
                y = height; // Bottom edge
            }
            
            this.gridGraphics.beginPath();
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(width, y);
            this.gridGraphics.strokePath();
        }
        
        // Add labels (columns A-J, rows 1-18)
        this.gridGraphics.fillStyle(0x00ffff, 0.8);
        
        // Column labels (A-J)
        const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        for (let col = 0; col < 10; col++) {
            const x = col * cellWidth + cellWidth / 2;
            const label = this.add.text(x, 8, columnLabels[col], {
                fontSize: '12px',
                color: '#00ffff',
                align: 'center'
            }).setOrigin(0.5).setDepth(1001);
            
            // Store label reference for cleanup
            if (!this.gridLabels) this.gridLabels = [];
            this.gridLabels.push(label);
        }
        
        // Row labels (1-18)
        for (let row = 0; row < 18; row++) {
            let y;
            if (row < 17) {
                y = row * cellHeight + cellHeight / 2;
            } else {
                y = 17 * cellHeight + lastRowHeight / 2;
            }
            
            const label = this.add.text(8, y, (row + 1).toString(), {
                fontSize: '12px',
                color: '#00ffff',
                align: 'center'
            }).setOrigin(0.5).setDepth(1001);
            
            this.gridLabels.push(label);
        }
    }

    hideGridLabels() {
        if (this.gridLabels) {
            this.gridLabels.forEach(label => label.destroy());
            this.gridLabels = [];
        }
    }

    update() {
        if (!this.puffy || !this.puffy.sprite) return;
        if (!this.puffy.isReady) return; // Block input/physics until Puffy is fully ready
        
        // Handle grid toggle (G key) - desktop only
        if (!this.isMobile && this.gridKey && Phaser.Input.Keyboard.JustDown(this.gridKey)) {
            this.toggleGrid();
        }
        
        // Update moving block position
        this.updateMovingBlock();
        
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

    updateMovingBlock() {
        if (!this.movingBlock) return;
        
        // Calculate movement based on delta time for consistent speed
        const deltaTime = this.game.loop.delta / 1000; // Convert ms to seconds
        const movement = this.movingBlock.speed * deltaTime * this.movingBlock.direction;
        
        // Debug log occasionally (every 60 frames ~ 1 second at 60fps)
        if (this.game.loop.frame % 60 === 0) {
            console.log(`🚀 Moving block: x=${this.movingBlock.x.toFixed(1)}, direction=${this.movingBlock.direction}, bounds=${this.movingBlock.startX}-${this.movingBlock.endX}`);
        }
        
        // Update position
        this.movingBlock.x += movement;
        
        // Check boundaries and reverse direction
        if (this.movingBlock.direction === 1 && this.movingBlock.x >= this.movingBlock.endX) {
            // Hit right boundary, reverse direction
            this.movingBlock.x = this.movingBlock.endX;
            this.movingBlock.direction = -1;
        } else if (this.movingBlock.direction === -1 && this.movingBlock.x <= this.movingBlock.startX) {
            // Hit left boundary, reverse direction
            this.movingBlock.x = this.movingBlock.startX;
            this.movingBlock.direction = 1;
        }
        
        // Update physics body position to match sprite position
        if (this.movingBlock.body) {
            // For Phaser Arcade Physics, use x and y properties or setX/setY methods
            this.movingBlock.body.x = this.movingBlock.x - this.movingBlock.width / 2;
            this.movingBlock.body.y = this.movingBlock.y - this.movingBlock.height / 2;
        }
    }

    showBirthdayInvitation() {
        if (this.invitationShown) return;
        this.invitationShown = true;
        this.physics.pause();
        const { width, height } = this.cameras.main;
        // Remove any old overlay
        if (this.overlayScreen) {
            Object.values(this.overlayScreen).forEach(element => {
                if (element && element.destroy) element.destroy();
            });
        }
        // Inject Google Fonts for Playfair Display
        if (!document.getElementById('playfair-font')) {
            const link = document.createElement('link');
            link.id = 'playfair-font';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap';
            document.head.appendChild(link);
        }
        // Responsive overlay sizing
        const overlayW = Math.min(width * 0.95, 400);
        const overlayH = height < 500 ? 340 : 400;
        // Create a container to hold all overlay elements
        const overlayContainer = this.add.container(width / 2, height / 2).setDepth(100);
        // Overlay background
        const overlayBg = this.add.rectangle(0, 0, overlayW, overlayH, 0x000000, 0.85)
            .setOrigin(0.5).setStrokeStyle(2, 0xffffff);
        overlayContainer.add(overlayBg);
        // Title with improved responsive sizing
        const title = this.add.text(0, 0, "You're invited to Puffy's Birthday", {
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: width < 400 ? '18px' : width < 500 ? '22px' : '28px',
            color: '#FFD700',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#8B4513',
            strokeThickness: 2,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true },
            wordWrap: { width: overlayW * 0.9, useAdvancedWrap: true },
            fixedWidth: overlayW * 0.9
        }).setOrigin(0.5, 0);
        overlayContainer.add(title);
        // Details with improved text wrapping
        const detailsText = this.add.text(0, 0, [
            "When: July 3rd 7pm-10pm",
            "Where: Puffy's house",
            "What: Garden dinner + Puffy's favorite movie",
            "",
            "Can't wait to see you there! 🐱💕"
        ], {
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: width < 500 ? '13px' : '16px',
            color: '#FFFFFF',
            align: 'center',
            lineSpacing: 8,
            backgroundColor: 'rgba(139, 69, 19, 0.85)',
            padding: { x: 16, y: 18 },
            wordWrap: { width: overlayW * 0.85, useAdvancedWrap: true },
            fixedWidth: overlayW * 0.85
        }).setOrigin(0.5, 0);
        overlayContainer.add(detailsText);
        // Puffy image
        const puffyW = width < 500 ? 90 : 140;
        const puffy = this.add.image(0, 0, 'puffy_winks');
        puffy.setDisplaySize(puffyW, puffyW).setOrigin(0.5, 0);
        overlayContainer.add(puffy);
        // Dynamically space elements vertically
        let y = -overlayH / 2 + 32;
        title.y = y;
        y += title.height + 18;
        detailsText.y = y;
        y += detailsText.height + 18;
        puffy.y = y;
        // Store overlay elements for cleanup (if needed)
        this.overlayScreen = { container: overlayContainer, background: overlayBg, title, details: detailsText, puffy };
        // Overlay remains until refresh
        console.log('✅ Birthday invitation overlay displayed (container, no overlap)');
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
    
    // Setup mobile browser UI auto-hide
    setupMobileBrowserUIHide();
    
    window.hopHopPuffGame = new HopHopPuffGame();
});

// Mobile browser UI auto-hide functionality
function setupMobileBrowserUIHide() {
    // Only run on mobile devices
    if (!('ontouchstart' in window)) return;
    
    let hideTimer;
    
    // Function to request fullscreen and hide browser UI
    function hideBrowserUI() {
        // Request fullscreen on document element
        const elem = document.documentElement;
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(() => {
                console.log('📱 Fullscreen not supported or denied');
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen().catch(() => {
                console.log('📱 WebKit fullscreen not supported or denied');
            });
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen().catch(() => {
                console.log('📱 Mozilla fullscreen not supported or denied');
            });
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen().catch(() => {
                console.log('📱 IE fullscreen not supported or denied');
            });
        }
        
        // Force scroll to top to hide address bar on browsers that don't support fullscreen
        window.scrollTo(0, 1);
        setTimeout(() => window.scrollTo(0, 0), 100);
    }
    
    // Function to show browser UI (exit fullscreen)
    function showBrowserUI() {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().catch(() => {});
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen().catch(() => {});
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen().catch(() => {});
        }
    }
    
    // Auto-hide after 3 seconds of no interaction
    function resetHideTimer() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            hideBrowserUI();
        }, 3000);
    }
    
    // Listen for touch events to reset timer
    document.addEventListener('touchstart', resetHideTimer, { passive: true });
    document.addEventListener('touchmove', resetHideTimer, { passive: true });
    document.addEventListener('touchend', resetHideTimer, { passive: true });
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            hideBrowserUI();
        }, 500);
    });
    
    // Initial hide after page load
    setTimeout(() => {
        hideBrowserUI();
    }, 1000);
    
    console.log('📱 Mobile browser UI auto-hide enabled');
}

// Global function to toggle dev grid from UI button
window.toggleDevGrid = function() {
    const gameScene = window.game?.scene?.getScene('GameScene');
    if (gameScene && gameScene.toggleGrid) {
        gameScene.toggleGrid();
    }
};

// Global function to execute grid commands from UI
window.executeGridCommand = function() {
    const commandInput = document.getElementById('grid-command');
    const resultDiv = document.getElementById('command-result');
    
    if (!commandInput || !resultDiv) return;
    
    const command = commandInput.value.trim();
    if (!command) {
        resultDiv.textContent = 'Enter a command first';
        resultDiv.style.color = '#ff6666';
        return;
    }
    
    try {
        // Check if grid system is available
        if (!window.gamePlacement || !window.gameValidator) {
            throw new Error('Grid system not initialized yet');
        }
        
        // Execute the command
        console.log(`🎯 Executing grid command: ${command}`);
        const result = eval(command);
        
        // Display result
        if (result) {
            resultDiv.textContent = `✅ Success: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`;
            resultDiv.style.color = '#66ff66';
        } else {
            resultDiv.textContent = '✅ Command executed successfully';
            resultDiv.style.color = '#66ff66';
        }
        
        // Clear the input for next command
        commandInput.value = '';
        
    } catch (error) {
        console.error('Grid command error:', error);
        resultDiv.textContent = `❌ Error: ${error.message}`;
        resultDiv.style.color = '#ff6666';
    }
};

// Allow Enter key to execute commands
document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('grid-command');
    if (commandInput) {
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                window.executeGridCommand();
            }
        });
    }
});

console.log('✅ Hop Hop Puff main.js loaded successfully!'); 