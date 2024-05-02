class M4 {
  // ATTRIBUTES
  private length = 4;
  public matrix: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  public determinant: number | null = null;
  public inverse: M4 | null = null;
  public modifiedDeterminant: boolean = false;
  public modifiedInverse: boolean = false;

  // CONSTRUCTOR
  constructor(matrix?: number[][]) {
    if (matrix) {
      this.matrix = matrix;
    } else {
      this.matrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  // METHODS
  get(row: number, col: number): number {
    if (row < 0 || row >= this.length || col < 0 || col >= this.length) {
      throw new Error("Index out of bounds");
    }
    return this.matrix[row][col];
  }

  set(row: number, col: number, value: number): void {
    if (row < 0 || row >= this.length || col < 0 || col >= this.length) {
      throw new Error("Index out of bounds");
    }
    this.matrix[row][col] = value;
    this.modifiedDeterminant = true;
    this.modifiedInverse = true;
  }

  static identity(): M4 {
    let identityMatrix = new M4();
    for (let i = 0; i < identityMatrix.length; i++) {
      identityMatrix.matrix[i][i] = 1;
    }
    return identityMatrix;
  }

  static zero(): M4 {
    let zeroMatrix = new M4();
    return zeroMatrix;
  }

  static isEqual(a: M4, b: M4): boolean {
    return a.isEqual(b);
  }

  isEqual(b: M4): boolean {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        if (this.matrix[i][j] !== b.matrix[i][j]) return false;
      }
    }
    return true;
  }

  isIdentity(): boolean {
    return M4.isEqual(this, M4.identity());
  }

  calculateDeterminant(): number {
    if (this.determinant !== null && !this.modifiedDeterminant) {
      return this.determinant;
    }
    const m = this.matrix; // Shortcut to refer to the matrix array
    // Expansion by minors for 4x4 determinant
    const minors = [];
    for (let i = 0; i < 4; i++) {
      let minor = [];
      for (let j = 0; j < 4; j++) {
        // Generate 3x3 minor matrix for m[i][j]
        let subMinor = [];
        for (let k = 0; k < 4; k++) {
          if (k !== i) {
            let row = [];
            for (let l = 0; l < 4; l++) {
              if (l !== j) {
                // Exclude the i-th row and j-th column
                row.push(m[k][l]);
              }
            }
            // Add the row to the sub-minor
            subMinor.push(row);
          }
        }
        // Calculate the determinant of the 3x3 minor and apply (-1)^(i+j) multiplier
        minor.push(
          (i + j) % 2 === 0
            ? this._3x3Determinant(subMinor)
            : -this._3x3Determinant(subMinor)
        );
      }
      // Add the calculated cofactor to the minors array
      minors.push(minor);
    }
    let det = 0;
    for (let i = 0; i < 4; i++) {
      // Sum the products for the first row
      det += m[0][i] * minors[0][i];
    }
    this.determinant = det;
    this.modifiedDeterminant = false;
    return det;
  }

  _3x3Determinant(m: number[][]): number {
    return (
      // Formula for the determinant of a 3x3 matrix
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }

  // Calculates the inverse of the matrix.
  calculateInverse(): M4 {
    if (this.inverse !== null && !this.modifiedInverse) {
      return this.inverse;
    }

    let det = this.calculateDeterminant();
    if (det === 0) throw new Error("Matrix is not invertible.");

    let cofactorMatrix = []; // Array to store cofactors.
    for (let i = 0; i < 4; i++) {
      let cofactorRow = [];
      for (let j = 0; j < 4; j++) {
        // Generate the sub-matrix excluding the current row and column
        let subMatrix = [];
        for (let k = 0; k < 4; k++) {
          if (k !== i) {
            let subRow = [];
            for (let l = 0; l < 4; l++) {
              if (l !== j) {
                subRow.push(this.matrix[k][l]);
              }
            }
            subMatrix.push(subRow);
          }
        }
        // Calculate the determinant of the sub-matrix
        let cofactor = this._3x3Determinant(subMatrix);
        if ((i + j) % 2 === 1) cofactor *= -1; // Adjust sign based on position
        cofactorRow.push(cofactor); // Add the cofactor to the row
      }
      cofactorMatrix.push(cofactorRow); // Add the row to the cofactor matrix
    }

    // Transpose the cofactor matrix to get the adjugate
    let adjugateMatrix = new M4();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        adjugateMatrix.matrix[j][i] = cofactorMatrix[i][j] / det; // Divide each element by the determinant
      }
    }

    this.inverse = adjugateMatrix;
    this.modifiedInverse = false;
    return adjugateMatrix; // Return the inverse matrix
  }

  toQuaternion(): Quaternion {
    const m = this.matrix;
    const trace = m[0][0] + m[1][1] + m[2][2]; // Compute the trace of the 3x3 rotation part

    // Declare quaternion components
    let w, x, y, z;
    if (trace > 0) {
      // Case when trace is positive:
      // Scaling factor
      const S = Math.sqrt(trace + 1.0) * 2;
      w = 0.25 * S;
      x = (m[2][1] - m[1][2]) / S;
      y = (m[0][2] - m[2][0]) / S;
      z = (m[1][0] - m[0][1]) / S;
    } else if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) {
      // Case when the element m[0][0] is the largest diagonal member:
      const S = Math.sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]) * 2;
      w = (m[2][1] - m[1][2]) / S; // Calculate the scalar part based on m[0][0]
      x = 0.25 * S; // Set x as the leading term
      y = (m[0][1] + m[1][0]) / S; // Compute y component symmetrically
      z = (m[0][2] + m[2][0]) / S; // Compute z component symmetrically
    } else if (m[1][1] > m[2][2]) {
      // Case when m[1][1] is the largest diagonal member:
      const S = Math.sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]) * 2;
      w = (m[0][2] - m[2][0]) / S;
      x = (m[0][1] + m[1][0]) / S;
      y = 0.25 * S; // Set y as the leading term
      z = (m[1][2] + m[2][1]) / S;
    } else {
      // Case when m[2][2] is the largest diagonal member:
      const S = Math.sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]) * 2;
      w = (m[1][0] - m[0][1]) / S;
      x = (m[0][2] + m[2][0]) / S;
      y = (m[1][2] + m[2][1]) / S;
      z = 0.25 * S; // Set z as the leading term
    }

    return new Quaternion(w, x, y, z);
  }

  transpose(): M4 {
    const transposedMatrix = new M4();
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        // Swap the row and column indices
        transposedMatrix.matrix[j][i] = this.matrix[i][j];
      }
    }
    return transposedMatrix;
  }

  static transpose(a: M4): M4 {
    return a.transpose();
  }
}

export default M4;
