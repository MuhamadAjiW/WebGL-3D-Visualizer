declare class M4 {
  // Attributes
  private length: number;
  public matrix: number[][];

  // Constructor
  /**
   * Creates a new 4x4 matrix (M4).
   *
   * @param matrix - (Optional) A 4x4 matrix to initialize with. If omitted, a zero matrix will be created.
   */
  constructor(matrix?: number[][]);

  // Static Methods
  /**
   * Creates an M4 instance from a column-major matrix.
   *
   * @param matrix - A 4x4 matrix provided in column-major order.
   * @returns An M4 instance with the matrix stored in row-major order.
   */
  static fromColumnMajor(matrix: number[][]): M4;

  /**
   * Returns an identity matrix.
   *
   * @returns An identity M4 matrix.
   */
  static identity(): M4;

  /**
   * Returns a zero matrix.
   *
   * @returns An M4 matrix with all values set to zero.
   */
  static zero(): M4;

  /**
   * Checks if two M4 matrices are equal.
   *
   * @param a - The first matrix to compare.
   * @param b - The second matrix to compare.
   * @returns `true` if the two matrices are equal, `false` otherwise.
   */
  static isEqual(a: M4, b: M4): boolean;

  /**
   * Transposes a given M4 matrix.
   *
   * @param a - The matrix to transpose.
   * @returns The transposed M4 matrix.
   */
  static transpose(a: M4): M4;

  /**
   * Creates a frustum projection matrix.
   *
   * @param left - Left clipping plane.
   * @param right - Right clipping plane.
   * @param bottom - Bottom clipping plane.
   * @param top - Top clipping plane.
   * @param near - Near clipping plane.
   * @param far - Far clipping plane.
   * @returns An M4 matrix representing the frustum projection.
   */
  static frustum(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): M4;

  /**
   * Creates an orthographic projection matrix.
   *
   * @param left - Left clipping plane.
   * @param right - Right clipping plane.
   * @param bottom - Bottom clipping plane.
   * @param top - Top clipping plane.
   * @param near - Near clipping plane.
   * @param far - Far clipping plane.
   * @returns An M4 matrix representing the orthographic projection.
   */
  static ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): M4;

  /**
   * Creates a perspective projection matrix.
   *
   * @param fovY - The field of view angle in the Y direction.
   * @param aspect - The aspect ratio of the viewport.
   * @param near - Near clipping plane.
   * @param far - Far clipping plane.
   * @returns An M4 matrix representing the perspective projection.
   */
  static perspective(
    fovY: number,
    aspect: number,
    near: number,
    far: number
  ): M4;

  /**
   * Creates a translation matrix for 3D coordinates.
   *
   * @param pos - A 3D vector representing the translation.
   * @returns An M4 matrix that translates by the given vector.
   */
  static translation3d(pos: Vector3): M4;

  /**
   * Creates a scaling matrix for 3D coordinates.
   *
   * @param s - A 3D vector representing the scaling factors.
   * @returns An M4 matrix that scales by the given factors.
   */
  static scale3d(s: Vector3): M4;

  /**
   * Multiplies two matrices together.
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns The product of the two matrices.
   */
  static multiply(a: M4, b: M4): M4;

  /**
   * Multiplies an array of matrices together sequentially.
   *
   * @param matrices - An array of matrices to multiply.
   * @returns The product of all the matrices.
   * @throws Will throw an error if fewer than two matrices are provided.
   */
  static mul(...matrices: M4[]): M4;

  /**
   * Combines translation, rotation, and scaling into a single transformation matrix.
   *
   * @param pos - The translation vector.
   * @param q - The quaternion representing the rotation.
   * @param s - The scaling vector.
   * @returns An M4 matrix representing the combined transformation.
   */
  static TRS(pos: Vector3, q: Quaternion, s: Vector3): M4;

  /**
   * Converts a quaternion to a rotation matrix and returns it as an M4.
   *
   * @param q - The quaternion representing the rotation.
   * @returns An M4 matrix representing the rotation.
   */
  static rotation3d(q: Quaternion): M4;

  /**
   * Flattens a matrix to a 1D array in column-major order.
   *
   * @param matrix - The matrix to flatten.
   * @returns A 1D array representing the flattened matrix.
   */
  static flatten(matrix: M4): number[];

  /**
   * Creates an M4 instance from a JSON string.
   *
   * @param json - A JSON string representing the matrix data.
   * @returns An M4 instance with the data from the JSON string.
   */
  static fromJSON(json: string): M4;

  /**
   * Converts an M4 instance to a JSON string.
   *
   * @param matrix - The matrix to convert.
   * @returns A JSON string representing the matrix data.
   */
  static toJSON(matrix: M4): string;

  // Methods

  /**
   * Gets the value at the specified row and column.
   *
   * @param row - The row index.
   * @param col - The column index.
   * @returns The value at the specified position.
   * @throws Will throw an error if the index is out of bounds.
   */
  get(row: number, col: number): number;

  /**
   * Sets the value at the specified row and column.
   *
   * @param row - The row index.
   * @param col - The column index.
   * @param value - The value to set.
   * @throws Will throw an error if the index is out of bounds.
   */
  set(row: number, col: number, value: number): void;

  /**
   * Checks if this matrix is equal to another matrix.
   *
   * @param b - The matrix to compare with.
   * @returns `true` if the two matrices are equal, `false` otherwise.
   */
  isEqual(b: M4): boolean;

  /**
   * Checks if this matrix is an identity matrix.
   *
   * @returns `true` if this is an identity matrix, `false` otherwise.
   */
  isIdentity(): boolean;

  /**
   * Calculates the determinant of the matrix.
   *
   * @returns The determinant value.
   */
  determinant(): number;

  /**
   * Calculates the inverse of the matrix.
   *
   * @returns An M4 matrix representing the inverse of this matrix.
   * @throws Will throw an error if the matrix is not invertible.
   */
  inverse(): M4;

  /**
   * Converts this matrix to a quaternion representation.
   *
   * @returns A quaternion representing the matrix.
   */
  toQuaternion(): Quaternion;

  /**
   * Transposes this matrix.
   *
   * @returns The transposed M4 matrix.
   */
  transpose(): M4;

  /**
   * Retrieves a specified column from the matrix.
   *
   * @param idx - The column index.
   * @returns An array representing the column.
   * @throws Will throw an error if the index is out of bounds.
   */
  getColumn(idx: number): number[];

  /**
   * Retrieves a specified row from the matrix.
   *
   * @param idx - The row index.
   * @returns An array representing the row.
   * @throws Will throw an error if the index is out of bounds.
   */
  getRow(idx: number): number[];

  /**
   * Gets the position vector from this matrix.
   *
   * @returns An array representing the position.
   */
  getPosition(): number[];

  /**
   * Transforms a position vector by this matrix.
   *
   * @param position - The 3D position to transform.
   * @returns The transformed position.
   */
  transformPosition(position: Vector3): Vector3;

  /**
   * Transforms a direction vector by this matrix.
   *
   * @param direction - The 3D direction to transform.
   * @returns The transformed direction.
   */
  transformDirection(direction: Vector3): Vector3;

  /**
   * Sets the values for a specified column.
   *
   * @param index - The column index.
   * @param column - The values to set in the column.
   * @throws Will throw an error if the index or column length is invalid.
   */
  setColumn(index: number, column: number[]): void;

  /**
   * Sets the values for a specified row.
   *
   * @param index - The row index.
   * @param row - The values to set in the row.
   * @throws Will throw an error if the index or row length is invalid.
   */
  setRow(index: number, row: number[]): void;

  /**
   * Sets this matrix as a translation, rotation, and scaling (TRS) matrix.
   *
   * @param translation - The translation vector.
   * @param rotation - The rotation matrix (M4).
   * @param scale - The scaling factors.
   */
  setTRS(translation: number[], rotation: M4, scale: number[]): void;

  /**
   * Converts the matrix to a formatted string.
   *
   * @returns A string representation of the matrix.
   */
  toString(): string;

  /**
   * Transforms a plane by this matrix.
   *
   * @param plane - An object containing the plane normal vector and a `d` value.
   * @returns An object containing the transformed plane normal vector and `d` value.
   */
  transformPlane(plane: { normal: Vector3; d: number }): {
    normal: Vector3;
    d: number;
  };

  /**
   * Checks if this matrix is a valid TRS matrix (excluding perspective distortions).
   *
   * @returns `true` if the matrix is a valid TRS matrix, `false` otherwise.
   */
  validTRS(): boolean;

  /**
   * Calculates the inverse of this matrix if it is affine.
   *
   * @returns An M4 matrix representing the inverse of this affine matrix.
   */
  inverse3DAffine(): M4;

  /**
   * Clones the current matrix.
   *
   * @returns A new M4 instance that is a copy of this matrix.
   */
  clone(): M4;

  /**
   * Creates a "look at" matrix for camera transformations.
   *
   * @param eye - The position of the camera.
   * @param center - The point the camera is looking at.
   * @param up - The up direction for the camera.
   * @returns An M4 matrix representing the "look at" transformation.
   */
  static lookAt(eye: Vector3, center: Vector3, up: Vector3): M4;
}

export default M4;
