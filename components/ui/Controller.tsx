import { GoChevronRight } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { Collapse } from "react-collapse";
import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { InputOptions } from "@/types/ui";
import { useState } from "react";
import Button from "./Button";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  isCamera?: boolean;
}

const Controller: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  isCamera,
}) => {
  const cameraType: InputOptions[] = [
    {
      name: "Oblique Camera",
      value: "obliqueCamera",
    },
    {
      name: "Orthographic Camera",
      value: "orthographicCamera",
    },
    {
      name: "Perspective Camera",
      value: "perspectiveCamera",
    },
  ];

  const [camera, setCamera] = useState("perspectiveCamera");

  const handleChange = (event: SelectChangeEvent) => {
    setCamera(event.target.value);
  };

  return (
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
          {!isCamera ? (
            <>
              <div className="flex items-center gap-3 w-full">
                <div className="w-1/4">Name</div>
                <div className="w-3/4">
                  <TextField
                    id="name-field"
                    fullWidth
                    className="bg-white"
                    size="small"
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
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                  <div>Distance</div>
                  <TextField
                    id="distance-field"
                    type="number"
                    className="bg-white"
                    size="small"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>Camera Type</div>
                  <Select value={camera} onChange={handleChange} className="bg-white" size="small">
                    {cameraType.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="flex justify-end items-center">
                  <Button 
                    id="reset-default"
                    text="Reset"
                    className="bg-white text-black py-1 px-4 rounded-sm"
                    handleClick={() => {}}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default Controller;
