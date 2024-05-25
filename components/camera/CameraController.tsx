import { CameraControllerType } from "@/libs/controllers";
import { InputOptions } from "@/types/ui";
import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { Collapse } from "react-collapse";
import { GoChevronDown, GoChevronRight } from "react-icons/go";
import UIButton from "../ui/Button";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  cameraController: CameraControllerType
  setCameraController: Dispatch<SetStateAction<CameraControllerType>>
}

const CameraController: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  cameraController,
  setCameraController
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

  let newCameraState: CameraControllerType = { ...cameraController }
  const handleDistanceChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if(+event.target.value){
      newCameraState.distance = +event.target.value;
      setCameraController(newCameraState);
    }
  }

  const handleCameraChange = (event: SelectChangeEvent) => {
    newCameraState.type = event.target.value;
    setCameraController(newCameraState);
  }
  
  const handleCameraReset = () => {
    newCameraState.reset = true;
    setCameraController(newCameraState);
  }

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
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between gap-3">
              <div>Distance</div>
              <TextField
                id="distance-field"
                type="number"
                className="bg-white"
                size="small"
                onChange={handleDistanceChange}
                value={cameraController.distance || ""}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>Camera Type</div>
              <Select
                value={cameraController.type}
                onChange={handleCameraChange}
                className="bg-white"
                size="small"
              >
                {cameraType.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex justify-end items-center">
              <UIButton
                id="reset-default"
                text="Reset"
                className="bg-white text-black py-1 px-4 rounded-sm"
                handleClick={handleCameraReset}
              />
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CameraController;
