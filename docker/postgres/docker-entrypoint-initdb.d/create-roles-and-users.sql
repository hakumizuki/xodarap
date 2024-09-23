-- see: https://aws.amazon.com/jp/blogs/news/managing-postgresql-users-and-roles/
-- public ロールから全ての権限を剥奪
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE main FROM PUBLIC;

-- readwrite ロールを作成
CREATE ROLE readwrite WITH CREATEDB;
GRANT CONNECT ON DATABASE main TO readwrite;
GRANT USAGE, CREATE ON SCHEMA public TO readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO readwrite;

CREATE USER app_user WITH PASSWORD 'password';
ALTER ROLE app_user CREATEDB; -- 開発環境でのみ必要（テスト用データベースの用意のため）
GRANT readwrite TO app_user;

CREATE USER report_user WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE main TO report_user;
GRANT USAGE ON SCHEMA public TO report_user;
GRANT pg_read_all_data TO report_user;
