const sql = `
DROP FUNCTION IF EXISTS calculate_accumlated(user_id integer, currency text);
CREATE OR REPLACE FUNCTION calculate_accumlated(user_id integer, currency text)
RETURNS DOUBLE precision AS $calculate_accumlated$
DECLARE
  accumulated_buy DOUBLE precision;
  accumulated_sell DOUBLE precision;
  accumulated DOUBLE precision;
BEGIN
  SELECT round(SUM(round((o.size - o.filled)::numeric, 8) * o.price)::numeric, 8) INTO accumulated_buy
  FROM "Orders" AS "o"
  LEFT JOIN (
    SELECT lower(name) as name
    FROM "Pairs"
    WHERE pair_2 = currency
  ) AS "p"
  ON lower("o".symbol) = lower("p".name)
  WHERE "o"."side" = 'buy' AND "o"."created_by" = user_id AND name IS NOT NULL
  GROUP BY "o"."created_by" LIMIT 1;

  SELECT round(SUM(round((o.size - o.filled)::numeric, 8))::numeric, 8) INTO accumulated_sell
  FROM "Orders" AS "o"
  LEFT JOIN (
    SELECT lower(name) as name
    FROM "Pairs"
    WHERE pair_base = currency
  ) AS "p"
  ON lower("o".symbol) = lower("p".name)
  WHERE "o"."side" = 'sell' AND "o"."created_by" = user_id AND name IS NOT NULL
  GROUP BY "o"."created_by" LIMIT 1;

  IF accumulated_buy IS NULL THEN
    accumulated_buy = 0;
  END IF;
  IF accumulated_sell IS NULL THEN
    accumulated_sell = 0;
  END IF;

  accumulated = accumulated_buy + accumulated_sell;

  RAISE LOG 'USER ID: %, CURRENCY: %, ACCUMULATED: %, SELL: % BUY: %', user_id, currency, accumulated, accumulated_sell, accumulated_buy;
  RETURN accumulated;
END;
$calculate_accumlated$ LANGUAGE plpgsql;
`;

module.exports = sql;
