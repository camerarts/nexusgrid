
export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface CropConfig {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
}

export interface OutputDimensions {
  width: number;
  height: number;
}

/**
 * Helper to format bytes to human readable string
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// NOTE: The actual slicing logic is now handled directly in GridEditor.tsx via canvas manipulation
// This file can be kept for type definitions or future utility functions.
export const processImage = async (
  file: File, 
  cropConfig?: CropConfig,
  targetDimensions: OutputDimensions = { width: 1920, height: 1080 },
  maxSizeBytes: number = 2 * 1024 * 1024 // Default 2MB
): Promise<{ blob: Blob; width: number; height: number }> => {
    // Legacy placeholder to satisfy old imports if any remain, 
    // but main logic has moved to GridEditor
    return new Promise((resolve) => {
        resolve({ blob: new Blob(), width: 0, height: 0 });
    });
};