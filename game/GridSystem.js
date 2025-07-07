// GridSystem.js - Comprehensive grid-based development system for Hop Hop Puff
// Enables precise object placement using chess-like coordinates (A1-J18)

console.log('🔧 Loading GridSystem for development...');

class GridSystem {
    constructor(gameWidth = 320, gameHeight = 568) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.cellWidth = 32;  // 10 columns * 32px = 320px
        this.cellHeight = 32; // 18 rows * 32px = 576px (568 + 8px remainder)
        this.cols = 10; // A-J
        this.rows = 18; // 1-18
        
        // Column mapping A=0, B=1, C=2, etc.
        this.colMap = {};
        this.reverseColMap = {};
        for (let i = 0; i < this.cols; i++) {
            const letter = String.fromCharCode(65 + i); // A, B, C...
            this.colMap[letter] = i;
            this.reverseColMap[i] = letter;
        }
        
        console.log(`🎯 GridSystem initialized: ${this.cols} cols x ${this.rows} rows (${this.cellWidth}x${this.cellHeight}px cells)`);
    }
    
    // Parse grid coordinate like "B12" or "D5"
    parseCoordinate(coord) {
        if (!coord || typeof coord !== 'string') {
            throw new Error(`Invalid coordinate: ${coord}`);
        }
        
        const match = coord.match(/^([A-J])(\d{1,2})$/);
        if (!match) {
            throw new Error(`Invalid coordinate format: ${coord}. Use format like 'B12' or 'D5'`);
        }
        
        const [, colLetter, rowStr] = match;
        const col = this.colMap[colLetter];
        const row = parseInt(rowStr);
        
        if (col === undefined) {
            throw new Error(`Invalid column: ${colLetter}. Use A-J`);
        }
        
        if (row < 1 || row > this.rows) {
            throw new Error(`Invalid row: ${row}. Use 1-${this.rows}`);
        }
        
        return { col, row, colLetter, rowNum: row };
    }
    
    // Convert grid coordinate to pixel position (center of cell)
    gridToPixel(coord) {
        const { col, row } = this.parseCoordinate(coord);
        
        // Grid row 1 is at the TOP, so we need to invert
        // Row 1 = y = 16px (center of first cell)
        // Row 18 = y = 560px (center of last cell)
        const x = col * this.cellWidth + (this.cellWidth / 2);
        const y = (row - 1) * this.cellHeight + (this.cellHeight / 2);
        
        return { x, y };
    }
    
    // Convert pixel position to grid coordinate
    pixelToGrid(x, y) {
        const col = Math.floor(x / this.cellWidth);
        const row = Math.floor(y / this.cellHeight) + 1;
        
        if (col < 0 || col >= this.cols || row < 1 || row > this.rows) {
            return null;
        }
        
        const colLetter = this.reverseColMap[col];
        return `${colLetter}${row}`;
    }
    
    // Calculate span between two coordinates
    getSpan(startCoord, endCoord) {
        const start = this.parseCoordinate(startCoord);
        const end = this.parseCoordinate(endCoord);
        
        // Ensure start comes before end
        const minCol = Math.min(start.col, end.col);
        const maxCol = Math.max(start.col, end.col);
        const minRow = Math.min(start.row, end.row);
        const maxRow = Math.max(start.row, end.row);
        
        const width = (maxCol - minCol + 1) * this.cellWidth;
        const height = (maxRow - minRow + 1) * this.cellHeight;
        
        // Center position of the span
        const centerX = minCol * this.cellWidth + (width / 2);
        const centerY = (minRow - 1) * this.cellHeight + (height / 2);
        
        return {
            x: centerX,
            y: centerY,
            width,
            height,
            startCell: `${this.reverseColMap[minCol]}${minRow}`,
            endCell: `${this.reverseColMap[maxCol]}${maxRow}`,
            colSpan: maxCol - minCol + 1,
            rowSpan: maxRow - minRow + 1
        };
    }
    
    // Validate if coordinates are within bounds
    isValidCoordinate(coord) {
        try {
            this.parseCoordinate(coord);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Get all coordinates in a span
    getCoordinatesInSpan(startCoord, endCoord) {
        const start = this.parseCoordinate(startCoord);
        const end = this.parseCoordinate(endCoord);
        
        const minCol = Math.min(start.col, end.col);
        const maxCol = Math.max(start.col, end.col);
        const minRow = Math.min(start.row, end.row);
        const maxRow = Math.max(start.row, end.row);
        
        const coordinates = [];
        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                coordinates.push(`${this.reverseColMap[col]}${row}`);
            }
        }
        
        return coordinates;
    }
}

class GridPlacement {
    constructor(gridSystem, scene) {
        this.grid = gridSystem;
        this.scene = scene;
        this.placedObjects = new Map(); // Track placed objects
        
        console.log('🎨 GridPlacement system ready');
    }
    
    // Place a platform spanning grid coordinates
    placePlatform(startCoord, endCoord, options = {}) {
        try {
            const span = this.grid.getSpan(startCoord, endCoord);
            const id = options.id || `platform_${startCoord}_${endCoord}`;
            
            console.log(`🏗️ Placing platform ${id} from ${span.startCell} to ${span.endCell}`);
            console.log(`   Position: (${span.x}, ${span.y}) Size: ${span.width}x${span.height}px`);
            
            // For block platforms, calculate how many blocks are needed
            if (options.useBlocks && this.scene.textures.exists('block')) {
                return this.placeBlockPlatform(span, id, options);
            } else {
                // Simple rectangle platform
                const platform = this.scene.add.rectangle(span.x, span.y, span.width, span.height, 
                    options.color || 0x00ff00, options.alpha || 1);
                
                if (options.physics !== false) {
                    this.scene.physics.add.existing(platform, true); // Static body
                    if (this.scene.platforms) {
                        this.scene.platforms.add(platform);
                    }
                }
                
                this.placedObjects.set(id, {
                    object: platform,
                    type: 'platform',
                    startCoord,
                    endCoord,
                    span
                });
                
                return platform;
            }
        } catch (error) {
            console.error(`❌ Failed to place platform ${startCoord}-${endCoord}:`, error.message);
            throw error;
        }
    }
    
    // Place block-based platform
    placeBlockPlatform(span, id, options = {}) {
        const blockTexture = this.scene.textures.get('block').getSourceImage();
        
        // Analyze block dimensions (reuse existing logic)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = blockTexture.width;
        canvas.height = blockTexture.height;
        ctx.drawImage(blockTexture, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, blockTexture.width, blockTexture.height);
        const data = imageData.data;
        
        let minX = blockTexture.width, maxX = 0, minY = blockTexture.height, maxY = 0;
        for (let y = 0; y < blockTexture.height; y++) {
            for (let x = 0; x < blockTexture.width; x++) {
                const alpha = data[(y * blockTexture.width + x) * 4 + 3];
                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        }
        
        const contentWidth = maxX - minX + 1;
        const contentHeight = maxY - minY + 1;
        
        // NEW: Scale blocks to fit single grid cell (32x32px)
        const maxContentDimension = Math.max(contentWidth, contentHeight);
        const scale = 32 / maxContentDimension; // Scale to fit 32px grid cell
        const scaledContentWidth = contentWidth * scale;
        
        // Calculate how many blocks fit in the span
        const numBlocks = Math.ceil(span.width / scaledContentWidth);
        const blocks = [];
        
        // Place blocks across the span
        const startX = span.x - (span.width / 2) + (scaledContentWidth / 2);
        
        for (let i = 0; i < numBlocks; i++) {
            const blockX = startX + (i * scaledContentWidth);
            const block = this.scene.add.image(blockX, span.y, 'block');
            block.setScale(scale);
            
            if (options.physics !== false) {
                this.scene.physics.add.existing(block, true);
                if (this.scene.platforms) {
                    this.scene.platforms.add(block);
                }
            }
            
            blocks.push(block);
        }
        
        this.placedObjects.set(id, {
            objects: blocks,
            type: 'blockPlatform',
            startCoord: span.startCell,
            endCoord: span.endCell,
            span,
            numBlocks
        });
        
        console.log(`   Created ${numBlocks} blocks for platform`);
        return blocks;
    }
    
    // Create a moving block at a grid coordinate
    createMovingBlock(coord, startCoord, endCoord, options = {}) {
        try {
            const position = this.grid.gridToPixel(coord);
            const startPos = this.grid.gridToPixel(startCoord);
            const endPos = this.grid.gridToPixel(endCoord);
            const id = options.id || `moving_block_${coord}_${startCoord}_${endCoord}`;
            
            console.log(`🚀 Creating moving block ${id} at ${coord}, traveling ${startCoord} to ${endCoord}`);
            
            // Use the same block analysis as platforms
            const blockTexture = this.scene.textures.get('block').getSourceImage();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = blockTexture.width;
            canvas.height = blockTexture.height;
            ctx.drawImage(blockTexture, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, blockTexture.width, blockTexture.height);
            const data = imageData.data;
            
            let minX = blockTexture.width, maxX = 0, minY = blockTexture.height, maxY = 0;
            for (let y = 0; y < blockTexture.height; y++) {
                for (let x = 0; x < blockTexture.width; x++) {
                    const alpha = data[(y * blockTexture.width + x) * 4 + 3];
                    if (alpha > 0) {
                        minX = Math.min(minX, x);
                        maxX = Math.max(maxX, x);
                        minY = Math.min(minY, y);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            
            const contentWidth = maxX - minX + 1;
            const contentHeight = maxY - minY + 1;
            const maxContentDimension = Math.max(contentWidth, contentHeight);
            const scale = 32 / maxContentDimension;
            
            // Create the moving block
            const block = this.scene.add.image(position.x, position.y, 'block');
            block.setScale(scale);
            
            // Add physics and movement properties
            if (options.physics !== false) {
                this.scene.physics.add.existing(block, false); // Dynamic body
                block.body.setImmovable(true);
                if (this.scene.platforms) {
                    this.scene.platforms.add(block);
                }
            }
            
            // Set movement properties
            block.startX = startPos.x;
            block.endX = endPos.x;
            block.direction = 1; // 1 = moving right, -1 = moving left
            block.speed = options.speed || 120; // Default to Puffy's speed
            
            this.placedObjects.set(id, {
                object: block,
                type: 'movingBlock',
                coord,
                startCoord,
                endCoord,
                position,
                speed: block.speed
            });
            
            console.log(`✅ Moving block created: ${scaledContentWidth.toFixed(1)}x${scaledContentWidth.toFixed(1)}px, speed=${block.speed}px/s`);
            return block;
            
        } catch (error) {
            console.error(`❌ Failed to create moving block:`, error.message);
            throw error;
        }
    }
    
    // Place any game object at a grid coordinate
    placeObject(coord, objectType, options = {}) {
        try {
            const position = this.grid.gridToPixel(coord);
            const id = options.id || `${objectType}_${coord}`;
            
            console.log(`📦 Placing ${objectType} at ${coord} (${position.x}, ${position.y})`);
            
            let object;
            
            switch (objectType) {
                case 'gift':
                    object = this.scene.add.image(position.x, position.y, 'gift');
                    if (options.scale) object.setScale(options.scale);
                    break;
                    
                case 'sprite':
                    if (options.texture) {
                        object = this.scene.add.image(position.x, position.y, options.texture);
                        if (options.scale) object.setScale(options.scale);
                    }
                    break;
                    
                case 'rectangle':
                    object = this.scene.add.rectangle(
                        position.x, position.y, 
                        options.width || 32, options.height || 32,
                        options.color || 0xffffff, options.alpha || 1
                    );
                    break;
                    
                default:
                    throw new Error(`Unknown object type: ${objectType}`);
            }
            
            if (options.physics && object) {
                this.scene.physics.add.existing(object, options.static || false);
            }
            
            this.placedObjects.set(id, {
                object,
                type: objectType,
                coord,
                position
            });
            
            return object;
        } catch (error) {
            console.error(`❌ Failed to place ${objectType} at ${coord}:`, error.message);
            throw error;
        }
    }
    
    // Remove placed object
    removeObject(id) {
        const placed = this.placedObjects.get(id);
        if (placed) {
            if (placed.objects) {
                // Multiple objects (like block platform)
                placed.objects.forEach(obj => obj.destroy());
            } else if (placed.object) {
                placed.object.destroy();
            }
            this.placedObjects.delete(id);
            console.log(`🗑️ Removed object: ${id}`);
            return true;
        }
        return false;
    }
    
    // Get info about placed object
    getObjectInfo(id) {
        return this.placedObjects.get(id);
    }
    
    // List all placed objects
    listObjects() {
        console.log('📋 Placed objects:');
        this.placedObjects.forEach((info, id) => {
            console.log(`  ${id}: ${info.type} at ${info.coord || `${info.startCoord}-${info.endCoord}`}`);
        });
        return Array.from(this.placedObjects.keys());
    }
}

class GridValidator {
    constructor(gridSystem, placement) {
        this.grid = gridSystem;
        this.placement = placement;
        
        console.log('✅ GridValidator ready');
    }
    
    // Validate that an object is correctly placed at grid coordinates
    validatePlacement(id, expectedStartCoord, expectedEndCoord = null) {
        const placed = this.placement.getObjectInfo(id);
        if (!placed) {
            return { valid: false, error: `Object ${id} not found` };
        }
        
        try {
            if (expectedEndCoord) {
                // Validate span placement
                const expectedSpan = this.grid.getSpan(expectedStartCoord, expectedEndCoord);
                const actualSpan = placed.span;
                
                const positionMatch = Math.abs(actualSpan.x - expectedSpan.x) < 1 && 
                                    Math.abs(actualSpan.y - expectedSpan.y) < 1;
                const sizeMatch = Math.abs(actualSpan.width - expectedSpan.width) < 1 && 
                                Math.abs(actualSpan.height - expectedSpan.height) < 1;
                
                return {
                    valid: positionMatch && sizeMatch,
                    expected: expectedSpan,
                    actual: actualSpan,
                    positionMatch,
                    sizeMatch
                };
            } else {
                // Validate single coordinate placement
                const expectedPos = this.grid.gridToPixel(expectedStartCoord);
                const actualPos = placed.position;
                
                const positionMatch = Math.abs(actualPos.x - expectedPos.x) < 1 && 
                                    Math.abs(actualPos.y - expectedPos.y) < 1;
                
                return {
                    valid: positionMatch,
                    expected: expectedPos,
                    actual: actualPos,
                    positionMatch
                };
            }
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
    
    // Run validation test on all placed objects
    validateAll() {
        console.log('🔍 Validating all placed objects...');
        const results = [];
        
        this.placement.placedObjects.forEach((info, id) => {
            let validation;
            if (info.startCoord && info.endCoord) {
                validation = this.validatePlacement(id, info.startCoord, info.endCoord);
            } else if (info.coord) {
                validation = this.validatePlacement(id, info.coord);
            }
            
            results.push({ id, ...validation });
            
            const status = validation.valid ? '✅' : '❌';
            console.log(`  ${status} ${id}: ${validation.valid ? 'VALID' : 'INVALID'}`);
            if (!validation.valid && validation.error) {
                console.log(`    Error: ${validation.error}`);
            }
        });
        
        return results;
    }
}

// Export classes for use in game
window.GridSystem = GridSystem;
window.GridPlacement = GridPlacement;
window.GridValidator = GridValidator;

console.log('✅ GridSystem classes loaded and available globally');