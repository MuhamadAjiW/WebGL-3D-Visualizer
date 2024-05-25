import { TreeViewBaseItem } from "@mui/x-tree-view";
import Object3D from "../class/object3d";
import { Scene } from "../class/scene";
import { Mesh } from "../class/mesh";
import { Color } from "../base-types/color";

export const convertGLTFToTreeView = (
  scheneSchema: any //change this later
): TreeViewBaseItem => {
  // console.log("This is schene Schema", scheneSchema)
  return {
    id: scheneSchema.name,
    label: scheneSchema.name,
    children: scheneSchema.children?.map(convertGLTFToTreeView),
  };
};

export const findMeshById = (
  nodeSchema: any, // change this later and return type
  id: string
): Object3D | null => {
  for (let node of nodeSchema) {
    if (node.name === id) {
      return node;
    }
    if (node.children) {
      let result = findMeshById(node.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const convertLoadToTree = (
  dict: { [key: number]: boolean },
  nodes: any,
  index: number
) => {
  if (dict[index]) {
    const node = nodes[index];
    dict[index] = false;
    return {
      id: node.name,
      name: node.name,
      position: {
        x: node.translation[0],
        y: node.translation[1],
        z: node.translation[2],
      },
      rotation: {
        x: node.rotation[0],
        y: node.rotation[1],
        z: node.rotation[2],
      },
      scale: {
        x: node.scale[0],
        y: node.scale[1],
        z: node.scale[2],
      },
      visible: node.visible,
      localMatrix: node.localMatrix,
      worldMatrix: node.worldMatrix,
      cameraIndex: node.cameraIndex,
      meshIndex: node.meshIndex,
      children: node.children.map((childIndex: number) =>
        convertLoadToTree(dict, nodes, childIndex)
      ),
    };
  }
};

export const convertGLTFToLoad = (GLTFTree: any): Scene => {
  const saveScene = new Scene();

  saveScene.name = GLTFTree.name;

  const length = GLTFTree.children.length;

  for (let i = 0; i < length; i++) {
    const node = GLTFTree.children[0];
    saveScene.add(node);
    GLTFTree.children.push(node);
  }

  return saveScene;
};

export const convertHexToRGBA = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = parseInt(hex.slice(7, 9), 16);
  return { r, g, b, a };
};

export const rgbaToHex = (color: Color) => {
  let [r, g, b, a] = color.get();
  r = Math.floor(r * a);
  g = Math.floor(g * a);
  b = Math.floor(b * a);
  const hex = (r << 16) | (g << 8) | b;
  return "#" + hex.toString(16).padStart(6, "0");
};
