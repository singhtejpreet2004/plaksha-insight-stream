/**
 * Stream configuration and utilities
 * Hardcoded for local deployment on 10.1.40.46
 */

export interface StreamConfig {
  id: string;
  name: string;
  location: string;
  model: string;
  streamUrl: string;
  statsUrl: string;
}

export const STREAMS: StreamConfig[] = [
  {
    id: 'gate_02_entry',
    name: 'Gate 02 Entry',
    location: 'Main Gate 02 - Entry Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5000',
    statsUrl: '/api/stats/5000'
  },
  {
    id: 'gate1_main_entry',
    name: 'Gate 1 Main Entry',
    location: 'Gate 1 - Main Entry Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5001',
    statsUrl: '/api/stats/5001'
  },
  {
    id: 'gate1_outside_left',
    name: 'Gate 1 Outside Left',
    location: 'Gate 1 - Left Exterior',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5002',
    statsUrl: '/api/stats/5002'
  },
  {
    id: 'gate2_exit',
    name: 'Gate 2 Exit',
    location: 'Gate 2 - Exit Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5003',
    statsUrl: '/api/stats/5003'
  }
];

export interface StreamStats {
  camera: string;
  frames: number;
  avg_fps: number;
  last_infer_ms: number;
  last_head_count: number;
  total_heads: number;
  utc: string;
}

export const fetchStreamStats = async (statsUrl: string): Promise<StreamStats | null> => {
  try {
    const response = await fetch(statsUrl);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching stats from ${statsUrl}:`, error);
    return null;
  }
};

export const checkStreamOnline = async (streamUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(streamUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
