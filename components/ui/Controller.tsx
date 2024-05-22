import { Euler } from "@/libs/base-types/euler";
import { Quaternion } from "@/libs/base-types/quaternion";
import Vector3 from "@/libs/base-types/vector3";
import Object3D from "@/libs/class/object3d";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { useRef } from "react";
import { Collapse } from "react-collapse";
import { GoChevronDown, GoChevronRight } from "react-icons/go";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  component: Object3D;
  handleSubmit: (values: any) => void;
  isControllerChange: boolean;
}

const ComponentController: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  component,
  handleSubmit,
  isControllerChange,
}) => {
  // TODO: setFromQuaternion is a little off here for some reason on the y axis at 90 degrees
  // The quick fix is just to only load it whenever the components reset so uhh
  const savedComponent = useRef<Object3D | null>(null)
  const rotation = useRef<Vector3>(Vector3.zero)
  const position = useRef<Vector3>(Vector3.zero)
  const scale = useRef<Vector3>(Vector3.one)
  const name = useRef<string>("")

  if(component && component != savedComponent.current){
    savedComponent.current = component;

    const euler = new Euler()
    euler.setFromQuaternion(component.rotation as Quaternion);
    rotation.current = euler.toVector3Degrees();
    position.current = component.position;
    scale.current = component.scale;
    name.current = component.name;
  }

  const formik = useFormik({
    initialValues: {
      name: name.current,
      position: {
        x: position.current.x,
        y: position.current.y,
        z: position.current.z,
      },
      rotation: {
        x: rotation.current.x,
        y: rotation.current.y,
        z: rotation.current.z,
      },
      scale: {
        x: scale.current.x,
        y: scale.current.y,
        z: scale.current.z,
      },
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
  });

  const refresh = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    formik.submitForm()
  }

  return (
    <>
      {component && (
        <div className="w-full py-2" id={id}>
          <div
            className="cursor-pointer flex gap-2 items-center"
            onClick={handleClick}
          >
            <div>{isExpanded ? <GoChevronDown /> : <GoChevronRight />}</div>
            <div>{title}</div>
          </div>
          <Collapse isOpened={isExpanded}>
            <div className="px-6 py-4 flex flex-col gap-5">
              <div className="flex items-center gap-3 w-full">
                <div className="w-1/4">Name</div>
                <div className="w-3/4">
                  <TextField
                    id="name"
                    name="name"
                    fullWidth
                    className="bg-white"
                    size="small"
                    onChange={refresh}
                    value={formik.values.name}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Position</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="position.x"
                      name="position.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.position.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="position.y"
                      name="position.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.position.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="position.z"
                      name="position.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.position.z}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Rotation</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="rotation.x"
                      name="rotation.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.rotation.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="rotation.y"
                      name="rotation.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.rotation.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="rotation.z"
                      name="rotation.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.rotation.z}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Scale</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="scale.x"
                      name="scale.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.scale.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="scale.y"
                      name="scale.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.scale.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="scale.z"
                      name="scale.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.scale.z}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      )}
    </>
  );
};

export default ComponentController;
