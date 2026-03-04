import { create } from 'zustand';

export type NodeState = {
  id: string;
  value: number;
  x: number;
  y: number;
  state: 'default' | 'highlighted' | 'swapping' | 'inserted' | 'rotating';
  meta?: { rbColor?: 'RED' | 'BLACK' };
};

export type EdgeState = {
  from: string;
  to: string;
  weight?: number;
  state: 'default' | 'highlighted' | 'relaxing' | 'active';
};

export type VisualizerStep = {
  nodes: NodeState[];
  edges: EdgeState[];
  activeCodeLine: number | null;
  explanation: string;
};

interface VisualizerStore {
  steps: VisualizerStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;

  setSteps: (steps: VisualizerStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStepIndex: (index: number) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  reset: () => void;
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1000,

  setSteps: (steps) => set({ steps, currentStepIndex: 0, isPlaying: false }),

  nextStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1, isPlaying: false });
    }
  },

  setStepIndex: (index) => set({ currentStepIndex: index, isPlaying: false }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  reset: () => set({ currentStepIndex: 0, isPlaying: false }),
}));
