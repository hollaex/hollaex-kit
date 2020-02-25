const { CURRENCIES } = require('../../constants');

let declares = '';
let selects = '';
let balances = '';
CURRENCIES.forEach((currency) => {
	const crypto = currency;
	declares += `acum_${crypto} DOUBLE precision;\n`;
	selects += `SELECT calculate_accumlated(NEW.created_by, '${crypto}') INTO acum_${crypto};\n`;
	balances += `${crypto}_available = round((${crypto}_balance - acum_${crypto})::numeric, 8),\n`;
});

const sql = `
CREATE OR REPLACE FUNCTION update_balance_after_order_add()
RETURNS TRIGGER AS $update_balance_after_order_add$
DECLARE
  ${declares}
BEGIN
  ${selects}

  UPDATE "Balances"
  SET
  	${balances}
    updated_at = current_timestamp
  WHERE user_id = NEW.created_by;

  PERFORM check_balance(NEW.created_by);

  RETURN NEW;
END;
$update_balance_after_order_add$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_balance_after_order_add
ON "Orders";

CREATE TRIGGER update_balance_after_order_add
AFTER INSERT ON "Orders"
FOR EACH ROW EXECUTE PROCEDURE update_balance_after_order_add();
`;

module.exports = sql;