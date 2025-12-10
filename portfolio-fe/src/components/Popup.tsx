"use client";
import type { Position } from "@/lib/repos";

interface PopupProps {
  object: React.ReactNode;
  position?: Partial<Position>;
}

const DEFAULT_POS: Position = {
  top: 0,
  left: 0,
  height: 0,
  width: 0,
  scale: 1,
};

export default function Popup({ object, position = {} }: PopupProps) {
  const finalPos: Position = { ...DEFAULT_POS, ...position };
    
  return (
    <div
      id="popup-card"
      className={["fixed z-[20] bg-white overflow-hidden",
        "group block rounded-xl border shadow-sm",
        "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700",
        "hover:border-blue-400 hover:shadow-xl",
        "transition-transform duration-200 ease-out",
        "flex flex-col items-center justify-center",
        ].join(" ")}

      style={{
        top: finalPos.top,
        left: finalPos.left,
        width: finalPos.width,
        height: finalPos.height,
        transform: `scale(${finalPos.scale})`,
        transformOrigin: "center center"}}>
      <div>

        {object}
      </div>
    </div>
  );
}
