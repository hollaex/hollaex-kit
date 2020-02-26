const sql = `

CREATE OR REPLACE FUNCTION check_deposit_status_before_deposit_update()
RETURNS TRIGGER AS $check_deposit_status_before_deposit_update$
BEGIN
  IF NEW.rejected = true AND OLD.rejected = true THEN
    RAISE EXCEPTION 'A rejected deposit can not be modified. deposit id: %', NEW.id;
  ELSEIF NEW.rejected = true AND OLD.rejected = false AND NEW.type = 'deposit' THEN
    RAISE EXCEPTION 'A "deposit" can not be rejected. deposit id: %', NEW.id;
  END IF;
  RETURN NEW;
END;
$check_deposit_status_before_deposit_update$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_deposit_status_before_deposit_update
ON "Deposits";

CREATE TRIGGER check_deposit_status_before_deposit_update
BEFORE UPDATE ON "Deposits"
FOR EACH ROW EXECUTE PROCEDURE check_deposit_status_before_deposit_update();
`;

module.exports = sql;
