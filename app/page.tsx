"use client";

import Button from "@/components/ui/Button";
import RenderComponent from "@/components/render/RenderComponent";

export default function Home() {
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
          {/* Todo: Tree Component */}
          <div
            className="bg-gray-900 flex-grow overflow-y-auto p-5"
            id="tree"
          ></div>
        </div>
        <div className="py-5 px-7 flex flex-col h-1/2">
          <div className="">
            <div className="text-2xl font-bold bg-gray-900">Animation</div>
          </div>
          <div className="flex gap-5 items-center w-full py-3">
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
        <div className="bg-gray-900 flex-grow">
          This is the place for Inspector
        </div>
      </div>
    </div>
  );
}
