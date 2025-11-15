import { Clip, Project } from './types';

export function createEmptyProject(): Project {
  return {
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: 'Untitled Project',
    clips: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createNewClip(index: number): Clip {
  return {
    id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: `Clip ${index + 1}`,
    prompt: '',
    duration: 4,
    resolution: '480p',
    model: 'seedance-1-lite',
    status: 'idle',
  };
}

export function duplicateClip(clip: Clip, index: number): Clip {
  return {
    ...clip,
    id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: `${clip.title} (Copy)`,
    status: 'idle',
    videoUrl: undefined,
    errorMessage: undefined,
  };
}

export function saveProjectToLocalStorage(project: Project): void {
  try {
    localStorage.setItem('current-project', JSON.stringify(project));
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
  }
}

export function loadProjectFromLocalStorage(): Project | null {
  try {
    const saved = localStorage.getItem('current-project');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load project from localStorage:', error);
  }
  return null;
}
