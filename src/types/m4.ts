import { Quaternion } from "./quaternion";
import Vector3 from "./vector3";

class M4 {
  // ATTRIBUTES
  private length = 4;
  public matrix: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // CONSTRUCTOR
  constructor(matrix?: number[][]) {
    if (matrix) {
      // deep copy
      this.matrix = matrix.map((row) => [...row]);
    } else {
      this.matrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  static fromColumnMajor(matrix: number[][]): M4 {
    let result = new M4(matrix);
    result = result.transpose();
    return result;
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

  determinant(): number {
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
  inverse(): M4 {
    let det = this.determinant();
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

  getColumn(idx: number): number[] {
    let col = [];
    for (let i = 0; i < this.length; i++) {
      col.push(this.matrix[i][idx]);
    }
    return [...col];
  }

  getRow(idx: number): number[] {
    return [...this.matrix[idx]];
  }

  // Method to get the position vector from the matrix
  getPosition(): number[] {
    return [
      this.matrix[0][3], // x component
      this.matrix[1][3], // y component
      this.matrix[2][3], // z component
    ];
  }

  // Method to transform a position vector by the matrix
  transformPosition(position: Vector3): Vector3 {
    // Convert the 3D position to a 4D vector with the fourth component as 1
    let vector = [position.x, position.y, position.z, 1];
    let result = [0, 0, 0, 0];

    // Perform matrix multiplication
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += this.matrix[i][j] * vector[j];
      }
    }

    // Return only the x, y, z components, discarding the homogeneous coordinate
    return new Vector3(result);
  }

  // Method to transform a direction vector by the matrix
  transformDirection(direction: Vector3): Vector3 {
    // Initialize the result vector with zeros
    let result = [0, 0, 0];
    let arrDirection = direction.getVector();

    // Only use the top-left 3x3 part of the matrix for transformation
    for (let i = 0; i < 3; i++) {
      // Iterate over the rows of the matrix
      for (let j = 0; j < 3; j++) {
        // Iterate over the columns of the matrix
        result[i] += this.matrix[i][j] * arrDirection[j];
      }
    }

    return new Vector3(result);
  }

  setColumn(index: number, column: number[]): void {
    if (index < 0 || index >= this.length || column.length !== this.length) {
      throw new Error("Invalid column index or column length.");
    }
    for (let i = 0; i < this.length; i++) {
      this.matrix[i][index] = column[i];
    }
  }

  setRow(index: number, row: number[]): void {
    if (index < 0 || index >= this.length || row.length !== this.length) {
      throw new Error("Invalid row index or row length.");
    }
    this.matrix[index] = [...row];
  }

  // Sets this matrix to a translation, rotation, and scaling matrix
  setTRS(translation: number[], rotation: M4, scale: number[]): void {
    // Clear the matrix to identity
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.matrix[i][j] = i === j ? 1 : 0;
      }
    }
    // Apply scaling
    for (let i = 0; i < 3; i++) {
      this.matrix[i][i] = scale[i];
    }
    // Apply rotation
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.matrix[i][j] *= rotation.matrix[i][j];
      }
    }
    // Apply translation
    for (let i = 0; i < 3; i++) {
      this.matrix[i][3] = translation[i];
    }
  }

  // Returns a formatted string for this matrix
  toString(): string {
    return this.matrix.map((row) => row.join("\t")).join("\n");
  }

  // Transforms a plane in space
  transformPlane(plane: { normal: Vector3; d: number }): {
    normal: Vector3;
    d: number;
  } {
    const transformedNormal = this.transformDirection(plane.normal);
    const planeNormalArr = plane.normal.getVector();
    const transformedNormalArr = transformedNormal.getVector();
    const pointOnPlane = planeNormalArr.map((value, _index) => value * plane.d);
    const transformedPoint = this.transformPosition(new Vector3(pointOnPlane));
    const transformedPointArr = transformedPoint.getVector();
    const newD = transformedNormalArr.reduce(
      (acc, n, i) => acc + n * transformedPointArr[i],
      0
    );
    return { normal: transformedNormal, d: newD };
  }

  // Checks if this matrix is a valid transform matrix (not considering perspective distortions)
  validTRS(): boolean {
    // Check if last row is [0, 0, 0, 1]
    const lastRow = [0, 0, 0, 1];
    return lastRow.every((val, index) => this.matrix[3][index] === val);
  }

  // STATIC METHODS
  // creates a projection matrix that defines a viewable region known as a frustum, which resembles a truncated pyramid. In a perspective projection, objects closer to the viewer appear larger, and objects further away appear smaller.
  static frustum(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): M4 {
    const m = new M4();
    m.matrix[0][0] = (2 * near) / (right - left);
    m.matrix[1][1] = (2 * near) / (top - bottom);
    m.matrix[0][2] = (right + left) / (right - left);
    m.matrix[1][2] = (top + bottom) / (top - bottom);
    m.matrix[2][2] = -(far + near) / (far - near);
    m.matrix[3][2] = -1;
    m.matrix[2][3] = -(2 * far * near) / (far - near);
    m.matrix[3][3] = 0;
    return m;
  }

  // An affine matrix includes rotation, scaling, translation, and shearing, but retains lines and parallelism (lines remain lines, parallel lines remain parallel).
  inverse3DAffine(): M4 {
    // Assumes matrix is affine: Last row is [0, 0, 0, 1]
    // Not implemented here due to complexity, use calculateInverse() if affine.
    return this.inverse();
  }

  // Method to clone the current matrix
  clone(): M4 {
    // Using the constructor to create a new M4 instance with a copied matrix
    return new M4(this.matrix.map((row) => row.slice()));
  }

  // used for camera transformations in graphics
  // Orients the scene so that the desired object or location is centered in the viewport.
  static lookAt(eye: Vector3, center: Vector3, up: Vector3): M4 {
    const f = center.substract(eye).normalize();
    const s = f.cross(up.normalize());
    const u = s.cross(f);

    const m = new M4();
    m.matrix[0][0] = s.x;
    m.matrix[1][0] = s.y;
    m.matrix[2][0] = s.z;
    m.matrix[0][1] = u.x;
    m.matrix[1][1] = u.y;
    m.matrix[2][1] = u.z;
    m.matrix[0][2] = -f.x;
    m.matrix[1][2] = -f.y;
    m.matrix[2][2] = -f.z;
    m.matrix[3][0] = -s.dot(eye);
    m.matrix[3][1] = -u.dot(eye);
    m.matrix[3][2] = f.dot(eye);
    m.matrix[3][3] = 1;
    return m;
  }

  // An orthogonal projection matrix flattens 3D space into 2D without perspective, maintaining parallel lines
  static ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): M4 {
    const m = new M4();
    m.matrix[0][0] = 2 / (right - left);
    m.matrix[1][1] = 2 / (top - bottom);
    m.matrix[2][2] = -2 / (far - near);
    m.matrix[0][3] = -(right + left) / (right - left);
    m.matrix[1][3] = -(top + bottom) / (top - bottom);
    m.matrix[2][3] = -(far + near) / (far - near);
    m.matrix[3][3] = 1;
    return m;
  }

  // Similar to the frustum, but specified with a field of view angle (fovY), aspect ratio, and near and far distances.
  // Focuses on depth and angle of view.
  static perspective(
    fovY: number,
    aspect: number,
    near: number,
    far: number
  ): M4 {
    const f = 1.0 / Math.tan(fovY / 2);
    const m = new M4();
    m.matrix[0][0] = f / aspect;
    m.matrix[1][1] = f;
    m.matrix[2][2] = (far + near) / (near - far);
    m.matrix[2][3] = (2 * far * near) / (near - far);
    m.matrix[3][2] = -1;
    m.matrix[3][3] = 0;
    return m;
  }

  // Creates a translation matrix
  static translation3d(pos: Vector3): M4 {
    let m = M4.identity();
    m.matrix[0][3] = pos.x;
    m.matrix[1][3] = pos.y;
    m.matrix[2][3] = pos.z;
    return m;
  }

  // Creates a scaling matrix
  static scale3d(s: Vector3): M4 {
    let m = M4.identity();
    m.matrix[0][0] = s.x;
    m.matrix[1][1] = s.y;
    m.matrix[2][2] = s.z;
    return m;
  }

  // Multiplies this matrix by another matrix
  static multiply(a: M4, b: M4): M4 {
    let result = new M4();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result.matrix[i][j] = 0;
        for (let k = 0; k < 4; k++) {
          result.matrix[i][j] += a.matrix[i][k] * b.matrix[k][j];
        }
      }
    }
    return result;
  }

  static mul(...matrices: M4[]): M4 {
    if (matrices.length < 2) {
      throw new Error("Need at least two matrices to multiply.");
    }

    let result = matrices[0];
    for (let i = 1; i < matrices.length; i++) {
      result = M4.multiply(result, matrices[i]);
    }
    return result;
  }

  // Static version of TRS combining translate, rotate (from Quaternion), and scale
  public static TRS(pos: Vector3, q: Quaternion, s: Vector3): M4 {
    let translation = M4.translation3d(pos);
    let rotation = M4.rotation3d(q);
    let scaling = M4.scale3d(s);

    // The order of multiplication depends on specific needs: usually translate * rotate * scale
    return M4.multiply(translation, M4.multiply(rotation, scaling));
  }

  // Converts a quaternion to a rotation matrix and embeds it in an M4
  static rotation3d(q: Quaternion): M4 {
    let matrix = new M4();
    let rot = q.toRotationMatrix();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        matrix.matrix[i][j] = rot[i][j];
      }
    }
    matrix.matrix[3][3] = 1;
    return matrix;
  }

  public static flatten(matrix: M4): number[] {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        result.push(matrix.matrix[j][i]);
      }
    }
    return result;
  }

  // SAVE AND LOAD
  static fromJSON(json: string): M4 {
    const matrixData = JSON.parse(json);
    return new M4(matrixData);
  }

  static toJSON(matrix: M4): string {
    return JSON.stringify(matrix.matrix);
  }
}

export default M4;
