import { NodeSchema, SceneSchema } from "@/types/ui";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import Object3D from "../class/object3d";

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
