-- =============================================================
-- HTF4.0 — Seed Script: Pre-create teams as Supabase Auth users
-- Run AFTER schema.sql + rls_policies.sql
--
-- Each team gets:
--   • An auth.users row with email = {team_code}@htf.local
--   • A profiles row with team_code, team_name, role
--
-- To add more teams, duplicate the block below and change
-- the team_code, team_name, password, and (optionally) role.
--
-- Works identically on local Supabase and cloud Supabase.
-- =============================================================

-- ─── Team T02 (dummy test team) ─────────────────────────────
-- team_code: T02 | password: team02
do $$
declare
  _uid uuid := gen_random_uuid();
begin
  -- 1. Create the auth user
  insert into auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    confirmation_token, recovery_token,
    email_change, email_change_token_new,
    email_confirmed_at, confirmation_sent_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    _uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    't02@htf.local',
    crypt('team02', gen_salt('bf')),
    '', '',
    '', '',
    now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"team_code":"T02"}'::jsonb,
    now(), now()
  );

  -- 2. Create identity (required for signInWithPassword)
  insert into auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at,
    created_at, updated_at
  ) values (
    _uid, _uid, 't02@htf.local', 'email',
    jsonb_build_object('sub', _uid::text, 'email', 't02@htf.local'),
    now(), now(), now()
  );

  -- 3. Create the profile
  insert into public.profiles (id, team_code, team_name, role)
  values (_uid, 'T02', 'Team T02', 'participant');
end $$;

-- ─── Volunteer account (for testing) ───────────────────────
-- team_code: VOLUNTEER | password: htfvolunteer
do $$
declare
  _uid uuid := gen_random_uuid();
begin
  insert into auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    confirmation_token, recovery_token,
    email_change, email_change_token_new,
    email_confirmed_at, confirmation_sent_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    _uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'volunteer@htf.local',
    crypt('htfvolunteer', gen_salt('bf')),
    '', '',
    '', '',
    now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"team_code":"VOLUNTEER"}'::jsonb,
    now(), now()
  );

  insert into auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at,
    created_at, updated_at
  ) values (
    _uid, _uid, 'volunteer@htf.local', 'email',
    jsonb_build_object('sub', _uid::text, 'email', 'volunteer@htf.local'),
    now(), now(), now()
  );

  insert into public.profiles (id, team_code, team_name, role)
  values (_uid, 'VOLUNTEER', 'Volunteer', 'volunteer');
end $$;

-- ─── Admin account (for testing) ────────────────────────────
-- team_code: ADMIN | password: admin123
do $$
declare
  _uid uuid := gen_random_uuid();
begin
  insert into auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    confirmation_token, recovery_token,
    email_change, email_change_token_new,
    email_confirmed_at, confirmation_sent_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    _uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@htf.local',
    crypt('admin123', gen_salt('bf')),
    '', '',
    '', '',
    now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"team_code":"ADMIN"}'::jsonb,
    now(), now()
  );

  insert into auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at,
    created_at, updated_at
  ) values (
    _uid, _uid, 'admin@htf.local', 'email',
    jsonb_build_object('sub', _uid::text, 'email', 'admin@htf.local'),
    now(), now(), now()
  );

  insert into public.profiles (id, team_code, team_name, role)
  values (_uid, 'ADMIN', 'Admin', 'admin');
end $$;
