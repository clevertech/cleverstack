---------------------------------------------------------------------
-- CONTRIB SCHEMA
-- This is not mandatory, but it's traditional to put all 3rd
-- party extensions in a contrib schema. Notably pgcrypto for
-- password hashing

drop schema if exists contrib cascade;
create schema contrib authorization postgres;
grant all on schema contrib to public;


-- Install pgcrypto for password encryption

create extension pgcrypto schema contrib;

---------------------------------------------------------------------
create or replace function public.generate_credentials() 
returns trigger as $$
	begin
		new.salt := contrib.gen_salt('bf');
		new.password := contrib.crypt(new.global_id || new.password, new.salt);
		return new;
	end;
$$ language plpgsql;

create or replace function public.update_credentials()
returns trigger as $$
	begin
		new.salt := old.salt;
		new.password := contrib.crypt(new.global_id || new.password, old.salt);
		return new;
	end;
$$ language plpgsql;