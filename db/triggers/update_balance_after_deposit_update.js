const { CURRENCIES } = require('../../constants');

let depositComplete = '';
let withdrawalComplete = '';

CURRENCIES.forEach((currency, i) => {
	const crypto = currency;
	if (i === 0) {
		depositComplete += 'IF ';
		withdrawalComplete += 'IF ';
	} else {
		depositComplete += 'ELSEIF ';
		withdrawalComplete += 'ELSEIF ';
	}
	depositComplete += `
    NEW.currency = '${crypto}' THEN
      UPDATE "Balances"
      SET
        ${crypto}_balance = round((${crypto}_balance + NEW.amount)::numeric, 8),
        ${crypto}_pending = round((${crypto}_pending - NEW.amount)::numeric, 8),
        updated_at = current_timestamp
      WHERE user_id = NEW.user_id;
  `;
	withdrawalComplete += `
    NEW.currency = '${crypto}' THEN
      UPDATE "Balances"
      SET
      ${crypto}_balance = round((${crypto}_balance - NEW.amount)::numeric, 8),
        updated_at = current_timestamp
      WHERE user_id = NEW.user_id;
  `;

	if (i === CURRENCIES.length - 1) {
		depositComplete += 'END IF; ';
		withdrawalComplete += 'END IF; ';
	}
});

const sql = `

CREATE OR REPLACE FUNCTION update_balance_after_deposit_update()
RETURNS TRIGGER AS $update_balance_after_deposit_update$
BEGIN
  IF NEW.status = true AND OLD.status = false AND NEW.dismissed = false AND OLD.dismissed = false THEN
    IF NEW.type = 'deposit' THEN
      ${depositComplete}
    ELSEIF NEW.type = 'withdrawal' THEN
      ${withdrawalComplete}
    END IF;
  ELSE
    RAISE LOG 'DEPOSITS HERE';

  END IF;
  RETURN NEW;
END;
$update_balance_after_deposit_update$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_balance_after_deposit_update
ON "Deposits";

CREATE TRIGGER update_balance_after_deposit_update
AFTER UPDATE ON "Deposits"
FOR EACH ROW EXECUTE PROCEDURE update_balance_after_deposit_update();

`;

module.exports = sql;