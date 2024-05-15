import { GoChevronRight } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { Collapse } from "react-collapse";
import { TextField } from "@mui/material";
import Button from "./Button";
import { NodeSchema } from "@/types/ui";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  component: NodeSchema; // this will be change later
}

const Controller: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  component,
}) => {
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
                    id="name-field"
                    fullWidth
                    className="bg-white"
                    size="small"
                    value={component.name} // this also will be changed
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Position</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="x-field"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      value={component.position.x || 0}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="y-field"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      value={component.position.y || 0}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="z-field"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      value={component.position.z || 0}
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
                      id="x-field"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      value={component.rotation.x || 0 }
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="y-field"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      value={component.rotation.y || 0 }
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="z-field"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      value={component.rotation.z || 0 }
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
                      id="x-field"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      value={component.scale.x || 0}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="y-field"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      value={component.scale.y || 0}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="z-field"
                      fullWidth
                      type="number"
                      className="bg-white"  
                      size="small"
                      value={component.scale.z || 0}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <Button
                  id="apply-button"
                  text="Apply"
                  handleClick={() => {}}
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
