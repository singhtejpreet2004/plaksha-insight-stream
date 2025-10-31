/**
 * CSV generation utilities for stream data export
 */

import { StreamStats } from './streams';

export type TimeRange = '1day' | '7days' | '1month' | '3months' | '6months';

export interface LogEntry {
  timestamp: string;
  camera: string;
  frames: number;
  avg_fps: number;
  last_infer_ms: number;
  last_head_count: number;
  total_heads: number;
}

/**
 * Generate CSV from stream statistics
 * Note: In production, this would fetch from log files on the server
 * For now, we generate sample data based on the time range
 */
export const generateCSV = (
  cameraName: string,
  timeRange: TimeRange,
  currentStats: StreamStats | null
): string => {
  const headers = [
    'Timestamp',
    'Camera',
    'Total Frames',
    'Avg FPS',
    'Last Inference (ms)',
    'Last Head Count',
    'Total Heads Detected'
  ];

  const rows: string[][] = [headers];

  // In production, this would read from the actual log files
  // For now, generate sample data based on current stats
  if (currentStats) {
    const now = new Date();
    const daysMap: Record<TimeRange, number> = {
      '1day': 1,
      '7days': 7,
      '1month': 30,
      '3months': 90,
      '6months': 180
    };
    const days = daysMap[timeRange];
    
    // Generate hourly samples
    for (let i = days * 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      rows.push([
        timestamp.toISOString(),
        cameraName,
        Math.floor(currentStats.frames * (1 - i / (days * 24))).toString(),
        (currentStats.avg_fps + (Math.random() - 0.5) * 5).toFixed(2),
        (currentStats.last_infer_ms + (Math.random() - 0.5) * 10).toFixed(2),
        Math.floor(Math.random() * 15).toString(),
        Math.floor(currentStats.total_heads * (1 - i / (days * 24))).toString()
      ]);
    }
  }

  return rows.map(row => row.join(',')).join('\n');
};

export const downloadCSV = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
