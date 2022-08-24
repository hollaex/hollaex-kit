'use strict';

const crypto = require('crypto');

const {
    meta,
    publicMeta,
    toolsLib,
    lodash,
    moment,
    app,
    loggerPlugin,
    expressValidator,
    bluebird,
    rp
} = this;

const {
    webhook_secret: { value: WEBHOOK_SECRET },
    client_secret: { value: CLIENT_SECRET },
    manual_review: { value: MANUAL_REVIEW }
} = meta;
const {
    client_id: { value: CLIENT_ID },
    flow_id: { value: FLOW_ID }
} = publicMeta;

const VERIFY_STATUS = {
    EMPTY: 0,
    PENDING: 1,
    REJECTED: 2,
    COMPLETED: 3
};

const
   MATI_API_URL_AUTH = 'https://api.getmati.com/oauth',
   getDomainUrl = (path) => `${toolsLib.getDomain()}${path}`;

const init = async () => {
    if (!WEBHOOK_SECRET) {
        throw new Error('webhook_secret required value');
    }
    if (!CLIENT_SECRET) {
        throw new Error('client_secret required value');
    }
    if (!CLIENT_ID) {
        throw new Error('client_id required value');
    }
    if (!FLOW_ID) {
        throw new Error('flow_id required value');
    }
    if (typeof MANUAL_REVIEW !== 'boolean') {
        throw new Error('manual_review invalid value');
    }
};

const convertGender = (gender) => {
    return gender ? 'Female' : 'Male';
};

const parseObjToList = (data) => {
    const result = {
        html: '',
        text: ''
    };

    for (let field in data) {
        if (!lodash.isNil(data[field])) {
            if (field === 'gender') {
                data[field] = convertGender(data[field]);
            }

            if (toolsLib.isDatetime(data[field])) {
                data[field] = moment(data[field]).format('YYYY/MM/DD');
            }
            result.html += `<li>${lodash.startCase(field)}: ${data[field]}</li>`;
            result.text += `${lodash.startCase(field)}: ${data[field]}\n`;
        }
    }

    return result;
};

const documentApprovedEmail = (email, data = {}) => {
    const idData = parseObjToList(data);

    const html = `
		<div>
			<p>
				Dear ${email},
			</p>
			<p>
				Your uploaded KYC documents have been approved.<br>
				You now have access to all exchange features that require identity verification.
			</p>
			<ul>
				${idData.html}
			</ul>
			<p>
				To view your approved documents, visit your <a href=${getDomainUrl('/verification')}>Verification page</a>.
			</p>
			<p>
				Regards,<br>
				${toolsLib.getKitConfig().api_name} team
			</p>
		</div>
	`;

    const text = `
		Dear ${email},

		Your uploaded KYC documents have been approved.
		You now have access to all exchange features that require identity verification.

		${idData.text}

		To view your approved documents, visit your Verification page.

		Regards,
		${toolsLib.getKitConfig().api_name} team
	`;

    const subject = 'KYC Documents Approved';

    return toolsLib.sendCustomEmail(
       email,
       subject,
       toolsLib.emailHtmlBoilerplate(html),
       {
           bcc: 'default',
           text
       }
    );
};

const documentPendingEmail = (email) => {
    const html = `
		<div>
			<p>
				Dear ${email},
			</p>
			<p>
				Your uploaded documents are currently being processed.<br>
				We will notify you when your documents are approved or denied.
			</p>
			<p>
				To view the status of your pending documents, visit your <a href=${getDomainUrl('/verification')}>Verification page</a>.
			</p>
			<p>
				Regards,<br>
				${toolsLib.getKitConfig().api_name} team
			</p>
		</div>
	`;

    const text = `
		Dear ${email},

		Your uploaded documents are currently being processed.
		We will notify you when your documents are approved or denied.

		To view the status of your pending documents, visit your Verification page.

		Regards,
		${toolsLib.getKitConfig().api_name} team
	`;

    const subject = 'KYC Documents Pending';

    return toolsLib.sendCustomEmail(
       email,
       subject,
       toolsLib.emailHtmlBoilerplate(html),
       {
           bcc: 'default',
           text
       }
    );
};

const documentRejectedEmail = (email, reasons = {}) => {
    const parsedReasons = parseObjToList(reasons);

    const html = `
		<div>
			<p>
				Dear ${email},
			</p>
			<p>
				Unfortunately, your uploaded KYC documents have been rejected.<br>
				The reasons for your documents being rejected are listed below.<br>
			</p>
			<div>
				${parsedReasons.html}
			</div>
			<p>
				If you feel these reasons are invalid, please feel free to reply to this email.<br>
				Otherwise, please reupload valid documents in order to verify your identity.
			</p>
			<p>
				Regards,<br>
				${toolsLib.getKitConfig().api_name} team
			</p>
		</div>
	`;

    const text = `
		Dear ${email},

		Unfortunately, your uploaded KYC documents have been rejected.
		The reasons for your documents being rejected are listed below.

		${parsedReasons.text}

		If you feel these reasons are invalid, please feel free to reply to this email.
		Otherwise, please reupload valid documents in order to verify your identity.

		Regards,
		${toolsLib.getKitConfig().api_name} team
	`;

    const subject = 'KYC Documents Rejected';

    return toolsLib.sendCustomEmail(
       email,
       subject,
       toolsLib.emailHtmlBoilerplate(html),
       {
           bcc: 'default',
           text
       }
    );
};

const documentExpiredEmail = (email) => {
    const html = `
		<div>
			<p>
				Dear ${email},
			</p>
			<p>
				Your iDenfy document upload token as expired.<br>
				You will no longer be able to use your token to upload your documents.<br>
				To generate a new token, please go through the KYC process in your <a href=${getDomainUrl('/verification')}>Verification page</a>.
			</p>
			<p>
				Regards,<br>
				${toolsLib.getKitConfig().api_name} team
			</p>
		</div>
	`;

    const text = `
		Dear ${email},

		Your iDenfy document upload token as expired.
		You will no longer be able to use your token to upload your documents.
		To generate a new token, please go through the KYC process in your Verification page.

		Regards,
		${toolsLib.getKitConfig().api_name} team
	`;

    const subject = 'iDenfy Token Expired';

    return toolsLib.sendCustomEmail(
       email,
       subject,
       toolsLib.emailHtmlBoilerplate(html),
       {
           bcc: 'default',
           text
       }
    );
};

const adminAlertEmail = async (data = {}) => {
    const { email, id } = data;

    const html = `
		<div>
			<p>
				Documents provided by user ${email} with ID ${id} have been automatically approved and are awaiting manual approval.<br>
				<br>
				You can manually approve or reject these documents through the <a href=${getDomainUrl(`/admin/user?id=${id}`)}>Operator Controls Panel</a>.<br>
				Once reviewed, the user will be notified of the updated status.
			</p>
		</div>
	`;

    const text = `
		Documents provided by user ${email} with ID ${id} have been automatically approved and are awaiting manual approval.

		You can manually approve or reject these documents through the Operator Controls Panel.
		Once reviewed, the user will be notified of the updated status.
	`;

    const subject = 'KYC Documents Awaiting Manual Review';

    const kycOperators = await toolsLib.database.findAll('user', {
        where: {
            is_kyc: true
        },
        attributes: ['email'],
        raw: true
    });

    let cc = null;

    if (kycOperators.length > 0) {
        cc = kycOperators.map((operator) => operator.email).join(',');
    }

    return toolsLib.sendCustomEmail(
       toolsLib.getKitSecrets().emails.audit,
       subject,
       toolsLib.emailHtmlBoilerplate(html),
       {
           cc,
           text
       }
    );
};

const getGender = (docSex) => {
    if (docSex && docSex !== 'UNDEFINED') {
        return docSex === 'F';
    }

    return false;
};

const generateUpdatedUserData = (status, data, eventName) => {
    let result = {};
    if (eventName === 'verification_started' || eventName === 'verification_inputs_completed') {
        result = {
            id_data: {
                status
            }
        };
        return result;

    } else if (eventName === 'verification_expired') {
        result = {
            id_data: {
                status
            }
        };
        result.id_data.mati.resource = data.resource;

        return result;

    } else if (eventName === 'verification_updated' || eventName === 'verification_completed') {
        bluebird.all([
            data.resource,
            generateMatiToken()
        ])
           .then(([resourceURL, responseToken]) => {
               if (!responseToken)
                   throw new Error('Not authentication Mati');

               loggerPlugin.verbose(
                  data.metadata.user_id,
                  'GET /plugins/mati/admin/files request getMatiFiles',
                  responseToken
               );
               responseToken = JSON.parse(responseToken);
               return getMatiFiles(resourceURL, responseToken.access_token);
           })
           .then((documentUser) => {

               result = {
                   full_name: '',
                   nationality: '',
                   gender: false,
                   dob: null,
                   id_data: {
                       status
                   }
               };

               loggerPlugin.verbose(
                  data.metadata.user_id,
                  'GET /plugins/mati/admin/files response data',
                  documentUser
               );

               const {
                   fullName: { value: fullName },
                   documentNumber: { value: documentNumber },
                   dateOfBirt: { value: dateOfBirt },
                   expirationDate: { value: expirationDate },
                   documentType: { value: documentType },
                   firstName: { value: firstName },
                   issueCountry: { value: issueCountry },
                   nationality: { value: nationality },
                   personalNumber: { value: personalNumber },
                   sex: { value: sex },
                   surname: { value: surname }
               } = documentUser.documents.fields;

               result.id_data.mati = documentUser.documents.data;
               result.id_data.mati.resource = documentUser.resource;
               if (documentType) {
                   result.id_data.type = documentType.toLowerCase();
               }

               if (documentNumber) {
                   result.id_data.number = documentNumber;
               }

               if (expirationDate) {
                   result.id_data.expiration_date = moment(expirationDate).toISOString();
               }

               if (nationality) {
                   result.nationality = nationality;
               }

               if (dateOfBirt) {
                   result.dob = moment(dateOfBirt).toISOString();
               }

               if (fullName) {
                   result.full_name = fullName;
               }
               if (sex) {
                   result.gender = getGender(sex);
               }
               return result;
           });
    }
};

const generateMatiToken = async () => {
    const method = 'POST';
    const headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET, 'utf8').toString('base64')
    };
    const form = {
        'grant_type': 'client_credentials'
    };
    const option = {
        headers,
        method,
        uri: MATI_API_URL_AUTH,
        form
    };

    return rp(option);
};

const getMatiFiles = async (resource, accessToken) => {

    const method = 'GET';
    const headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken
    };
    const url = resource;
    loggerPlugin.verbose(
       resource,
       accessToken,
       'getMatiFiles request'
    );
    return rp({
        headers,
        method,
        url
    });
};

const verifyRequest = async (signature, secret, payloadBody) => {
    let hash = crypto.createHmac('sha256', secret);
    hash = hash.update(payloadBody).digest('hex');
    const isValid = crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));

    loggerPlugin.error(
       'MATI PLUGIN cannot verify notification request'
    );

    if (!isValid) {
        throw new Error('Invalid request');
    }
};

init()
   .then(() => {
       app.post('/plugins/mati/notification', (req, res) => {
           loggerPlugin.verbose(
              req.uuid,
              'POST /plugins/mati/notification body URL webhook',
              req.body
           );

           const signature = req.headers['x-signature'];
           const data = req.body;

           verifyRequest(signature, WEBHOOK_SECRET, JSON.stringify(data))
              .then(() => {
                  if (!data.metadata || !data.metadata.user_id) {
                      throw new Error('Meta data user_id not given');
                  }

                  return toolsLib.database.findOne('user', {
                      where: {
                          id: data.metadata.user_id
                      },
                      attributes: [
                          'id',
                          'email',
                          'network_id',
                          'full_name',
                          'gender',
                          'nationality',
                          'dob',
                          'id_data'
                      ]
                  });
              })
              .then(async (user) => {
                  if (!user) {
                      throw new Error('User not found');
                  }

                  const { eventName } = data;

                  let updateStatus;

                  if (eventName === 'verification_started') {
                      updateStatus = VERIFY_STATUS.PENDING;
                  } else if (eventName === 'verification_inputs_completed') {
                      updateStatus = VERIFY_STATUS.PENDING;
                  } else if (eventName === 'verification_updated') {
                      if (MANUAL_REVIEW) {
                          updateStatus = VERIFY_STATUS.PENDING;
                      } else {
                          updateStatus = VERIFY_STATUS.COMPLETED;
                      }
                  } else if (eventName === 'verification_completed') {
                      if (MANUAL_REVIEW) {
                          updateStatus = VERIFY_STATUS.PENDING;
                      } else {
                          updateStatus = VERIFY_STATUS.COMPLETED;
                      }
                  } else if (eventName === 'verification_expired') {
                      updateStatus = VERIFY_STATUS.REJECTED;
                  }

                  const previousStatus = user.id_data.status;

                  loggerPlugin.verbose(
                     req.uuid,
                     'POST /plugins/mati/notification status',
                     'mati eventName',
                     eventName,
                     'previous id data status:',
                     previousStatus,
                     'updating status:',
                     updateStatus
                  );

                  if (updateStatus) {
                      const updateData = await generateUpdatedUserData(updateStatus, data, eventName);

                      loggerPlugin.verbose(
                         req.uuid,
                         'POST /plugins/mati/notification updated user',
                         updateData
                      );
                      const updatedUser = await user.update(updateData);

                      loggerPlugin.verbose(
                         req.uuid,
                         'POST /plugins/mati/notification updated user',
                         updatedUser
                      );

                      try {
                          if (updateStatus === VERIFY_STATUS.PENDING && MANUAL_REVIEW) {
                              adminAlertEmail({
                                  email: user.email,
                                  id: user.id
                              });
                          }
                      } catch (err) {
                          loggerPlugin.error(
                             req.uuid,
                             'POST /plugins/mati/notification error while sending manual review required email',
                             err.message
                          );
                      }

                      try {
                          if (updateStatus === VERIFY_STATUS.REJECTED) {
                              documentRejectedEmail(
                                 user.email
                              );
                          } else if (updateStatus === VERIFY_STATUS.PENDING) {
                              documentPendingEmail(user.email);
                          } else if (updateStatus === VERIFY_STATUS.COMPLETED) {
                              documentApprovedEmail(user.email, {
                                  full_name: updatedUser.full_name ? updatedUser.full_name : null,
                                  dob: updatedUser.dob,
                                  gender: lodash.isBoolean(updatedUser.gender) ? updatedUser.gender : null,
                                  nationality: updatedUser.nationality ? updatedUser.nationality : null,
                                  ...lodash.omit(updatedUser.id_data, ['status', 'mati'])
                              });
                          }
                      } catch (err) {
                          loggerPlugin.error(
                             req.uuid,
                             'POST /plugins/mati/notification error while sending email',
                             err.message
                          );
                      }
                  }
                  return res.json({ message: 'Success' });

              })
              .catch((err) => {
                  loggerPlugin.error(
                     req.uuid,
                     'POST /plugins/mati/notification err',
                     err
                  );
                  return res.status(err.statusCode || 400).json({ message: toolsLib.errorMessageConverter(err) });
              });
       });

       app.get('/plugins/mati/admin/files', [
           toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
           expressValidator.checkSchema({
               user_id: {
                   in: ['query'],
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
              'GET /plugins/mati/admin/files auth',
              req.auth.sub
           );

           const { user_id } = req.query;
           toolsLib.user.getUserByKitId(user_id)
              .then((user) => {
                  if (!user) {
                      throw new Error('User not found');
                  }

                  if (
                     !user.id_data
                     || !user.id_data.mati
                     || !user.id_data.mati.resource
                     || user.id_data.status === VERIFY_STATUS.EMPTY
                  ) {
                      throw new Error('User does not have uploaded documents');
                  }
                  loggerPlugin.verbose(
                     user_id,
                     'GET /plugins/mati/admin/files request generateMatiToken'
                  );

                  return bluebird.all([
                      user,
                      generateMatiToken()
                  ]);
              })
              .then(([user, responseToken]) => {
                  if (!responseToken)
                      throw new Error('Not authentication Mati');
                  loggerPlugin.verbose(
                     user_id,
                     'GET /plugins/mati/admin/files request getMatiFiles',
                     responseToken
                  );
                  responseToken = JSON.parse(responseToken);
                  return getMatiFiles(user.id_data.mati.resource, responseToken.access_token);
              })
              .then((data) => {

                  loggerPlugin.verbose(
                     user_id,
                     'GET /plugins/mati/admin/files response data',
                     data
                  );

                  return res.json(data);
              })
              .catch((err) => {
                  loggerPlugin.error(
                     req.uuid,
                     'GET /plugins/mati/admin/files err',
                     err.message
                  );
                  return res.status(err.statusCode || 400).json({ message: toolsLib.errorMessageConverter(err) });
              });
       });

       app.get('/plugins/mati/admin/file1/:location', [], (req, res) => {
           const { location } = req.params;

            generateMatiToken()
              .then((responseToken) => {
                  if (!responseToken)
                      throw new Error('Not authentication Mati');
                  responseToken = JSON.parse(responseToken);
                  return
                  const method = 'GET';
                  const headers = {
                      'Authorization': 'Bearer ' + responseToken
                  };
                  const url = 'https://media.getmati.com/file?location='+location;

                  return rp({
                      headers,
                      method,
                      url
                  })
              })
               .then((data) => {
                       console.log(data, "data");
                       res.contentType('image/jpeg');
                       return res.send(data);
                   })
               .catch((err) => {
                   loggerPlugin.error(
                      req.uuid,
                      'GET /plugins/mati/admin/file err',
                      err.message
                   );
                   return res.status(err.statusCode || 400).json({ message: toolsLib.errorMessageConverter(err) });
               });
       });

       app.post('/plugins/mati/verify', [
           toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'kyc', 'support', 'supervisor']),
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
              'POST /plugins/mati/verify auth',
              req.auth.sub
           );

           const { user_id } = req.body;

           toolsLib.user.getUserByKitId(user_id, false, false)
              .then((user) => {
                  if (!user) {
                      throw new Error('User not found');
                  }

                  if (
                     !user.id_data
                     || lodash.isNil(user.id_data.status)
                     || user.id_data.status === VERIFY_STATUS.EMPTY
                  ) {
                      throw new Error('User documents are not pending');
                  }

                  if (user.id_data.status === VERIFY_STATUS.COMPLETED) {
                      throw new Error('User documents are already verified');
                  }

                  return user.update({
                      id_data: {
                          ...user.id_data,
                          status: VERIFY_STATUS.COMPLETED
                      }
                  });
              })
              .then((data) => {
                  try {
                      documentApprovedEmail(data.email, {
                          full_name: data.full_name ? data.full_name : null,
                          dob: data.dob,
                          gender: lodash.isBoolean(data.gender) ? data.gender : null,
                          nationality: data.nationality ? data.nationality : null,
                          ...lodash.omit(data.id_data, ['status', 'idenfy'])
                      });
                  } catch (err) {
                      loggerPlugin.error(
                         req.uuid,
                         'POST /plugins/mati/verify err while sending email',
                         err.message
                      );
                  }
                  return res.json(lodash.pick(data, [
                      'id',
                      'email',
                      'full_name',
                      'dob',
                      'nationality',
                      'gender',
                      'id_data'
                  ]));
              })
              .catch((err) => {
                  loggerPlugin.error(
                     req.uuid,
                     'POST /plugins/mati/verify err',
                     err.message
                  );
                  return res.status(err.statusCode || 400).json({ message: toolsLib.errorMessageConverter(err) });
              });
       });

       app.post('/plugins/mati/revoke', [
           toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'kyc', 'support', 'supervisor']),
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
              'POST /plugins/mati/revoke auth',
              req.auth.sub
           );

           const user_id = req.body.user_id;

           toolsLib.user.getUserByKitId(user_id, false, false)
              .then((user) => {
                  if (!user) {
                      throw new Error('User not found');
                  }

                  if (
                     !user.id_data
                     || lodash.isNil(user.id_data.status)
                     || user.id_data.status === VERIFY_STATUS.EMPTY
                  ) {
                      throw new Error('User documents are not pending');
                  }

                  if (user.id_data.status === VERIFY_STATUS.REJECTED) {
                      throw new Error('User documents are already rejected');
                  }

                  return user.update({
                      id_data: {
                          ...user.id_data,
                          status: VERIFY_STATUS.REJECTED
                      }
                  });
              })
              .then((data) => {
                  try {
                      documentRejectedEmail(
                         data.email
                      );
                  } catch (err) {
                      loggerPlugin.error(
                         req.uuid,
                         'POST /plugins/mati/revoke err while sending email',
                         err.message
                      );
                  }
                  return res.json(lodash.pick(data, [
                      'id',
                      'email',
                      'full_name',
                      'dob',
                      'nationality',
                      'gender',
                      'id_data'
                  ]));
              })
              .catch((err) => {
                  loggerPlugin.error(
                     req.uuid,
                     'GET /plugins/mati/revoke err',
                     err.message
                  );
                  return res.status(err.statusCode || 400).json({ message: toolsLib.errorMessageConverter(err) });
              });
       });
   })
   .catch((err) => {
       loggerPlugin.error(
          'DOMINICAN EXCHANGE KYC PLUGIN err',
          err.message
       );
   });