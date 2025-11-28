import { Room, TimeSlot, Team } from '@/types';

// 합주실 목데이터
export const rooms: Room[] = [
  {
    id: '1',
    name: '소리터 A',
    location: '학생회관 지하 1층',
    capacity: 5,
    equipment: ['드럼', '베이스 앰프', '기타 앰프', '마이크 2개'],
    openAt: '10:00',
    closeAt: '24:00',
  },
  {
    id: '2',
    name: '소리터 B',
    location: '학생회관 지하 1층',
    capacity: 4,
    equipment: ['드럼', '베이스 앰프', '기타 앰프', '보컬부스'],
    openAt: '10:00',
    closeAt: '24:00',
  },
  {
    id: '3',
    name: '소리터 C',
    location: '학생회관 지하 2층',
    capacity: 6,
    equipment: ['드럼', '베이스 앰프', '기타 앰프 2개', '키보드', 'PA시스템'],
    openAt: '10:00',
    closeAt: '24:00',
  },
];

// 오늘의 시간 슬롯 목데이터 (18:00 ~ 23:00)
export const todaySlots: TimeSlot[] = [
  {
    id: 's1',
    room: rooms[0],
    date: '2025-11-12',
    startTime: '18:00',
    endTime: '19:00',
    available: true,
  },
  {
    id: 's2',
    room: rooms[1],
    date: '2025-11-12',
    startTime: '19:00',
    endTime: '20:00',
    available: false,
    teamName: '블루노트',
  },
  {
    id: 's3',
    room: rooms[2],
    date: '2025-11-12',
    startTime: '20:00',
    endTime: '21:00',
    available: true,
  },
  {
    id: 's4',
    room: rooms[0],
    date: '2025-11-12',
    startTime: '21:00',
    endTime: '22:00',
    available: true,
  },
  {
    id: 's5',
    room: rooms[1],
    date: '2025-11-12',
    startTime: '22:00',
    endTime: '23:00',
    available: false,
    teamName: '록스피릿',
  },
  {
    id: 's6',
    room: rooms[2],
    date: '2025-11-12',
    startTime: '20:00',
    endTime: '22:00',
    available: true,
  },
];

// 팀 목데이터
export const teams: Team[] = [
  {
    id: 't1',
    name: '블루노트',
    memberCount: 5,
    genre: '재즈/퓨전',
  },
  {
    id: 't2',
    name: '록스피릿',
    memberCount: 4,
    genre: '록/메탈',
  },
  {
    id: 't3',
    name: '어쿠스틱 소울',
    memberCount: 3,
    genre: '포크/어쿠스틱',
  },
];

