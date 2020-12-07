'use strict';

const TABLE = 'Plugins';
const plugins = [
	{
		name: 'Hello Exchange',
		version: 1,
		description: 'Demo Plugin',
		author: 'bitHolla',
		enabled: true,
		meta: JSON.stringify({
			key: 'key',
			secret: 'secret'
		}),
		prescript: JSON.stringify({
			install: ['hello-world-npm'],
			run: null
		}),
		postscript: JSON.stringify({
			run: null
		}),
		script: 'const helloWorld = installedLibraries[\'hello-world-npm\']; app.get(\'/plugins/hello-exchange\', (req, res) => res.json({ message: \'Hello Exchange\', other: helloWorld(), meta }));'
	},
	{
		name: 'Announcements',
		version: 1,
		description: 'Enables getting, posting, and deleting announcements',
		author: 'bitHolla',
		enabled: true,
		meta: JSON.stringify({}),
		prescript: JSON.stringify({}),
		postscript: JSON.stringify({}),
		script: `
			const announcementModel = toolsLib.database.createModel(
				'announcement',
				properties = {
					created_by: {
						type: 'integer',
						onDelete: 'CASCADE',
						allowNull: false,
						references: {
							model: 'Users',
							key: 'id'
						}
					},
					title: {
						type: 'string',
						allowNull: false
					},
					message: {
						type: 'text',
						allowNull: false
					},
					type: {
						type: 'string',
						allowNull: false,
						defaultValue: 'info'
					}
				}
			);
			const { checkSchema } = expressValidator;
			app.get('/plugins/announcements', [
				checkSchema({
					limit: {
						in: ['query'],
						isInt: true,
						optional: true,
						errorMessage: 'must be an integer'
					},
					page: {
						in: ['query'],
						isInt: true,
						optional: true,
						errorMessage: 'must be an integer'
					},
					order_by: {
						in: ['query'],
						isString: true,
						optional: true,
						errorMessage: 'must be a string'
					},
					order: {
						in: ['query'],
						isString: true,
						isIn: {
							options: [['asc', 'desc']],
						},
						errorMessage: 'must be one of [asc, desc]',
						optional: true
					},
					start_date: {
						in: ['query'],
						isISO8601: true,
						errorMessage: 'must be an iso date',
						optional: true
					},
					end_date: {
						in: ['query'],
						isISO8601: true,
						errorMessage: 'must be an iso date',
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				const { limit, page, order_by, order, start_date, end_date } = req.query;

				loggerPlugin.info(
					req.uuid,
					'GET /plugins/announcements query',
					limit,
					page,
					order_by,
					order,
					start_date,
					end_date
				);

				const pagination = toolsLib.database.paginationQuery(limit, page);
				const ordering = toolsLib.database.orderingQuery(order_by, order);
				const timeframe = toolsLib.database.timeframeQuery(start_date, end_date);

				const query = {
					where: {},
					order: [ordering],
					attributes: {
						exclude: ['created_by']
					},
					...pagination
				};

				if (timeframe) query.where.created_at = timeframe;

				announcementModel.findAndCountAll(query)
					.then(toolsLib.database.convertSequelizeCountAndRows)
					.then((announcements) => {
						return res.json(announcements);
					})
					.catch((err) => {
						loggerPlugin.error(
							req.uuid,
							'GET /plugins/announcements err',
							err.message
						);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/announcement', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
				checkSchema({
					title: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: false
					},
					message: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 5',
							options: { min: 1 }
						},
						optional: false
					},
					type: {
						in: ['body'],
						errorMessage: 'must be a string',
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						isString: true,
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'POST /plugins/announcement auth',
					req.auth.sub
				);

				let { title, message, type } = req.body;

				if (!type) type = 'info';

				loggerPlugin.info(
					req.uuid,
					'POST /plugins/announcement title',
					title,
					'type',
					type
				);

				announcementModel.create({
					created_by: req.auth.sub.id,
					title,
					message,
					type
				})
					.then((announcement) => {
						return res.json(announcement);
					})
					.catch((err) => {
						loggerPlugin.error(
							req.uuid,
							'POST /plugins/announcement err',
							err.message
						);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.delete('/plugins/announcement', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
				checkSchema({
					id: {
						in: ['query'],
						errorMessage: 'must include an id',
						isInt: true,
						optional: false
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'DELETE /plugins/announcement auth',
					req.auth.sub
				);

				const { id } = req.query;

				loggerPlugin.info(
					req.uuid,
					'DELETE /plugins/announcement id',
					id
				);

				announcementModel.findOne({
					where: { id }
				})
					.then((announcement) => {
						if (!announcement) {
							throw new Error('Not found');
						}
						return announcement.destroy();
					})
					.then(() => {
						return res.json({ message: 'Success' });
					})
					.catch((err) => {
						loggerPlugin.error(
							req.uuid,
							'DELETE /plugins/announcement err',
							err.message
						);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});
		`
	},
	{
		name: 'Bank',
		version: 1,
		description: 'Allow users to update bank information',
		author: 'bitHolla',
		enabled: true,
		meta: JSON.stringify({}),
		prescript: JSON.stringify({}),
		postscript: JSON.stringify({}),
		script: `
			const crypto = require('crypto');
			const VERIFY_STATUS = {
				EMPTY: 0,
				PENDING: 1,
				REJECTED: 2,
				COMPLETED: 3
			};

			app.post('/plugins/bank/user', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['user']),
				expressValidator.checkSchema({
					bank_name: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: false
					},
					account_number: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 5 and maximum length of 50',
							options: { min: 1, max: 50 }
						},
						optional: true
					},
					card_number: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					'POST /bank/user auth',
					req.auth.sub
				);

				const email = req.auth.sub.email;
				let bank_account = req.body;

				loggerPlugin.info(
					'POST /bank/user bank',
					email,
					bank_account
				);

				toolsLib.user.getUserByEmail(email, false)
					.then(async (user) => {
						if (!user) {
							throw new Error('User not found');
						} else if (user.bank_account.length >= 3) {
							throw new Error('User can have a maximum of three banks');
						}

						bank_account = lodash.pick(
							bank_account,
							'bank_name',
							'card_number',
							'account_number'
						);

						bank_account.id = crypto.randomBytes(10).toString('hex');
						bank_account.status = VERIFY_STATUS.PENDING;

						let newBank = user.bank_account;
						newBank.push(bank_account);

						const updatedUser = await user.update(
							{ bank_account: newBank },
							{ fields: ['bank_account'] }
						);

						return res.json(updatedUser.bank_account);
					})
					.catch((err) => {
						loggerPlugin.error('POST /bank/user err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/bank/admin', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
				expressValidator.checkSchema({
					id: {
						in: ['query'],
						errorMessage: 'must be an integer',
						isInt: true,
						optional: false
					},
					bank_account: {
						in: ['body'],
						errorMessage: 'must be an array',
						isArray: true,
						optional: false,
						custom: {
							options: (value) => {
								return value.length >= 1 && value.length <= 3;
							},
							errorMessage: 'must be minimum length of 1 and maximum length of 3'
						}
					},
					'bank_account.*.bank_name': {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: false
					},
					'bank_account.*.account_number': {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 5 and maximum length of 50',
							options: { min: 1, max: 50 }
						},
						optional: true
					},
					'bank_account.*.card_number': {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					'POST /bank/admin auth',
					req.auth.sub
				);

				const id = req.query.id;
				let { bank_account } = req.body;

				loggerPlugin.info(
					'POST /bank/admin bank',
					id,
					bank_account
				);

				toolsLib.user.getUserByKitId(id, false)
					.then(async (user) => {
						if (!user) {
							throw new Error('User not found');
						}

						lodash.each(bank_account, (bank) => {
							bank.id = crypto.randomBytes(10).toString('hex');
							bank.status = VERIFY_STATUS.COMPLETED;
							bank = lodash.pick(
								bank,
								'id',
								'status',
								'bank_name',
								'card_number',
								'account_number'
							);
						});

						const updatedUser = await user.update(
							{ bank_account },
							{ fields: ['bank_account'] }
						);

						return res.json(updatedUser.bank_account);
					})
					.catch((err) => {
						loggerPlugin.error('POST /bank/user err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/bank/verify', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
				expressValidator.checkSchema({
					user_id: {
						in: ['body'],
						errorMessage: 'must be an integer',
						isInt: true,
						optional: false
					},
					bank_id: {
						in: ['body'],
						errorMessage: 'must be an string',
						isString: true,
						optional: false
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'GET /plugins/bank/verify auth',
					req.auth.sub
				);

				const { user_id, bank_id } = req.body;

				loggerPlugin.info(
					req.uuid,
					'POST /plugins/bank/verify params',
					'user_id',
					user_id,
					'bank_id',
					bank_id
				);

				toolsLib.user.getUserByKitId(user_id, false)
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						const bank = user.bank_account.filter((bank) => bank.id === bank_id);

						if (bank.length === 0) {
							throw new Error('Bank not found');
						} else if (bank[0].status === VERIFY_STATUS.COMPLETED) {
							throw new Error('Bank is already verified');
						}

						const banks = user.bank_account.map((bank) => {
							if (bank.id === bank_id) {
								bank.status = VERIFY_STATUS.COMPLETED;
							}
							return bank;
						});

						return user.update(
							{ bank_account: banks },
							{ fields: ['bank_account'] }
						);
					})
					.then((user) => {
						return res.json(user.bank_account);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'POST /plugins/bank/verify err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/bank/revoke', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
				expressValidator.checkSchema({
					user_id: {
						in: ['body'],
						errorMessage: 'must be an integer',
						isInt: true,
						optional: false
					},
					bank_id: {
						in: ['body'],
						errorMessage: 'must be an string',
						isString: true,
						optional: false
					},
					message: {
						in: ['body'],
						errorMessage: 'must be an string',
						isString: true,
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'POST /plugins/bank/revoke auth',
					req.auth.sub
				);

				const { user_id, bank_id } = req.body;
				let { message } = req.body || 'Unspecified';

				loggerPlugin.info(
					req.uuid,
					'POST /plugins/bank/revoke params',
					'user_id',
					user_id,
					'bank_id',
					bank_id
				);

				toolsLib.user.getUserByKitId(user_id, false)
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						const bank = user.bank_account.filter((bank) => bank.id === bank_id);

						if (bank.length === 0) {
							throw new Error('Bank not found');
						}

						const newBanks = user.bank_account.filter((bank) => bank.id !== bank_id);

						return user.update(
							{ bank_account: newBanks },
							{ fields: ['bank_account'] }
						);
					})
					.then((user) => {
						toolsLib.sendEmail('USER_VERIFICATION_REJECT', user.email, { type: 'bank', message }, user.settings);
						return res.json(user.bank_account);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'POST /plugins/bank/revoke err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});
		`
	},
	{
		name: 'SMS',
		version: 1,
		description: 'SMS functionality using AWS SNS',
		author: 'bitHolla',
		enabled: true,
		meta: JSON.stringify({
			accessKeyId: '',
			secretAccessKey: '',
			region: ''
		}),
		prescript: JSON.stringify({
			install: ['awesome-phonenumber', 'aws-sdk']
		}),
		script: `
			const PhoneNumber = installedLibraries['awesome-phonenumber'];
			const aws = installedLibraries['aws-sdk'];

			const sns = () => {
				aws.config.update({
					accessKeyId: meta.accessKeyId,
					secretAccessKey: meta.secretAccessKey,
					region: meta.region
				});
				return new aws.SNS();
			};

			const sendAwsSMS = (phoneNumber, message) => {
				const params = {
					Message: message,
					MessageStructure: 'string',
					PhoneNumber: phoneNumber
				};

				return new Promise((resolve, reject) => {
					sns().publish(params, (err, data) => {
						if (err) {
							const error = new Error('Error sending SMS');
							error.statusCode = 400;
							return reject(error);
						}
						return resolve(data);
					});
				});
			};

			toolsLib.database.subscriber.subscribe('channel:events');

			toolsLib.database.subscriber.on('message', (channel, message) => {
				if (channel === 'channel:events') {
					const { type, data } = JSON.parse(message);
					if (type === 'deposit' || type === 'withdrawal') {
						if (data.status === 'COMPLETED') {
							toolsLib.user.getUserByKitId(data.user_id, false)
								.then(async (user) => {
									if (user && user.phone_number) {
										const phoneNumber = new PhoneNumber(user.phone_number);
										const message = \`Your \${data.currency.toUpperCase()} \${type} for amount \${data.amount} is confirmed\`
										const res = await sendAwsSMS(phoneNumber.getNumber(), message);
									}
								})
						}
					}
				}
			});

			app.get('/plugins/sms/verify', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['user']),
				expressValidator.checkSchema({
					phone: {
						in: ['query'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: false
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'GET /plugins/sms/verify auth',
					req.auth.sub
				);

				const number = req.query.phone;
				const { id } = req.auth.sub;

				loggerPlugin.info(
					req.uuid,
					'GET /plugins/sms/verify phoneNumber',
					number
				);

				const phoneNumber = new PhoneNumber(number);

				if (!phoneNumber.isValid()) {
					loggerPlugin.error(
						req.uuid,
						'GET /plugins/sms/verify',
						'Invalid phone number'
					);
					return res.status(400).json({ message: 'Invalid phone number' });
				}

				const phone = phoneNumber.getNumber();
				const code = toolsLib.security.generateOtp();
				const message = \`Your verification code is \${code}\`;

				sendAwsSMS(phoneNumber.getNumber(), message)
					.then(() => {
						const userKey = \`user:sms:\${id}\`;
						const data = {
							phone,
							code
						};

						return toolsLib.database.client.setAsync(
							userKey,
							JSON.stringify(data),
							'EX',
							6 * 60 // 6 minutes
						);
					})
					.then(() => {
						return res.json({ message: 'SMS has been sent' });
					})
					.catch((err) => {
						loggerPlugin.error(
							req.uuid,
							'GET /plugins/sms/verify err',
							err.message
						);
						return res.status(err.statusCode || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/sms/verify', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['user']),
				expressValidator.checkSchema({
					code: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: false
					},
					phone: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: false
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'POST /plugins/sms/verify auth',
					req.auth.sub
				);

				const { id } = req.auth.sub;
				const { code, phone } = req.body;

				loggerPlugin.info(
					req.uuid,
					'POST /plugins/sms/verify code',
					code,
					'phone',
					phone
				);

				const phoneNumber = new PhoneNumber(phone);

				if (!phoneNumber.isValid()) {
					loggerPlugin.error(
						req.uuid,
						'POST /plugins/sms/verify',
						'Invalid phone number'
					);
					return res.status(400).json({ message: 'Invalid phone number' });
				}

				const formattedNumber = phoneNumber.getNumber();
				const userKey = \`user:sms:\${id}\`;

				toolsLib.database.client.getAsync(userKey)
					.then((data) => {
						if (!data) {
							throw new Error('The code provided has expired or has been used');
						}
						data = JSON.parse(data);

						if (data.phone !== formattedNumber) {
							throw new Error('The phone number provided is incorrect');
						} else if (data.code !== code) {
							throw new Error('The code provided is invalid');
						}

						return toolsLib.user.getUserByKitId(id, false);
					})
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						return user.update({ phone_number: phone }, { fields: ['phone_number'] });
					})
					.then(() => {
						return toolsLib.database.client.delAsync(userKey);
					})
					.then(() => {
						return res.json({ message: 'Phone number has been verified' });
					})
					.catch((err) => {
						loggerPlugin.error(
							req.uuid,
							'POST /plugins/sms/verify err',
							err.message
						);
						return res.status(err.statusCode || 400).json({ message: err.message });
					});
			});
		`
	},
	{
		name: 'KYC',
		version: 1,
		description: 'KYC plugin',
		author: 'bitHolla',
		enabled: true,
		meta: JSON.stringify({
			bucketName: 'bucketName',
			region: 'region',
			accessKeyId: 'key',
			secretAccessKey: 'secret'
		}),
		prescript: JSON.stringify({
			install: ['aws-sdk', 'awesome-phonenumber'],
			run: null
		}),
		script: `
			const aws = installedLibraries['aws-sdk'];
			const PhoneNumber = installedLibraries['awesome-phonenumber'];
			const upload = multer();

			const VERIFY_STATUS = {
				EMPTY: 0,
				PENDING: 1,
				REJECTED: 2,
				COMPLETED: 3
			};

			const s3 = () => {
				aws.config.update({
					accessKeyId: meta.accessKeyId,
					secretAccessKey: meta.secretAccessKey
				});
				return new aws.S3({
					region: meta.region,
					signatureVersion: 'v4'
				});
			};

			const uploadFile = (name, file) => {
				return new Promise((resolve, reject) => {
					const params = {
						Bucket: meta.bucketName,
						Key: name,
						Body: file.buffer,
						ContentType: file.mimetype,
						ACL: 'authenticated-read'
					};
					s3().upload(params, (err, data) => {
						if (err) {
							reject(err);
						}
						resolve(data);
					});
				});
			};

			const getKeyFromLink = (link) => {
				const AWS_SE = 'amazonaws.com/';
				const indexOfService = link.indexOf(AWS_SE);
				if (indexOfService > 0) {
					return link.substring(indexOfService + AWS_SE.length);
				}
				// if not amazon.com link, return same link
				return link;
			};

			const getPublicLink = (privateLink) => {
				const params = {
					Bucket: meta.bucketName,
					Key: getKeyFromLink(privateLink),
					Expires: 300 //seconds
				};

				return s3().getSignedUrl('getObject', params);
			};

			const validMimeType = (type = '') => {
				return type.indexOf('image/') === 0;
			};

			const getType = (type = '') => {
				return type.replace('image/', '');
			};

			app.put('/plugins/kyc/user', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['user']),
				expressValidator.checkSchema({
					full_name: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					},
					gender: {
						in: ['body'],
						errorMessage: 'must be a boolean',
						isBoolean: true,
						optional: true
					},
					nationality: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					},
					dob: {
						in: ['body'],
						errorMessage: 'must be a string',
						isISO8601: true,
						optional: true
					},
					address: {
						in: ['body'],
						custom: {
							options: (value) => {
								if (!lodash.isPlainObject(value)) {
									return false;
								}
								if (!value.country || !lodash.isString(value.country)) {
									return false;
								}
								if (!value.address || !lodash.isString(value.address)) {
									return false;
								}
								if (!value.postal_code || !lodash.isString(value.postal_code)) {
									return false;
								}
								if (!value.country || !lodash.isString(value.country)) {
									return false;
								}
								return true;
							}
						},
						errorMessage: 'must be an object with country, address, postal_code, country (all string)',
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'PUT /plugins/kyc/user auth',
					req.auth.sub
				);

				const newData = req.body;
				const { email } = req.auth.sub;

				toolsLib.user.getUserByEmail(email, false)
					.then(async (user) => {
						if (!user) {
							throw new Error('User not found');
						}

						const updatedData = lodash.pick(newData, [
							'full_name',
							'gender',
							'dob',
							'address',
							'nationality'
						]);

						let updatedUser = await user.update(updatedData, {
							fields: [
								'full_name',
								'gender',
								'nationality',
								'dob',
								'address'
							],
							returning: true
						});

						updatedUser = lodash.omit(updatedUser.dataValues, [
							'password',
							'is_admin',
							'is_support',
							'is_kyc',
							'is_supervisor'
						]);

						return res.json(updatedUser);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'PUT /plugins/kyc/user err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.put('/plugins/kyc/admin', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support']),
				expressValidator.checkSchema({
					user_id: {
						in: ['query'],
						errorMessage: 'must be an integer',
						isInt: true,
						optional: false
					},
					full_name: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					},
					gender: {
						in: ['body'],
						errorMessage: 'must be a boolean',
						isBoolean: true,
						optional: true
					},
					nationality: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					},
					dob: {
						in: ['body'],
						errorMessage: 'must be a string',
						isISO8601: true,
						optional: true
					},
					address: {
						in: ['body'],
						custom: {
							options: (value) => {
								if (!lodash.isPlainObject(value)) {
									return false;
								}
								if (!value.country || !lodash.isString(value.country)) {
									return false;
								}
								if (!value.address || !lodash.isString(value.address)) {
									return false;
								}
								if (!value.postal_code || !lodash.isString(value.postal_code)) {
									return false;
								}
								if (!value.country || !lodash.isString(value.country)) {
									return false;
								}
								return true;
							}
						},
						errorMessage: 'must be an object with country, address, postal_code, country (all string)',
						optional: true
					},
					phone_number: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'PUT /plugins/kyc/admin auth',
					req.auth.sub
				);

				const ip = req.headers['x-real-ip'];
				const domain = req.headers['x-real-origin'];
				const admin_id = req.auth.sub.id;
				const id = req.query.user_id;
				const newData = req.body;

				toolsLib.user.getUserByKitId(id, false)
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						const prevUserData = lodash.cloneDeep(user.dataValues);

						if (newData.phone_number) {
							const phoneNumber = new PhoneNumber(newData.phone_number);
							if (!phoneNumber.isValid()) {
								throw new Error('Invalid phone number given');
							}
							newData.phone_number = phoneNumber.getNumber();
						}

						const updatedData = lodash.pick(newData, [
							'full_name',
							'gender',
							'dob',
							'address',
							'nationality',
							'phone_number'
						]);

						return Promise.all([
							user.update(updatedData, {
								fields: [
									'full_name',
									'gender',
									'dob',
									'address',
									'nationality',
									'phone_number'
								],
								returning: true
							}),
							prevUserData
						]);
					})
					.then(async ([ user, prevUserData ]) => {
						await toolsLib.user.createAudit(admin_id, 'userUpdate', ip, {
							userId: user.id,
							prevUserData,
							newUserDate: user,
							domain
						});

						user = lodash.omit(user.dataValues, [
							'password',
							'is_admin',
							'is_support',
							'is_kyc',
							'is_supervisor'
						]);

						return res.json(user);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'PUT /plugins/kyc/user err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.get('/plugins/kyc/id', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
				expressValidator.checkSchema({
					id: {
						in: ['query'],
						errorMessage: 'must be an integer',
						isInt: true,
						optional: true
					},
					email: {
						in: ['query'],
						errorMessage: 'must be an email',
						isEmail: true,
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'GET /plugins/kyc/id auth',
					req.auth.sub
				);

				const { email, id } = req.query;
				const where = {};

				if (id) {
					where.id = id;
				} else if (email) {
					where.email = email;
				} else {
					loggerPlugin.error(req.uuid, 'GET /plugins/kyc/id', 'Email or id required');
					return res.status(400).json({ message: 'Email or id required' });
				}

				toolsLib.database.findOne('user', { where, attributes: ['id', 'id_data' ], raw: true })
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						return toolsLib.database.findOne('verification image', {
							where: { id: user.id },
							order: [['created_at', 'desc']],
							attributes: ['front', 'back', 'proof_of_residency'],
							raw: true
						});
					})
					.then((images) => {
						if (!images) {
							throw new Error('ID image not found');
						}
						const data = {
							front: images.front ? getPublicLink(images.front) : '',
							back: images.back ? getPublicLink(images.back) : '',
							proof_of_residency: images.proof_of_residency ? getPublicLink(images.proof_of_residency) : ''
						};

						return res.json(data);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'GET /plugins/kyc/id err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/kyc/id/verify', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
				expressValidator.checkSchema({
					user_id: {
						in: ['body'],
						errorMessage: 'must be an integer',
						isInt: true,
						optional: false
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'POST /plugins/kyc/id/verify auth',
					req.auth.sub
				);

				const { user_id } = req.body;

				loggerPlugin.info(
					req.uuid,
					'POST /plugins/kyc/id/verify user_id',
					user_id
				);

				toolsLib.user.getUserByKitId(user_id, false)
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						if (user.id_data.status === VERIFY_STATUS.COMPLETED) {
							throw new Error('ID already verified');
						}

						return user.update({
							id_data: { ...user.id_data, status: VERIFY_STATUS.COMPLETED, note: '' }
						}, {
							fields: ['id_data'],
							raw: true,
							returning: true
						});
					})
					.then((user) => {
						return res.json(user.id_data);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'POST /plugins/kyc/id/verify err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/kyc/id/revoke', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
				expressValidator.checkSchema({
					user_id: {
						in: ['body'],
						errorMessage: 'must be an integer',
						isInt: true,
						optional: false
					},
					message: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				loggerPlugin.verbose(
					req.uuid,
					'POST /plugins/kyc/id/revoke auth',
					req.auth.sub
				);

				const user_id = req.body.user_id;
				const message = req.body.message || 'Unspecified';

				loggerPlugin.info(
					req.uuid,
					'POST /plugins/kyc/id/revoke user_id',
					user_id
				);

				toolsLib.user.getUserByKitId(user_id, false)
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						if (user.id_data.status === VERIFY_STATUS.REJECTED) {
							throw new Error('ID already revoked');
						}

						return toolsLib.database.getModel('sequelize')
							.transaction((transaction) => {
								return Promise.all([
									user.update({
										id_data: { ...user.id_data, status: VERIFY_STATUS.COMPLETED, note: '' }
									}, {
										fields: ['id_data'],
										raw: true,
										returning: true,
										transaction
									}),
									toolsLib.database.destroy('verification image', {
										where: { user_id: user.id }
									}, { transaction })
								]);
							});
					})
					.then(([ user ]) => {
						const emailData = { type: 'id', message };

						toolsLib.sendEmail('USER_VERIFICATION_REJECT', user.email, emailData, user.settings);

						return res.json(user.id_data);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'POST /plugins/kyc/id/revoke err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.post('/plugins/kyc/user/upload', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['user']),
				upload.fields([
					{ name: 'front', maxCount: 1 },
					{ name: 'back', maxCount: 1 },
					{ name: 'proof_of_residency', maxCount: 1 }
				])
			], (req, res) => {
				loggerPlugin.verbose(
					req.uuid,
					'POST /plugins/kyc/user/upload auth',
					req.auth.sub
				);

				const { id } = req.auth.sub;

				let { front, back, proof_of_residency } = req.files;
				if (front) front = front[0];
				if (back) back = back[0];
				if (proof_of_residency) proof_of_residency = proof_of_residency[0];
				const { ...otherData } = req.body;

				let invalidType = '';
				if (!validMimeType(front.mimetype)) {
					invalidType = 'front';
				} else if (back && !validMimeType(back.mimetype)) {
					invalidType = 'back';
				} else if (
					proof_of_residency &&
					!validMimeType(proof_of_residency.mimetype)
				) {
					invalidType = 'proof_of_residency';
				}

				if (invalidType) {
					loggerPlugin.error(req.uuid, 'POST /plugins/kyc/user/upload error', \`Invalid type: \${invalidType} field\`);
					return res.status(400).json({ message: \`Invalid type: \${invalidType} field\` });
				}

				const updatedData = { id_data: {} };

				Object.entries(otherData).forEach(([key, field]) => {
					if (field) {
						if (
							key === 'type' ||
							key === 'number' ||
							key === 'issued_date' ||
							key === 'expiration_date'
						) {
							updatedData.id_data[key] = field;
						}
					}
				});

				const ts = moment().valueOf();
				let currentUser;

				toolsLib.user.getUserByKitId(id, false)
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}
						currentUser = user;
						let { status } = user.id_data || 0;
						if (status === VERIFY_STATUS.COMPLETED) {
							throw new Error('You are not allowed to upload an approved document');
						}
						return Promise.all([
							uploadFile(
								\`\${id}/\${ts}-front.\${getType(front.mimetype)}\`,
								front
							),
							back
								? uploadFile(
									\`\${id}/\${ts}-back.\${getType(back.mimetype)}\`,
									back
								)
								: undefined,
							proof_of_residency
								? uploadFile(
									\`\${id}/\${ts}-proof_of_residency.\${getType(
										proof_of_residency.mimetype
									)}\`,
									proof_of_residency
								)
								: undefined
						]);
					})
					.then((results) => {
						loggerPlugin.info(req.uuid, 'POST /plugins/kyc/user/upload results', results);
						return toolsLib.database.getModel('sequelize').transaction((transaction) => {
							return toolsLib.database.getModel('verification image').findOrCreate(
								{
									defaults: {
										user_id: currentUser.id,
										front: results[0].Location,
										back: results[1] ? results[1].Location : '',
										proof_of_residency: results[2] ? results[2].Location: ''
									},
									where: { user_id: currentUser.id },
									transaction
								},
							)
								.then(async ([image, created]) => {
									if(!created) {
										await image.update({
											front: results[0].Location,
											back: results[1] ? results[1].Location : '',
											proof_of_residency: results[2] ? results[2].Location: ''
										}, { transaction, fields: ['front', 'back', 'proof_of_residency'] } );
									}

									updatedData.status = VERIFY_STATUS.PENDING;

									await currentUser.update(updatedData, { transaction, fields: ['id_data'] });

									return;
								});
						});
					})
					.then(() => {
						toolsLib.sendEmail('USER_VERIFICATION', currentUser.email, {}, currentUser.settings);
						return res.json({ message: 'Success' });
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'POST /plugins/kyc/user/upload error', err.message);
						res.status(400).json({ message: err.message });
					});
			});

			app.post('/plugins/kyc/admin/upload', [
				toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor']),
				upload.fields([
					{ name: 'front', maxCount: 1 },
					{ name: 'back', maxCount: 1 },
					{ name: 'proof_of_residency', maxCount: 1 }
				])
			], (req, res) => {
				loggerPlugin.verbose(req.uuid, 'POST /plugins/kyc/admin/upload auth', req.auth.sub);

				let { front, back, proof_of_residency } = req.files;
				if (front) front = front[0];
				if (back) back = back[0];
				if (proof_of_residency) proof_of_residency = proof_of_residency[0];
				const { ...otherData } = req.body;
				const user_id = req.query.user_id;

				loggerPlugin.info(
					req.uuid,
					'POST /plugins/kyc/admin/upload user_id',
					user_id
				);

				if (
					!front &&
					!back &&
					!proof_of_residency &&
					Object.keys(otherData).length === 0
				) {
					loggerPlugin.error(
						req.uuid,
						'POST /plugins/kyc/admin/upload err',
						'Missing fields'
					);
					return res.status(400).json({ message: 'Missing fields' });
				}

				let invalidType = '';
				if (front && !validMimeType(front.mimetype)) {
					invalidType = 'front';
				} else if (back && !validMimeType(back.mimetype)) {
					invalidType = 'back';
				} else if (
					proof_of_residency &&
					!validMimeType(proof_of_residency.mimetype)
				) {
					invalidType = 'proof_of_residency';
				}
				if (invalidType) {
					loggerPlugin.error(
						req.uuid,
						'POST /plugins/kyc/admin/upload err',
						\`Invalid type \${invalidType} field\`
					);
					return res.status(400).json({ message: \`Invalid type \${invalidType} field\` });
				}

				const updatedData = { id_data: { provided: true }};

				Object.entries(otherData).forEach(([key, field]) => {
					if (field) {
						if (
							key === 'type' ||
							key === 'number' ||
							key === 'issued_date' ||
							key === 'expiration_date'
						) {
							updatedData.id_data[key] = field;
						}
					}
				});

				const ts = moment().valueOf();
				let currentUser;

				toolsLib.user.getUserByKitId(user_id, false)
					.then((user) => {
						if (!user) {
							throw new Error('User not found');
						}

						currentUser = user;

						return toolsLib.database.findOne('verification image', {
							where: { user_id: user.id },
							order: [['created_at', 'desc']],
							attributes: ['front', 'back', 'proof_of_residency'],
							raw: true
						});
					})
					.then((verificationImage) => {
						if (!verificationImage) {
							return {
								front: undefined,
								back: undefined,
								proof_of_residency: undefined
							};
						}
						return verificationImage;
					})
					.then((data) => {
						return Promise.all([
							front
								? uploadFile(
									\`\${user_id}/\${ts}-front.\${getType(front.mimetype)}\`,
									front
								)
								: { Location: data.front },
							back
								? uploadFile(
									\`\${user_id}/\${ts}-back.\${getType(back.mimetype)}\`,
									back
								)
								: { Location: data.back },
							proof_of_residency
								? uploadFile(
									\`\${user_id}/\${ts}-proof_of_residency.\${getType(
										proof_of_residency.mimetype
									)}\`,
									proof_of_residency
								)
								: { Location: data.proof_of_residency }
						]);
					})
					.then((results) => {
						loggerPlugin.info(req.uuid, 'POST /plugins/kyc/user/upload results', results);
						return toolsLib.database.getModel('sequelize').transaction((transaction) => {
							return toolsLib.database.getModel('verification image').findOrCreate(
								{
									defaults: {
										user_id: currentUser.id,
										front: results[0].Location,
										back: results[1] ? results[1].Location : '',
										proof_of_residency: results[2] ? results[2].Location: ''
									},
									where: { user_id: currentUser.id },
									transaction
								},
							)
								.then(async ([image, created]) => {
									let updatedImage = image;
									if(!created) {
										updatedImage = await image.update({
											front: results[0].Location,
											back: results[1] ? results[1].Location : '',
											proof_of_residency: results[2] ? results[2].Location: ''
										}, { transaction, fields: ['front', 'back', 'proof_of_residency'], returning: true } );
									}

									updatedData.status = VERIFY_STATUS.PENDING;

									await currentUser.update(updatedData, { transaction, fields: ['id_data'] });

									return updatedImage;
								});
						});
					})
					.then((data) => {
						return res.json({ message: 'Success', data });
					})
					.catch((err) => {
						loggerPlugin.error('POST /plugins/kyc/admin/upload err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
				});
			`
	},
];

module.exports = {
	up: (queryInterface) => queryInterface.bulkInsert(TABLE, plugins, {}),
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};