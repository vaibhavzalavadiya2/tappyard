// Polyomino Shapes & Board Logic for Block Grid Zen
// Grid Size: 10x10

export interface BlockShape {
  id: string;
  name: string;
  matrix: number[][]; // 1 for solid block, 0 for empty
  color: string;
  glow: string;
  border: string;
}

export const GRID_SIZE = 10;

// Neon Color Palette for Shapes
export const SHAPE_COLORS = [
  {
    color: 'from-cyan-500 to-blue-600',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.6)]',
    border: 'border-cyan-300',
  },
  {
    color: 'from-emerald-400 to-teal-600',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.6)]',
    border: 'border-emerald-300',
  },
  {
    color: 'from-amber-400 to-yellow-500',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.6)]',
    border: 'border-amber-300',
  },
  {
    color: 'from-fuchsia-500 to-pink-600',
    glow: 'shadow-[0_0_12px_rgba(236,72,153,0.6)]',
    border: 'border-fuchsia-300',
  },
  {
    color: 'from-purple-500 to-indigo-600',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.6)]',
    border: 'border-purple-300',
  },
  {
    color: 'from-rose-500 to-orange-500',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]',
    border: 'border-rose-300',
  },
];

// Master shape templates
const SHAPE_TEMPLATES: { name: string; matrix: number[][] }[] = [
  // Dots & Lines
  { name: '1x1 Dot', matrix: [[1]] },
  { name: '2x1 Line H', matrix: [[1, 1]] },
  { name: '2x1 Line V', matrix: [[1], [1]] },
  { name: '3x1 Line H', matrix: [[1, 1, 1]] },
  { name: '3x1 Line V', matrix: [[1], [1], [1]] },
  { name: '4x1 Line H', matrix: [[1, 1, 1, 1]] },
  { name: '4x1 Line V', matrix: [[1], [1], [1], [1]] },
  { name: '5x1 Line H', matrix: [[1, 1, 1, 1, 1]] },
  { name: '5x1 Line V', matrix: [[1], [1], [1], [1], [1]] },

  // Squares
  {
    name: '2x2 Square',
    matrix: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: '3x3 Square',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },

  // 2x2 Small Corners
  {
    name: 'Small Corner TL',
    matrix: [
      [1, 1],
      [1, 0],
    ],
  },
  {
    name: 'Small Corner TR',
    matrix: [
      [1, 1],
      [0, 1],
    ],
  },
  {
    name: 'Small Corner BL',
    matrix: [
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: 'Small Corner BR',
    matrix: [
      [0, 1],
      [1, 1],
    ],
  },

  // 3x3 Large Corners
  {
    name: 'Large Corner TL',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
  },
  {
    name: 'Large Corner TR',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
  },
  {
    name: 'Large Corner BL',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    name: 'Large Corner BR',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },

  // T-Shapes
  {
    name: 'T-Shape Up',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    name: 'T-Shape Down',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },

  // L-Shapes (3x2)
  {
    name: 'L-Shape 1',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: 'L-Shape 2',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  },
];

let shapeIdCounter = 1;

// Generate random set of 3 playable shapes
export function dealThreeShapes(): BlockShape[] {
  const shapes: BlockShape[] = [];

  for (let i = 0; i < 3; i++) {
    const tmpl = SHAPE_TEMPLATES[Math.floor(Math.random() * SHAPE_TEMPLATES.length)];
    const colorStyle = SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)];

    shapes.push({
      id: `shape-${shapeIdCounter++}`,
      name: tmpl.name,
      matrix: tmpl.matrix,
      color: colorStyle.color,
      glow: colorStyle.glow,
      border: colorStyle.border,
    });
  }

  return shapes;
}

// Check if a shape can legally fit at row, col
export function canPlaceShape(
  grid: (string | null)[][],
  matrix: number[][],
  startRow: number,
  startCol: number
): boolean {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  if (startRow < 0 || startCol < 0) return false;
  if (startRow + numRows > GRID_SIZE || startCol + numCols > GRID_SIZE) return false;

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (matrix[r][c] === 1) {
        if (grid[startRow + r][startCol + c] !== null) {
          return false; // Cell already occupied!
        }
      }
    }
  }

  return true;
}

// Check if ANY available shape can fit ANYWHERE on the board
export function canAnyShapeFit(
  grid: (string | null)[][],
  shapes: (BlockShape | null)[]
): boolean {
  const activeShapes = shapes.filter((s): s is BlockShape => s !== null);
  if (activeShapes.length === 0) return true; // Hand empty, next round deals

  for (const shape of activeShapes) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlaceShape(grid, shape.matrix, r, c)) {
          return true; // Found a valid placement!
        }
      }
    }
  }

  return false; // No legal moves remain!
}

// Find all full rows and columns
export function findCompletedLines(
  grid: (string | null)[][]
): { rows: number[]; cols: number[] } {
  const rows: number[] = [];
  const cols: number[] = [];

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every((cell) => cell !== null)) {
      rows.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      cols.push(c);
    }
  }

  return { rows, cols };
}
