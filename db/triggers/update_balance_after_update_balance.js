const { CURRENCIES } = require('../../constants');

let declares = '';
let conditions = '';
let selects = '';
let balances = '';
CURRENCIES.forEach((currency, i) => {
	const crypto = currency;
	declares += `available_${crypto} DOUBLE precision;\n`;
	declares += `balance_${crypto} DOUBLE precision;\n`;
	declares += `pending_withdraw_${crypto} DOUBLE precision;\n`;

	if (i === 0) {
		conditions += 'IF ';
	} else {
		conditions += 'OR ';
	}
	conditions += `NEW.${crypto}_balance <> OLD.${crypto}_balance\n`;

	selects += `SELECT calculate_accumlated(NEW.user_id, '${crypto}') INTO available_${crypto};
    SELECT calculate_accumlated_withdrawals(NEW.user_id, '${crypto}') INTO pending_withdraw_${crypto};\n`;

	balances += `${crypto}_available = round((NEW.${crypto}_balance - round((available_${crypto} + pending_withdraw_${crypto})::numeric, 8))::numeric, 8)`;

	if (i === CURRENCIES.length - 1) {
		conditions += 'THEN \n';
	} else {
		balances += ',\n';
	}
});


const sql = `
CREATE OR REPLACE FUNCTION update_balance_after_update_balance()
RETURNS TRIGGER AS $update_balance_after_update_balance$
DECLARE
  ${declares}
BEGIN

  ${conditions}
  ${selects}

    UPDATE "Balances"
    SET
     ${balances}
    WHERE user_id = NEW.user_id;
  END IF;

  PERFORM check_balance(NEW.user_id);

  RETURN NEW;
END;
$update_balance_after_update_balance$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_balance_after_update_balance
ON "Balances";

CREATE TRIGGER update_balance_after_update_balance
AFTER UPDATE ON "Balances"
FOR EACH ROW EXECUTE PROCEDURE update_balance_after_update_balance();
`;

module.exports = sql;