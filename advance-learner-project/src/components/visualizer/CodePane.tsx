"use client";

import { useVisualizerStore } from "@/store/useVisualizerStore";

interface CodePaneProps {
  code: string[];
}

export function CodePane({ code }: CodePaneProps) {
  const { currentStepIndex, steps } = useVisualizerStore();
  const activeLine = steps[currentStepIndex]?.activeCodeLine ?? -1;

  return (
    <div className="w-full font-mono text-sm border-brutal bg-white shadow-brutal overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-brutal bg-primary">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-brutal-thin bg-secondary" />
          <div className="w-3 h-3 border-brutal-thin bg-accent-green" />
          <div className="w-3 h-3 border-brutal-thin bg-accent-blue" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest">
          AVL.cpp
        </span>
      </div>

      {/* Code lines */}
      <div className="p-2 overflow-x-auto">
        {code.map((line, index) => {
          const isActive = index + 1 === activeLine;

          return (
            <div
              key={index}
              className={`flex items-center px-2 py-0.5 transition-colors duration-100 ${
                isActive
                  ? "bg-primary border-l-4 border-black font-bold"
                  : "border-l-4 border-transparent hover:bg-surface-alt"
              }`}
            >
              <span className="w-7 text-right text-text-muted mr-4 select-none shrink-0 text-xs">
                {index + 1}
              </span>
              <pre
                className={`whitespace-pre ${
                  isActive ? "text-black" : "text-text-secondary"
                }`}
              >
                {line}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
