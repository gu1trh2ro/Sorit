// 합주실 타입
export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  openAt: string; // "10:00"
  closeAt: string; // "24:00"
  externalLink?: string; // 외부 예약 링크
}

// 시간 슬롯 타입
export interface TimeSlot {
  id: string;
  room: Room;
  date: string; // "2025-11-12"
  startTime: string; // "18:00"
  endTime: string; // "19:00"
  available: boolean;
  teamName?: string; // 예약된 경우 팀 이름
}

// 팀 타입
export interface Team {
  id: string;
  name: string;
  memberCount: number;
  genre: string;
}

// 버튼 variant 타입
export type ButtonVariant = 'primary' | 'secondary' | 'outline';

