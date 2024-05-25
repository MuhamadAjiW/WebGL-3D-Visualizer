import Vector3 from "@/libs/base-types/vector3";
import { BufferAttribute } from "../webgl/attribute";

class BufferGeometry {
  public type: number = 0;
  public position: BufferAttribute | undefined;
  public normal: BufferAttribute | undefined;
  public texCoords: BufferAttribute | undefined;
  public tangent: BufferAttribute | undefined;
  public bitangent: BufferAttribute | undefined;
  public smoothShade: boolean = false;
  public vertexToIndex: Map<any, number[]> = new Map();

  calculateNormals(forceNewAttribute = false) {
    if (!this.smoothShade) {
      this.calculateNormalsFlat(forceNewAttribute);
    } else {
      this.calculateNormalsSmooth(forceNewAttribute);
    }
  }

  calculateNormalsFlat(forceNewAttribute = false) {
    const position = this.position;
    if (!position) {
      return;
    }

    let normal = this.normal;
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    // Triangles, might need to refactor if we implement it the other way
    if (position.length < position.size * 3) {
      throw new Error(
        "Geometry vertices is less than 3, needs at least 3 vertices to calculate the normal of a surface"
      );
    }

    for (let index = 0; index < position.count; index += 3) {
      const vertex1 = new Vector3(position.get(index));
      const vertex2 = new Vector3(position.get(index + 1));
      const vertex3 = new Vector3(position.get(index + 2));

      const vector1 = vertex2.substract(vertex1);
      const vector2 = vertex3.substract(vertex1);

      const vectorN = vector1.cross(vector2);

      normal.set(index, vectorN.getVector());
      normal.set(index + 1, vectorN.getVector());
      normal.set(index + 2, vectorN.getVector());
    }

    this.normal = normal;
  }

  calculateNormalsSmooth(forceNewAttribute = false) {
    const position = this.position;
    if (!position) {
      return;
    }

    let normal = this.normal;
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    this.calculateNormalsFlat();
    this.calculateSmoothShading();
  }

  // Note: Calculate normal before calculate tangent
  calculateTangents(forceNewAttribute = false) {
    const position = this.position;
    const texCoords = this.texCoords;
    if (!position || !texCoords) {
      return;
    }

    let tangent = this.tangent;
    if (forceNewAttribute || !tangent) {
      tangent = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    let bitangent = this.bitangent;
    if (forceNewAttribute || !bitangent) {
      bitangent = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    for (let index = 0; index < position.count; index += 3) {
      const vertex1 = new Vector3(position.get(index));
      const vertex2 = new Vector3(position.get(index + 1));
      const vertex3 = new Vector3(position.get(index + 2));
      const uv1 = new Vector3([...texCoords.get(index), 0]);
      const uv2 = new Vector3([...texCoords.get(index + 1), 0]);
      const uv3 = new Vector3([...texCoords.get(index + 2), 0]);

      const edge1 = vertex2.substract(vertex1);
      const edge2 = vertex3.substract(vertex1);
      const deltaUV1 = uv2.substract(uv1);
      const deltaUV2 = uv3.substract(uv1);

      const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);
      const tangent1 = new Vector3();
      tangent1.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
      tangent1.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
      tangent1.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);

      const bitangent1 = new Vector3();
      bitangent1.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
      bitangent1.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
      bitangent1.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);

      tangent.set(index, tangent1.getVector());
      tangent.set(index + 1, tangent1.getVector());
      tangent.set(index + 2, tangent1.getVector());

      bitangent.set(index, bitangent1.getVector());
      bitangent.set(index + 1, bitangent1.getVector());
      bitangent.set(index + 2, bitangent1.getVector());
    }

    this.tangent = tangent;
    this.bitangent = bitangent;
  }

  calculateVertexIndex() {
    if (this.position) {
      let i = 0;
      let array = this.position.data;
      array.forEach((element: any) => {
        if (this.vertexToIndex.has(element)) {
          let addElement = this.vertexToIndex.get(element)!;
          addElement.push(i);
          this.vertexToIndex.set(element, addElement);
        } else {
          this.vertexToIndex.set(element, [i]);
        }
        i += 1;
      });
    }
  }

  calculateSmoothShading() {
    this.calculateVertexIndex();

    for (const key of this.vertexToIndex.keys()) {
      const arrayIndex = this.vertexToIndex.get(key);
      let normalArray = this.normal!.data;
      let sum = 0;
      arrayIndex?.forEach((index: number) => {
        sum += normalArray[index];
      });
      arrayIndex?.forEach((index: number) => {
        normalArray[index] = sum;
      });
    }
  }
}

export { BufferGeometry };

/////

// computeTangents() {
//   const tan1 = [], tan2 = [];

//   for ( let i = 0; i < positionAttribute.count; i ++ ) {
//     tan1[ i ] = new Vector3();
//     tan2[ i ] = new Vector3();
//   }

//   const vA = new Vector3(),
//     vB = new Vector3(),
//     vC = new Vector3(),

//     uvA = new Vector2(),
//     uvB = new Vector2(),
//     uvC = new Vector2(),

//     sdir = new Vector3(),
//     tdir = new Vector3();

//   function handleTriangle( a, b, c ) {
//     vA.fromBufferAttribute( positionAttribute, a );
//     vB.fromBufferAttribute( positionAttribute, b );
//     vC.fromBufferAttribute( positionAttribute, c );

//     uvA.fromBufferAttribute( uvAttribute, a );
//     uvB.fromBufferAttribute( uvAttribute, b );
//     uvC.fromBufferAttribute( uvAttribute, c );

//     vB.sub( vA );
//     vC.sub( vA );

//     uvB.sub( uvA );
//     uvC.sub( uvA );

//     const r = 1.0 / ( uvB.x * uvC.y - uvC.x * uvB.y );

//     // silently ignore degenerate uv triangles having coincident or colinear vertices

//     if ( ! isFinite( r ) ) return;

//     sdir.copy( vB ).multiplyScalar( uvC.y ).addScaledVector( vC, - uvB.y ).multiplyScalar( r );
//     tdir.copy( vC ).multiplyScalar( uvB.x ).addScaledVector( vB, - uvC.x ).multiplyScalar( r );

//     tan1[ a ].add( sdir );
//     tan1[ b ].add( sdir );
//     tan1[ c ].add( sdir );

//     tan2[ a ].add( tdir );
//     tan2[ b ].add( tdir );
//     tan2[ c ].add( tdir );
//   }

//   let groups = this.groups;

//   if ( groups.length === 0 ) {

//     groups = [ {
//       start: 0,
//       count: index.count
//     } ];

//   }

//   for ( let i = 0, il = groups.length; i < il; ++ i ) {

//     const group = groups[ i ];

//     const start = group.start;
//     const count = group.count;

//     for ( let j = start, jl = start + count; j < jl; j += 3 ) {

//       handleTriangle(
//         index.getX( j + 0 ),
//         index.getX( j + 1 ),
//         index.getX( j + 2 )
//       );

//     }

//   }

//   const tmp = new Vector3(), tmp2 = new Vector3();
//   const n = new Vector3(), n2 = new Vector3();

//   function handleVertex( v ) {

//     n.fromBufferAttribute( normalAttribute, v );
//     n2.copy( n );

//     const t = tan1[ v ];

//     // Gram-Schmidt orthogonalize

//     tmp.copy( t );
//     tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

//     // Calculate handedness

//     tmp2.crossVectors( n2, t );
//     const test = tmp2.dot( tan2[ v ] );
//     const w = ( test < 0.0 ) ? - 1.0 : 1.0;

//     tangentAttribute.setXYZW( v, tmp.x, tmp.y, tmp.z, w );

//   }

//   for ( let i = 0, il = groups.length; i < il; ++ i ) {

//     const group = groups[ i ];

//     const start = group.start;
//     const count = group.count;

//     for ( let j = start, jl = start + count; j < jl; j += 3 ) {

//       handleVertex( index.getX( j + 0 ) );
//       handleVertex( index.getX( j + 1 ) );
//       handleVertex( index.getX( j + 2 ) );

//     }

//   }

// }
