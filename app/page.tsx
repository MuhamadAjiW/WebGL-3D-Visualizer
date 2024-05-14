"use client";

import Button from "@/components/ui/Button";
import RenderComponent from "@/components/render/RenderComponent";
import TreeView from "@/components/ui/TreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import Controller from "@/components/ui/Controller";
import { useState } from "react";
import CameraController from "@/components/ui/CameraController";

export default function Home() {
  // dummy
  const treeItems: TreeViewBaseItem[] = [
    {
      id: "1",
      label: "Main",
      children: [
        { id: "2", label: "Hello" },
        {
          id: "3",
          label: "Subtree with children",
          children: [
            { id: "6", label: "Hello" },
            {
              id: "7",
              label: "Sub-subtree with children",
              children: [
                { id: "9", label: "Child 1" },
                { id: "10", label: "Child 2" },
                { id: "11", label: "Child 3" },
              ],
            },
            { id: "8", label: "Hello" },
          ],
        },
        { id: "4", label: "World" },
        { id: "5", label: "Something something" },
        { id: "12", label: "Something something" },
        { id: "13", label: "Something something" },
        { id: "14", label: "Something something" },
        { id: "15", label: "Something something" },
        { id: "16", label: "Something something" },
      ],
    },
  ];

  const [isComponentExpanded, setIsComponentExpanded] = useState(false);
  const [isCameraExpanded, setIsCameraExpanded] = useState(false);

  const handleComponentExpanded = () => {
    setIsComponentExpanded(!isComponentExpanded);
  };

  const handleCameraExpanded = () => {
    setIsCameraExpanded(!isCameraExpanded);
  };

  return (
    <div className="flex w-full h-screen bg-main-black text-white">
      <div className="w-1/2 py-5 px-7 flex flex-col">
        <div className="pb-6">
          <div className=" text-2xl font-bold bg-gray-900">Camera View</div>
        </div>
        <div className="bg-white text-black flex-grow">
          <RenderComponent />
        </div>
      </div>
      <div className="w-1/4 flex flex-col border-x-2">
        <div className="h-1/2 border-b-2 py-5 px-7 flex flex-col">
          <div className="pb-6">
            <div className="text-2xl font-bold bg-gray-900">Scene Graph</div>
          </div>
          <div className="bg-gray-900 flex-grow overflow-y-auto p-5">
            <TreeView treeItems={treeItems} />
          </div>
        </div>
        <div className="py-5 px-7 flex flex-col h-1/2">
          <div className="">
            <div className="text-2xl font-bold bg-gray-900">Animation</div>
          </div>
          <div className="flex gap-5 items-strech w-full py-3">
            <Button
              id="play-button"
              handleClick={() => {}}
              text="Play"
              className="bg-white text-black px-4"
            />
            <Button
              id="pause-button"
              handleClick={() => {}}
              text="Pause"
              className="bg-white text-black px-4"
            />
            <Button
              id="reverse-button"
              handleClick={() => {}}
              text="Reverse"
              className="bg-white text-black px-4"
            />
            <Button
              id="auto-replay-button"
              handleClick={() => {}}
              text="Auto Replay"
              className="bg-white text-black px-4"
            />
          </div>
          <div className="bg-gray-900 flex-grow">
            This is the place for animation
          </div>
        </div>
      </div>
      <div className="w-1/4 py-5 px-7 flex flex-col">
        <div className="pb-6">
          <div className="text-2xl font-bold bg-gray-900">Inspector</div>
        </div>
        <div className="bg-gray-900 flex-grow p-5">
          <Controller
            id="component-controller"
            isExpanded={isComponentExpanded}
            handleClick={handleComponentExpanded}
            title="Component Controller"
          />
          <CameraController
            id="camera-controller"
            isExpanded={isCameraExpanded}
            handleClick={handleCameraExpanded}
            title="Camera Controller"
          />
        </div>
      </div>
    </div>
  );
}
