import { NodeSchema, SceneSchema } from "@/types/ui";
import { TreeViewBaseItem } from "@mui/x-tree-view";

export const convertGLTFToTreeView = (
  scheneSchema: SceneSchema
): TreeViewBaseItem => {
  return {
    id: scheneSchema.id,
    label: scheneSchema.name,
    children: scheneSchema.children?.map(convertGLTFToTreeView),
  };
};

export const findMeshById = (
  nodeSchema: NodeSchema[],
  id: string
): NodeSchema | null => {
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
