
export enum AppMode {
  BLUEPRINT = 'BLUEPRINT',
  PROTOTYPE = 'PROTOTYPE'
}

export type Language = 'en' | 'ja';

export interface AnimationFrame {
  id: string;
  url: string;
  prompt: string;
  type: 'start' | 'end' | 'generated';
  index: number; // 0 for start, last for end, intermediates in between
}

export interface GenerationStep {
  step: number;
  description: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
}

export interface GeneratedResponse {
  prompts: string[];
}
