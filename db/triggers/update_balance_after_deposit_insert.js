const { CURRENCIES } = require('../../constants');

let depositPending = '';
let withdrawalPending = '';
let depositComplete = '';
let withdrawalComplete = '';

CURRENCIES.forEach((currency, i) => {
	const crypto = currency;
	if (i === 0) {
		depositPending += 'IF ';
		withdrawalPending += 'IF ';
		depositComplete += 'IF ';
		withdrawalComplete += 'IF ';
	} else {
		depositPending += 'ELSEIF ';
		withdrawalPending += 'ELSEIF ';
		depositComplete += 'ELSEIF ';
		withdrawalComplete += 'ELSEIF ';
	}
	depositPending += `
    NEW.currency = '${crypto}' THEN
      UPDATE "Balances"
      SET
        ${crypto}_pending = round((${crypto}_pending + NEW.amount)::numeric, 8),
        updated_at = current_timestamp
      WHERE user_id = NEW.user_id;
  `;
	withdrawalPending += `
    NEW.currency = '${crypto}' THEN
      UPDATE "Balances"
      SET
        ${crypto}_available = round((${crypto}_available - NEW.amount)::numeric, 8),
        updated_at = current_timestamp
      WHERE user_id = NEW.user_id;
  `;
	depositComplete += `
    NEW.currency = '${crypto}' THEN
      UPDATE "Balances"
      SET
        ${crypto}_balance = round((${crypto}_balance + NEW.amount)::numeric, 8),
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
		depositPending += 'END IF;';
		withdrawalPending += 'END IF; ';
		depositComplete += 'END IF; ';
		withdrawalComplete += 'END IF; ';
	}
});

const sql = `
CREATE OR REPLACE FUNCTION update_balance_after_deposit()
RETURNS TRIGGER AS $update_balance_after_deposit$
BEGIN
  IF NEW.status = FALSE THEN
    IF NEW.type = 'deposit' THEN
      ${depositPending}
    ELSEIF NEW.type = 'withdrawal' THEN
      ${withdrawalPending}
    END IF;
  ELSIF NEW.status = TRUE THEN
    IF NEW.type = 'deposit' THEN
      ${depositComplete}
    ELSEIF NEW.type = 'withdrawal' THEN
      ${withdrawalComplete}
    END IF;
  END IF;

  PERFORM check_balance(NEW.user_id);

  RETURN NEW;
END;
$update_balance_after_deposit$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_balance_after_deposit
ON "Deposits";

CREATE TRIGGER update_balance_after_deposit
AFTER INSERT ON "Deposits"
FOR EACH ROW EXECUTE PROCEDURE update_balance_after_deposit();
`;

module.exports = sql;