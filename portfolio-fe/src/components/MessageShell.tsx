"use client";
import { useUIContext } from "@/context/UIContext";

interface MessageShellProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function MessageShell({ children, onClose }: MessageShellProps) {
    const {
      isMobile
    } = useUIContext();
  return (
    <section
      className="
        sticky top-0 z-10 
        bg-gray-100 dark:bg-neutral-800
        border border-gray-300 dark:border-neutral-700
        shadow-lg rounded-xl
        overflow-y-auto overflow-x-hidden
        custom-scrollbar
        min-h-[13rem] min-w-[13rem]
        relative
      "
    >

      {/* Close Button */}
        <div className="flex items-center justify-end p-2 w-full h-[3rem]">
            <button
                onClick={(e) => {
                e.stopPropagation();
                onClose();
                }}
                className="
                w-7 h-7
                flex items-center justify-center
                rounded-md
                bg-neutral-300 dark:bg-neutral-700
                hover:bg-neutral-400 dark:hover:bg-neutral-600
                text-black dark:text-white
                font-bold shadow">
            X
            </button>
        </div>

        {/* Content */}
        <div className="pb-3 h-[8rem]">
            {children}
        </div>

    </section>
  );
}
