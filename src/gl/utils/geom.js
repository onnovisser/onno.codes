import * as THREE from 'three';

function addBarycentricCoordinates(bufferGeometry, removeEdge = false) {
  const attrib =
    bufferGeometry.getIndex() || bufferGeometry.getAttribute('position');
  const count = attrib.count / 3;
  const barycentric = [];

  // for each triangle in the geometry, add the barycentric coordinates
  for (let i = 0; i < count; i++) {
    const even = i % 2 === 0;
    const Q = removeEdge ? 1 : 0;
    if (even) {
      barycentric.push(0, 0, 1, 0, 1, 0, 1, 0, Q);
    } else {
      barycentric.push(0, 1, 0, 0, 0, 1, 1, 0, Q);
    }
  }

  // add the attribute to the geometry
  const array = new Float32Array(barycentric);
  const attribute = new THREE.BufferAttribute(array, 3);
  bufferGeometry.addAttribute('barycentric', attribute);
}

function unindexBufferGeometry(bufferGeometry) {
  // un-indices the geometry, copying all attributes like position and uv
  const index = bufferGeometry.getIndex();
  if (!index) return; // already un-indexed

  const indexArray = index.array;
  const triangleCount = indexArray.length / 3;

  const attributes = bufferGeometry.attributes;
  const newAttribData = Object.keys(attributes).map(key => {
    return {
      array: [],
      attribute: bufferGeometry.getAttribute(key),
    };
  });

  for (let i = 0; i < triangleCount; i++) {
    // indices into attributes
    const a = indexArray[i * 3 + 0];
    const b = indexArray[i * 3 + 1];
    const c = indexArray[i * 3 + 2];
    const indices = [a, b, c];

    // for each attribute, put vertex into unindexed list
    newAttribData.forEach(data => {
      const attrib = data.attribute;
      const dim = attrib.itemSize;
      // add [a, b, c] vertices
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        for (let d = 0; d < dim; d++) {
          const v = attrib.array[index * dim + d];
          data.array.push(v);
        }
      }
    });
  }
  index.array = null;
  bufferGeometry.setIndex(null);

  // now copy over new data
  newAttribData.forEach(data => {
    const newArray = new data.attribute.array.constructor(data.array);
    data.attribute.setArray(newArray);
  });
}

function computeCentroids(bufferGeometry) {
  const attrib = bufferGeometry.getAttribute('position');
  const count = attrib.count / 3;
  const pos = attrib.array;
  const centroids = [];

  for (let i = 0; i < count; i++) {
    const j = i * 9;
    const x = (pos[j] + pos[j + 3] + pos[j + 6]) / 3;
    const y = (pos[j + 1] + pos[j + 4] + pos[j + 7]) / 3;
    const z = (pos[j + 2] + pos[j + 5] + pos[j + 8]) / 3;

    centroids[j] = x;
    centroids[j + 1] = y;
    centroids[j + 2] = z;

    centroids[j + 3] = x;
    centroids[j + 4] = y;
    centroids[j + 5] = z;

    centroids[j + 6] = x;
    centroids[j + 7] = y;
    centroids[j + 8] = z;
  }

  // add the attribute to the geometry
  const array = new Float32Array(centroids);
  const attribute = new THREE.BufferAttribute(array, 3);
  bufferGeometry.addAttribute('centroid', attribute);
}

function createAttribute(geometry, name, itemSize, factory, perFace) {
  const mult = perFace ? 3 : 1; // Assuming a geometry with only triangles
  const { count } = geometry.attributes.position;
  const buffer = new Float32Array(count * itemSize);
  const attribute = new THREE.BufferAttribute(buffer, itemSize);

  geometry.addAttribute(name, attribute);

  if (factory) {
    const data = [];
    for (let i = 0; i < count; i += mult) {
      factory(data, i, count);
      setPrefabData(geometry, attribute, i, data);
    }
  }

  return attribute;
}

/**
 * Sets data for all vertices of a prefab at a given index.
 * Usually called in a loop.
 *
 * @param {String|BufferAttribute} attribute The attribute or attribute name where the data is to be stored.
 * @param {Number} prefabIndex Index of the prefab in the buffer geometry.
 * @param {Array} data Array of data. Length should be equal to item size of the attribute.
 */
function setPrefabData(geometry, attribute, prefabIndex, data) {
  attribute =
    typeof attribute === 'string' ? geometry.attributes[attribute] : attribute;

  let offset = prefabIndex * geometry.prefabVertexCount * attribute.itemSize;

  for (let i = 0; i < geometry.prefabVertexCount; i++) {
    for (let j = 0; j < attribute.itemSize; j++) {
      attribute.array[offset++] = data[j];
    }
  }
}

export {
  addBarycentricCoordinates,
  unindexBufferGeometry,
  createAttribute,
  computeCentroids,
};
