
const sql = `
DROP FUNCTION IF EXISTS get_limit_for_level(level INT, currency text, type text);
CREATE OR REPLACE FUNCTION get_limit_for_level(level INT, currency text, type text)
RETURNS DOUBLE precision AS $get_limit_for_level$
DECLARE
  max_limit DOUBLE precision;
  query_string TEXT = '';
BEGIN
  IF type = 'deposit' THEN
    query_string = 'SELECT c.deposit_limits->>$2 as limit FROM "Coins" AS c WHERE c.symbol=$1';
  ELSEIF type = 'withdrawal' THEN
    query_string = 'SELECT c.withdrawal_limits->>$2 as limit FROM "Coins" AS c WHERE c.symbol=$1';
  ELSE
    RAISE EXCEPTION 'invalid type: %', type;
  END IF;

  EXECUTE query_string INTO max_limit USING currency, level::text;

    RAISE LOG 'max_limit: %', max_limit;
    RAISE LOG 'level: %', $1;

  IF max_limit IS NULL THEN
    IF type = 'deposit' THEN
      -- unlimited
      max_limit = 0;
    ELSE
      -- not available
      max_limit = -1;
    END IF;
  END IF;

  RAISE LOG 'level: % - Currency: % - Type: % - LIMIT: %', $1, currency, type, max_limit;
  RETURN max_limit;
END;
$get_limit_for_level$ LANGUAGE plpgsql;
`;

module.exports = sql;