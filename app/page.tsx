"use client";

import CameraController from "@/components/camera/CameraController";
import RenderComponent from "@/components/render/RenderComponent";
import Button from "@/components/ui/Button";
import ComponentController from "@/components/ui/Controller";
import CustomSlider from "@/components/ui/slider";
import TreeView from "@/components/ui/TreeView";
import { AnimationClip } from "@/libs/base-types/animation";
import { Euler } from "@/libs/base-types/euler";
import { Quaternion } from "@/libs/base-types/quaternion";
import Vector3 from "@/libs/base-types/vector3";
import { AnimationEasingType } from "@/libs/class/animation/animation-easing";
import { Loader } from "@/libs/class/loader/loader";
import Object3D from "@/libs/class/object3d";
import { Scene } from "@/libs/class/scene";
import {
  AnimationControllerType,
  CameraControllerType,
} from "@/libs/controllers";
import { convertGLTFToLoad, convertGLTFToTreeView, findMeshById } from "@/libs/helper";
import { MathUtil } from "@/libs/util/math-util";
import { InputOptions } from "@/types/ui";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

const testAnim: AnimationClip = {
  name: "Test",
  frames: [
    // 0
    {
      keyframe: {},
      children: {
        Parent: {
          keyframe: {
            translation: [0, 0, 0],
            rotation: [0, 0, 0],
          },
          children: {
            Left: {
              keyframe: {
                rotation: [0, 0, 0],
              },
            },
          },
        },
      },
    },
    // 1
    {
      keyframe: {},
      children: {
        Parent: {
          keyframe: {
            translation: [-0.5, 0, 0],
            rotation: [0, 0.5, 0],
          },
          children: {
            Left: {
              keyframe: {
                rotation: [2, 0, 0],
              },
            },
          },
        },
      },
    },
    // 2
    {
      keyframe: {},
      children: {
        Parent: {
          keyframe: {
            translation: [0.5, 0, 0],
            rotation: [0, 0.25, 0],
          },
          children: {
            Left: {
              keyframe: {
                rotation: [0, 1, 0],
              },
            },
          },
        },
      },
    },
  ],
};
// const testAnim: AnimationClip = {
//   name: "Test2",
//   frames: [
//     // 0
//     {
//       keyframe: {
//         rotation: [0, 0, 0],
//       },
//       children: {},
//     },
//     // 1
//     {
//       keyframe: {
//         rotation: [0, 1, 0],
//       },
//       children: {},
//     },
//     // 2
//     {
//       keyframe: {
//         rotation: [0, 2, 0],
//       },
//       children: {},
//     },
//   ],
// };
//

export default function Home() {
  // States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Scene | null>(null);
  const [isComponentExpanded, setIsComponentExpanded] = useState<boolean>(true);
  const [isCameraExpanded, setIsCameraExpanded] = useState<boolean>(true);
  const [activeComponent, setActiveComponent] = useState<Object3D | null>(null);
  const [isControllerChange, setIsControllerChange] = useState<boolean>(false);
  const [activeAnimationClip, setActiveAnimationClip] =
    useState<AnimationClip | null>(null);
  const [activeAnimationClipIdx, setActiveAnimationClipIdx] =
    useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [animationSelectedFile, setAnimationSelectedFile] = useState<File>();

  const [cameraController, setCameraController] =
    useState<CameraControllerType>({
      type: "orthographicCamera",
      distance: 3,
      reset: false,
    });
  const [animationController, setAnimationController] =
    useState<AnimationControllerType>({
      play: false,
      pause: false,
      reverse: false,
      playback: false,
      currentFrame: 0,
      maxFrame: 0,
      fps: 1,
      easing: AnimationEasingType.LINEAR,
      manualUpdate: false,
    });

  // Fetch data with default to initialize

  const loader: Loader = new Loader();

  const fetchData = async () => {
    let loaded: any = null;
    let loadedAnim: any = null;

    if (selectedFile) {
      loaded = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          try {
            const result = JSON.parse(text);
            console.log(result);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (e) => {
          reject(new Error("File reading failed"));
        };
        reader.readAsText(selectedFile);
      });
    } else {
      const response = await fetch("/articulated-awe.json");
      loaded = await response.json();
    }

    if (animationSelectedFile) {
      loadedAnim = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          try {
            const result = JSON.parse(text);
            console.log(result);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (e) => {
          reject(new Error("File reading failed"));
        };
        reader.readAsText(animationSelectedFile);
      });
      
    } else {
      const responseAnim = await fetch("/animation-awe.json");
      loadedAnim = await responseAnim.json();
    }

    console.log("This is loaded file", loaded);

    const loadedFile = await loader.loadFromJson(JSON.stringify(loaded));
    const loadedAnimation = await loader.loadAnimation(
      JSON.stringify(loadedAnim)
    );

    console.log(loadedFile)

    setData(loadedFile.scene);
    setActiveComponent(loadedFile.scene);
    setActiveAnimationClip(loadedAnimation[activeAnimationClipIdx]);

    
  };

  useEffect(() => {
    fetchData();
  }, [selectedFile, animationSelectedFile]);

  // Generate tree from received file
  const GLTFTree = {
    id: `scene-${data?.name}`,
    name: data?.name,
    children: data?.children,
  };
  const treeItems: TreeViewBaseItem[] = [convertGLTFToTreeView(GLTFTree)];

  // UI
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setAnimationController((prevState) => ({
        ...prevState,
        manualUpdate: true,
        currentFrame: newValue,
      }));
      // console.log("Slider value: ", newValue)
    }
  };

  const handleAnimationControllerButton = (controller: string) => {
    if (controller === "play") {
      setAnimationController((prevState) => ({
        ...prevState,
        play: true,
        pause: false,
      }));
    } else if (controller === "pause") {
      setAnimationController((prevState) => ({
        ...prevState,
        pause: true,
        play: false,
      }));
    }
  };

  const handleSaveFile = async (fileType: string) => {
    if (!GLTFTree) return

    if (fileType === 'model') {
      // const copiedGLTFTree = copyGLTFTree(GLTFTree);
      console.log(GLTFTree)
      // console.log(copiedGLTFTree)
      const convertScene = convertGLTFToLoad(GLTFTree)
      console.log(GLTFTree)
      const saveFile = loader.save(convertScene)
      console.log(saveFile)
      try {
        console.log("Uploading")
        const formData = new FormData()
        const blob = new Blob([saveFile], { type: 'application/json' });
        formData.append("myFile", blob, selectedFile?.name || "articulated-awe.json")
        const { data } = await axios.post('api/file-upload', formData)
        console.log(data)
        console.log(activeComponent)
      } catch (error) {
        console.error(error)
      }
    }
    if (fileType === 'animation') console.log('animation')
  }

  const handleAnimationControllerCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAnimationController((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSubmitController = (values: any) => {
    const position = new Vector3(
      values.position.x,
      values.position.y,
      values.position.z
    );

    const rotation = Quaternion.Euler(
      new Euler(
        MathUtil.DegreesToRad(values.rotation.x),
        MathUtil.DegreesToRad(values.rotation.y),
        MathUtil.DegreesToRad(values.rotation.z)
      )
    );
    const scale = new Vector3(values.scale.x, values.scale.y, values.scale.z);

    if (activeComponent) {
      activeComponent.position = position;
      activeComponent.rotation = rotation;
      activeComponent.scale = scale;
      setActiveComponent(activeComponent);
      setIsControllerChange(!isControllerChange);
    }
  };

  const handleLoadFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    if (event.target.files) {
      if (fileType === "model") setSelectedFile(event.target.files[0]);
      if (fileType === "animation")
        setAnimationSelectedFile(event.target.files[0]);
    }
  };

  const toogleFileInput = (fileType: string) => {
    if (fileType === "model" && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (fileType === "animation" && animationFileInputRef.current) {
      animationFileInputRef.current.click();
    }
  };

  const handleComponentExpanded = () => {
    setIsComponentExpanded(!isComponentExpanded);
  };

  const handleCameraExpanded = () => {
    setIsCameraExpanded(!isCameraExpanded);
  };

  const handleItemSelection = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    if (isSelected) {
      // if (!GLTFTree.children) return;
      const selectedComponent = findMeshById(GLTFTree.children, itemId);
      
      if (!selectedComponent) {
        console.log(GLTFTree)
        setActiveComponent(data);
      } else {
        console.log(selectedComponent, itemId)
        setActiveComponent(selectedComponent);
      }
    }
  };

  const handleFPSChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (+event.target.value) {
      setAnimationController((prev) => ({
        ...prev,
        fps: +event.target.value,
      }));
      setIsControllerChange(!isControllerChange);
    }
  };

  const handleEasingChange = (event: SelectChangeEvent) => {
    setAnimationController((prev) => ({
      ...prev,
      easing: +event.target.value,
    }));
    setIsControllerChange(!isControllerChange);
  };

  // Dropdown values
  const easeType: InputOptions[] = [
    {
      name: "Linear",
      value: AnimationEasingType.LINEAR,
    },
    {
      name: "Sine in",
      value: AnimationEasingType.EASE_IN_SINE,
    },
    {
      name: "Sine out",
      value: AnimationEasingType.EASE_OUT_SINE,
    },
    {
      name: "Sine in-out",
      value: AnimationEasingType.EASE_IN_OUT_SINE,
    },
    {
      name: "Bounce in",
      value: AnimationEasingType.EASE_IN_BOUNCE,
    },
    {
      name: "Bounce out",
      value: AnimationEasingType.EASE_OUT_BOUNCE,
    },
    {
      name: "Bounce in-out",
      value: AnimationEasingType.EASE_IN_OUT_BOUNCE,
    },
  ];

  if (!data || !activeComponent) return <div>Loading...</div>;

  return (
    <div className="flex w-full h-screen bg-main-black text-white">
      <div className="w-1/2 py-5 px-7 flex flex-col">
        <div className="pb-6">
          <div className=" text-2xl font-bold bg-gray-900">Camera View</div>
        </div>
        <div className="bg-white text-black flex-grow">
          <RenderComponent
            activeComponent={activeComponent}
            isControllerChange={isControllerChange}
            cameraController={cameraController}
            setCameraController={setCameraController}
          />
        </div>
      </div>
      <div className="w-1/4 flex flex-col border-x-2">
        <div className="h-1/3 border-b-2 py-5 px-7 flex flex-col">
          <div className="pb-6 flex items-center justify-between">
            <div className="text-2xl font-bold bg-gray-900">Scene Graph</div>
            <div className="flex items-center justify-center gap-3">
              <Button
                id="load-button"
                handleClick={() => {
                  toogleFileInput("model");
                }}
                text="Load"
                className="bg-white text-black px-4 rounded-sm"
              />
              <div>
                <input
                  type="file"
                  name="file-input"
                  id="file-input"
                  className="hidden"
                  onChange={(event) => {
                    handleLoadFile(event, "model");
                  }}
                  ref={fileInputRef}
                  accept=".json"
                />
              </div>
              <Button
                id="save-button"
                handleClick={() => handleSaveFile('model')}
                text="Save"
                className="bg-white text-black px-4 rounded-sm"
              />
            </div>
          </div>
          <div className="bg-gray-900 flex-grow overflow-y-auto p-5">
            <TreeView
              treeItems={treeItems}
              handleItemSelection={handleItemSelection}
            />
          </div>
        </div>
        <div className="py-5 px-7 flex flex-col h-2/3">
          <div className="pb-6 flex items-center justify-between">
            <div className="text-2xl font-bold bg-gray-900">Animation</div>
            <div className="flex items-center justify-center gap-3">
              <Button
                id="load-button"
                handleClick={() => {
                  toogleFileInput("animation");
                }}
                text="Load"
                className="bg-white text-black px-4 rounded-sm"
              />
              <div>
                <input
                  type="file"
                  name="file-input"
                  id="file-input"
                  className="hidden"
                  onChange={(event) => {
                    handleLoadFile(event, "animation");
                  }}
                  ref={animationFileInputRef}
                  accept=".json"
                />
              </div>
              <Button
                id="save-button"
                handleClick={() => handleSaveFile('animation')}
                text="Save"
                className="bg-white text-black px-4 rounded-sm"
              />
            </div>
          </div>
          <div className="flex gap-5 items-strech w-full py-3 overflow-x-auto">
            <Button
              id="play-button"
              handleClick={() => {
                handleAnimationControllerButton("play");
              }}
              text="Play"
              className="bg-white text-black px-4"
            />
            <Button
              id="pause-button"
              handleClick={() => {
                handleAnimationControllerButton("pause");
              }}
              text="Pause"
              className="bg-white text-black px-4"
            />
          </div>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "silver",
                    },
                  }}
                  checked={animationController.reverse}
                  onChange={handleAnimationControllerCheckbox}
                  name="reverse"
                />
              }
              label="Reverse"
            ></FormControlLabel>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "silver",
                    },
                  }}
                  checked={animationController.playback}
                  onChange={handleAnimationControllerCheckbox}
                  name="playback"
                />
              }
              label="Auto Replay"
            ></FormControlLabel>
          </FormGroup>
          <div className="flex items-center justify-between gap-3">
            <div>FPS</div>
            <TextField
              id="distance-field"
              type="number"
              className="bg-white"
              size="small"
              onChange={handleFPSChange}
              value={animationController.fps || ""}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>Easing</div>
            <Select
              value={animationController.easing.toString()}
              onChange={handleEasingChange}
              className="bg-white"
              size="small"
            >
              {easeType.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-5 py-4 items-center justify-between">
            <div>Frame</div>
            <CustomSlider
              aria-label="animation frame slider"
              value={animationController.currentFrame}
              min={1}
              max={animationController.maxFrame}
              onChange={handleSliderChange}
              valueLabelDisplay="on"
            />
          </div>
          <div className="bg-white flex-grow relative">
            <RenderComponent
              activeComponent={activeComponent}
              isControllerChange={isControllerChange}
              activeAnimationClip={activeAnimationClip!!}
              cameraController={cameraController}
              setCameraController={setCameraController}
              animationController={animationController}
              setAnimationController={setAnimationController}
            />
          </div>
        </div>
      </div>
      <div className="w-1/4 py-5 px-7 flex flex-col overflow-y-auto">
        <div className="pb-6">
          <div className="text-2xl font-bold bg-gray-900">Inspector</div>
        </div>
        <div className="bg-gray-900 flex-grow p-5">
          <ComponentController
            id="component-controller"
            isExpanded={isComponentExpanded}
            handleClick={handleComponentExpanded}
            title="Component Controller"
            component={activeComponent}
            handleSubmit={handleSubmitController}
            isControllerChange={isControllerChange}
          />
          <CameraController
            id="camera-controller"
            isExpanded={isCameraExpanded}
            handleClick={handleCameraExpanded}
            title="Camera Controller"
            cameraController={cameraController}
            setCameraController={setCameraController}
          />
        </div>
      </div>
    </div>
  );
}
