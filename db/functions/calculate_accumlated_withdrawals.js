const sql = `
DROP FUNCTION IF EXISTS calculate_accumlated_withdrawals(user_id_to_check integer, check_currency text);
CREATE OR REPLACE FUNCTION calculate_accumlated_withdrawals(user_id_to_check integer, check_currency text)
RETURNS DOUBLE precision AS $calculate_accumlated_withdrawals$
DECLARE
  accumulated DOUBLE precision;
BEGIN
  SELECT round(SUM("d"."amount")::numeric, 8) INTO accumulated
  FROM "Deposits" AS "d"
  WHERE
    "d"."status" = false AND
    "d"."dismissed" = false AND
    "d"."rejected" = false AND
    "d"."user_id" = user_id_to_check AND
    "d"."currency" = check_currency AND
    "d"."type" = 'withdrawal'
  GROUP BY "d"."user_id" LIMIT 1;
  -- RAISE LOG 'USER ID: %, CURRENCY: %, ACCUMULATED: %', user_id, check_currency, accumulated;

  IF accumulated IS NULL THEN
    accumulated = 0;
  END IF;

  -- RAISE LOG 'USER ID: %, CURRENCY: %, ACCUMULATED: %', user_id, check_currency, accumulated;
  RETURN accumulated;
END;
$calculate_accumlated_withdrawals$ LANGUAGE plpgsql;
`;

module.exports = sql;