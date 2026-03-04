"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from "lucide-react";
import { ReactNode } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  VisualizerComponent: ReactNode;
  CodeComponent: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  VisualizerComponent,
  CodeComponent,
}: ModalProps) {
  const {
    isPlaying,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    steps,
    currentStepIndex,
    playbackSpeed,
    setPlaybackSpeed,
  } = useVisualizerStore();

  const currentExplanation =
    steps[currentStepIndex]?.explanation || "Waiting...";
  const progress =
    steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full h-full max-w-7xl max-h-[90vh] bg-background border-brutal shadow-brutal-xl flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <header className="flex items-center justify-between px-6 py-3 border-b-brutal bg-primary">
              <h2 className="text-xl font-black uppercase tracking-wider">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 border-brutal bg-secondary text-white hover:bg-red-500 shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* ── Split layout ── */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Visualizer */}
              <div className="flex-1 relative bg-background">
                {VisualizerComponent}

                {/* Floating explanation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-xl border-brutal bg-white px-5 py-3 shadow-brutal-sm">
                  <p className="text-sm font-bold text-center">
                    {currentExplanation}
                  </p>
                </div>
              </div>

              {/* Code + Controls */}
              <div className="w-full lg:w-105 flex flex-col border-l-brutal bg-surface">
                <div className="flex-1 overflow-y-auto p-4">
                  {CodeComponent}
                </div>

                {/* ── Controls ── */}
                <div className="p-4 border-t-brutal bg-white">
                  {/* Speed selector */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider">
                      Speed:
                    </span>
                    {[
                      { label: "0.5x", value: 2000 },
                      { label: "1x", value: 1000 },
                      { label: "2x", value: 500 },
                      { label: "4x", value: 250 },
                    ].map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setPlaybackSpeed(s.value)}
                        className={`px-2 py-1 text-xs font-black border-brutal-thin transition-all ${
                          playbackSpeed === s.value
                            ? "bg-primary shadow-brutal-sm"
                            : "bg-white hover:bg-surface-alt"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Playback buttons */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={reset}
                      className="p-3 border-brutal bg-white hover:bg-surface-alt shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      title="Reset"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={prevStep}
                      className="p-3 border-brutal bg-white hover:bg-surface-alt shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      title="Previous"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-4 border-brutal bg-primary hover:bg-primary-hover shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={nextStep}
                      className="p-3 border-brutal bg-white hover:bg-surface-alt shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      title="Next"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3 text-xs font-mono font-black">
                    <span>{currentStepIndex + 1}</span>
                    <div className="flex-1 h-3 border-brutal-thin bg-white overflow-hidden">
                      <div
                        className="h-full bg-accent-green transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span>{steps.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
