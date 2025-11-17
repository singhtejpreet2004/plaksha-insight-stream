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
    id: 'gate_1_outside_left',
    name: 'Gate 1 Outside Left',
    location: 'Gate 1 - Left Exterior',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6001',
    statsUrl: '/api/stats/6001'
  },
  {
    id: 'gate_1_main_entry',
    name: 'Gate 1 Main Entry',
    location: 'Gate 1 - Main Entry Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6002',
    statsUrl: '/api/stats/6002'
  },
  {
    id: 'gate_1_flag_side',
    name: 'Gate 1 Flag Side',
    location: 'Gate 1 - Flag Side',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6003',
    statsUrl: '/api/stats/6003'
  },
  {
    id: 'gate_1_bharti_front',
    name: 'Gate 1 Bharti Front',
    location: 'Gate 1 - Bharti Front',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6004',
    statsUrl: '/api/stats/6004'
  },
  {
    id: 'gate_1_outside_right',
    name: 'Gate 1 Outside Right',
    location: 'Gate 1 - Right Exterior',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6005',
    statsUrl: '/api/stats/6005'
  },
  {
    id: 'gate_2_entry_camera',
    name: 'Gate 2 Entry Camera',
    location: 'Gate 2 - Entry Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6006',
    statsUrl: '/api/stats/6006'
  },
  {
    id: 'gate_2_exit_camera',
    name: 'Gate 2 Exit Camera',
    location: 'Gate 2 - Exit Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6007',
    statsUrl: '/api/stats/6007'
  },
  {
    id: 'utility_plant_room_backside_1',
    name: 'Utility Plant Room Backside 1',
    location: 'Utility Plant Room - Back Side 1',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6014',
    statsUrl: '/api/stats/6014'
  },
  {
    id: 'utility_plant_room_backside_2',
    name: 'Utility Plant Room Backside 2',
    location: 'Utility Plant Room - Back Side 2',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6015',
    statsUrl: '/api/stats/6015'
  },
  {
    id: 'generator_area',
    name: 'Generator Area',
    location: 'Generator Area',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6016',
    statsUrl: '/api/stats/6016'
  },
  {
    id: 'a2_gf_electronic_zone',
    name: 'A2 GF Electronic Zone',
    location: 'Building A2 - Ground Floor Electronic Zone',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6017',
    statsUrl: '/api/stats/6017'
  },
  {
    id: 'a2_gf_robotic_zone',
    name: 'A2 GF Robotic Zone',
    location: 'Building A2 - Ground Floor Robotic Zone',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6018',
    statsUrl: '/api/stats/6018'
  },
  {
    id: 'a2_gf_makerspace_worktops',
    name: 'A2 GF Makerspace Worktops',
    location: 'Building A2 - Ground Floor Makerspace Worktops',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6019',
    statsUrl: '/api/stats/6019'
  },
  {
    id: 'a2_gf_entrance_from_library',
    name: 'A2 GF Entrance from Library',
    location: 'Building A2 - Ground Floor Library Entrance',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6020',
    statsUrl: '/api/stats/6020'
  },
  {
    id: 'a2_gf_entrance_main_lobby',
    name: 'A2 GF Entrance Main Lobby',
    location: 'Building A2 - Ground Floor Main Lobby',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6021',
    statsUrl: '/api/stats/6021'
  },
  {
    id: 'dr2_1f_dining_area_1',
    name: 'DR2 1F Dining Area 1',
    location: 'Dining Room 2 - 1st Floor Dining Area 1',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6023',
    statsUrl: '/api/stats/6023'
  },
  {
    id: 'dr2_1f_dining_area_2',
    name: 'DR2 1F Dining Area 2',
    location: 'Dining Room 2 - 1st Floor Dining Area 2',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6024',
    statsUrl: '/api/stats/6024'
  },
  {
    id: 'dr2_1f_lobby_near_it_room',
    name: 'DR2 1F Lobby Near IT Room',
    location: 'Dining Room 2 - 1st Floor IT Room Lobby',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6026',
    statsUrl: '/api/stats/6026'
  },
  {
    id: 'dr2_gf_near_girls_toilet',
    name: 'DR2 GF Near Girls Toilet',
    location: 'Dining Room 2 - Ground Floor Near Girls Toilet',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6027',
    statsUrl: '/api/stats/6027'
  },
  {
    id: 'd58_summer_court_2',
    name: 'D58 Summer Court 2',
    location: 'D58 - Summer Court 2',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6028',
    statsUrl: '/api/stats/6028'
  },
  {
    id: 'd59_summer_court_1',
    name: 'D59 Summer Court 1',
    location: 'D59 - Summer Court 1',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6029',
    statsUrl: '/api/stats/6029'
  },
  {
    id: 'camera_2_near_library_entrance',
    name: 'Camera 2 Near Library Entrance',
    location: 'Near Library Entrance',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6030',
    statsUrl: '/api/stats/6030'
  },
  {
    id: 'a1_gf_classroom_corridor',
    name: 'A1 GF Classroom Corridor',
    location: 'Building A1 - Ground Floor Classroom Corridor',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6031',
    statsUrl: '/api/stats/6031'
  },
  {
    id: 'a1_main_lobby_entrance',
    name: 'A1 Main Lobby Entrance',
    location: 'Building A1 - Main Lobby Entrance',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6032',
    statsUrl: '/api/stats/6032'
  },
  {
    id: 'a1_gf_entrance_library_side',
    name: 'A1 GF Entrance Library Side',
    location: 'Building A1 - Ground Floor Library Side Entrance',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6033',
    statsUrl: '/api/stats/6033'
  },
  {
    id: 'a1_gf_elevator_lobby_1',
    name: 'A1 GF Elevator Lobby 1',
    location: 'Building A1 - Ground Floor Elevator Lobby 1',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6034',
    statsUrl: '/api/stats/6034'
  },
  {
    id: 'gh_gf_outdoor_dining_area_1',
    name: 'GH GF Outdoor Dining Area 1',
    location: 'Guest House - Ground Floor Outdoor Dining Area 1',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/6035',
    statsUrl: '/api/stats/6035'
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
