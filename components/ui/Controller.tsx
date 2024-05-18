import { GoChevronRight } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { Collapse } from "react-collapse";
import { TextField } from "@mui/material";
import Button from "./Button";
import { useFormik } from "formik";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  component: any; // this will be change later
  handleSubmit: (values: any) => void; // this will be change later
}

const Controller: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  component,
  handleSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      name: component?.name || "",
      position: {
        x: component?.position.x || 0,
        y: component?.position.y || 0,
        z: component?.position.z || 0,
      },
      rotation: {
        w: component?.rotation.w || 0,
        x: component?.rotation.x || 0,
        y: component?.rotation.y || 0,
        z: component?.rotation.z || 0,
      },
      scale: {
        x: component?.scale.x || 0,
        y: component?.scale.y || 0,
        z: component?.scale.z || 0,
      },
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
  });

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
                    onChange={formik.handleChange}
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
                      onChange={formik.handleChange}
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
                      onChange={formik.handleChange}
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
                      onChange={formik.handleChange}
                      value={formik.values.position.z}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Rotation</div>
                <div className="grid grid-cols-2 items-center gap-2">
                  <div className="flex items-center justify-end">
                    <div>W</div>
                    <TextField
                      id="rotation.w"
                      name="rotation.w"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={formik.handleChange}
                      value={formik.values.rotation.w}
                    />
                  </div>
                  <div className="flex gap-1 items-center justify-end">
                    <div>X</div>
                    <TextField
                      id="rotation.x"
                      name="rotation.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={formik.handleChange}
                      value={formik.values.rotation.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center justify-end">
                    <div>Y</div>
                    <TextField
                      id="rotation.y"
                      name="rotation.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={formik.handleChange}
                      value={formik.values.rotation.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center justify-end">
                    <div>Z</div>
                    <TextField
                      id="rotation.z"
                      name="rotation.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={formik.handleChange}
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
                      onChange={formik.handleChange}
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
                      onChange={formik.handleChange}
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
                      onChange={formik.handleChange}
                      value={formik.values.scale.z}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <Button
                  id="apply-button"
                  text="Apply"
                  type="submit"
                  handleClick={formik.handleSubmit}
                  className="bg-white text-black px-4 py-1"
                />
              </div>
            </div>
          </Collapse>
        </div>
      )}
    </>
  );
};

export default Controller;
