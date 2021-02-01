const sql = `
CREATE OR REPLACE FUNCTION update_userlevel_after_verify()
RETURNS TRIGGER AS $update_userlevel_after_verify$
BEGIN
  IF new.verified IS TRUE THEN
    UPDATE "Users"
    SET email_verified = true, updated_at = current_timestamp
    WHERE id = new.user_id;
  END IF;
  RETURN NEW;
END;
$update_userlevel_after_verify$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_userlevel_after_verify
ON "VerificationCodes";

CREATE TRIGGER update_userlevel_after_verify
AFTER UPDATE ON "VerificationCodes"
FOR EACH ROW EXECUTE PROCEDURE update_userlevel_after_verify();
`;

module.exports = sql;
