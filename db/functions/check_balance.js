const { CURRENCIES } = require('../../constants');

let declares = '';
let selects = '';
let balances = '';
let conditions = '';

CURRENCIES.forEach((currency, i) => {
	const crypto = currency;
	if (i === 0) {
		conditions += 'IF ';
	} else {
		conditions += 'ELSEIF ';
	}
	declares += `balance_${crypto} DOUBLE precision;\n`;
	selects += `${crypto}_available`;
	balances += `balance_${crypto}`;
	conditions += `balance_${crypto} < 0 THEN
    RAISE EXCEPTION '${crypto} Balance can not be negative: % - user: %', balance_${crypto}, user_id_to_check;
    RETURN FALSE;\n`;
	if (i === CURRENCIES.length-1) {
		conditions += 'END IF;';
	} else {
		selects += ', ';
		balances += ', ';
	}
});

const sql = `
DROP FUNCTION IF EXISTS check_balance(user_id_to_check integer);
CREATE OR REPLACE FUNCTION check_balance(user_id_to_check integer)
RETURNS BOOLEAN AS $check_balance$
DECLARE
  ${declares}
  user_is_admin BOOLEAN;
BEGIN
  SELECT "Users".is_admin INTO user_is_admin
  FROM "Users"
  WHERE id = user_id_to_check;


  -- Admins can have negative balance
  IF user_is_admin THEN
    RAISE LOG 'USER ID: %, is Admin?: %', user_id_to_check, user_is_admin;
    RETURN TRUE;
  END IF;

  SELECT ${selects}
  INTO ${balances}
  FROM "Balances"
  WHERE "Balances".user_id = user_id_to_check;

  RAISE LOG 'USER ID: %', user_id_to_check;
  ${conditions}
  RETURN TRUE;
END;
$check_balance$ LANGUAGE plpgsql;
`;

module.exports = sql;
