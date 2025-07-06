# 🎯 Grid Development System

The Hop Hop Puff Grid Development System enables precise object placement using chess-like coordinates for efficient level design collaboration.

## Overview

The grid system divides the 320x568px game area into a 10x18 grid where each cell is 32x32 pixels:
- **Columns**: A-J (10 columns)
- **Rows**: 1-18 (18 rows, with row 18 being slightly smaller)
- **Coordinates**: Chess-like notation (e.g., "B12", "G5")

## Quick Start

### 1. Enable Grid Overlay
```javascript
// Press G key in game, or use desktop UI button
// Shows labeled grid with A-J columns and 1-18 rows
```

### 2. Place Objects Using Commands

**Place a platform spanning B12 to D12:**
```javascript
quickPlatform("B12", "D12")
```

**Place a gift at coordinate E10:**
```javascript
quickObject("E10", "gift")
```

**Validate all placements:**
```javascript
gameValidator.validateAll()
```

## Core Classes

### GridSystem
Handles coordinate parsing and pixel conversion.

```javascript
// Convert grid coordinate to pixel position
const pos = gameGrid.gridToPixel("B12"); 
// Returns: {x: 48, y: 352}

// Convert pixel position to grid coordinate  
const coord = gameGrid.pixelToGrid(64, 352);
// Returns: "B12"

// Calculate span between coordinates
const span = gameGrid.getSpan("B12", "D12");
// Returns: {x: 80, y: 352, width: 96, height: 32, ...}
```

### GridPlacement
Places and manages game objects at grid coordinates.

```javascript
// Place block platform spanning multiple cells
const platform = gamePlacement.placePlatform("B12", "D12", {
    useBlocks: true,
    id: "my_platform"
});

// Place any game object at a coordinate
const gift = gamePlacement.placeObject("E10", "gift", {
    scale: 0.2,
    id: "level_gift"
});

// Remove object by ID
gamePlacement.removeObject("my_platform");

// List all placed objects
gamePlacement.listObjects();
```

### GridValidator
Validates object placement accuracy.

```javascript
// Validate specific placement
const result = gameValidator.validatePlacement("my_platform", "B12", "D12");
// Returns: {valid: true/false, expected: {...}, actual: {...}}

// Validate all placed objects
const results = gameValidator.validateAll();
// Returns array of validation results
```

## Helper Functions

Quick access functions for common operations:

```javascript
// Quick platform (uses blocks automatically)
quickPlatform("B12", "D12");
quickPlatform("G8", "I8", "custom_id");

// Quick object placement
quickObject("E10", "gift");
quickObject("C5", "rectangle", 0.5); // with custom scale

// Quick validation
checkPlacement("platform_B12_D12", "B12", "D12");

// Coordinate conversion
gridToPixel("B12");     // Get pixel position
pixelToGrid(64, 352);   // Get grid coordinate
```

## Development Console

### Desktop UI Console
Use the development panel in the desktop UI:
1. Enter command in the "Grid Commands" input field
2. Click "Execute" or press Enter
3. Results appear below the input

Example commands:
```
quickPlatform("B12", "D12")
quickObject("E10", "gift") 
gameValidator.validateAll()
```

### Browser Console
Open browser developer tools and use any grid command:

```javascript
// Place multiple platforms quickly
quickPlatform("B16", "D16");  // Bottom level
quickPlatform("G15", "I15");  // Second level
quickPlatform("B14", "D14");  // Third level
quickPlatform("G13", "I13");  // Top level

// Add objects
quickObject("E12", "gift", 0.1);
quickObject("F8", "rectangle");

// Validate everything
gameValidator.validateAll();
```

## Test System

### Interactive Test Interface
Open `tests/grid_placement_test.html` for a comprehensive testing interface:

- **Platform Placement**: Test spanning multiple cells
- **Object Placement**: Test single-cell objects  
- **Validation Testing**: Verify placement accuracy
- **Example Commands**: Run pre-built test scenarios

### Validation Testing
```javascript
// The validator checks:
// 1. Position accuracy (within 1px tolerance)
// 2. Size accuracy for spans  
// 3. Coordinate bounds checking
// 4. Object existence verification

const results = gameValidator.validateAll();
results.forEach(r => {
    console.log(`${r.id}: ${r.valid ? 'PASS' : 'FAIL'}`);
});
```

## Coordinate System Reference

### Grid Layout
```
   A  B  C  D  E  F  G  H  I  J
1  •  •  •  •  •  •  •  •  •  •
2  •  •  •  •  •  •  •  •  •  •
3  •  •  •  •  •  •  •  •  •  •
...
16 •  •  •  •  •  •  •  •  •  •  <- Platform level
17 •  •  •  •  •  •  •  •  •  •
18 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  <- Ground level
```

### Common Platform Positions
```javascript
// Current game platforms:
quickPlatform("B16", "D16");  // Bottom left platform
quickPlatform("G15", "I15");  // Second right platform  
quickPlatform("A14", "C14");  // Third left (edge-touching)
quickPlatform("H13", "J13");  // Top right (edge-touching)
```

### Pixel Conversion Examples
| Coordinate | Pixel Position | Notes |
|------------|---------------|-------|
| A1 | (16, 16) | Top-left cell center |
| E9 | (144, 272) | Center of game area |
| J18 | (304, 560) | Bottom-right cell center |
| B12 | (48, 352) | Platform level |

## Error Handling

The system includes comprehensive error checking:

```javascript
// Invalid coordinates throw descriptive errors
try {
    quickPlatform("Z99", "A1");  // Invalid column/row
} catch (error) {
    console.log(error.message); // "Invalid column: Z. Use A-J"
}

// Validation catches position mismatches
const result = checkPlacement("bad_platform", "A1", "B1");
if (!result.valid) {
    console.log(`Placement error: ${result.error}`);
}
```

## Best Practices

### 1. Use Descriptive IDs
```javascript
// Good: Descriptive and unique
quickPlatform("B12", "D12", "bottom_left_platform");

// Avoid: Generic or auto-generated
quickPlatform("B12", "D12", "platform1");
```

### 2. Validate After Placement
```javascript
quickPlatform("B12", "D12", "my_platform");
const valid = checkPlacement("my_platform", "B12", "D12");
if (!valid.valid) {
    console.warn("Platform placement failed validation!");
}
```

### 3. Clean Up Test Objects
```javascript
// Remove test objects when done
gamePlacement.removeObject("test_platform");

// Or use the test system's auto-cleanup
// (removes all objects with "test_" prefix)
```

### 4. Use Grid Overlay for Visual Reference
```javascript
// Always enable grid when designing levels
// Press 'G' key or use desktop UI button
```

## Integration Examples

### Creating a New Level Section
```javascript
// Clear existing test objects
gamePlacement.listObjects().forEach(id => {
    if (id.startsWith('test_')) {
        gamePlacement.removeObject(id);
    }
});

// Build new platform layout
quickPlatform("B15", "D15", "level2_platform1");
quickPlatform("F14", "H14", "level2_platform2"); 
quickPlatform("C12", "E12", "level2_platform3");

// Add objects
quickObject("G13", "gift", 0.15);
quickObject("B11", "rectangle");

// Validate the layout
gameValidator.validateAll();
```

### Precise Positioning
```javascript
// For exact positioning, use the full API
const span = gameGrid.getSpan("B12", "D12");
console.log(`Platform will be ${span.width}px wide at position (${span.x}, ${span.y})`);

// Place with exact options
gamePlacement.placePlatform("B12", "D12", {
    useBlocks: true,
    id: "precise_platform",
    physics: true  // Enable physics collision
});
```

## Troubleshooting

### Common Issues

**Grid not visible:**
- Ensure you're on desktop (grid is desktop-only)
- Press 'G' key or use desktop UI button
- Check browser console for errors

**Commands not working:**
- Verify game is fully loaded
- Check browser console for "Grid development system initialized"
- Ensure no JavaScript errors

**Validation failing:**
- Objects may have been manually moved
- Check coordinate spelling (case-sensitive)
- Verify object still exists

**Objects appearing in wrong position:**
- Double-check coordinate format ("B12" not "b12")
- Ensure you're using the right coordinate system (A-J, 1-18)
- Validate with `checkPlacement()` after creation

### Debug Commands
```javascript
// Check if grid system is loaded
console.log(typeof window.gameGrid);  // Should be "object"

// List current objects
gamePlacement.listObjects();

// Get detailed object info
const info = gamePlacement.getObjectInfo("platform_B12_D12");
console.log(info);

// Check coordinate conversion
console.log(gridToPixel("B12"));  // Verify expected position
```

## API Reference

Complete method signatures and return types available in the source code:
- `game/GridSystem.js` - Core classes and methods
- `game/main.js` - Integration and helper functions
- `tests/grid_placement_test.html` - Interactive testing interface