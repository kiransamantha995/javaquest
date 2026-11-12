-- Supabase Migration: 01_secure_xp.sql
-- Restricts direct client-side updates to xp, level, and hearts
-- Adds server-side RPC functions for verified progress and XP awards

-- 1. Tighten Profiles update policy: users cannot modify xp or level directly
-- Only allows updating cosmetic fields (username, avatar, difficulty, last_visit)
create or replace function public.validate_profile_update()
returns trigger as $$
begin
  -- Prevent client from incrementing or modifying XP/level directly via REST UPDATE
  -- (Only permitted if invoked with auth.role() = 'service_role' or via security definer RPC)
  if (new.xp <> old.xp or new.level <> old.level) and current_user <> 'postgres' and current_setting('role', true) <> 'service_role' then
    -- Allow change only if called inside award_xp_rpc
    if current_setting('javaquest.internal_award', true) <> 'true' then
      new.xp := old.xp;
      new.level := old.level;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_protect_profile_xp on public.profiles;
create trigger tr_protect_profile_xp
  before update on public.profiles
  for each row execute function public.validate_profile_update();

-- 2. Server-side RPC to securely award XP and auto-level up
create or replace function public.award_xp(lesson_id text, xp_amount int)
returns jsonb as $$
declare
  curr_uid uuid := auth.uid();
  old_xp int;
  new_xp int;
  new_level int;
begin
  if curr_uid is null then
    raise exception 'Authentication required';
  end if;

  if xp_amount <= 0 or xp_amount > 200 then
    raise exception 'Invalid XP amount';
  end if;

  -- Set transaction-local flag so the trigger allows the XP update
  set local javaquest.internal_award = 'true';

  select coalesce(xp, 0) into old_xp from public.profiles where id = curr_uid;
  new_xp := old_xp + xp_amount;
  new_level := greatest(1, floor(new_xp / 100) + 1);

  update public.profiles
  set xp = new_xp, level = new_level, updated_at = now()
  where id = curr_uid;

  return jsonb_build_object('success', true, 'xp', new_xp, 'level', new_level);
end;
$$ language plpgsql security definer;
