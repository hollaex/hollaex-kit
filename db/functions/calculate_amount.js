const sql = `
DROP FUNCTION IF EXISTS calculate_amount_with_fee(size DOUBLE precision, fee FLOAT);
CREATE OR REPLACE FUNCTION calculate_amount_with_fee(size DOUBLE precision, fee FLOAT)
RETURNS DOUBLE precision AS $calculate_amount_with_fee$
DECLARE
  amount DOUBLE precision;
BEGIN
  amount = size;
  IF fee > 0 THEN
    amount = amount - round((amount * fee / 100)::numeric, 8);
  END IF;
  RETURN round(amount::numeric, 8);
END;
$calculate_amount_with_fee$ LANGUAGE plpgsql;


DROP FUNCTION IF EXISTS calculate_amount_with_fee(price DOUBLE precision, size DOUBLE precision, fee FLOAT);
CREATE OR REPLACE FUNCTION calculate_amount_with_fee(price DOUBLE precision, size DOUBLE precision, fee FLOAT)
RETURNS DOUBLE precision AS $calculate_amount_with_fee$
DECLARE
  amount DOUBLE precision;
BEGIN
  amount = round((price * size)::numeric, 8);
  IF fee > 0 THEN
    amount = amount - round((amount * fee / 100)::numeric, 8);
  END IF;
  RETURN round(amount::numeric, 8);
END;
$calculate_amount_with_fee$ LANGUAGE plpgsql;
`;

module.exports = sql;
