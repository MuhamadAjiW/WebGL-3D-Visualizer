import { NodeSchema, SceneSchema } from "@/types/ui";
import { TreeViewBaseItem } from "@mui/x-tree-view";

export const convertGLTFToTreeView = (
  scheneSchema: any //change this later
): TreeViewBaseItem => {
  return {
    id: scheneSchema.id,
    label: scheneSchema.name,
    children: scheneSchema.children?.map(convertGLTFToTreeView),
  };
};

export const findMeshById = (
  nodeSchema: any, // change this later and return type
  id: string
) : any => {
  for (let node of nodeSchema) {
    if (node.id === id) {
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
