-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Scheduling Polls (약속 잡기 투표)
create table scheduling_polls (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null, -- 약속 이름 (예: 프리텐더 합주)
  event_type text, -- 약속 종류 (팀 회의, 가벼운 모임 등)
  headcount integer, -- 참여 인원
  dates text[] not null, -- 투표할 날짜 후보들 (YYYY-MM-DD 배열)
  is_closed boolean default false -- 투표 마감 여부
);

-- 2. Scheduling Votes (시간 선택 투표)
create table scheduling_votes (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  poll_id uuid references scheduling_polls(id) on delete cascade not null,
  user_name text not null, -- 투표자 이름 (비로그인 가능하므로 텍스트로 저장)
  password text, -- 수정/삭제용 간단한 비밀번호 (선택 사항)
  selected_slots jsonb not null -- 선택한 시간 슬롯들 (날짜별 시간 배열)
  -- 예: { "2024-12-03": ["13:00", "13:30", "14:00"], "2024-12-04": [...] }
);

-- 3. Reservations (최종 확정된 예약)
create table reservations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  room_id integer not null, -- 합주실 ID (mockData의 ID와 매핑)
  user_name text not null, -- 예약자 이름
  date date not null, -- 예약 날짜
  start_time time not null, -- 시작 시간
  end_time time not null, -- 종료 시간
  event_type text, -- 예약 목적 (합주, 개인연습, 휴식 등)
  status text default 'confirmed' -- 예약 상태
);

-- RLS (Row Level Security) Policies
-- 개발 편의를 위해 일단 모든 읽기/쓰기 허용 (나중에 제한 가능)
alter table scheduling_polls enable row level security;
create policy "Allow public read/write polls" on scheduling_polls for all using (true) with check (true);

alter table scheduling_votes enable row level security;
create policy "Allow public read/write votes" on scheduling_votes for all using (true) with check (true);

alter table reservations enable row level security;
create policy "Allow public read/write reservations" on reservations for all using (true) with check (true);
