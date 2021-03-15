const sql = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION create_verificationcode_after_user()
RETURNS TRIGGER AS $create_verificationcode_after_user$
BEGIN
  INSERT INTO "VerificationCodes"
  ("id","user_id","code","created_at","updated_at")
  VALUES
  (DEFAULT,new.id,uuid_generate_v4(),current_timestamp,current_timestamp);
  RETURN NEW;
END;
$create_verificationcode_after_user$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_verificationcode_after_user
ON "Users";

CREATE TRIGGER create_verificationcode_after_user
AFTER INSERT ON "Users"
FOR EACH ROW EXECUTE PROCEDURE create_verificationcode_after_user();
`;

module.exports = sql;