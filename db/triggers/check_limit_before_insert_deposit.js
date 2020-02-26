const sql = `

CREATE OR REPLACE FUNCTION check_limit_before_insert_deposit()
RETURNS TRIGGER AS $check_limit_before_insert_deposit$
DECLARE
  daily_limit DOUBLE precision;
  -- acum_eth DOUBLE precision;
  accumulated DOUBLE precision;
  level INTEGER;
BEGIN
  SELECT verification_level
  INTO level
  FROM "Users"
  WHERE id = NEW.user_id;

  SELECT get_limit_for_level(level, NEW.currency, NEW.type)
  INTO daily_limit;

  RAISE LOG 'verification_level: %. limit: %. CURRENCY: %, TYPE: %', level, daily_limit, NEW.currency, NEW.type;
  IF daily_limit = 0 THEN
    -- limit = 0 means unlimited
    RETURN NEW;
  ELSEIF daily_limit = -1 THEN
    RAISE EXCEPTION 'Operation is not allowed and is disabled.';
  END IF;

  SELECT COALESCE(SUM(amount), 0)
  INTO accumulated
  FROM "Deposits"
  WHERE
    user_id = NEW.user_id AND
    type = NEW.type AND
    currency = NEW.currency AND
    created_at > NEW.created_at - INTERVAL '1 day';

  RAISE LOG 'verification_level: %. limit: %. accumulated: %, sum: %', level, daily_limit, accumulated, accumulated + NEW.amount;
  IF accumulated + NEW.amount > daily_limit THEN
    RAISE EXCEPTION 'Limit exceeded of %s in the last 24 hours. accumulated: %, limit: %', NEW.type, accumulated, daily_limit;
  END IF;
  RETURN NEW;
END;
$check_limit_before_insert_deposit$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_limit_before_insert_deposit
ON "Deposits";

CREATE TRIGGER check_limit_before_insert_deposit
BEFORE INSERT ON "Deposits"
FOR EACH ROW EXECUTE PROCEDURE check_limit_before_insert_deposit();
`;

module.exports = sql;
