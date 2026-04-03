create type status as enum ('active', 'banned');

create table users (
  id UUID PK,
  username text not null,
  email TEXT,
  solde int not null default 0,
  statut status not null default 'active',
  subscription text,
  auto_buy boolean not null default false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)


create table credentials (
  user_id UUID FK -> users.id,
  password_hash TEXT,
  created_at TIMESTAMP
  updated_at TIMESTAMP
)

create table oauth_accounts (
  id UUID PK,
  user_id UUID FK -> users.id,
  provider TEXT,
  provider_user_id TEXT,
  created_at TIMESTAMP,
  UNIQUE(provider, provider_user_id)
)

create table refresh_tokens (
  id UUID PK,
  user_id UUID,
  token_hash TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE
)