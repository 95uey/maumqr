-- ================================================
-- 마음QR 초기 스키마
-- ================================================

-- ------------------------------------------------
-- 1. profiles (근로자 프로필)
-- ------------------------------------------------
create table if not exists public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  custom_id     text        unique not null,          -- URL용 ID (@minjun-barista)
  display_name  text        not null,                 -- 표시 이름
  role          text        not null default '',      -- 직업/역할 (카페 바리스타)
  bio           text        not null default '',      -- 자기소개
  avatar_url    text,                                 -- 프로필 사진 URL
  kakao_token   text,                                 -- 카카오 알림톡용 토큰 (추후)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- custom_id는 소문자 영문, 숫자, 하이픈만 허용
alter table public.profiles
  add constraint profiles_custom_id_format
  check (custom_id ~ '^[a-z0-9][a-z0-9\-]{2,28}[a-z0-9]$');

-- updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------
-- 2. payments (결제/마음 기록)
-- ------------------------------------------------
create table if not exists public.payments (
  id              uuid        primary key default gen_random_uuid(),
  portone_payment_id text     unique not null,        -- 포트원 결제 ID
  sender_id       uuid        references auth.users(id) on delete set null,
  recipient_id    uuid        not null references public.profiles(id) on delete restrict,
  amount          integer     not null check (amount >= 1000),  -- 원 단위
  message_key     text        not null,               -- preset key (thank_you, come_again, cheer)
  message_text    text        not null,               -- 실제 메시지 텍스트
  status          text        not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  notified_at     timestamptz,                        -- 알림 발송 시각
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.handle_updated_at();

-- 수신자별 최신순 조회 인덱스
create index payments_recipient_created
  on public.payments (recipient_id, created_at desc)
  where status = 'paid';

-- ------------------------------------------------
-- 3. Row Level Security
-- ------------------------------------------------

-- profiles: 공개 읽기 (QR 스캔 후 누구나), 본인만 수정
alter table public.profiles enable row level security;

create policy "profiles_public_read"
  on public.profiles for select
  using (true);

create policy "profiles_owner_insert"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_owner_update"
  on public.profiles for update
  using (id = auth.uid());

-- payments: 서비스 서버(service role)만 insert/update, 당사자만 읽기
alter table public.payments enable row level security;

create policy "payments_sender_read"
  on public.payments for select
  using (sender_id = auth.uid() or recipient_id = (
    select id from public.profiles where id = auth.uid()
  ));

-- ------------------------------------------------
-- 4. 신규 가입 시 profiles row 자동 생성 트리거
--    (custom_id: 이메일 앞부분 기반 자동 생성)
-- ------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_id text;
  final_id text;
  counter  integer := 0;
begin
  -- 이메일 @ 앞부분을 소문자로, 특수문자는 하이픈으로
  base_id := regexp_replace(
    lower(split_part(new.email, '@', 1)),
    '[^a-z0-9]', '-', 'g'
  );
  -- 너무 짧으면 패딩
  if length(base_id) < 4 then
    base_id := base_id || '-user';
  end if;
  -- 중복 방지: 겹치면 숫자 suffix
  final_id := base_id;
  loop
    exit when not exists (
      select 1 from public.profiles where custom_id = final_id
    );
    counter := counter + 1;
    final_id := base_id || '-' || counter::text;
  end loop;

  insert into public.profiles (id, custom_id, display_name)
  values (
    new.id,
    final_id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
