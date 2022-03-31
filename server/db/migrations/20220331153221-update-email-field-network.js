'use strict';


const TABLE = 'Statuses';
const COLUMN = 'email';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn(TABLE, COLUMN);
		await queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.JSONB,
			defaultValue: {
				"en": {
					"DOC_REJECTED": {
						"html": "<div><p>Dear ${email} </p><p>Unfortunately, your uploaded KYC documents have been rejected.<br>The reasons for your documents being rejected are listed below.<br></p><div><ul>${doc_information}</ul></div><p>If you feel these reasons are invalid, please feel free to reply to this email.<br>Otherwise, please reupload valid documents in order to verify your identity.</p><p> Regards<br> ${api_name} team </p</div>",
						"title": "KYC Documents Rejected"
					},
					"DOC_VERIFIED": {
						"html": "<div><p>Dear ${email} </p><p>Your uploaded KYC documents have been approved.<br>You now have access to all exchange features that require identity verification.</p><ul>${doc_information}</ul><p>To view your approved documents, visit your <a href=\"${link}\" target='_blank'>Verification page</a></p><p> Regards<br> ${api_name} team </p></div>",
						"title": "KYC Documents Approved"
					},
					"CONFIRM_EMAIL": {
						"html": "<div><p><p>Dear ${name} </p></p><p>You have made sensitive request related to your accounts security. To verify the operation you would require to use to code below to authorize this operation.<br /><p style=\"font-size: 1.2rem; text-align: center;\">${code}</p>If you did not make this request, report this immidiately and proceed to change your crendetials as soon as possible.</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Security Verification"
					},
					"LOGIN": {
						"html": "<div> <p> Dear ${name} </p> <p> We have recorded a login to your account with the following details </p> <div> <div>Time: ${time}</div> <div>Country: ${country}</div> <div>IP Address: ${ip}</div> </div> <p> If this was not you, please change your password, set up two-factor authentication, and contact us immediately. </p> <p> Regards<br> ${api_name} team </p> </div>",
						"title": "Login"
					},
					"SIGNUP": {
						"html": "<div> <p> Dear ${name} </p> <p> You need to confirm your email account by clicking the button below.<br> If you have any questions feel free to contact us simply by replying to this email.</p><p>Please click on the button below to proceed with your registration.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirm</Button></a></div><p> Regards<br> ${api_name} team </p></div>",
						"title": "Sign Up"
					},
					"WELCOME": {
						"html": "<div><p> Dear ${name} </p><p>Thank you for signing up to ${api_name}.</p><p>To begin trading, you must first deposit cryptocurrency or fund money to your account.Please go to your <a href=\"${link_account}\" target='_blank'>account</a> and visit the <a href=\"${link_deposit}\" target='_blank'>deposit</a> page.,</p><p>If you have any questions or concerns, please contact us simply by replying to this email.</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Welcome"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> Dear ${name} </p><p>You have made a request to reset the password for your account.<br />To update your password, click on the link below.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Reset My Password</Button></a></div><p>If this request was made in error, it is safe to ignore it; no changes will be made to your account.</p><p>Request initiated from: ${ip}</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Reset Password Request"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> Dear ${name} </p><p>Congratulations. Your account is verified successfully.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Trade Now</Button></a></div><p> Regards<br> ${api_name} team </p></div>",
						"title": "Account Verified"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> Dear ${name} </p><p>Congratulations. Your account access level is upgraded to ${tier} tier. You will benefit from lower fees, higher withdrawal limits and other premium features.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Trade Now</Button></a></div><p> Regards<br> ${api_name} team </p></div>",
						"title": "Account Upgraded"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> Dear ${name} </p><p>We were not able to find or process your ${currency} deposit made on ${date} for ${amount}. Thus, the transaction is rejected by our system.</p><p>If you have any further inquiries, you can reply to this email</p><p>Transaction ID: ${txid}<br />Amount: ${amount}<br />Status: Rejected</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} Deposit rejected"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> Dear ${name} </p><p>We were not able to find or process your ${currency} withdrawal made on ${date} for ${amount}. Thus the transaction is rejected by our system and your pending withdrawal amount is credited back to your ${api_name} wallet.</p><p>If you have any further inquiries, you can reply to this email</p><p>Transaction ID: ${txid}<br />Amount: ${amount}<br />Status: Rejected</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} Withdrawal rejected"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> Dear ${name} </p><p>You have made a ${currency} withdrawal request of ${amount} to ${address}<br /><br />Amount: ${amount}<br />Fee: ${fee} ${currency}<br />Address: ${address}<br /><span id='network'>Network: ${network}</span><br /><br />In order to confirm this withdrawal, please click the button below.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirm</Button></a></div><p>If this request was made in error, it is safe to ignore it; no changes will be made to your account.</p><p>Request initiated from: ${ip}</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} Withdrawal Request"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>User Verification Required</h3><div>User '${email}' uploaded his documents for verification. Please verify his documents.</div></div>",
						"title": "User Verification"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>Suspicious Deposit</h3><div>The client with email ${email} has received a ${currency} deposit that is suspicious.<br />Transaction ID: ${txid}<h4>Transaction data:</h4><div>${data}</div></div></div>",
						"title": "Suspicious Deposit"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> Dear ${name} </p><p>Your ${currency} withdrawal for ${amount} was being sent to an invalid address and is rejected.</p><p>Address: ${address}</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Invalid Withdrawal Address"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>Your account ${email} has been deactivated. You will not be able to use your account until it is activated by the exchange admin.</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Account ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>Your account ${email} has been activated. You are now able to use your account.</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Account ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> Dear ${name} </p><p>Your discount rate has been changed to ${rate}%. This rate will be applied to your order fees.</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Discount Rate Change"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> Dear ${name} </p><p>A pending bank account has been verified. Your valid account can now be used for exchange operations requiring a bank account.</p><div><strong>Verified Bank Accounts:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">To view your current bank accounts, please visit the exchange's Verification Tab</a></p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Bank Verified"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> Dear ${name} </p><p>Your recent ID verification is processed and is unfortunately rejected. For further actions read the message from our expert below:</p><p>Message: ${message}</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "ID Verification Rejected"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> Dear ${name} </p><p>Your new bank registration is processed and is unfortunately rejected. For further actions read the message from our expert below:</p><p>Message: ${message}</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "New Bank Application Rejected"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> Dear ${name} </p><p>This email confirms that you recently changed the password for your account. No further action is required.<br />If you did not authorize this change please contact us immediately.<br /></p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Password Changed"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> Dear ${name} </p><p>You have made a request to change the password for your account.<br />To confirm your password changed, click on the link below.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirm Change My Password</Button></a></div><p>If this request was made in error, it is safe to ignore it; no changes will be made to your account.</p><p>Request initiated from: ${ip}</p><p> Regards<br> ${api_name} team </p></div>",
						"title": "Change Password Confirmation"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> Dear ${name} </p><p> You have a new deposit for ${amount} ${currency} pending in your ${api_name} wallet. Please wait until the transaction is confirmed and your funds will be available in your wallet. Your transaction requires ${confirmation} confirmation(s) on blockchain.</p><p>Amount: ${amount} ${currency}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id='network'>Network: ${network}</span><br />Fee: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} Deposit pending"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> Dear ${name} </p><p> Your ${currency} deposit for ${amount} ${currency} is confirmed and completed and it is available in your ${currency} wallet.</p><p>Amount: ${amount} ${currency}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id='network'>Network: ${network}</span><br />Fee: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} Deposit completed"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> Dear ${name} </p><p>You made a withdrawal request for ${amount} ${currency}. Your withdrawal status is pending and will be processed shortly.</p><p>Amount: ${amount} ${currency}<br />Fee: ${fee} ${currency}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id='network'>Network: ${network}</span><br /><ul>${explorers}</ul><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} withdrawal pending"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> Dear ${name} </p><p>Your withdrawal request for ${amount} ${currency} is processed.</p><p>Amount: ${amount} ${currency}<br />Fee: ${fee} ${currency}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id='network'>Network: ${network}</span><br /><ul>${explorers}</ul><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} withdrawal completed"
					}
				},
				"ar": {
					"LOGIN": {
						"html": "<div> <p> ${name}العزيز </p> <p> لقد سجلنا تسجيل دخولٍ إلى حسابك مع التفاصيل التالية </p> <div> <div>الوقت:  ${time} </div> <div>البلد:  ${country}</div> <div>عنوان IP: ${ip}</div> </div> <p> إذا لم يكن هذا أنت ، فيرجى تغيير كلمة المرور الخاصة بك وإعداد المصادقة ذات العاملين والاتصال بنا على الفور. </p> <p> تحية<br> فريق${api_name} </p> </div>",
						"title": "تسجيل الدخول"
					},
					"SIGNUP": {
						"html": "<div> <p> ${name}العزيز </p> <p> تحتاج إلى تأكيد حساب البريد الإلكتروني الخاص بك عن طريق النقر على الزر أدناه.<br> إذا كانت لديك أي أسئلة ، فلا تتردد في الاتصال بنا ببساطة عن طريق الرد على هذا البريد الإلكتروني.</p><p>الرجاء الضغط على الزر أدناه لمتابعة التسجيل الخاص بك.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">أيِّد</Button></a></div><p> تحية<br> فريق${api_name} </p></div>",
						"title": "سجّل"
					},
					"WELCOME": {
						"html": "<div><p> ${name}العزيز </p><p>شكرًا لك على الاشتراك في${api_name}.</p><p>لكي تقوم بالتداول ، يجب عليك أولاً إيداع عملة مشفرة أو تمويل الأموال في حسابك.من فضلك ، انتقل إلى <a href=\"${link_account}\" target='_blank'>الحساب</a> وقم بزيارة صفحة <a href=\"${link_deposit}\" target='_blank'>ايداع</a>.,</p><p>إذا كانت لديك أي أسئلة أو استفسارات ، فيرجى الاتصال بنا ببساطة عن طريق الرد على هذا البريد الإلكتروني.</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "أهلا بك"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> ${name}العزيز </p><p>لقد قدمت طلباً لإعادة تعيين كلمة المرور لحسابك.<br />لتحديث كلمة المرور الخاصة بك ، انقر على الرابط أدناه.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">إعادة تعيين كلمة المرور الخاصة بي</Button></a></div><p>إذا تم تقديم هذا الطلب عن طريق الخطأ ، فمن الآمن تجاهله ؛ لن يتم إجراء أي تغييرات في حسابك.</p><p>تم بدء الطلب من: ${ip}</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "طلب إعادة تعيين كلمة المرور"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> ${name}العزيز </p><p>تهانينا. تم التحقق من حسابك بنجاح.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">تداول الآن</Button></a></div><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تم التحقق من الحساب"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> ${name}العزيز </p><p>تهانينا. تمت ترقية مستوى حسابك إلى مستوى${tier}. ستستفيد من رسوم أقل وحدود سحب أعلى وميزات مميزة أخرى.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">تداول الآن</Button></a></div><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تم ترقية الحساب"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> ${name}العزيز </p><p>لم نتمكن من العثور على أو معالجة إيداعك ${currency} الذي تم إجراؤه في ${date} بمبلغ {amount} دولار. وبالتالي ، يتم رفض المعاملة من قبل نظامنا.</p><p>إذا كان لديك أي استفسارات أخرى ، يمكنك الرد على هذا البريد الإلكتروني</p><p>معرّف المعاملة:${txid} <br />المبلغ: ${amount}<br />Status: Rejected</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "${currency} ايداع مرفوض"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> ${name}العزيز </p><p>لم نتمكن من العثور على الايداعك أو معالجة إيداعك ${currency} الذي تم إجراؤه في ${date} بمبلغ ${amount}. وبالتالي ، يتم رفض المعاملة من قبل نظامنا.</p><p>لم نتمكن من العثور على السحب الذي طلبته ${currency} أو معالجته في  ${date} بمبلغ  ${amount}.  وبالتالي تم رفض المعاملة من قبل نظامنا وإعادة مبلغ السحب المعلق إلى محفظتك ${api_name}.</p><p>معرّف المعاملة:${txid} <br />المبلغ: ${amount}<br />Status: Rejected</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "${currency} سحب مرفوض"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> ${name}العزيز </p><p>لقد قدّمت طلب سحب${currency} بمبلغ ${amount} الى ${address}<br /><br />المبلغ: ${amount}<br />الرسوم: ${fee} ${currency}<br />العنوان: ${address}<br /><span id='network'>شبكة الاتصال: ${network}</span><br /><br />لتأكيد هذا السحب ، انقر على الزر أدناه.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">أيٍّد</Button></a></div><p>إذا تم تقديم هذا الطلب عن طريق الخطأ ، فمن الآمن تجاهله ؛ لن يتم إجراء أي تغييرات في حسابك.</p><p>تم بدء الطلب من: ${ip}</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "${currency} سحب  طلب"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>مطلوب التحقق من المستخدم</h3><div>قام المستخدم '${email}' بتحميل مستنداته للتحقق منها. يرجى التحقق من وثائقه.</div></div>",
						"title": "التحقق من المستخدم"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>الوديعة مشكوك فيها</h3><div>تلقى العميل بالبريد الإلكتروني  ${email} تلقى العميل بالبريد الإلكتروني  ${currency} مشكوكاً.<br />معرّف المعاملة:${txid} <h4>Transaction data:</h4><div>${data}</div></div></div>",
						"title": "الوديعة مشكوك فيها"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> ${name}العزيز </p><p>تم إرسال سحب ${currency} الخاص بك لـ ${amount} إلى عنوان غير صالح وتم رفضه.</p><p>العنوان: ${address}</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "عنوان السحب غير صالح"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>تم إلغاء تنشيط حسابك ${email}. لن تتمكن من استخدام حسابك حتى يتم تنشيطه من قبل مسؤول التبادل.</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "حساب ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>تم تفعيل حسابك ${email}. أنت الآن قادر على استخدام حسابك.</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "حساب ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> ${name}العزيز </p><p>تم تغيير معدل الخصم الخاص بك إلى ${rate}٪. سيتم تطبيق هذا المعدل على رسوم طلبك.</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تغيير معدل الخصم"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> ${name}العزيز </p><p>تم التحقق من حساب مصرفي معلق. يمكن الآن استخدام حسابك الصالح لعمليات الصرف التي تتطلب حسابًا مصرفيًا.</p><div><strong>Verified Bank Accounts:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">لعرض حساباتك المصرفية الحالية ، يرجى زيارة علامة تبويب التحقق في البورصة</a></p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تم التحقق من البنك"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> ${name}العزيز </p><p>تتم معالجة عملية التحقق من هويتك الحديثة ورفضها للأسف. لمزيد من الإجراءات ، اقرأ الرسالة من خبيرنا أدناه:</p><p>رسالة: ${message}</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تم رفض التحقق من الهوية"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> ${name}العزيز </p><p>تتم معالجة تسجيلك المصرفي الجديد ورفضه للأسف. لمزيد من الإجراءات ، اقرأ الرسالة من خبيرنا أدناه</p><p>رسالة: ${message}</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تم رفض طلب البنك الجديد"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> ${name}العزيز </p><p>يؤكد هذا البريد الإلكتروني أنك قمت مؤخرًا بتغيير كلمة المرور لحسابك. مطلوب أي إجراء آخر.<br />إذا لم تأذن بهذا التغيير ، يرجى الاتصال بنا على الفور.<br /></p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تم تغيير كلمة السر"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> ${name}العزيز </p><p>لقد قدمت طلبًا لتغيير كلمة المرور الخاصة بحسابك.<br />لتأكيد تغيير كلمة المرور الخاصة بك ، انقر فوق الارتباط أدناه.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">تأكيد تغيير كلمة المرور الخاصة بي</Button></a></div><p>إذا تم تقديم هذا الطلب عن طريق الخطأ ، فمن الآمن تجاهله ؛ لن يتم إجراء أي تغييرات على حسابك.</p><p>تم بدء الطلب من: ${ip}</p><p> تحية<br> فريق${api_name} </p></div>",
						"title": "تغيير تأكيد كلمة المرور"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> ${name}العزيز </p><p> ${amount} لديك إيداع جديد بمبلغ ${currency} في قيد الانتظار في محفظتك ${api_name} .يرجى الانتظار حتى يتم تأكيد المعاملة وستتوفر أموالك في محفظتك. تتطلب معاملتك. ${confirmation} تأكيداً (تأكيداتٍ) على البلوك تشين.</p><p>المبلغ: ${amount} ${currency}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id='network'>شبكة الاتصال: ${network}</span><br />الرسوم: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> تحية<br> فريق${api_name} </p></div>",
						"title": "${currency} ايداع pending"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> ${name}العزيز </p><p> تم تأكيد وديعة ${currency} بمبلغ ${amount} ${currency} واكتملت وهي متوفرة في محفظتك ${currency}.</p><p>المبلغ: ${amount} ${currency}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id='network'>شبكة الاتصال: ${network}</span><br />الرسوم: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> تحية<br> فريق${api_name} </p></div>",
						"title": "${currency} ايداع completed"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> ${name}العزيز </p><p>لقد قدمت طلب سحب بمبلغ ${amount} ${currency} إلى عنوان. ${address}. حالة السحب الخاصة بك في قيد الإنتظار وستتم معالجتها قريبًا.</p><p>المبلغ: ${amount} ${currency}<br />الرسوم: ${fee} ${currency}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id='network'>شبكة الاتصال: ${network}</span><br /><ul>${explorers}</ul><p> تحية<br> فريق${api_name} </p></div>",
						"title": "${currency} سحب request"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> ${name}العزيز </p><p>تمت معالجة طلب سحبك بمبلغ ${amount} ${currency} و نقله إلى عنوان.${address}. </p><p>المبلغ: ${amount} ${currency}<br />الرسوم: ${fee} ${currency}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id='network'>شبكة الاتصال: ${network}</span><br /><ul>${explorers}</ul><p> تحية<br> فريق${api_name} </p></div>",
						"title": "${currency} سحب completed"
					}
				},
				"de": {
					"LOGIN": {
						"html": "<div> <p> Sehr geehrte/r ${name} </p> <p> Wir haben eine Anmeldung zu Ihrem Konto mit den folgenden Daten aufgezeichnet </p> <div> <div>Zeit: ${time}</div> <div>Land: ${country}</div> <div>IP-Adresse: ${ip}</div> </div> <p> If this was not you, please change your password, set up two-factor authentication, and contact us immediately. </p> <p> Mit freundlichen Grüßen<br> ${api_name} team </p> </div>",
						"title": "Login"
					},
					"SIGNUP": {
						"html": "<div> <p> Sehr geehrte/r ${name} </p> <p> Sie müssen Ihr E-Mail-Konto bestätigen, indem Sie auf die unten angezeigte Taste klicken.<br> Wenn Sie Fragen haben, können Sie uns gerne kontaktieren, indem Sie einfach auf diese E-Mail antworten.</p><p>Bitte klicken Sie auf die Schaltfläche unten, um mit Ihrer Registrierung fortzufahren.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Bestätigen</Button></a></div><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Sign Up"
					},
					"WELCOME": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Vielen Dank, dass Sie sich bei to ${api_name} angemeldet haben..</p><p>Um mit dem Trading zu beginnen, müssen Sie zunächst Kryptowährungen oder Geld auf Ihr Konto einzahlen.Bitte gehen Sie zu Ihrem <a href=\"${link_account}\" target='_blank'>Konto</a> und besuchen Sie die <a href=\"${link_deposit}\" target='_blank'>Einzahlung</a> Seite.,</p><p>Wenn Sie Fragen oder Bedenken haben, kontaktieren Sie uns bitte einfach durch Beantwortung dieser E-Mail.</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Willkommen"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>YSie haben eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto gestellt.<br />Um Ihr Passwort zu aktualisieren, klicken Sie auf den unten stehenden Link.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Mein Passwort zurücksetzen</Button></a></div><p>Wenn diese Anfrage fälschlicherweise gestellt wurde, können Sie sie getrost ignorieren; es werden keine Änderungen an Ihrem Konto vorgenommen.</p><p>Anfrage initiiert von: ${ip}</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Passwort zurücksetzen"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Herzlichen Glückwunsch! Ihr Konto wurde erfolgreich verifiziert.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Jetzt handeln</Button></a></div><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Konto verifiziert"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Herzlichen Glückwunsch. Ihre Kontozugriffsstufe wird auf Stufe ${tier} hochgestuft. Sie profitieren von niedrigeren Gebühren, höheren Auszahlungslimits und anderen Premium-Funktionen.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Jetzt handeln</Button></a></div><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Konto aktualisiert"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Wir waren nicht in der Lage, Ihre ${currency} Einzahlung zu finden oder zu bearbeiten, die am ${date} für ${amount}. gemacht wurde. Daher wird die Transaktion von unserem System abgelehnt.</p><p>Wenn Sie weitere Fragen haben, können Sie auf diese E-Mail </p><p>Transaktionsnummer: ${txid}<br />Betrag: ${amount}<br />Status: Rejected</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "${currency} Einzahlung rejected"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Wir waren nicht in der Lage, Ihre ${currency} Auszahlung zu finden oder zu bearbeiten, die am ${date} für ${amount}. gemacht wurde. Dadurch wird die Transaktion von unserem System abgelehnt und Ihr ausstehender Abhebungsbetrag wird Ihrer ${api_name} Geldbörse wieder gutgeschrieben.</p><p>Wenn Sie weitere Fragen haben, können Sie auf diese E-Mail antworten</p><p>Transaktionsnummer: ${txid}<br />Betrag: ${amount}<br />Status: Rejected</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "${currency} Abbuchung rejected"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Sie haben einen ${currency} Auszahlungsantrag von ${amount} an die Adresse ${address} gemacht<br /><br />Betrag: ${amount}<br />Gebühr: ${fee} ${currency}<br />Adresse: ${address}<br /><span id='network'>Netzwerk: ${network}</span><br /><br />Um diese Auszahlung zu bestätigen, klicken Sie bitte auf die Taste unten.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Bestätigen</Button></a></div><p>Wenn diese Anfrage fälschlicherweise gestellt wurde, können Sie sie getrost ignorieren; es werden keine Änderungen an Ihrem Konto vorgenommen.</p><p>Anfrage initiiert von: ${ip}</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "${currency} Abbuchung Anfrage"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>Benutzerverifizierung erforderlich</h3><div>Der Benutzer '${email}' hat seine Dokumente zur Überprüfung hochgeladen. Bitte verifizieren Sie seine Dokumente.</div></div>",
						"title": "Benutzerverifizierung"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>Verdächtige Einzahlung</h3><div>Der Client mit der E-Mail ${email} hat eine ${currency} Einzahlung erhalten, die verdächtig ist.<br />Transaktionsnummer: ${txid}<h4>Transaktionsdaten:</h4><div>${data}</div></div></div>",
						"title": "Verdächtige Einzahlung"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Ihre ${currency} Auszahlung für ${amount} wurde an eine ungültige Adresse gesendet und wurde abgelehnt.</p><p>Adresse: ${address}</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Ungültige Auszahlungsadresse"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>Ihr Konto ${email} wurde deaktiviert. Sie können Ihr Konto erst wieder verwenden, wenn es vom Administrator aktiviert wurde.</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Konto ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>Ihr Konto ${email} wurde aktiviert. Sie können nun Ihr Konto verwenden.</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Konto ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Ihr Rabattsatz wurde auf ${rate}% geändert. Dieser Satz wird auf Ihre Bestellgebühren angewendet.</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Diskontsatzänderung"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Ein ausstehendes Bankkonto wurde bestätigt. Ihr gültiges Konto kann jetzt für Umtauschoperationen verwendet werden, die ein Bankkonto erfordern.</p><div><strong>Verifizierte Bankkonten:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">Um Ihre aktuellen Bankkonten anzuzeigen, besuchen Sie bitte die Registerkarte „Verifizierung“ der Börse</a></p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Bank verifiziert"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Ihre aktuelle ID-Verifizierung wurde bearbeitet und ist leider abgelehnt worden. Für weitere Aktionen lesen Sie die Nachricht unseres Experten unten:</p><p>Nachricht: ${message}</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "ID-Verifizierung abgelehnt"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Ihre neue Bankanmeldung wurde bearbeitet und ist leider abgelehnt worden. Für weitere Aktionen lesen Sie die Nachricht unseres Experten unten:</p><p>Nachricht: ${message}</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Neuer Bankantrag abgelehnt"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Diese E-Mail bestätigt, dass Sie kürzlich das Passwort für Ihr Konto geändert haben. Sind keine weiteren Maßnahmen erforderlich.<br />Wenn Sie diese Änderung nicht autorisiert haben, kontaktieren Sie uns bitte umgehend.<br /></p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Passwort geändert"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Sie haben eine Anfrage gestellt, um das Passwort für Ihr Konto zu ändern.<br />Um Ihr geändertes Passwort zu bestätigen, klicken Sie auf den unten stehenden Link.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Bestätigen Sie Mein Passwort ändern</Button></a></div><p>Wenn diese Anfrage irrtümlich gestellt wurde, können Sie sie ignorieren; Es werden keine Änderungen an Ihrem Konto vorgenommen.</p><p>Request initiated from: ${ip}</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "Passwortbestätigung ändern"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p>Sehr geehrte/r ${name} </p><p> Sie haben eine neue Einzahlung von ${amount} ${currency} in Ihrer ${api_name} Geldbörse ausstehend. Bitte warten Sie, bis die Transaktion bestätigt ist und Ihr Guthaben in Ihrer Geldbörse verfügbar ist. Ihre Transaktion erfordert ${confirmation} Bestätigung(en) in der Blockchain.</p><p>Betrag: ${amount} ${currency}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id='network'>Netzwerk: ${network}</span><br />Gebühr: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "${currency} Einzahlung pending"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> Sehr geehrte/r ${name} </p><p> Ihre ${currency} Anzahlung für ${amount} ${currency} ist bestätigt und abgeschlossen und steht in Ihrer ${currency} Geldbörse zur Verfügung.</p><p>Betrag: ${amount} ${currency}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id='network'>Netzwerk: ${network}</span><br />Gebühr: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "${currency} Einzahlung completed"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Sie haben eine Auszahlungsanforderung für ${amount} ${currency} gemacht. Ihr Auszahlungsstatus ist ausstehend und wird in Kürze bearbeitet.</p><p>Betrag: ${amount} ${currency}<br />Gebühr: ${fee} ${currency}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id='network'>Netzwerk: ${network}</span><br /><ul>${explorers}</ul><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "${currency} Abbuchung request"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> Sehr geehrte/r ${name} </p><p>Ihr Auszahlungsantrag für ${amount} ${currency} wurde bearbeitet.</p><p>Betrag: ${amount} ${currency}<br />Gebühr: ${fee} ${currency}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id='network'>Netzwerk: ${network}</span><br /><ul>${explorers}</ul><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>",
						"title": "${currency} Abbuchung completed"
					}
				},
				"es": {
					"LOGIN": {
						"html": "<div> <p> Estimado/ Estimada ${name} </p> <p> Hemos registrado un acceso a su cuenta con los siguientes detalles </p> <div> <div>Tiempo: ${time}</div> <div>País: ${country}</div> <div>Dirección IP: ${ip}</div> </div> <p> Si no ha sido usted, por favor cambie su contraseña, establezca una autenticación de dos factores y póngase en contacto con nosotros inmediatamente. </p> <p> Saludos<br>Equipo de  ${api_name}  </p> </div>",
						"title": "Inicio de sesión"
					},
					"SIGNUP": {
						"html": "<div> <p> Estimado/ Estimada ${name} </p> <p> Tiene que confirmar su cuenta de correo electrónico haciendo clic en el botón de abajo.<br> Si tiene alguna pregunta, no dude en contactarnos simplemente respondiendo a este correo electrónico.</p><p>Por favor, haga clic en el botón de abajo para proceder a su registro.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirmar</Button></a></div><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Registro"
					},
					"WELCOME": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Gracias por registrarse en ${api_name}.</p><p>Para poder comerciar, primero debe depositar criptomonedas en su cuenta.Por favor, vaya a su <a href=\"${link_account}\" target='_blank'>cuenta</a> y visite la página de <a href=\"${link_deposit}\" target='_blank'>depósito</a>.,</p><p>Si tiene alguna pregunta o preocupación, por favor contáctenos simplemente respondiendo a este correo electrónico.</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Bienvenido"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Ha solicitado que se restablezca la contraseña de su cuenta.<br />Para actualizar su contraseña, haga clic en el siguiente enlace.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Restablecer mi contraseña</Button></a></div><p>Si esta solicitud se hizo por error, es seguro ignorarla; no se harán cambios en su cuenta.</p><p>Solicitud iniciada de: ${ip}</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Solicitud de restablecimiento de la contraseña."
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Felicidades. Su cuenta ha sido verificada con éxito.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Comercie ahora</Button></a></div><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Cuenta verificada"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Felicidades. El nivel de acceso a su cuenta ha sido actualizado a nivel ${tier}. Usted se beneficiará de tarifas más bajas, límites de retiro más altos y otras características premium.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Comercie ahora</Button></a></div><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Cuenta actualizada"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>No pudimos encontrar o procesar su ${currency} depósito hecho el ${date} de ${amount}. Por consiguiente, la transacción es rechazada por nuestro sistema.</p><p>Si tiene más preguntas, puede responder a este correo electrónico</p><p>ID de transacción: ${txid}<br />Cantidad: ${amount}<br />Estado: Rechazado</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "${currency} Depósito rechazado"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>No pudimos encontrar o procesar su ${currency} retirada hecha el ${date} de ${amount}. Por consiguiente, la transacción es rechazada por nuestro sistema y el importe de la retirada pendiente se acredita de nuevo a su ${api_name} billetera.</p><p>Si tiene más preguntas, puede responder a este correo electrónico</p><p>ID de transacción: ${txid}<br />Cantidad: ${amount}<br />Estado: Rechazado</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "${currency} Retirada rechazado"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>You have made a ${currency} withdrawal request of ${amount} to ${address}<br /><br />Cantidad: ${amount}<br />Fee: ${fee} ${currency}<br />Dirección: ${address}<br /><span id='network'>La red: ${network}</span><br /><br />In order to confirm this withdrawal, please click the button below.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirm</Button></a></div><p>Si esta solicitud se hizo por error, es seguro ignorarla; no se harán cambios en su cuenta.</p><p>Solicitud iniciada de: ${ip}</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "${currency} Retirada Request"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>Se requiere la verificación del usuario</h3><div>Usuario '${email}' subió sus documentos para verificarlos. Por favor, verifique sus documentos.</div></div>",
						"title": "Verificación de usuario"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>Depósito sospechoso</h3><div>El cliente con el correo electrónico ${email} ha recibido un depósito de ${currency} que es sospechoso.<br />ID de transacción: ${txid}<h4>Transaction data:</h4><div>${data}</div></div></div>",
						"title": "Depósito sospechoso"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Su retiro de ${currency} por ${amount} fue enviada a una dirección inválida y fue rechazada.</p><p>Dirección: ${address}</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Dirección de retiro no válida"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>Su cuenta ${email} ha sido desactivada. No podrá utilizar su cuenta hasta que sea activada por el administrador del intercambio.</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Cuenta ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>Su cuenta ${email} ha sido activada. Ahora puede usar su cuenta.</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Cuenta ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Dirección: ${address}Su tasa de descuento se ha cambiado al ${rate}%.  Este descuento se aplicará a las tarifas de sus transacciones.</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Descuento"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Se ha verificado una cuenta bancaria pendiente. Su cuenta válida ahora se puede utilizar para operaciones de cambio que requieren una cuenta bancaria.</p><div><strong>Cuentas bancarias verificadas:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">Para ver sus cuentas bancarias actuales, visite el Pestaña de Verificación de Exchange</a></p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Banco verificado"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Su reciente verificación de identidad ha sido procesada y desafortunadamente es rechazada. Para más información, lea el mensaje de nuestro experto a continuación:</p><p>Mensaje: ${message}</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "La verificación de identificación fue rechazada"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Su nuevo registro bancario se ha procesado y desafortunadamente ha sido rechazado. Para más información, lea el mensaje de nuestro experto a continuación:</p><p>Mensaje: ${message}</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Solicitud de nuevo banco rechazada"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Este correo electrónico confirma que recientemente cambió la contraseña de su cuenta. No se requiere ninguna otra acción.<br />Si no autorizó este cambio por favor contáctenos inmediatamente.<br /></p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Contraseña cambiada"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Ha realizado una solicitud para cambiar la contraseña de su cuenta.<br />Para confirmar el cambio de contraseña, haga clic en el enlace a continuación.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirmar cambio de contraseña</Button></a></div><p>Si esta solicitud se realizó por error, es seguro ignorarla; no se realizarán cambios en su cuenta.</p><p>Solicitud iniciada desde: ${ip}</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "Cambiar confirmación de contraseña"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> Estimado/ Estimada ${name} </p><p>Tiene un nuevo depósito por ${amount} ${currency} pendiente en su ${api_name} billetera. Por favor espere hasta que la transacción se confirme y sus fondos estarán disponibles en su billetera. Su transacción requiere ${confirmation} confirmación(es) en la cadena de bloqueo.</p><p>Cantidad: ${amount} ${currency}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacción: ${transaction_id}<br /><span id='network'>La red: ${network}</span><br />Tarifa: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "${currency} Depósito pending"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> Estimado/ Estimada ${name} </p><p> Su ${currency} depósito por ${amount} ${currency} está confirmado y completado y está disponible en su ${currency} billetera.</p><p>Cantidad: ${amount} ${currency}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacción: ${transaction_id}<br /><span id='network'>La red: ${network}</span><br />Tarifa: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "${currency} Depósito completed"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Usted hizo una solicitud de retiro de ${amount} ${currency}. El estado de su retirada está pendiente y se procesará en breve.</p><p>Cantidad: ${amount} ${currency}<br />Tarifa: ${fee} ${currency}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacción: ${transaction_id}<br /><span id='network'>La red: ${network}</span><br /><ul>${explorers}</ul><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "${currency} Retirada request"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> Estimado/ Estimada ${name} </p><p>Su solicitud de retirada de ${amount} ${currency} se está procesando.</p><p>Cantidad: ${amount} ${currency}<br />Tarifa: ${fee} ${currency}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacciónID: ${transaction_id}<br /><span id='network'>La red: ${network}</span><br /><ul>${explorers}</ul><p> Saludos<br>Equipo de  ${api_name}  </p></div>",
						"title": "${currency} Retirada completed"
					}
				},
				"fa": {
					"LOGIN": {
						"html": "<div> <p>  کاربر عزیز${name} </p> <p> شما با جزییات زیر وارد حساب کاربری خود شده ایید </p> <div> <div>زمان: ${time}</div> <div>:کشور ${country}</div> <div>آی پی آدرس: ${ip}</div> </div> <p> اگر شما وارد حساب کاربری خود نشده ایید ، اکیدا توصیه میکنیم  بی درنگ پسورد خود را عوض کنید و همچنین رمز یکبار مصرف حساب کاربری خود را فعال نمایید. </p> <p> با تشکر<br> ${api_name} تیم </p> </div>",
						"title": "ورود"
					},
					"SIGNUP": {
						"html": "<div> <p>  کاربر عزیز${name} </p> <p> شما باید ایمیل خود را با فشار دادن دکمه زیر تایید نمایید.<br> در صورت داشتن هر گونه سوال و یا ابهامی  کافیست تا آن را در پاسخ به همین ایمیل با ما درمیان بگذارید .</p><p>برای ادامه روند ثبت نام خود ، لطفا دکمه زیر را فشار دهید.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">تایید</Button></a></div><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "ثبت نام"
					},
					"WELCOME": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>با تشکر از ثبت نام شما در  ${api_name}.</p><p>برای شروع معاملات شما ابتدا باید به حساب کاربری خود رمزارز و یا پول فیات واریز نمایید.لطفا ابتدا به حساب کاربری خود رفته وصفحه واریز ها را مشاهده فرمایید.,</p><p>در صورت داشتن سوال و یا ابهامی با ما تماس حاصل فرمایید.</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "خوش آمدید"
					},
					"RESET_PASSWORD": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>شما درخواست کلمه عبور جدید برای حساب کاربری خود را ارسال کرده اید.<br />برای بروز رسانی کلمه عبور خود از لینک زیر استفاده نمایید.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">کلمه عبور من را مجددا تنظیم کن</Button></a></div><p>اگر این درخواست را باشتباه صادر کرده اید می توانید براحتی آن را ملغی کنید بدون آنکه نگران تغییر در حساب کاربری خود باشید.</p><p>درخواست ارسالی از : ${ip}</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "درخواست کلمه عبور جدید"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>تبریک می گوییم. حساب کاربری شما تایید و ارتقا سطح داده شده است و هم اکنون می توانید براحتی فعالیت خود را آغاز نمایید.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">هم اکنون معامله کنید</Button></a></div><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "حساب کاربری تایید شد"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>بریک می گوییم ، سطح حساب کاربری شما به سطح ${tier}ارتقا یافت.شما می توانید از مزیت های کارمزد کمتر و سقف برداشت های بیشتر منتفع شوید.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">هم اکنون معامله کنید</Button></a></div><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "حساب کاربری ارتقا یافت"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>ما قادر به پردازش واریز ${currency} شما در تاریخ ${date} و به مبلغ ${amount}نمی باشیم. یه همین دلیل سیستم درخواست شما رد کرده است `,</p><p>درصورت وجود هر گونه سوال بیشتر ، در پاسخ به این ایمیل آن را مطرح کنید.l</p><p>شماره پیگیری تراکنش : ${txid}<br />مبلغ: ${amount}<br />وضعیت: مردود شده</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "${currency} واریز مردود شد"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>ما قادر به پردازش برداشت ${currency} شما در تاریخ ${date} و به مبلغ ${amount}.به همین دلیل درخواست برداشت شما توسط سیستم رد شده است و مبلغ برداشت به${api_name} کیف پول شما عودت داده خواهد شد.`,.</p><p>درصورت وجود هر گونه سوال بیشتر ، در پاسخ به این ایمیل آن را مطرح کنید.l</p><p>شماره پیگیری تراکنش : ${txid}<br />مبلغ: ${amount}<br />وضعیت: مردود شده</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "${currency} برداشت مردود شد"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>شما درخواست برداشت ${currency} و به مبلغ ${amount} به آدرس ${address}نموده اید.<br /><br />مبلغ: ${amount}<br />کارمزد: ${fee} ${currency}<br />آدرس: ${address}<br /><span id='network'>شبکه: ${network}</span><br /><br />برای تایید برداشت خود ،دکمه زیر فشار دهید.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">تایید</Button></a></div><p>اگر این درخواست را باشتباه صادر کرده اید می توانید براحتی آن را ملغی کنید بدون آنکه نگران تغییر در حساب کاربری خود باشید.</p><p>درخواست ارسالی از : ${ip}</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "${currency} برداشت درخواست"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3تایید کاربر باید صورت پذیرد</h3><div>کاربر '${email}' مدارکش برای تایید حساب کاربری ارسال نموده ، لطفا آنها را بررسی نمایید.</div></div>",
						"title": "تایید کاربر"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>واریز مشکوک</h3><div>کاربر با ایمیل کاربری ${email} واریز ${currency}  دریافت نموده که مشکوک به نظر می رسد.<br />شماره پیگیری تراکنش : ${txid}<h4>اطلاعات تراکنش:</h4><div>${data}</div></div></div>",
						"title": "واریز مشکوک"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>برداشت ${currency} شما برای ${amount} به آدرسی نامعتبر ارسال شد و رد شد.</p><p>آدرس: ${address}</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "Invalid Withdrawal Address"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>حساب ${email} شما غیرفعال شده است. تا زمانی که اکانت خود توسط ادمین صرافی فعال نشود، نمی توانید از آن استفاده کنید.</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "Account ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>حساب ${email} شما فعال شده است. اکنون می توانید از حساب کاربری خود استفاده کنید.</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "Account ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>نرخ تخفیف شما به ${rate}٪ تغییر کرده است. این نرخ برای هزینه های سفارش شما اعمال می شود.</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "Discount Rate Change"
					},
					"BANK_VERIFIED": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>یک حساب بانکی معلق تأیید شده است. حساب معتبر شما اکنون می تواند برای عملیات مبادله ای که نیاز به حساب بانکی دارد استفاده شود.</p><div><strong>حساب های بانکی تایید شده:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">برای مشاهده حساب های بانکی فعلی خود، لطفاً به برگه تأیید صرافی مراجعه کنید</a></p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "Bank Verified"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>کد ملی و هویتی شما مورد پردازش قرار گرفت و متاسفانه مورد تایید نمی باشد لطفا برای جزییات بیشتر به پیام های ذیل مراجعه فرمایید:</p><p>:پیام ${message}</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "کد ملی مورد تایید نیست"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>درخواست اضافه شدن بانک جدید ، مورد تایید قرار نگرفت لطفا برای جزییات بیشتر به پیام های ذیل مراجعه فرمایید:</p><p>:پیام ${message}</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "شماره حساب بانکی مورد تایید نیست"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p>  کاربر عزیز${name} </p><p>این ایمیل تأیید می کند که شما اخیراً رمز عبور حساب خود را تغییر داده اید. هیچ اقدام دیگری لازم نیست.<br />اگر شما اجازه این تغییر را نداده اید، لطفاً فوراً با ما تماس بگیرید.<br /></p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "Password Changed"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> کاربر عزیز${name}} </p><p>شما درخواست تغییر رمز عبور حساب کاربری خود را داده اید<br />برای تایید تغییر رمز عبور، روی لینک زیر کلیک کنید.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">تغییر رمز عبور من را تأیید کنید</Button></a></div><p>اگر این درخواست به اشتباه انجام شده است، می توان آن را نادیده گرفت. هیچ تغییری در حساب شما ایجاد نخواهد شد.</p><p>درخواست از: ${ip}</p><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "Change Password Confirmation"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> کاربر عزیز${name} </p><p> شما یک واریز جدید به مبلغ ${amount} ${currency} دارید که در حال انتظار برای واریز به کیف پول ${api_name} می باشد. لطفا تا تایید تراکنش خود و مشاهده مبلغ در کیف پول خود تامل فرمایید. تراکنش شما حداقل به  ${confirmation} تایید بر روی شبکه بلاکچین نیاز دارد.` </p><p>مبلغ: ${amount} ${currency}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id='network'>شبکه: ${network}</span><br />کارمزد: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "${currency} واریز pending"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> کاربر عزیز${name}} </p><p> واریز ${currency} شما به میزان ${amount} ${currency}  تکمیل و تایید شده و هم اکنون در کیف پول ${currency}  شما قابل استفاده است.</p><p>مبلغ: ${amount} ${currency}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id='network'>شبکه: ${network}</span><br />کارمزد: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "${currency} واریز completed"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> کاربر عزیز${name} </p><p>شما درخواست برداشت به مبلغ ${amount} ${currency}.و به آدرس ${address} ثبت کرده اید. درخواست برداشت شما درحال انتظار بوده و به زودی مورد پردازش قرار خواهد گرفت.</p><p>مبلغ: ${amount} ${currency}<br />کارمزد: ${fee} ${currency}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id='network'>شبکه: ${network}</span><br /><ul>${explorers}</ul><p> با تشکر<br> ${api_name} تیم </p></div>",
						"title": "${currency} برداشت request"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> کاربر عزیز${name} </p><p>درخواست برداشت شما به مبلغ ${amount} ${currency} درحال انجام و ارسال به آدرس ${address} می باشد.<br />کارمزد: ${fee} ${currency}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id='network'>شبکه: ${network}</span><br /><ul>${explorers}</ul><p> Regards<br> ${api_name} team </p></div>",
						"title": "${currency} برداشت completed"
					}
				},
				"fr": {
					"LOGIN": {
						"html": "<div> <p> Bonjour ${name} </p> <p> Nous avons enregistré une connexion à votre compte avec les détails suivants </p> <div> <div>Heure: ${time}</div> <div>Pays ${country}</div> <div>Adresse IP: ${ip}</div> </div> <p> Si ce n'était pas vous, veuillez changer votre mot de passe, définissez authentification à deux facteurs, et contactez-nous immédiatement. </p> <p> Bien cordialement<br> ${api_name} team </p> </div>",
						"title": "Login"
					},
					"SIGNUP": {
						"html": "<div> <p> Bonjour ${name} </p> <p> Vous devez confirmer votre email en cliquant sur le bouton ci-dessous.<br> Si vous avez des questions, n'hésitez pas à nous contacter simplement en répondant à cet email.</p><p>Veuillez cliquer sur le bouton ci-dessous pour procéder à votre inscription.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirmer</Button></a></div><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "S'inscrire"
					},
					"WELCOME": {
						"html": "<div><p> Bonjour ${name} </p><p>Merci pour votre inscription à ${api_name}.</p><p>Pour faire du trading, vous devez d'abord déposer de la crypto-monnaie ou verser de l'argent sur votre compte.Veuillez aller à votre <a href=\"${link_account}\" target='_blank'>compte</a> et visitez la page <a href=\"${link_deposit}\" target='_blank'>dépôt</a>.,</p><p>Si vous avez des questions ou des préoccupations, veuillez nous contacter simplement en répondant à cet email.</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Bienvenue"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> Bonjour ${name} </p><p>Vous avez fait une demande de réinitialisation du mot de passe de votre compte.<br />Pour mettre à jour votre mot de passe, cliquez sur le lien ci-dessous.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Réinitialiser mon mot de passe</Button></a></div><p>Si cette demande a été faite par erreur, il est prudent de l'ignorer; aucune modification ne sera apportée à votre compte.</p><p>Demande initiée depuis: ${ip}</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Réinitialiser la demande de mot de passe"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> Bonjour ${name} </p><p>Félicitations. Votre compte a été vérifié correctement.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Commencer le trading maintenant.</Button></a></div><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Compte vérifié"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> Bonjour ${name} </p><p>Félicitations. Le niveau d'accès de votre compte a été mis à jour au niveau ${tier}. Vous bénéficierez de frais moins élevés, de limites de retrait plus élevées et d'autres fonctionnalités premium.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Commencer le trading maintenant.</Button></a></div><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "ompte mis à jour"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> Bonjour ${name} </p><p>Nous n'avons pas pu trouver ni traiter votre dépôt ${currency} effectué le ${date} de ${amount}. Ainsi, la transaction a été rejetée par notre système.</p><p>Si vous avez d'autres questions, vous pouvez répondre à cet email</p><p>Identité de la transaction: ${txid}<br />Montant: ${amount}<br />Status: Rejeté</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "${currency} Dépôt rejeté"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> Bonjour ${name} </p><p>Nous n'avons pas pu trouver ni traiter votre retrait ${currency} fait le ${date} de ${amount}. Ainsi, la transaction a été rejetée par notre système et le montant de votre retrait en attente sera crédité sur votre portefeuille ${api_name}.</p><p>Si vous avez d'autres questions, vous pouvez répondre à cet email</p><p>Identité de la transaction: ${txid}<br />Montant: ${amount}<br />Status: Rejeté</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "${currency} Retrait rejeté"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> Bonjour ${name} </p><p>Vous avez fait une demande de retrait ${currency} d'un montant de ${amount} à l'adresse suivante  ${address}<br /><br />Montant: ${amount}<br />Frais: ${fee} ${currency}<br />Addresse: ${address}<br /><span id='network'>Réseau: ${network}</span><br /><br />Pour confirmer le retrait, veuillez cliquer dur le bouton ci-dessous.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirmer</Button></a></div><p>Si cette demande a été faite par erreur, il est prudent de l'ignorer; aucune modification ne sera apportée à votre compte.</p><p>Demande initiée depuis: ${ip}</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "${currency} Retrait Demande"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>Vérification de l'utilisateur</h3><div>Utilisateur \"${email}\" a téléchargé ses documents pour vérification. Veuillez vérifier ses documents.</div></div>",
						"title": "Vérification de l'utilisateur"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>Dépôt suspect</h3><div>TLe client avec l'email ${email} a reçu un retrait de ${currency} ce qui est suspect.<br />Identité de la transaction: ${txid}<h4>Données de la transaction:</h4><div>${data}</div></div></div>",
						"title": "Dépôt suspect"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> Bonjour ${name} </p><p>Votre retrait ${currency} de ${amount} a été envoyé à une adresse invalide et est rejeté.</p><p>Addresse: ${address}</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Adresse de retrait invalide"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>Votre compte ${email} a été désactivé. Vous ne pourrez pas utiliser votre compte tant qu'il ne sera pas activé par l'administrateur de l'échange.</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Compte ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>Votre compte ${email} a été activé. Vous pouvez désormais utiliser votre compte.</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Compte ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> Bonjour ${name} </p><p>Votre taux de remise a été changé à ${rate}%. Ce taux sera appliqué aux frais de votre commande.</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Modification du taux d'actualisation"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> Bonjour ${name} </p><p>Un compte bancaire en attente a été vérifié. Votre compte valide peut maintenant être utilisé pour les opérations de change nécessitant un compte bancaire.</p><div><strong>Comptes bancaires vérifiés:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">Pour afficher vos comptes bancaires actuels, veuillez visiter la vérification de l'échange Tab</a></p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Vérifié par la banque"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> Bonjour ${name} </p><p>Votre récente vérification d'identité a été traitée et est malheureusement rejetée. Pour d'autres actions, lisez le message de notre expert ci-dessous:</p><p>Message: ${message}</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Vérification d'identité refusée"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> Bonjour ${name} </p><p>Votre nouvelle inscription bancaire a été traitée et est malheureusement rejetée. Pour d'autres actions, lisez le message de notre expert ci-dessous:</p><p>Message: ${message}</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Nouvelle demande bancaire rejetée"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> Bonjour ${name} </p><p>Cet e-mail confirme que vous avez récemment modifié le mot de passe de votre compte. Aucune autre action est nécessaire.<br />Si vous n'avez pas autorisé ce changement, veuillez nous contacter immédiatement.<br /></p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Mot de passe changé"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> Bonjour ${name} </p><p>Vous avez fait une demande de modification du mot de passe de votre compte.<br />Pour confirmer la modification de votre mot de passe, cliquez sur le lien ci-dessous.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirmer le changement de mon mot de passe</Button></a></div><p>Si cette demande a été faite par erreur, vous pouvez l'ignorer; aucune modification ne sera apportée à votre compte.</p><p>Demande initiée par: ${ip}</p><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "Change Password Confirmation"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> Bonjour ${name} </p><p> Vous avez un nouveau dépôt pour ${amount} ${currency} en attente dans votre portefeuille ${api_name} . Veuillez attendre que la transaction soit confirmée et vos fonds seront disponible dans votre portefeuille. Votre transaction nécessite ${confirmation} confirmation(s) sur la blockchain.</p><p>Montant: ${amount} ${currency}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id='network'>Réseau: ${network}</span><br />Frais: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "${currency} Deposit pending"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> Bonjour ${name} </p><p> Votre ${currency} dépôt pour ${amount} ${currency} est confirmé et complété et il est disponible dans votre portefeuille ${currency}.</p><p>Montant: ${amount} ${currency}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id='network'>Réseau: ${network}</span><br />Frais: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "${currency} Deposit completed"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> Bonjour ${name} </p><p>Vous avez fait une demande de retrait de ${amount} ${currency}. Le statut de votre retrait est en attente et sera traité sous peu.</p><p>Montant: ${amount} ${currency}<br />Frais: ${fee} ${currency}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id='network'>Réseau: ${network}</span><br /><ul>${explorers}</ul><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "${currency} withdrawal pending"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> Bonjour ${name} </p><p>Votre demande de retrait de ${amount} ${currency} est traité.</p><p>Montant: ${amount} ${currency}<br />Frais: ${fee} ${currency}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id='network'>Réseau: ${network}</span><br /><ul>${explorers}</ul><p> Bien cordialement<br> ${api_name} team </p></div>",
						"title": "${currency} withdrawal completed"
					}
				},
				"id": {
					"LOGIN": {
						"html": "<div> <p> Kepada ${name} </p> <p> Kami telah mencatat login ke akun Anda dengan rincian sebagai berikut </p> <div> <div>Waktu: ${time}</div> <div>Negara: ${country}</div> <div>Alamat IP: ${ip}</div> </div> <p> Jika ini bukan Anda, harap ubah kata sandi Anda, siapkan otentikasi dua faktor, dan segera hubungi kami. </p> <p> Salam<br> ${api_name} tim </p> </div>",
						"title": "Masuk"
					},
					"SIGNUP": {
						"html": "<div> <p> Kepada ${name} </p> <p> Konfirmasikan akun email Anda dengan klik Anda dengan klik tombol di bawah.<br> Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami dengan membalas email ini.</p><p>Silakan klik tombol di bawah untuk melanjutkan pendaftaran Anda.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Konfirmasi</Button></a></div><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Daftar"
					},
					"WELCOME": {
						"html": "<div><p> Kepada ${name} </p><p>Terima kasih telah mendaftar di ${api_name}.</p><p>Untuk memulai perdagangan, Anda perlu deposito cryptocurrency atau dana ke akun Anda terlebih dahulu. Silakan pergi ke <a href=\"${link_account}\" target='_blank'>akun</a>Anda dan kunjungi halaman <a href=\"${link_deposit}\" target='_blank'>Deposito</a>.,</p><p>Jika Anda memiliki pertanyaan atau kekhawatiran, jangan ragu untuk menghubungi kami dengan membalas email ini.</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Selamat datang"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> Kepada ${name} </p><p>Anda telah meminta reset kata sandi akun Anda.<br />Untuk memperbarui kata sandi Anda, silakan klik tautan di bawah.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Reset Kata Sandi Saya</Button></a></div><p>Jika Anda tidak ingin melanjutkan permintaan ini, silakan abaikan ini; tidak ada perubahan pada akun Anda.</p><p>Permintaan dari: ${ip}</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Permintaan Reset Kata Sandi"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> Kepada ${name} </p><p>Selamat. Akun Anda telah berhasil terverifikasi.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Berdagang Sekarang</Button></a></div><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Akun Terverifikasi"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> Kepada ${name} </p><p>Selamat. Tingkat akses akun Anda telah diperbarui ke tingkat ${tier}. Anda akan mendapatkan keuntungan dari biaya lebih rendah, batas penarikan lebih tinggi dan fitur premium lainnya.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Berdagang Sekarang</Button></a></div><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Akun Diperbarui"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> Kepada ${name} </p><p>Kami tidak dapat menemukan atau memproses deposit ${currency} Anda yang dibuat pada tanggal ${date} dengan jumlah ${amount}. Oleh karena itu, transaksi tersebut dibatalkan oleh sistem kami.</p><p>Jika Anda memiliki pertanyaan lebih lanjut, silakan membalas email ini</p><p>ID Transaksi: ${txid}<br />Jumlah: ${amount}<br />Status: Rejected</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "${currency} Deposito dibatalkan"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> Kepada ${name} </p><p>Kami tidak dapat menemukan atau memproses penarikan ${currency} Anda yang dibuat pada tanggal ${date} dengan jumlah ${amount}. Oleh karena itu, transaksi tersebut dibatalkan oleh sistem kami dan jumlah penarikan tertunda akan kembalikan ke dompet ${api_name} Anda.</p><p>Jika Anda memiliki pertanyaan lebih lanjut, silakan membalas email ini</p><p>ID Transaksi: ${txid}<br />Jumlah: ${amount}<br />Status: Rejected</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "${currency} Penarikan dibatalkan"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> Kepada ${name} </p><p>Anda telah membuat permintaan penarikan ${currency} dengan jumlah ${amount} ke ${address}<br /><br />Jumlah: ${amount}<br />Biaya: ${fee} ${currency}<br />Alamat: ${address}<br /><span id='network'>Jaringan: ${network}</span><br /><br />Untuk konfirmasi penarikan ini, silakan klik tombol di bawah.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Konfirmasi</Button></a></div><p>Jika Anda tidak ingin melanjutkan permintaan ini, silakan abaikan ini; tidak ada perubahan pada akun Anda.</p><p>Permintaan dari: ${ip}</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "${currency} Penarikan Permintaan"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>Verifikasi Pengguna Diperlukan</h3><div>Pengguna '${email}' telah mengupload dokumen untuk verifikasi. Silakan verifikasi dokumennya.</div></div>",
						"title": "Verifikasi Pengguna"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>Deposit Mencurigakan</h3><div>Klien dengan email ${email} telah mendapatkan deposit ${currency} yang mencurigakan.<br />ID Transaksi: ${txid}<h4>Data transaksi:</h4><div>${data}</div></div></div>",
						"title": "Deposit Mencurigakan"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> Kepada ${name} </p><p>Penarikan ${currency} Anda untuk ${amount} telah dikirim ke alamat tidak valid dan dibatalkan.</p><p>Alamat: ${address}</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Alamat Penarikan Tidak Valid"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>Akun Anda ${email} telah dinonaktifkan. Anda tidak dapat menggunakan akun Anda sampai diaktifkan lagi oleh admin bursa.</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Akun ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>Akun Anda ${email} telah diaktifkan. Sekarang, Anda dapat menggunakan akun Anda.</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Akun ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> Kepada ${name} </p><p>Tarif diskon Anda telah diubah menjadi ${rate}%. Tarif ini akan diterapkan pada biaya pemesanan Anda.</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Perubahan Tarif Diskon"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> Kepada ${name} </p><p>Rekening bank yang tertunda telah diverifikasi. Rekening Anda yang valid sekarang dapat digunakan untuk operasi pertukaran yang membutuhkan rekening bank.</p><div><strong>Rekening Bank Terverifikasi:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">Untuk melihat rekening bank Anda saat ini, kunjungi Verifikasi bursa Tab</a></p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Bank Terverifikasi"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> Kepada ${name} </p><p>Verifikasi ID Anda telah diproses tetapi dibatalkan. Untuk melakukan tindakan lebih lanjut, silakan baca pesan di bawah:</p><p>Pesan: ${message}</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Verifikasi ID Dibatalkan"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> Kepada ${name} </p><p>Pendaftaran bank baru Anda telah diproses tetapi dibatalkan. Untuk melakukan tindakan lebih lanjut, silakan baca pesan di bawah:</p><p>Pesan: ${message}</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Aplikasi Bank Baru Dibatalkan"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> Kepada ${name} </p><p>Email ini mengonfirmasi bahwa Anda baru saja mengubah kata sandi untuk akun Anda. Tidak diperlukan tindakan lebih lanjut.<br />Jika Anda tidak mengizinkan perubahan ini, harap segera hubungi kami.<br /></p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Kata Sandi Diubah"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> Kepada ${name} </p><p>Anda telah membuat permintaan untuk mengubah kata sandi akun Anda.<br />Untuk mengonfirmasi kata sandi Anda diubah, klik tautan di bawah<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Konfirmasi Ubah Kata Sandi Saya</Button></a></div><p>Jika permintaan ini dibuat karena kesalahan, Anda dapat mengabaikannya; tidak ada perubahan yang akan dilakukan pada akun</p><p>Permintaan dimulai dari: ${ip}</p><p> Salam<br> ${api_name} tim </p></div>",
						"title": "Ubah Konfirmasi Kata Sandi"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> Kepada ${name} </p><p> Ada deposit baru untuk ${amount} ${currency} yang sedang dalam proses di dompet ${api_name} Anda. Mohon ditunggu sampai transaksi dikonfirmasi dan dana Anda akan tersedia di dompet Anda. Please wait until the transaction is confirmed and your funds will be available in your wallet. Transaksi Anda memerlukan ${confirmation} konfirmasi dalam blockchain.</p><p>Jumlah: ${amount} ${currency}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id='network'>Jaringan: ${network}</span><br />Biaya: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Salam<br> ${api_name} tim </p></div>",
						"title": "${currency} Deposito pending"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> Kepada ${name} </p><p> Deposit ${currency} Anda untukr ${amount} ${currency} telah dikonfirmasi dan berhasil dibuat dan tersedia di dompet ${currency} Anda.</p><p>Jumlah: ${amount} ${currency}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id='network'>Jaringan: ${network}</span><br />Biaya: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Salam<br> ${api_name} tim </p></div>",
						"title": "${currency} Deposito completed"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> Kepada ${name} </p><p>Anda telah membuat permintaan penarikan untuk ${amount} ${currency}. ke alamat ${address}. Penarikan Anda sedang dalam proses dan akan segera diproses.</p><p>Jumlah: ${amount} ${currency}<br />Biaya: ${fee} ${currency}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id='network'>Jaringan: ${network}</span><br /><ul>${explorers}</ul><p> Salam<br> ${api_name} tim </p></div>",
						"title": "${currency} Penarikan pending"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p>Kepada ${name} </p><p>Permintaan penarikan Anda untuk ${amount} ${currency} telah diproses dan ditransfer ke alamat ${address}.</p><p>Jumlah: ${amount} ${currency}<br />Biaya: ${fee} ${currency}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id='network'>Jaringan: ${network}</span><br /><ul>${explorers}</ul><p> Salam<br> ${api_name} tim </p></div>",
						"title": "${currency} Penarikan completed"
					}
				},
				"ja": {
					"LOGIN": {
						"html": "<div> <p> ${name}様 </p> <p> お客様のアカウントが以下の情報からログインされました。 </p> <div> <div>時間: ${time}</div> <div>国家： ${country}</div> <div>IPアドレス： ${ip}</div> </div> <p> 本人のログインではない場合、${api_name}でパスワードの変更および二段階認証を設定し、即時にこのメールにてご返信ください。 </p> <p> 敬具<br> ${api_name} チーム </p> </div>",
						"title": "ログイン"
					},
					"SIGNUP": {
						"html": "<div> <p> ${name}様 </p> <p>下のボタンをクリックしてメールアカウントを確認する必要があります。<br> ご不明な点がございましたら、このメールに返信するだけでお気軽にお問い合わせください。</p><p>ご不明な点がございましたら、このメールに返信するだけでお気軽にお問い合わせください。</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">出金承認</Button></a></div><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "会員登録"
					},
					"WELCOME": {
						"html": "<div><p> ${name}様 </p><p>${api_name}をご利用いただき誠にありがとうございます。.</p><p>取引を始めるため、まず仮想通貨、または資金をアカウントに入金する必要があります。お客様の <a href=\"${link_account}\" target='_blank'>アカウント</a>に移動して、 <a href=\"${link_deposit}\" target='_blank'>入金</a> ページを訪問してください。`.,</p><p>お問い合わせは、このメールにてご返信ください。</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "ようこそ"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> ${name}様 </p><p>お客様のアカウントから、パスワードの再設定がリクエストされました。<br />下のリンクをクリックして、パスワードのアップデートを続行してください。<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">パスワード再設定</Button></a></div><p>このリクエストの続行を望まない場合、このメールは無視してください。お客様のアカウントに変更は一切適用されません。</p><p>リクエスト元： ${ip}</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "パスワード再設定のリクエスト"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> ${name}様 </p><p>おめでとうございます。お客様のアカウントの認証が完了しました。</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">取引を始める</Button></a></div><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "アカウントの認証完了"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> ${name}様 </p><p>おめでとうございます。お客様のアカウントのレベルが、${tier}にアップグレードされました。これから、より安い手数料や高い出金限度額など、様々なプレミアム特典をご利用になれます。</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">取引を始める</Button></a></div><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "Account Upgraded"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> ${name}様 </p><p>お客様が${date}に${amount} ${currency}を入金した履歴を検索または処理できませんでした。これにより、取引がシステムにより拒否されました。</p><p>お問い合わせは、このメールにてご返信ください。</p><p>取引ID： ${txid}<br />金額： ${amount}<br />取引状態：拒否</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "${currency} 入金 失敗"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> ${name}様 </p><p>お客様が${date}に${amount} ${currency}を出金した履歴を検索または処理できませんでした。これにより、取引がシステムにより拒否されました。お客様の保留中の出金は${api_name}ウォレットに返金されました。</p><p>お問い合わせは、このメールにてご返信ください。</p><p>取引ID： ${txid}<br />金額： ${amount}<br />取引状態：拒否</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "${currency} 出金 失敗"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> ${name}様 </p><p>お客様のアカウントから${address}へ${amount} ${currency}出金がリクエストされました。<br /><br />金額： ${amount}<br />手数料： ${fee} ${currency}<br />アドレス： ${address}<br /><span id='network'>ネットワーク: ${network}</span><br /><br />出金を承認するためには、下のボタンをクリックしてください。<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">出金承認</Button></a></div><p>このリクエストの続行を望まない場合、このメールは無視してください。お客様のアカウントに変更は一切適用されません。</p><p>リクエスト元： ${ip}</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "${currency} 出金 リクエスト"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>ユーザー本人確認要請</h3><div>ユーザー '${email}' uが本人確認書類をアップロードしました。書類の確認をお願いします。</div></div>",
						"title": "ユーザー本人確認"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>不明な入金</h3><div>ユーザー${email}が不明な${currency}入金を受け取りました。<br />取引ID： ${txid}<h4>取引データ：</h4><div>${data}</div></div></div>",
						"title": "不明な入金"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> ${name}様 </p><p>お客様の${amount} ${currency}出金が、無効なアドレスにリクエストされ取引が拒否されました。</p><p>アドレス： ${address}</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "無効な出金アドレス"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>お客様のアカウント${email}が非活性化されました。取引所管理者から活性化されるまでアカウントはご利用できません。</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "アカウント ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>お客様のアカウント${email}が活性化されました。これからアカウントをご利用できます。</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "アカウント ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> ${name}様</p><p>割引率が${rate}％に変更されました。この率は注文料金に適用されます。</p> <p>敬具<br>${api_name}チーム</p></ div>",
						"title": "割引率の変更"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> ${name}様 </p><p>保留中の銀行口座が確認されました。 これで、有効なアカウントを銀行口座を必要とする交換操作に使用できます。</p><div><strong>確認済みの銀行口座:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">現在の銀行口座を表示するには、取引所の[確認]タブにアクセスしてください</a></p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "銀行確認済み"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> ${name}様 </p><p>恐れ入りますが、お客様の本人確認に失敗しました。以下のメッセージを参考し、追加の処置を行ってください：</p><p>メッセージ： ${message}</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "本人確認失敗"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> ${name}様 </p><p>恐れ入りますが、お客様の新しい銀行情報の登録に失敗しました。以下のメッセージを参考し、追加の処置を行ってください：</p><p>メッセージ： ${message}</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "新しい銀行情報の登録失敗"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> ${name}様 </p><p>このメールは、アカウントのパスワードを最近変更したことを確認します。これ以上の操作は必要ありません。<br />変更しなかった場合 この変更を承認するには、すぐにご連絡ください。<br /></p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "パスワード変更済み"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> ${name}様 </p><p>アカウントのパスワードの変更をリクエストしました。<br />パスワードが変更されたことを確認するには、以下のリンクをクリックしてください。<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">パスワードの変更を確認する</Button></a></div><p>この要求が誤って行われた場合は、無視しても問題ありません。 アカウントに変更は加えられません。</p><p>リクエストの開始元： ${ip}</p><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "パスワードの変更の確認"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> ${name}様 </p><p> 現在、お客様の${api_name}ウォレットへの${amount} ${currency}入金は保留中です。取引が承認されるまでお待ちください お客様の取引には、ブロックチェーン上で${confirmation}個の承認が必要です。</p><p>金額: ${amount} ${currency}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id='network'>ネットワーク: ${network}</span><br />手数料: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "${currency}デポジットは保留中です"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> ${name}様 </p><p> お客様の${amount} ${currency}入金が完了しました。お客様の${currency}ウォレットから確認および利用が可能です。 </p><p>金額: ${amount} ${currency}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id='network'>ネットワーク: ${network}</span><br />手数料: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "${currency}デポジットが完了しました"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> ${name}様 </p><p>お客様のアドレス${address}に${amount} ${currency}出金がリクエストされました。現在の取引状態は保留中ですが、まもなく完了する予定です。</p><p>金額: ${amount} ${currency}<br />手数料: ${fee} ${currency}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id='network'>ネットワーク: ${network}</span><br /><ul>${explorers}</ul><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "${currency}の引き出しは保留中"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> ${name}様 </p><p>お客様の${amount} ${currency}出金が完了し、アドレス${address}に振り込みされました。</p><p>金額: ${amount} ${currency}<br />手数料: ${fee} ${currency}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id='network'>ネットワーク: ${network}</span><br /><ul>${explorers}</ul><p> 敬具<br> ${api_name} チーム </p></div>",
						"title": "${currency}の引き出しが完了しました"
					}
				},
				"ko": {
					"LOGIN": {
						"html": "<div> <p> ${name}님 </p> <p> 회원님의 계정에 대한 로그인 정보가 아래와 같이 기록되어 있습니다 </p> <div> <div>시간: ${time}</div> <div>국가: ${country}</div> <div>IP 주소: ${ip}</div> </div> <p> 본인이 아닌 경우, ${api_name}에 방문하여 비밀번호 변경 및 이중인증 보안을 설정하시고 즉시, 회신하여 저희에게 문의해주시기 바랍니다. </p> <p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p> </div>",
						"title": "로그인"
					},
					"SIGNUP": {
						"html": "<div> <p> ${name}님 </p> <p> 안녕하세요. 아래 버튼을 클릭하여 회원님의 이메일 계정을 인증해주시기바랍니다. <br> 문의사항은 본 메일에 회신하여 문의하실 수 있습니다.</p><p>아래 버튼을 클릭하여 등록 절차를 진행하시기 바랍니다.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">나의 계정 활성화</Button></a></div><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "회원가입"
					},
					"WELCOME": {
						"html": "<div><p> ${name}님 </p><p>누구나 빠르고 쉬운 거래가 가능한 가상화폐거래소 ${api_name}를 이용해주셔서 감사합니다.</p><p>거래를 시작하기 위해선 먼저, 비트코인 또는 현금을 계좌에 입금하여야 합니다. <a href=\"${link_account}\" target='_blank'>계정</a> 페이지로 이동하여 <a href=\"${link_deposit}\" target='_blank'>입금</a> 페이지를 방문해주시기 바랍니다.,</p><p>문의사항은 이메일로 문의해주시기 바랍니다.</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "환영합니다"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> ${name}님 </p><p>회원님의 계정에 대한 비밀번호 재설정을 요청하셨습니다.<br />아래 링크를 클릭하여 비밀번호 업데이트를 진행하시기 바랍니다.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">비밀번호 재설정</Button></a></div><p>만약 이 요청을 원하지 않는다면, 회원님의 계정에는 변경사항이 없으니 본 메일을 무시해 주시기 바랍니다.</p><p>요청하신곳: ${ip}</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "비밀번호 재설정 요청"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> ${name}님 </p><p>축하합니다. 회원님의 신원이 확인되어 계정이 승급되었습니다. 이제 거래를 시작하기 위한 모든 준비가 되었습니다.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">거래하기</Button></a></div><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "계정 인증완료"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> ${name}님 </p><p>축하합니다. 회원님의 계정이 레벨 ${tier} 로 업그레이드 되었습니다. 이제 더 낮은 수수료와 높아진 출금한도를 비롯한 다른 프리미엄 혜택을 받으실 수 있습니다.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">거래하기</Button></a></div><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "계정 업그레이드완료"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> ${name}님 </p><p>회원님이 ${date}에 ${amount}의 ${currency} 을 입금하신 내역을 찾을 수 없거나 처리 할 수 없습니다. 해당 거래는 시스템에 의해 거부되었습니다.</p><p>추가 문의 사항이 있으시다면 이 이메일에 회신해주시기 바랍니다.</p><p>거래 ID 확인: ${txid}<br />금액: ${amount}<br />상태 : 거절됨</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "${currency} 입금 거절됨"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> ${name}님 </p><p>회원님이 ${date}에 ${amount}의 ${currency} 을 출금하신 내역을 찾을 수 없거나 처리 할 수 없습니다. 해당 거래는 시스템에 의해 거부되었으며, 보류중인 회원님의 출금금액이 ${api_name} 지갑으로 환불됩니다.</p><p>추가 문의 사항이 있으시다면 이 이메일에 회신해주시기 바랍니다.</p><p>거래 ID 확인: ${txid}<br />금액: ${amount}<br />상태 : 거절됨</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "${currency} 출금 거절됨"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> ${name}님 </p><p>회원님은 ${address} 로 ${amount} 의 ${currency}을 출금요청하였습니다.<br /><br />금액: ${amount}<br />수수료: ${fee} ${currency}<br />주소: ${address}<br /><span id='network'>회로망: ${network}</span><br /><br />출금 요청을 완료하시려면 아래버튼을 클릭해주시기 바랍니다.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">나의 계정 활성화</Button></a></div><p>만약 이 요청을 원하지 않는다면, 회원님의 계정에는 변경사항이 없으니 본 메일을 무시해 주시기 바랍니다.</p><p>요청하신곳: ${ip}</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "${currency} 출금 요청"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>사용자 확인 필요</h3><div>사용자 '${email}' 이(가) 확인을 위해 문서를 업로드했습니다. 그의 문서를 확인하십시오.</div></div>",
						"title": "사용자 확인"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>수상한 입금</h3><div>이메일이 ${email}인 고객이 ${currency}의 의심스러운 보증금을 받았습니다.<br />거래 ID 확인: ${txid}<h4>거래 데이터:</h4><div>${data}</div></div></div>",
						"title": "이중 지출"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> ${name}님 </p><p>${amount}에 대한 ${currency} 인출이 잘못된 주소로 전송되었으며 거부되었습니다.</p><p>주소: ${address}</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "잘못된 출금 주소"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>${email} 계정이 비활성화되었습니다. 거래소 관리자가 활성화할 때까지 계정을 사용할 수 없습니다.</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "계정 ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>${email} 계정이 활성화되었습니다. 이제 계정을 사용할 수 있습니다.</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "계정 ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> ${name}님 </p><p>할인율이 ${rate}%로 변경되었습니다. 이 비율은 주문 수수료에 적용됩니다.</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "할인율 변경"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> ${name}님 </p><p>보류 중인 은행 계좌가 확인되었습니다. 이제 유효한 계정을 은행 계좌가 필요한 교환 작업에 사용할 수 있습니다.</p><div><strong>확인된 은행 계좌:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">현재 은행 계좌를 보려면 거래소의 확인 탭을 방문하세요.</a></p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "은행 인증"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> ${name}님 </p><p>회원님의 ID 인증을 진행하였으나 거절되었습니다. 아래의 메세지를 참고하여 추가 조치를 취해주시기 바랍니다:</p><p>메세지: ${message}</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "ID 인증 거절"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> ${name}님 </p><p>회원님의 새로운 은행정보 등록이 진행되었으나 거절되었습니다. 아래의 메세지를 참고하여 추가 조치를 취해주시기 바랍니다:</p><p>메세지: ${message}</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "새로운 은행정보 등록 거절"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> ${name}님 </p><p>이 이메일은 귀하가 최근에 귀하의 계정 비밀번호를 변경했음을 확인시켜 드립니다. 추가 조치가 필요하지 않습니다.<br />이 변경을 승인하지 않은 경우 즉시 당사에 연락하십시오.<br /></p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "비밀번호 변경됨"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> ${name}님 </p><p>계정의 비밀번호 변경을 요청하셨습니다.<br />비밀번호 변경을 확인하려면 아래 링크를 클릭하세요.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">내 비밀번호 변경 확인</Button></a></div><p>이 요청이 오류로 이루어진 경우 무시해도 됩니다. 귀하의 계정은 변경되지 않습니다.</p><p>요청 시작: ${ip}</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "비밀번호 변경 확인"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> ${name}님 </p><p> 회원님의 ${api_name} 지갑으로 ${amount} ${currency} 입금이 진행 중입니다. 거래가 승인되고 지갑에 자금이 입금될 때까지 기다려주십시오. 회원님의 거래에는 비트코인 블록체인 상 ${confirmation} 개의 승인이 요구됩니다. </p><p>금액: ${amount} ${currency}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id='network'>회로망: ${network}</span><br />수수료: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "${currency} 입금 보류 중"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> ${name}님} </p><p> 회원님의 ${amount} ${currency} 입금이 완료되었습니다. 회원님의 ${currency} 지갑에서 확인 및 이용하실 수 있습니다.</p><p>금액: ${amount} ${currency}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id='network'>회로망: ${network}</span><br />수수료: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "${currency} 입금 완료"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> ${name}님 </p><p>회원님의 ${amount} ${currency} 출금이 요청되었습니다. 출금 대기 중이며, 곧 완료될 예정입니다.</p><p>금액: ${amount} ${currency}<br />수수료: ${fee} ${currency}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id='network'>회로망: ${network}</span><br /><ul>${explorers}</ul><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "${currency} 출금 보류 중"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> ${name}님 </p><p>회원님의 ${amount} ${currency}를 출금이 완료되어 회원님의 계좌로 이체되었습니다.</p><p>금액: ${amount} ${currency}<br />수수료: ${fee} ${currency}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id='network'>회로망: ${network}</span>>br /><ul>${explorers}</ul><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>",
						"title": "${currency} 출금 완료"
					}
				},
				"pt": {
					"LOGIN": {
						"html": "<div> <p> Dear ${name} </p> <p> Registramos um login em sua conta com os seguintes dados </p> <div> <div>Hora: ${time}</div> <div>País: ${country}</div> <div>Endereço de IP: ${ip}</div> </div> <p> Caso não tenha sido você, altere sua senha, configure a autenticação de dois fatores e entre em contato conosco imediatamente. </p> <p> Saudações<br> ${api_name} equipe </p> </div>",
						"title": "Login"
					},
					"SIGNUP": {
						"html": "<div> <p> Dear ${name} </p> <p> Você precisa confirmar sua conta de e-mail clicando no botão abaixo.<br> Se você tiver alguma dúvida, basta entrar em contato através deste e-mail.</p><p>Por favor, clique no botão abaixo para prosseguir.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirmar</Button></a></div><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Registrar"
					},
					"WELCOME": {
						"html": "<div><p> Dear ${name} </p><p>Obrigado por se registrar-se no ${api_name}.</p><p>Para começar a fazer trade, você deve primeiro fazer um depósito em criptomoedas ou dinheiro em sua conta.Vá para sua <a href=\"${link_account}\" target='_blank'>conta</a> e visite a página de <a href=\"${link_deposit}\" target='_blank'>depósito</a>.,</p><p>Se você tiver alguma dúvida ou questão, basta entrar em contato conosco através deste e-mail.</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Bem-vindo(a)"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> Dear ${name} </p><p>Você solicitou a redefinição da senha de sua conta.<br />Para atualizar sua senha, clique no link abaixo.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Criar nova senha</Button></a></div><p>Se esta solicitação foi feita por engano, gentileza ignorá-la; nenhuma alteração será feita em sua conta.</p><p>Solicitação iniciada em: ${ip}</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Solicitação para redefinir a senha"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> Dear ${name} </p><p>Parabéns. Sua conta foi verificada com sucesso.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Comece a fazer trade agora!</Button></a></div><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Conta verificada"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> Dear ${name} </p><p>Parabéns! O nível de acesso da sua conta recebeu um upgrade e foi para o nível ${tier}. Você terá como benefícios taxas mais baixas, limites de saque mais altos e outros recursos premium.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Comece a fazer trade agora!</Button></a></div><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Conta atualizada"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> Dear ${name} </p><p>Não conseguimos encontrar ou processar seu depósito de ${currency} feito em ${date} para ${amount}. Por isso, a transação foi rejeitada pelo nosso sistema.</p><p>Em caso de dúvidas, basta responder a este e-mail</p><p>ID da transação: ${txid}<br />Quantia: ${amount}<br />Status: Rejeitado</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "${currency} Depósito rejeitado"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> Dear ${name} </p><p>Não foi possível encontrar ou processar sua retirada de ${currency} feita em ${date} para ${amount}. Por isso, a transação foi rejeitada pelo nosso sistema e o valor do saque pendente foi creditado de volta na sua carteira ${API_NAME ()}.</p><p>Em caso de dúvidas, basta responder a este e-mail</p><p>ID da transação: ${txid}<br />Quantia: ${amount}<br />Status: Rejeitado</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "${currency} Saque rejeitado"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> Dear ${name} </p><p>Você fez uma solicitação de saque de ${currency} de ${amount} para ${address}<br /><br />Quantia: ${amount}<br />Taxa: ${fee} ${currency}<br />Endereço: ${address}<br /><span id='network'>Rede: ${network}</span><br /><br />Para confirmar este saque, por favor clique no botão abaixo.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirmar</Button></a></div><p>Se esta solicitação foi feita por engano, gentileza ignorá-la; nenhuma alteração será feita em sua conta.</p><p>Solicitação iniciada em: ${ip}</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "${currency} Saque Solicitação"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>Verificação de usuário necessária</h3><div>O usuário '${email}' fez o upload de seus documentos para verificação. Por favor, verifique-os.</div></div>",
						"title": "Verificação de usuário"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>Depósito Suspeito</h3><div>O cliente com o e-mail ${email} recebeu um depósito suspeito de ${currency}.<br />ID da transação: ${txid}<h4>Dados de transação:</h4><div>${data}</div></div></div>",
						"title": "Depósito Suspeito"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> Dear ${name} </p><p>Seu saque de ${currency} de ${amount} estava prestes a ser enviado para um endereço inválido e por isso foi rejeitado.</p><p>Endereço: ${address}</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Endereço de saque inválido"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>Sua conta ${email} foi desativada. Você não poderá usar sua conta até que ela seja ativada pelo administrador da Exchange.</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Conta ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>Sua conta ${email} foi ativada. Agora você já pode usar sua conta.</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Conta ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> Dear ${name} </p><p>Sua taxa de desconto foi alterada para ${rate}%. Esta taxa será aplicada às taxas do seu pedido.</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Alteração da taxa de desconto"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> Dear ${name} </p><p>Uma conta bancária pendente foi verificada. Sua conta válida agora pode ser usada para operações de câmbio que exigem uma conta bancária.</p><div><strong>Contas bancárias verificadas:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">Para visualizar suas contas bancárias atuais, visite a guia Verificação da bolsa</a></p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Banco verificado"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> Dear ${name} </p><p>Sua solicitação de identidade recente foi processada mas, infelizmente, rejeitada. Para mais ações, leia a mensagem do nosso especialista abaixo:</p><p>Mensagem: ${message}</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Verificação de ID rejeitada"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> Dear ${name} </p><p>Seu novo registro no banco foi processado e infelizmente foi rejeitado. Para outras ações, leia a mensagem do nosso especialista abaixo:</p><p>Mensagem: ${message}</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Novo pedido de banco rejeitado"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> Dear ${name} </p><p>Este e-mail confirma que você alterou recentemente a senha da sua conta. Não é necessária nenhuma ação adicional.<br />Se você não autorizou essa alteração, entre em contato conosco imediatamente.<br /></p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Senha alterada"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> Dear ${name} </p><p>Você fez uma solicitação para alterar a senha da sua conta.<br />Para confirmar sua alteração de senha, clique no link abaixo.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Confirm Change My Password</Button></a></div><p>If this request was made in error, it is safe to ignore it; no changes will be made to your account.</p><p>Request initiated from: ${ip}</p><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "Confirmação de alteração de senha"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> Dear ${name} </p><p> Você tem um novo depósito de ${amount} ${currency} pendente em sua carteira ${api_name} . Aguarde até que a transação seja confirmada e seus fundos estejam disponíveis em sua carteira. Sua transação requer ${confirmation} confirmação ou confirmações no blockchain.</p><p>Quantia: ${amount} ${currency}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id='network'>Rede: ${network}</span><br />Taxa: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "${currency} Depósito Pendente"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> Dear ${name} </p><p> Seu ${currency} O depósito de ${amount} ${currency} foi confirmado e concluído e está disponível em sua ${currency} carteira.</p><p>Quantia: ${amount} ${currency}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id='network'>Rede: ${network}</span><br />Taxa: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "${currency} Depósito concluído"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> Dear ${name} </p><p>Você fez uma solicitação de saque de ${amount} ${currency} para o endereço ${address}. Seu status de retirada está pendente e será processado em breve.</p><p>Quantia: ${amount} ${currency}<br />Taxa: ${fee} ${currency}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id='network'>Rede: ${network}</span><br /><ul>${explorers}</ul><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "${currency} Saque pendente"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> Dear ${name} </p><p>Sua solicitação de saque de ${amount} ${currency} foi processada e transferida para o endereço ${address}.</p><p>Quantia: ${amount} ${currency}<br />Taxa: ${fee} ${currency}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id='network'>Rede: ${network}</span><br /><ul>${explorers}</ul><p> Saudações<br> ${api_name} equipe </p></div>",
						"title": "${currency} Saque concluído"
					}
				},
				"vi": {
					"LOGIN": {
						"html": "<div> <p> ${name} thân mến </p> <p> Chúng tôi ghi nhận lịch sử đăng nhập vào tài khoản của quý khách với chi tiết như sau </p> <div> <div>Thời gian: ${time}</div> <div>Quốc gia: ${country}</div> <div>Địa chỉ IP: ${ip}</div> </div> <p> Nếu đây không phải là quý khách, hãy thay đổi mật khẩu, cài đặt bảo mật Xác thực 2 yếu tố cho tài khoản và liên hệ với chúng tôi ngay lập tức. </p> <p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p> </div>",
						"title": "Đăng nhập"
					},
					"SIGNUP": {
						"html": "<div> <p> ${name} thân mến </p> <p> Quý khách cần xác nhận địa chỉ email bằng cách nhấn vào nút bên dưới.<br> Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi bằng cách hồi đáp lại thư này.</p><p>Vui lòng nhấn vào nút bên dưới để hoàn tất thủ tục đăng ký.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Xác nhận</Button></a></div><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Đăng ký"
					},
					"WELCOME": {
						"html": "<div><p> ${name} thân mến </p><p>Cảm ơn quý khách đã đăng ký thành viên tại ${api_name}.</p><p>Để giao dịch, trước tiên quý khách cần nạp tiền điện tử hoặc tiền mặt vào tài khoản.Vui lòng truy cập vào <a href=\"${link_account}\" target='_blank'>Tài khoản</a> và chuyển tới mục <a href=\"${link_deposit}\" target='_blank'>Nạp tiền</a>.,</p><p>Hãy hồi đáp lại thư này này nếu quý khách có bất kỳ câu hỏi hoặc mối bận tâm nào.</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Chào mừng quý khách"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> ${name} thân mến </p><p>Quý khách vừa thực hiện yêu cầu đặt lại mật khẩu cho tài khoản của mình.<br />Để cập nhật mật khẩu, vui lòng nhấn vào liên kết phía dưới.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Đặt lại mật khẩu</Button></a></div><p>Trong trường hợp không mong muốn thay đổi nêu trên, hãy bỏ qua tin nhắn này. Chúng tôi sẽ không thực hiện bất kỳ thay đổi nào trên tài khoản của quý khách.</p><p>Yêu cầu được gửi đến từ: ${ip}</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Yêu cầu đặt lại mật khẩu"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> ${name} thân mến </p><p>Chúc mừng. Tài khoản của quý khách đã được xác thực thành công.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Giao dịch ngay bây giờ</Button></a></div><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Tài khoản đã được xác thực"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> ${name} thân mến </p><p>Chúc mừng. Tài khoản của quý khách đã được nâng cấp lên cấp bậc ${tier}. Quý khách sẽ nhận được nhiều ưu đãi như phí giao dịch rẻ hơn, hạn mức rút tiền cao hơn và các phần thưởng khác.</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Giao dịch ngay bây giờ</Button></a></div><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Tài khoản đã được nâng cấp"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> ${name} thân mến </p><p>Chúng tôi không thể xác định và thực hiện yêu cầu nạp ${currency} với số lượng ${amount} được thực hiện vào ${date} của quý khách. Chính vì vậy, giao dịch đã bị từ chối bởi hệ thống của chúng tôi.</p><p>Hãy hồi đáp lại thư này nếu quý khách có thêm bất kỳ yêu cầu nào khác</p><p>ID giao dịch: ${txid}<br />Số lượng: ${amount}<br />Trạng thái: Bị từ chối</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "${currency} Nạp tiền bị từ chối"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> ${name} thân mến </p><p>Chúng tôi không thể xác định và thực hiện yêu cầu rút ${currency} với số lượng ${amount} được thực hiện vào ${date} của quý khách. Chính vì vậy, giao dịch đã bị từ chối bởi hệ thống của chúng tôi và số tiền tương ứng đã được hoàn lại vào ví ${api_name} của quý khách.</p><p>Hãy hồi đáp lại thư này nếu quý khách có thêm bất kỳ yêu cầu nào khác</p><p>ID giao dịch: ${txid}<br />Số lượng: ${amount}<br />Trạng thái: Bị từ chối</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "${currency} Rút tiền bị từ chối"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> ${name} thân mến </p><p>Quý khách vừa thực hiện yêu cầu rút ${currency} với số lượng ${amount} tới ${address}<br /><br />Số lượng: ${amount}<br />Phí: ${fee} ${currency}<br />Địa chỉ: ${address}<br /><span id='network'>Mạng: ${network}</span><br /><br />Để xác nhận yêu cầu rút tiền này, vui lòng nhấn vào nút bên dưới.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Xác nhận</Button></a></div><p>Trong trường hợp không mong muốn thay đổi nêu trên, hãy bỏ qua tin nhắn này. Chúng tôi sẽ không thực hiện bất kỳ thay đổi nào trên tài khoản của quý khách.</p><p>Yêu cầu được gửi đến từ: ${ip}</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Yêu cầu ${currency} Rút tiền"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>Đã yêu cầu xác thực người dùng</h3><div>Khách hàng có địa chỉ email '${email}' đã tải lên hồ sơ để yêu cầu xác thực. Vui lòng xác thực hồ sơ của người dùng này.</div></div>",
						"title": "Xác thực người dùng"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>Giao dịch nạp tiền đáng ngờ</h3><div>Khách hàng có địa chỉ email ${email} đã nhận được một giao dịch nạp ${currency} đáng ngờ.<br />ID giao dịch: ${txid}<h4>Dữ liệu giao dịch:</h4><div>${data}</div></div></div>",
						"title": "Giao dịch nạp tiền đáng ngờ"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> ${name} thân mến </p><p>Yêu cầu rút ${currency} với số lượng ${amount} của quý khách đã được gửi tới một địa chỉ không hợp lệ và bị từ chối.</p><p>Địa chỉ: ${address}</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Địa chỉ rút tiền không hợp lệ"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>Tài khoản ${email} của quý khách đã bị vô hiệu hóa. Quý khách sẽ không thể sử dụng tài khoản của mình cho đến khi nó được kích hoạt bởi người quản lý của sàn giao dịch.</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Tài khoản ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>Tài khoản ${email} của quý khách đã được kích hoạt. Giờ đây, quý khách đã có thể sử dụng tài khoản của mình.</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Tài khoản ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> ${name} thân mến </p><p>Tỷ lệ chiết khấu của bạn đã được thay đổi thành ${rate}%. Tỷ lệ này sẽ được áp dụng cho phí đặt hàng của bạn.</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Thay đổi tỷ lệ chiết khấu"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> ${name} thân mến </p><p>Một tài khoản ngân hàng đang chờ xử lý đã được xác minh. Tài khoản hợp lệ của bạn hiện có thể được sử dụng cho các hoạt động trao đổi yêu cầu tài khoản ngân hàng.</p><div><strong>Tài khoản ngân hàng đã xác minh::</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">Để xem các tài khoản ngân hàng hiện tại của bạn, vui lòng truy cập vào Tab Xác minh của sàn giao dịch</a></p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Ngân hàng đã xác minh"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> ${name} thân mến </p><p>Thủ tục xác thực ID của quý khách đã được tiếp nhận nhưng rất tiếc đã bị từ chối. Vui lòng tham khảo các hạng mục dưới đây để thực hiện các biện pháp tiếp theo:</p><p>Tin nhắn: ${message}</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Thủ tục xác thực ID bị từ chối"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> ${name} thân mến </p><p>Thủ tục đăng ký ngân hàng mới của quý khách đã được tiếp nhận nhưng rất tiếc đã bị từ chối. Vui lòng tham khảo các hạng mục dưới đây để thực hiện các biện pháp tiếp theo:</p><p>Tin nhắn: ${message}</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Thủ tục đăng ký ngân hàng mới bị từ chối"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> ${name} thân mến </p><p>Email này xác nhận rằng gần đây bạn đã thay đổi mật khẩu cho tài khoản của mình. Không có thêm hành động được yêu cầu.<br />Nếu bạn không cho phép thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.<br /></p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Mật khẩu đã được thay đổi"
					},
					"CHANGE_PASSWORD": {
						"html": "<div><p> ${name} thân mến </p><p>Bạn đã yêu cầu thay đổi mật khẩu cho tài khoản của mình.<br />Để xác nhận mật khẩu của bạn đã thay đổi, hãy nhấp vào liên kết bên dưới.<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">Xác nhận thay đổi mật khẩu của tôi</Button></a></div><p>Nếu yêu cầu này được đưa ra do nhầm lẫn, bạn có thể yên tâm bỏ qua nó; không có thay đổi nào sẽ được thực hiện đối với tài khoản của bạn.</p><p>Yêu cầu bắt đầu từ: ${ip}</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "Thay đổi xác nhận mật khẩu"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> ${name} thân mến </p><p> Một giao dịch nạp ${amount} ${currency} vào địa chỉ ví ${api_name} của quý khách đang chờ được xử lý. Vui lòng chờ đợi cho đến khi giao dịch được xác nhận và tiền được nạp vào ví của quý khách. Yêu cầu giao dịch của quý khách cần nhận được ${confirmation} kết quả đồng thuận trên blockchain.</p><p>Số lượng: ${amount} ${currency}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id='network'>Mạng: ${network}</span><br />Phí: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "${currency} Nạp tiền chưa giải quyết"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> ${name} thân mến </p><p> Giao dịch nạp ${currency} với số lượng ${amount} ${currency} đã được xác nhận và hoàn tất thành công. Số tiền đã được cập nhập vào ví ${currency} của quý khách.</p><p>Số lượng: ${amount} ${currency}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id='network'>Mạng: ${network}</span><br />Phí: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "${currency} Nạp tiền hoàn thành"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> ${name} thân mến </p><p>Quý khách vừa thực hiện yêu cầu rút ${amount} ${currency} tới địa chỉ ${address}. Yêu cầu rút tiền của quý khách đang ở trạng thái chờ xử lý và sẽ sớm được thực hiện.</p><p>Số lượng: ${amount} ${currency}<br />Phí: ${fee} ${currency}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id='network'>Mạng: ${network}</span><br /><ul>${explorers}</ul<p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "${currency} Rút tiền chưa giải quyết"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> ${name} thân mến </p><p>Yêu cầu rút ${amount} ${currency} của quý khách đã được thực hiện và số tiền tương ứng đã được chuyển thành công tới địa chỉ ${address}.</p><p>Số lượng: ${amount} ${currency}<br />Phí: ${fee} ${currency}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id='network'>Mạng: ${network}</span><br /><ul>${explorers}</ul><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>",
						"title": "${currency} Rút tiền hoàn thành"
					}
				},
				"zh": {
					"LOGIN": {
						"html": "<div> <p> ${name} </p> <p> 我们已经记录了你的账号的登录信息，具体如下 </p> <div> <div>时间: ${time}</div> <div>国家: ${country}</div> <div>IP 地址: ${ip}</div> </div> <p> 非本人的情况下，请更改你的密码，设置双重身份验证并立即联系我们。 </p> <p> 感谢你的使用<br> ${api_name} 团队 </p> </div>",
						"title": "登录"
					},
					"SIGNUP": {
						"html": "<div> <p> ${name} </p> <p>需要通过点击下面的按钮确认你的邮箱地址。<br> 如果你有任何问题，请随时联系我们，只需回复此邮件即可。</p><p>请点击下方按钮，进行注册</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">确认</Button></a></div><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "注册会员"
					},
					"WELCOME": {
						"html": "<div><p> ${name} </p><p>感谢你在 ${api_name} 进行注册.</p><p>若要进行交易，必须先将加密货币或资金存入你的账户。.前往 <a href=\"${link_account}\" target='_blank'>账号</a> 并访问 <a href=\"${link_deposit}\" target='_blank'>充值</a> 页面。.,</p><p>如果您有任何问题，请回复此邮件与我们进行联系。</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "注册会员"
					},
					"RESET_PASSWORD": {
						"html": "<div><p> ${name} </p><p>你已申请重置密码<br />请点击下方链接，进行密码更新<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\"重置我的密码</Button></a></div><p>如果该请求是错误的，请忽略，并且你的账号不会有任何改变</p><p>提出申请的出处: ${ip}</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "申请重置密码"
					},
					"ACCOUNT_VERIFY": {
						"html": "<div><p> ${name} </p><p>恭喜你，你的账号验证成功。</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">进行交易</Button></a></div><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "账号认证完成"
					},
					"ACCOUNT_UPGRADE": {
						"html": "<div><p> ${name} </p><p>恭喜你，你的账号级别已升级至${tier}，你将可以享受更低的费用、更高的提款限额和其他高级功能。</p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">进行交易</Button></a></div><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "账号升级完成"
					},
					"DEPOSIT_CANCEL": {
						"html": "<div><p> ${name} </p><p>我们无法找到或处理你在${date}存入的${currency}存款${amount}，因此这笔交易已被系统拒绝。</p><p>如果你有任何疑问，请回复此邮件。</p><p>交易 ID: ${txid}<br />金额: ${amount}<br />状态:拒绝</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "${currency} 充值 拒绝"
					},
					"WITHDRAWAL_CANCEL": {
						"html": "<div><p> ${name} </p><p>我们无法找到或处理你的${currency}在${date}提取的${amount}，因此系统拒绝了这一交易，你的待处理提款金额将被退回至${api_name}钱包中。</p><p>如果你有任何疑问，请回复此邮件。</p><p>交易 ID: ${txid}<br />金额: ${amount}<br />状态:拒绝</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "${currency} 提款 拒绝"
					},
					"WITHDRAWAL_REQUEST": {
						"html": "<div><p> ${name} </p><p>你已提出${currency}提款申请，金额为${amount}至${address}。<br /><br />金额: ${amount}<br />手续费: ${fee} ${currency}<br />地址: ${address}<br /><span id='network'>网络: ${network}</span><br /><br />为完成此次提款申请，请点击下方按钮。<br /></p><div style=\"padding-top: 10px; margin-bottom: 10px;\"><a href=\"${link}\" target='_blank'><Button style=\"cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;\">确认</Button></a></div><p>如果该请求是错误的，请忽略，并且你的账号不会有任何改变</p><p>提出申请的出处: ${ip}</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "${currency} 提款 申请"
					},
					"USER_VERIFICATION": {
						"html": "<div><h3>需要用戶驗證</h3><div> 用戶'${email}'上傳了他的文件以供驗證。 請核實他的文件。</div></div>",
						"title": "用户验证"
					},
					"SUSPICIOUS_DEPOSIT": {
						"html": "<div><h3>可疑存款</h3><div>電子郵件為 ${email} 的客戶收到了一筆可疑的 ${currency} 存款。<br />交易 ID: ${txid}<h4>交易數據：</h4><div>${data}</div></div></div>",
						"title": "可疑存款"
					},
					"INVALID_ADDRESS": {
						"html": "<div><p> ${name} </p><p>您的 ${amount} 的 ${currency} 提款被發送到無效地址並被拒絕。</p><p>地址: ${address}</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "取款地址無效"
					},
					"USER_DEACTIVATED": {
						"html": "<div><p>您的帳戶 ${email} 已停用。 在交易所管理員激活之前，您將無法使用您的帳戶。</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "帳戶 ${type}"
					},
					"USER_ACTIVATED": {
						"html": "<div><p>您的帳戶 ${email} 已激活。 您現在可以使用您的帳戶了。</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "帳戶 ${type}"
					},
					"DISCOUNT_UPDATE": {
						"html": "<div><p> ${name} </p><p>您的折扣率已更改為 ${rate}%。 此費率將適用於您的訂單費用。</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "貼現率變化"
					},
					"BANK_VERIFIED": {
						"html": "<div><p> ${name} </p><p>一個待處理的銀行賬戶已經過驗證。 您的有效賬戶現在可用於需要銀行賬戶的兌換操作。</p><div><strong>已驗證的銀行賬戶:</strong>${list_detail_bank_account}</div><p><a href=\"${link_verification}\">要查看您當前的銀行賬戶，請訪問交易所的驗證選項卡</a></p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "銀行認證"
					},
					"USER_ID_VERIFICATION_REJECT": {
						"html": "<div><p> ${name} </p><p>你的ID 认证已处理完毕，但是很遗憾被拒绝。关于进一步的操作，请阅读下方信息:</p><p>消息: ${message}</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "ID 认证拒绝"
					},
					"USER_BANK_VERIFICATION_REJECT": {
						"html": "<div><p> ${name} </p><p>你的新的银行信息申请已被处理，但是很遗憾被拒绝。关于进一步的操作，请阅读下方信息:</p><p>消息: ${message}</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "新的银行信息申请被拒绝"
					},
					"PASSWORD_CHANGED": {
						"html": "<div><p> ${name} </p><p>此電子郵件確認您最近更改了帳戶的密碼。 不需要採取進一步行動。<br />如果您未授權此更改，請立即與我們聯繫。<br /></p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "密碼已更改"
					},
					"DEPOSIT_PENDING": {
						"html": "<div><div><p> ${name} </p><p> 你的${api_name}钱包中有一笔${amount} ${currency}的新存款正在等待处理，待交易被确认后，资金才会进入到你的钱包中，该交易需要在区块链上进行${confirmation}确认。</p><p>金额: ${amount} ${currency}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id='network'>网络: ${network}</span><br />手续费: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "${currency} 存款待處理"
					},
					"DEPOSIT_COMPLETED": {
						"html": "<div><div><p> ${name}  </p><p> 你的${amount} ${currency}存款已完成。你的${currency}可在钱包中进行确认。</p><p>金额: ${amount} ${currency}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id='network'>网络: ${network}</span><br />手续费: ${fee} ${currency}<br /><ul>${explorers}</ul></div><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "${currency} 存款完成"
					},
					"WITHDRAWAL_PENDING": {
						"html": "<div><p> ${name} </p><p>你向该地址${address}申请了${amount} ${currency}的提款请求，该提款地址正在等待处理并会很快得到处理。</p><p>金额: ${amount} ${currency}<br />手续费: ${fee} ${currency}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id='network'>网络: ${network}</span><br /><ul>${explorers}</ul><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "${currency} 提款待處理"
					},
					"WITHDRAWAL_COMPLETED": {
						"html": "<div><p> ${name} </p><p>你的${amount} ${currency}已向该地址${address}提款完毕。</p><p>金额: ${amount} ${currency}<br />手续费: ${fee} ${currency}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id='network'>网络: ${network}</span><br /><ul>${explorers}</ul><p> 感谢你的使用<br> ${api_name} 团队 </p></div>",
						"title": "${currency} 提款完成"
					}
				},
			}
		});
	},
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
