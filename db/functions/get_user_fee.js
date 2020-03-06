const sql = `

DROP FUNCTION IF EXISTS get_user_fee(level integer, pair text, taker boolean);
CREATE OR REPLACE FUNCTION get_user_fee(level integer, pair text, taker boolean)
RETURNS FLOAT AS $get_user_fee$
DECLARE
  fee_value FLOAT = 0;
  query_string TEXT = '';
BEGIN
  IF taker = FALSE THEN
    query_string = 'SELECT p.maker_fees->>$2 as fee FROM "Pairs" AS p WHERE p.name=$1';
  ELSE
    query_string = 'SELECT p.taker_fees->>$2 as fee FROM "Pairs" AS p WHERE p.name=$1';
  END IF;

  EXECUTE query_string INTO fee_value USING pair, level::text;

  RAISE LOG 'FEE: %', fee_value;
  RETURN fee_value;
END;
$get_user_fee$ LANGUAGE plpgsql;
`;

module.exports = sql;