'use strict';

const TABLE = 'Users';
const COLUMN1 = 'id_data';
const COLUMN2 = 'bank_account';

module.exports = {
	up: (queryInterface) => queryInterface.sequelize.query (
		`UPDATE public."${TABLE}"SET
		${COLUMN1} =
			CASE
			WHEN (${COLUMN1}->>'verified' = 'false' and ${COLUMN1}->>'provided'='true') then jsonb_set(${COLUMN1}, '{status}', '1') 
			WHEN (${COLUMN1}->>'provided' = 'false' and ${COLUMN1}->>'verified'='false') then jsonb_set(${COLUMN1}, '{status}', '0') 
			WHEN (${COLUMN1}->>'provided' = 'false' and ${COLUMN1}->>'verified'='true') then jsonb_set(${COLUMN1}, '{status}', '3')
			WHEN (${COLUMN1}->>'provided' = 'true' and ${COLUMN1}->>'verified'='true') then jsonb_set(${COLUMN1}, '{status}', '3')
			ELSE jsonb_set(${COLUMN1}, '{status}', '0')
			END,
		${COLUMN2} =
			CASE
			WHEN (${COLUMN2}->>'verified' = 'false' and ${COLUMN2}->>'provided'='true') then jsonb_set(${COLUMN2}, '{status}', '1') 
			WHEN (${COLUMN2}->>'provided' = 'false' and ${COLUMN2}->>'verified'='false') then jsonb_set(${COLUMN2}, '{status}', '0') 
			WHEN (${COLUMN2}->>'provided' = 'false' and ${COLUMN2}->>'verified'='true') then jsonb_set(${COLUMN2}, '{status}', '3')
			WHEN (${COLUMN2}->>'provided' = 'true' and ${COLUMN2}->>'verified'='true') then jsonb_set(${COLUMN2}, '{status}', '3')
			ELSE jsonb_set(${COLUMN2}, '{status}', '0')
			END`
	),
	down: () => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
};