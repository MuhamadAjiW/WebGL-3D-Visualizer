import { InputOptions } from "@/types/ui";
import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";
import Button from "./Button";
import { GoChevronDown, GoChevronRight } from "react-icons/go";
import { Collapse } from "react-collapse";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  camera: string;
  handleCameraChange: (event: SelectChangeEvent) => void;
}

const CameraController: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  camera,
  handleCameraChange,
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
              <Select
                value={camera}
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
              <Button
                id="reset-default"
                text="Reset"
                className="bg-white text-black py-1 px-4 rounded-sm"
                handleClick={() => {}}
              />
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CameraController;
