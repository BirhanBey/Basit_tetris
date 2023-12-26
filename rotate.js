// rotate.js

export function rotateClockwise(piece, collides, draw) {
    const originalShape = piece.shape;
    const rotatedShape = rotateMatrix(originalShape);
  
    if (rotatedShape) {
      if (!collides(rotatedShape, piece.position)) {
        piece.shape = rotatedShape;
      } else {
        // Rotate back if there's a collision
        piece.shape = originalShape;
      }
    } else {
      console.error("Invalid matrix provided to rotateMatrix function");
    }
  
    draw();
  }
  
  // rotateMatrix fonksiyonu
  export function rotateMatrix(matrix) {
    if (!isValidMatrix(matrix)) {
      console.error("Invalid matrix provided to rotateMatrix function");
      return null;
    }
  
    const N = matrix.length;
    const M = matrix[0].length;
  
    try {
      const result = matrix[0].map((_, i) =>
        matrix.map((row) => row[i]).reverse()
      );
  
      if (!isValidMatrix(result) || result.length !== M || result[0].length !== N) {
        console.error("Invalid matrix dimensions after rotation");
        console.log("Before rotation:", matrix);
        console.log("After rotation:", result);
        return null;
      }
  
      return result;
    } catch (error) {
      console.error("Error during rotation:", error);
      console.log("Before rotation:", matrix);
      return null;
    }
  }
  
  // isValidMatrix fonksiyonu
  export function isValidMatrix(matrix) {
    if (!matrix || matrix.length === 0 || !matrix[0] || matrix[0].length === 0) {
      return false;
    }
  
    const rowLength = matrix[0].length;
    return matrix.every(row => row.length === rowLength);
  }
  