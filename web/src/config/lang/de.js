import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';

export default {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Open Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: 'Sind Sie sicher, dass Sie sich abmelden wollen?',
	ADD_TRADING_PAIR: 'Trading-Paar hinzufügen',
	ACTIVE_TRADES: 'Sie müssen {0}, um auf Ihre aktiven Trades zuzugreifen',
	CANCEL_BASE_WITHDRAWAL: 'Abbrechen {0} Auszahlung',
	CANCEL_WITHDRAWAL: 'Auszahlung abbrechen',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM:
		'Möchten Sie Ihre ausstehende Auszahlung stornieren?:',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'Login',
	SIGN_IN: 'Anmelden',
	SIGNUP_TEXT: 'Registrieren',
	REGISTER_TEXT: 'Registrieren',
	ACCOUNT_TEXT: 'Account',
	HOME_TEXT: 'Startseite',
	CLOSE_TEXT: 'Schließen',
	COPY_TEXT: 'Kopieren',
	COPY_SUCCESS_TEXT: 'Erfolgreich kopiert',
	CANCEL_SUCCESS_TEXT: 'Erfolgreich abgebrochen!',
	UPLOAD_TEXT: 'Hochladen',
	ADD_FILES: 'DATEIEN HINZUFÜGEN', // ToDo
	OR_TEXT: 'Oder',
	CONTACT_US_TEXT: 'Kontaktieren Sie uns',
	HELPFUL_RESOURCES_TEXT: 'Hilfreiche Ressourcen',
	HELP_RESOURCE_GUIDE_TEXT:
		'Für weitere Informationen und bei Fragen können Sie uns gerne eine E-Mail senden',
	HELP_TELEGRAM_TEXT: 'Prüfen Sie die offene API-Dokumentation:',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: 'Brauchen Sie Hilfe?', // new
	HELP_TEXT: 'Hilfe',
	SUCCESS_TEXT: 'Erfolg',
	ERROR_TEXT: 'Fehler',
	PROCEED: 'FORTFAHREN',
	EDIT_TEXT: 'Bearbeiten',
	BACK_TEXT: 'Zurück',
	NO_OPTIONS: 'Es sind keine Optionen verfügbar',
	SECONDS: 'Sekunden',
	VIEW_MARKET: 'Markt ansehen', // new
	GO_TRADE: 'Gehen Sie traden', // new
	VIEW_INFO: 'Info-Seite anzeigen', // new
	APPLY_HERE: 'Hier bewerben', // new
	HOME: {
		SECTION_1_TITLE: 'Willkommen bei HollaEx Exchange Kit!',
		SECTION_1_TEXT_1:
			'Bauen Sie Ihre eigene skalierbare Börse für digitale Vermögenswerte mit dem HollaEx Kit und seien Sie Teil der Zukunft des Finanzwesens.',
		SECTION_1_TEXT_2:
			'Wir streben danach, die Finanztechnologie durch einen erschwinglichen und einfachen Zugang zur Handelstechnologie voranzubringen.',
		SECTION_1_BUTTON_1: 'Mehr erfahren',
		SECTION_3_TITLE: 'Merkmale',
		SECTION_3_CARD_1_TITLE: 'SKALIERBARE MATCHING-ENGINE',
		SECTION_3_CARD_1_TEXT:
			'Leistungsstarke und skalierbare Order-Matching-Engine mit den effizientesten Algorithmen',
		SECTION_3_CARD_2_TITLE: 'BANKINTEGRATION',
		SECTION_3_CARD_2_TEXT:
			'Plugins mit anpassbaren Modulen für die Bankintegration verfügbar. Wir kennen das traditionelle Finanzwesen und können Ihnen helfen, Ihren Austausch lokal zu machen',
		SECTION_3_CARD_3_TITLE: 'HOHE SICHERHEIT',
		SECTION_3_CARD_3_TEXT:
			'HollaEx verwendet die besten Sicherheitspraktiken und die sichersten und zuverlässigsten Algorithmen, um die Guthaben sicher zu halten. Es ist unsere oberste Priorität und wir haben uns ganz besonders darum gekümmert.',
		SECTION_3_CARD_4_TITLE: 'ERWEITERTE BERICHTERSTATTUNG',
		SECTION_3_CARD_4_TEXT:
			'Admin-Panel mit anpassbaren E-Mails und Berichten zur Benachrichtigung von Support und Administrator über den Status des Systems und der Transaktionen.',
		SECTION_3_CARD_5_TITLE: 'SUPPORT',
		SECTION_3_CARD_5_TEXT:
			'Wir kümmern uns um Ihre Bedürfnisse und haben einen Online-Profi, der Ihnen bei Ihren Problemen und Anfragen helfen kann.',
		SECTION_3_CARD_6_TITLE: 'KYC-INTEGRATION',
		SECTION_3_CARD_6_TEXT:
			'Flexible und integrierbare Module zur Anwendung von KYC- und Benutzerverifizierungsmethoden in verschiedenen Rechtsordnungen.',
		SECTION_3_BUTTON_1: 'Demo ansehen',
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'SPRACHE',
		SECTIONS: {
			SECTION_1_TITLE: 'ÜBER',
			SECTION_1_LINK_1: 'Über uns',
			SECTION_1_LINK_2: 'Nutzungsbedingungen',
			SECTION_1_LINK_3: 'Datenschutzrichtlinie',
			SECTION_1_LINK_4: 'Kontaktieren Sie uns',
			SECTION_2_TITLE: 'Informationen',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Kontaktieren Sie uns',
			SECTION_2_LINK_3: 'Karriere',
			SECTION_3_TITLE: 'ENTWICKLER',
			SECTION_3_LINK_1: 'Dokumentation',
			SECTION_3_LINK_2: 'Forum',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'Bibliothek',
			SECTION_3_LINK_5: 'API doc',
			SECTION_3_LINK_6: 'Trading API',
			SECTION_3_LINK_7: 'Entwickler-Tools',
			SECTION_3_LINK_8: 'Dokumentation',
			SECTION_4_TITLE: 'EXCHANGE',
			SECTION_4_LINK_1: 'Anmeldung',
			SECTION_4_LINK_2: 'Registrieren',
			SECTION_4_LINK_3: 'Kontaktieren Sie uns',
			SECTION_4_LINK_4: 'Nutzungsbedingungen',
			SECTION_5_TITLE: 'RESSOURCEN',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'HollaEx Token (XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'HÄUFIG GESTELLTE FRAGEN', // new
			SECTION_6_TITLE: 'SOCIAL',
			SECTION_6_LINK_1: 'Twitter',
			SECTION_6_LINK_2: 'Telegram',
			SECTION_6_LINK_3: 'Facebook', // new
			SECTION_6_LINK_4: 'Instagram', // new
			SECTION_6_LINK_5: 'Linkedin', // new
			SECTION_6_LINK_6: 'Website', // new
			SECTION_6_LINK_7: 'Helpdesk', // new
			SECTION_6_LINK_8: 'Information', // new
			SECTION_6_LINK_9: 'YouTube', // new
		},
		XHT_DESCRIPTION:
			'HollaEx Kit ist eine Open-Source-Handelsplattform, die von bitHolla Inc. entwickelt wurde. Mit diesem Exchange Kit können Sie beliebige digitale Assets erstellen und auflisten und Benutzer für den Handel an Ihrer Börse einbinden. Um einfach einen selbst zu betreiben {1}.',
		CLICK_HERE: 'klicken Sie hier',
		VISIT_HERE: 'besuchen Sie hier',
	},
	ACCOUNTS: {
		TITLE: 'Konto',
		TAB_VERIFICATION: 'Verifizierung',
		TAB_SECURITY: 'Sicherheit',
		TAB_NOTIFICATIONS: 'Benachrichtigungen',
		TAB_SETTINGS: 'Einstellungen',
		TAB_PROFILE: 'Profil',
		TAB_WALLET: 'Geldbörse',
		TAB_SUMMARY: 'Zusammenfassung',
		TAB_HISTORY: 'Verlauf',
		TAB_API: 'API',
		TAB_SIGNOUT: 'Abmelden',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: 'Zugang anfordern',
		REQUEST_INVITE: 'Einladung anfordern',
		CATEGORY_PLACEHOLDER:
			'Wählen Sie die Kategorie, die am besten zu Ihrem Problem passt',
		INTRODUCTION_LABEL: 'Stellen Sie sich vor',
		INTRODUCTION_PLACEHOLDER:
			'Wo sind Sie ansässig? Sind Sie an einem Exchange interessiert?',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'Kategorie',
		CATEGORY_PLACEHOLDER:
			'Wählen Sie die Kategorie, die am besten zu Ihrem Problem passt',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'Benutzerverifizierung',
			OPTION_LEVEL: 'Benutzerlevel erhöhen',
			OPTION_DEPOSIT: 'Einzahlung & Auszahlung',
			OPTION_BUG: 'Fehler melden', // ToDo:
			OPTION_PERSONAL_INFO: 'Persönliche Informationen ändern', // ToDo:
			OPTION_BANK_TRANSFER: 'Banküberweisung', // new
			OPTION_REQUEST: 'Einladung für die XIV Exchange anfordern', // new
		},
		SUBJECT_LABEL: 'Betreff',
		SUBJECT_PLACEHOLDER: 'Geben Sie den Betreff Ihres Problems ein',
		DESCRIPTION_LABEL: 'Beschreibung',
		DESCRIPTION_PLACEHOLDER: 'Geben Sie detailliert an, was das Problem ist',
		ATTACHMENT_LABEL: 'Anhänge hinzufügen (max. 3)', // ToDo:
		ATTACHMENT_PLACEHOLDER:
			'Fügen Sie eine Datei hinzu, um Ihr Problem zu verdeutlichen. PDF-, JPG-, PNG- und GIF-Dateien werden akzeptiert',
		SUCCESS_MESSAGE: 'Die E-Mail wurde an unseren Kundensupport gesendet',
		SUCCESS_TITLE: 'Nachricht gesendet',
		SUCCESS_MESSAGE_1: 'Ihr Problem wurde an den Kundensupport weitergeleitet.',
		SUCCESS_MESSAGE_2: 'Sie können in 1 bis 3 Tagen mit einer Antwort rechnen.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'Ihre {0} Empfangsadresse', // new
			DESTINATION_TAG: 'Ihr {0} Ziel-Etikett', // new
			MEMO: 'Ihr {0} Memo', // new
			BTC: 'Ihre Bitcoin-Empfangsadresse',
			ETH: 'Ihre Ethereum-Empfangsadresse',
			BCH: 'Ihre Bitcoin Cash-Empfangsadresse',
		},
		INCREASE_LIMIT: 'Möchten Sie Ihr Tageslimit erhöhen?',
		QR_CODE:
			'Dieser QR-Code kann von der Person gescannt werden, die Ihnen Geld senden möchte',
		NO_DATA: 'Keine Informationen verfügbar',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: 'Bei {0} anmelden',
		CANT_LOGIN: 'Sie können sich nicht anmelden?',
		NO_ACCOUNT: 'Sie haben noch kein Konto?',
		CREATE_ACCOUNT: 'Erstellen Sie hier ein Konto',
		HELP: 'Hilfe',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'E-Mail',
		EMAIL_PLACEHOLDER: 'Geben Sie Ihre E-Mail Adresse ein',
		PASSWORD_LABEL: 'Passwort',
		PASSWORD_PLACEHOLDER: 'Geben Sie Ihr Passwort ein',
		PASSWORD_REPEAT_LABEL: 'Geben Sie Ihr Passwort erneut ein',
		PASSWORD_REPEAT_PLACEHOLDER: 'Geben Sie Ihr Passwort erneut ein',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'OTP-Code zur Anmeldung bereitstellen',
		CAPTCHA: 'Abgelaufene Sitzung. Bitte aktualisieren Sie die Seite',
		FROZEN_ACCOUNT: 'Dieses Konto ist eingefrorenn',
		INVALID_EMAIL: 'Ungültige E-Mail Adresse',
		TYPE_EMAIL: 'Geben Sie Ihre E-Mail ein',
		REQUIRED: 'Erforderliches Feld',
		INVALID_DATE: 'Ungültiges Datum',
		INVALID_PASSWORD:
			'Ungültiges Passwort. Es muss mindestens 8 Zeichen, eine Ziffer im Passwort und ein Sonderzeichen enthalten.',
		INVALID_PASSWORD_2:
			'Ungültiges Passwort. Es muss mindestens 8 Zeichen, mindestens eine Ziffer und ein Zeichen enthalten.',
		INVALID_CURRENCY: 'Ungültige {0} Adresse ({1})',
		INVALID_BALANCE:
			'Unzureichender Saldo verfügbar ({0}), um den Vorgang durchzuführen ({1}).',
		MIN_VALUE: 'Wert muss {0} oder höher sein.',
		MAX_VALUE: 'Wert muss {0} oder niedriger sein.',
		INSUFFICIENT_BALANCE: 'Unzureichende Balance',
		PASSWORDS_DONT_MATCH: 'Passwort stimmt nicht überein',
		USER_EXIST: 'E-Mail wurde bereits registriert',
		ACCEPT_TERMS:
			'Sie haben den Nutzungsbedingungen und der Datenschutzrichtlinie nicht zugestimmt',
		STEP: 'Ungültiger Wert, Schritt ist {0}',
		ONLY_NUMBERS: 'Wert kann nur Zahlen enthalten',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'Datenschutzrichtlinie',
			SUBTITLE:
				'Zuletzt aktualisiert am 1. April 2019. Ersetzt die vorherige Version in ihrer Gesamtheit.',
			TEXTS: [
				'HollaEx Web ist eine virtuelle Trading-Plattform, die sich zu 100 % im Besitz von bitHolla Inc. befindet. bitHolla Inc (im Folgenden bitHolla genannt) wurde in Seoul, Südkorea, gegründet.',
				'Die Nutzung dieser HollaEx-Website ("Website") und der auf der Website angebotene Service ("Service") unterliegen den auf dieser Seite mit den Allgemeinen Geschäftsbedingungen ("Bedingungen") enthaltenen Bestimmungen. Diese Vereinbarung stellt die gesamte Vereinbarung zwischen den Parteien dar. Alle anderen auf der Website zur Verfügung gestellten Informationen oder mündlich/schriftlich abgegebenen Erklärungen sind von dieser Vereinbarung ausgeschlossen; die Umtauschbestimmungen dienen nur zur Orientierung und stellen keine rechtliche Vereinbarung zwischen den Parteien dar.',
				'Durch den Zugriff, die Ansicht oder das Herunterladen von Informationen von der Website und die Nutzung des von bitHolla bereitgestellten Dienstes bestätigen Sie, dass Sie diese Bedingungen gelesen und verstanden haben und bedingungslos zustimmen, an sie gebunden zu sein. bitHolla kann die Bedingungen jederzeit und ohne vorherige Ankündigung ändern. Sie stimmen zu, dass Sie weiterhin an alle geänderten Bedingungen gebunden sind und dass bitHolla keine Verpflichtung hat, Sie über solche Änderungen zu informieren. Sie erkennen an, dass es in Ihrer Verantwortung liegt, diese Bedingungen regelmäßig auf Änderungen zu überprüfen und dass Ihre fortgesetzte Nutzung der Website und der von bitHolla angebotenen Dienste nach der Veröffentlichung von Änderungen der Bedingungen bedeutet, dass Sie diese Änderungen akzeptieren.',
				'Die Website und das Urheberrecht an allen Texten, Grafiken, Bildern, Software und allen anderen Materialien auf der Website sind Eigentum von bitHolla, einschließlich aller Marken und anderer geistiger Eigentumsrechte in Bezug auf die Materialien und den Service auf der Website. Die Materialien auf dieser Website dürfen nur für den persönlichen Gebrauch und für nicht-kommerzielle Zwecke verwendet werden.',
				'Sie dürfen Auszüge der Website nur für den oben genannten Zweck auf einem Computerbildschirm anzeigen oder ausdrucken, vorausgesetzt, dass Sie alle Urheberrechts- und sonstigen Eigentumshinweise sowie alle bitHolla-Marken oder -Logos beibehalten, wie sie auf dem ersten Ausdruck oder Download angezeigt werden, ohne sie zu ändern, hinzuzufügen oder zu löschen. Sofern nicht ausdrücklich angegeben, dürfen Sie ohne die vorherige schriftliche Genehmigung von bitHolla keine Materialien der Website verändern, modifizieren, reproduzieren, verteilen oder in einem anderen kommerziellen Kontext verwenden.',
				'Sie erkennen an, dass bitHolla und das bitHolla-Logo Warenzeichen von bitHolla Inc. sind. Sie dürfen diese Warenzeichen ohne Änderungen auf dem von dieser Website heruntergeladenen Material in dem oben genehmigten Umfang wiedergeben, aber Sie dürfen sie nicht anderweitig verwenden, kopieren, anpassen oder löschen.',
				'Sie dürfen unter keinen Umständen irgendwelche Rechte über oder in Bezug auf die Website erhalten (außer den Rechten zur Nutzung der Website gemäß diesen Bedingungen und anderen Bedingungen, die einen bestimmten Dienst oder Abschnitt der Website regeln) oder sich als Inhaber solcher Rechte über oder in Bezug auf die Website ausgeben.',
			],
		},
		GENERAL_TERMS: {
			TITLE: 'Allgemeine Geschäftsbedingungen',
			SUBTITLE:
				'Zuletzt aktualisiert am 1. April 2019. Ersetzt die vorherige Version in vollem Umfang.',
			TEXTS: [
				'HollaEx Web ist eine virtuelle Trading-Plattform, die sich zu 100 % im Besitz von bitHolla Inc. befindet. bitHolla Inc (im Folgenden bitHolla genannt) wurde in Seoul, Südkorea, gegründet.',
				'Die Nutzung dieser HollaEx-Website ("Website") und der auf der Website angebotene Service ("Service") unterliegen den auf dieser Seite mit den Allgemeinen Geschäftsbedingungen ("Bedingungen") enthaltenen Bestimmungen. Diese Vereinbarung stellt die gesamte Vereinbarung zwischen den Parteien dar. Alle anderen auf der Website zur Verfügung gestellten Informationen oder mündlich/schriftlich abgegebenen Erklärungen sind von dieser Vereinbarung ausgeschlossen; die Umtauschbestimmungen dienen nur zur Orientierung und stellen keine rechtliche Vereinbarung zwischen den Parteien dar.',
				'Durch den Zugriff, die Ansicht oder das Herunterladen von Informationen von der Website und die Nutzung des von bitHolla bereitgestellten Dienstes bestätigen Sie, dass Sie diese Bedingungen gelesen und verstanden haben und bedingungslos zustimmen, an sie gebunden zu sein. bitHolla kann die Bedingungen jederzeit und ohne vorherige Ankündigung ändern. Sie stimmen zu, dass Sie weiterhin an alle geänderten Bedingungen gebunden sind und dass bitHolla keine Verpflichtung hat, Sie über solche Änderungen zu informieren. Sie erkennen an, dass es in Ihrer Verantwortung liegt, diese Bedingungen regelmäßig auf Änderungen zu überprüfen und dass Ihre fortgesetzte Nutzung der Website und der von bitHolla angebotenen Dienste nach der Veröffentlichung von Änderungen der Bedingungen bedeutet, dass Sie diese Änderungen akzeptieren.',
				'Die Website und das Urheberrecht an allen Texten, Grafiken, Bildern, Software und allen anderen Materialien auf der Website sind Eigentum von bitHolla, einschließlich aller Marken und anderer geistiger Eigentumsrechte in Bezug auf die Materialien und den Service auf der Website. Die Materialien auf dieser Website dürfen nur für den persönlichen Gebrauch und für nicht-kommerzielle Zwecke verwendet werden.',
				'Sie dürfen Auszüge der Website nur für den oben genannten Zweck auf einem Computerbildschirm anzeigen oder ausdrucken, vorausgesetzt, dass Sie alle Urheberrechts- und sonstigen Eigentumshinweise sowie alle bitHolla-Marken oder -Logos beibehalten, wie sie auf dem ersten Ausdruck oder Download angezeigt werden, ohne sie zu ändern, hinzuzufügen oder zu löschen. Sofern nicht ausdrücklich angegeben, dürfen Sie ohne die vorherige schriftliche Genehmigung von bitHolla keine Materialien der Website verändern, modifizieren, reproduzieren, verteilen oder in einem anderen kommerziellen Kontext verwenden.',
				'Sie erkennen an, dass bitHolla und das bitHolla-Logo Warenzeichen von bitHolla Inc. sind. Sie dürfen diese Warenzeichen ohne Änderungen auf dem von dieser Website heruntergeladenen Material in dem oben genehmigten Umfang wiedergeben, aber Sie dürfen sie nicht anderweitig verwenden, kopieren, anpassen oder löschen.',
				'Sie dürfen unter keinen Umständen irgendwelche Rechte über oder in Bezug auf die Website erhalten (außer den Rechten zur Nutzung der Website gemäß diesen Bedingungen und anderen Bedingungen, die einen bestimmten Dienst oder Abschnitt der Website regeln) oder sich als Inhaber solcher Rechte über oder in Bezug auf die Website ausgeben.',
			],
		},
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'Okay',
			START_TRADING: 'Handel beginnen',
			SEE_HISTORY: 'siehe Verlauf',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} Einzahlung erhalten',
			TITLE_INCOMING: 'Eingehend {0}',
			SUBTITLE_RECEIVED: 'Sie haben Ihre {0} Einzahlung erhalten',
			SUBTITLE_INCOMING: 'Sie haben eingehende {0}',
			INFORMATION_PENDING_1:
				'Ihre {0} benötigen 1 Bestätigungen, bevor Sie mit dem Handel beginnen können.',
			INFORMATION_PENDING_2:
				'Dies kann 10-30 Minuten dauern. Wir senden eine E-Mail, sobald Ihre {0} in der Blockchain bestätigt wurde.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: 'Anfrage gesendet',
		BUTTON_TEXT: 'Okay',
	},
	OTP_FORM: {
		OTP_FORM_TITLE:
			'Geben Sie Ihren Authentifizierungscode ein, um fortzufahren',
		OTP_LABEL: 'OTP-Code',
		OTP_PLACEHOLDER: 'Geben Sie den Authentifizierungscode ein',
		OTP_TITLE: 'Authentifizierungscode',
		OTP_HELP: 'Hilfe',
		OTP_BUTTON: 'einreichen',
		ERROR_INVALID: 'Ungültiger OTP-Code',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Quick',
		TOTAL_COST: 'Gesamtkosten',
		BUTTON: 'Überprüfung {0} Auftrag',
		INPUT: '{0} bis {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: 'vorherige Seite',
	NEXT_PAGE: 'nächste Seite',
	WALLET: {
		LOADING_ASSETS: 'Assets werden geladen...', // new
		TOTAL_ASSETS: 'Gesamtvermögen',
		AVAILABLE_WITHDRAWAL: 'Für den Handel verfügbar',
		AVAILABLE_TRADING: 'Für Entnahme verfügbar',
		ORDERS_PLURAL: 'orders',
		ORDERS_SINGULAR: 'order',
		HOLD_ORDERS:
			'Sie haben {0} offen {1}, was zu einem Halt von {2} {3} auf Ihrem {4} Saldo führt',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'Konto-Wiederherstellung',
		SUBTITLE: `Stellen Sie Ihr Konto unten wieder her`,
		SUPPORT: 'Kontaktieren Sie den Kundendienst.',
		BUTTON: 'Wiederherstellungslink senden',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'Passwortrücksetzung gesendet',
		TEXT:
			'Wenn für die E-Mail-Adresse ein Konto existiert, wurde eine E-Mail mit Anweisungen zum Zurücksetzen an diese Adresse gesendet. Bitte prüfen Sie Ihre E-Mail und klicken Sie auf den Link, um das Zurücksetzen des Passworts abzuschließen.',
	},
	RESET_PASSWORD: {
		TITLE: 'Neues Passwort festlegen',
		SUBTITLE: 'Neues Passwort festlegen',
		BUTTON: 'Neues Passwort festlegen',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'Sie haben erfolgreich ein neues Passwort eingerichtet.',
		TEXT_2: 'Klicken Sie unten auf Login, um fortzufahren.',
	},
	SIGN_UP: {
		SIGNUP_TO: 'Registrieren Sie sich bei {0}',
		NO_EMAIL: 'Haben Sie die E-Mail nicht erhalten?',
		REQUEST_EMAIL: 'Hier ein weitere E-Mail anfordern',
		HAVE_ACCOUNT: 'Sie haben bereits ein Konto?',
		GOTO_LOGIN: 'Gehen Sie zur Anmeldeseite',
		AFFILIATION_CODE: 'Empfehlungscode (optional)',
		AFFILIATION_CODE_PLACEHOLDER: 'Geben Sie Ihren Empfehlungscode ein',
		TERMS: {
			terms: 'Allgemeine Bedingungen',
			policy: 'Datenschutzrichtlinie',
			text: 'Ich habe die {0} und {1} gelesen und stimme ihnen zu.',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'E-Mail gesendet',
		TEXT_1:
			'Prüfen Sie Ihre E-Mail und klicken Sie auf den Link, um Ihre E-Mail zu verifizieren.',
		TEXT_2:
			'If you have not received any email verification and you have checked your junk mail then you can try clicking resend below.',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'E-Mail-Anfrage erneut senden',
		BUTTON: 'E-Mail anfordern',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'E-Mail erneut senden',
		TEXT_1:
			'Wenn Sie nach einigen Minuten immer noch keine E-Mail-Bestätigung erhalten haben, kontaktieren Sie uns bitte unten.',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'Ungültiger Code',
		TEXT_1: 'Sie haben Ihre E-Mail erfolgreich verifiziert.',
		TEXT_2: 'Sie können nun zur Anmeldung fortfahren.',
	},
	USER_VERIFICATION: {
		INFO_TXT:
			'Hier können Sie Ihren Fortschritt auf dem Weg zur Verifizierung und zu einem Konto-Upgrade überwachen.',
		INFO_TXT_1:
			'Bitte übermitteln Sie die relevanten Informationen, die für jeden Abschnitt unten benötigt werden. Erst wenn alle Abschnitte ausgefüllt sind, werden Ihre Informationen geprüft und für ein Konto-Upgrade genehmigt.',
		INFO_TXT_2:
			'* Für die Verifizierung des Identitätsabschnitts benötigen Sie {0} bestimmte Dokumente.',
		DOCUMENTATIONS: 'upload',
		COMPLETED: 'Abgeschlossen',
		PENDING_VERIFICATION: 'Ausstehende Überprüfung',
		TITLE_EMAIL: 'E-Mail',
		MY_EMAIL: 'Meine E-mail',
		MAKE_FIRST_DEPOSIT: 'Erste Einzahlung vornehmen', // new
		OBTAIN_XHT: 'XHT erhalten', // new
		TITLE_USER_DOCUMENTATION: 'Identifikation',
		TITLE_ID_DOCUMENTS: 'Upload',
		TITLE_BANK_ACCOUNT: 'Bankkonto',
		TITLE_MOBILE_PHONE: 'Mobiltelefon',
		TITLE_PERSONAL_INFORMATION: 'Persönliche Informationen',
		VERIFY_EMAIL: 'E-Mail verifizieren',
		VERIFY_MOBILE_PHONE: 'Mobiltelefon verifizieren',
		VERIFY_USER_DOCUMENTATION: 'Benutzerdokumentation überprüfen',
		VERIFY_ID_DOCUMENTS: 'Ausweisdokumente prüfen',
		VERIFY_BANK_ACCOUNT: 'Bankkonto überprüfen',
		BUTTON: 'Verifizierungsanfrage einreichen',
		TITLE_IDENTITY: 'Identität',
		TITLE_MOBILE: 'Mobiltelefon',
		TITLE_MOBILE_HEADER: 'Mobiltelefon-Nummer',
		TITLE_BANK: 'Bank',
		TITLE_BANK_HEADER: 'Bankverbindung',
		CHANGE_VALUE: 'Wert ändern',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'Ihre persönlichen Daten werden bearbeitet.',
		PENDING_VERIFICATION_BANK: 'Ihre Bankverbindung wird überprüft',
		PENDING_VERIFICATION_DOCUMENTS: 'Ihre Dokumente werden geprüft',
		GOTO_VERIFICATION: 'Zur Verifizierung gehen',
		GOTO_WALLET: 'Zur Geldbörse gehen', // new
		CONNECT_BANK_ACCOUNT: 'Bankkonto verbinden',
		ACTIVATE_2FA: '2FA aktivieren',
		INCOMPLETED: 'Unvollständig',
		BANK_VERIFICATION: 'Bank Verifizierung',
		IDENTITY_VERIFICATION: 'Identitätsverifizierung',
		PHONE_VERIFICATION: 'Telefonverifizierung',
		DOCUMENT_VERIFICATION: 'Dokumentenverifizierung',
		START_BANK_VERIFICATION: 'Bankverifizierung starten',
		START_IDENTITY_VERIFICATION: 'Identitätsverifizierung starten',
		START_PHONE_VERIFICATION: 'Telefonverifizierung starten',
		START_DOCUMENTATION_SUBMISSION: 'Dokumentationsübermittlung beginnen',
		GO_BACK: 'Zurück',
		BANK_VERIFICATION_TEXT_1:
			'Sie können bis zu 3 Bankkonten hinzufügen. Bei internationalen Bankkonten müssen Sie den Kundensupport kontaktieren und haben begrenzte Abhebungslimits.',
		BANK_VERIFICATION_TEXT_2:
			'Durch die Verifizierung Ihres Bankkontos können Sie Folgendes erhalten:',
		BASE_WITHDRAWAL: 'Fiat Abhebung',
		BASE_DEPOSITS: 'Fiat Anlagen',
		ADD_ANOTHER_BANK_ACCOUNT: 'Weiteres Bankkonto hinzufügen',
		BANK_NAME: 'Bank Name',
		ACCOUNT_NUMBER: 'Kontonummer',
		CARD_NUMBER: 'Kartennummer',
		BANK_VERIFICATION_HELP_TEXT:
			'Damit dieser Abschnitt verifiziert werden kann, müssen Sie den Abschnitt {0} ausfüllen.',
		DOCUMENT_SUBMISSION: 'Dokument einreichen',
		REVIEW_IDENTITY_VERIFICATION: 'Überprüfung der Identitätsverifizierung',
		PHONE_DETAILS: 'Telefon Details',
		PHONE_COUNTRY_ORIGIN: 'Tel. Anwendungsland',
		MOBILE_NUMBER: 'Handy-Nummer',
		DOCUMENT_PROOF_SUBMISSION: 'Einreichung von Dokumentenbeweisen',
		START_DOCUMENTATION_RESUBMISSION: 'Start Dokumentation Neueinreichung',
		SUBMISSION_PENDING_TXT:
			'*Dieser Abschnitt wurde bereits übermittelt. Wenn Sie Änderungen vornehmen und erneut übermitteln, werden Ihre vorherigen Informationen überschrieben.',
		CUSTOMER_SUPPORT_MESSAGE: 'Meldung des Kundendienstes',
		DOCUMENT_PENDING_NOTE:
			'Ihre Dokumente sind eingereicht und warten auf die Überprüfung. Bitte haben Sie etwas Geduld.',
		DOCUMENT_VERIFIED_NOTE: 'Ihre Dokumente sind vollständig.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: 'Hinweis aus der Verifikationsabteilung',
		CODE_EXPIRES_IN: 'Code läuft ab in',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'Vorname',
				FIRST_NAME_PLACEHOLDER:
					'Geben Sie Ihren Vornamen so ein, wie er in Ihrem Ausweisdokument steht',
				LAST_NAME_LABEL: 'Nachname',
				LAST_NAME_PLACEHOLDER:
					'Geben Sie Ihren Nachnamen so ein, wie er in Ihrem Ausweisdokument steht',
				FULL_NAME_LABEL: 'Ihr vollständiger Name',
				FULL_NAME_PLACEHOLDER:
					'Geben Sie Ihren vollständigen Namen ein, wie er in Ihrem Ausweisdokument steht',
				GENDER_LABEL: 'Geschlecht',
				GENDER_PLACEHOLDER: 'Geben Sie an, welches Geschlecht Sie haben',
				GENDER_OPTIONS: {
					MAN: 'Männlich',
					WOMAN: 'Weiblich',
				},
				NATIONALITY_LABEL: 'Nationalität',
				NATIONALITY_PLACEHOLDER:
					'Geben Sie ein, welche Nationalität in Ihrem Ausweisdokument steht',
				DOB_LABEL: 'Geburtsdatum',
				COUNTRY_LABEL: 'Land Ihres Wohnsitzes',
				COUNTRY_PLACEHOLDER:
					'Wählen Sie das Land aus, in dem Sie sich derzeit befinden.',
				CITY_LABEL: 'Stadt',
				CITY_PLACEHOLDER: 'Geben Sie die Stadt ein, in der Sie wohnen',
				ADDRESS_LABEL: 'Adresse',
				ADDRESS_PLACEHOLDER: 'Geben Sie die Adresse ein, wo Sie derzeit wohnen',
				POSTAL_CODE_LABEL: 'Postleitzahl',
				POSTAL_CODE_PLACEHOLDER: 'Geben Sie Ihre Postleitzahl ein',
				PHONE_CODE_LABEL: 'Land',
				PHONE_CODE_PLACEHOLDER:
					'Wählen Sie das Land, in dem Ihr Telefon angemeldet ist',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: 'Telefonnummer',
				PHONE_NUMBER_PLACEHOLDER: 'Geben Sie Ihre Telefonnummer ein',
				CONNECTING_LOADING: 'Verbinden',
				SMS_SEND: 'SMS senden',
				SMS_CODE_LABEL: 'SMS-Code',
				SMS_CODE_PLACEHOLDER: 'Geben Sie Ihren SMS-Code ein',
			},
			INFORMATION: {
				TEXT:
					'WICHTIG: Geben Sie Ihren Namen genau so in die Felder ein, wie er in Ihrem Ausweisdokument steht (vollständiger Vorname, eventuelle Zweitnamen/Initialen und vollständiger Nachname(n)). Sind Sie ein Unternehmen? Wenden Sie sich an den Kundensupport für ein Firmenkonto.',
				TITLE_PERSONAL_INFORMATION: 'Persönliche Informationen',
				TITLE_PHONE: 'Handy',
				PHONE_VERIFICATION_TXT:
					'Die Angabe gültiger Kontaktdaten hilft uns sehr bei der Konfliktlösung und verhindert unerwünschte Transaktionen auf Ihrem Konto.',
				PHONE_VERIFICATION_TXT_1:
					'Erhalten Sie Echtzeit-Updates für Ein- und Auszahlungen, indem Sie Ihre Handynummer mitteilen.',
				PHONE_VERIFICATION_TXT_2:
					'Beweisen Sie außerdem Ihre Identität und Adresse, indem Sie Ihre LAN-Telefonnummer angeben (optional).',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'Bitte wählen Sie eine Art von Ausweisdokument',
				ID_NUMBER: 'Bitte geben Sie Ihre Dokumentennummer ein',
				ISSUED_DATE:
					'Bitte wählen Sie das Datum, an dem Ihr Dokument ausgestellt wurde',
				EXPIRATION_DATE:
					'Bitte wählen Sie das Datum, an dem Ihr Dokument abläuft',
				FRONT: 'Bitte laden Sie eine Kopie Ihres Reisepasses hoch',
				PROOF_OF_RESIDENCY:
					'Bitte laden Sie eine Kopie des Dokuments hoch, das Ihren aktuellen Wohnsitz belegt',
				SELFIE_PHOTO_ID:
					'Bitte laden Sie ein Selfie mit Reisepass und Notiz hoch',
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'Dokument-ID Typ',
				TYPE_PLACEHOLDER: 'Art des Ausweises wählen',
				TYPE_OPTIONS: {
					ID: 'ID',
					PASSPORT: 'Reisepass',
				},
				ID_NUMBER_LABEL: 'Reisepassnummer',
				ID_NUMBER_PLACEHOLDER: 'Geben Sie Ihre Reisepassnummer ein',
				ID_PASSPORT_NUMBER_LABEL: 'Reisepassnummer',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'Geben Sie Ihre Reisepassnummer ein',
				ISSUED_DATE_LABEL: 'Ausstellungsdatum des Reisepasses',
				EXPIRATION_DATE_LABEL: 'Ablaufdatum des Reisepasses',
				FRONT_LABEL: 'Reisepass',
				FRONT_PLACEHOLDER: 'Fügen Sie eine Kopie Ihres Reisepasses hinzu',
				BACK_LABEL: 'Rückseite des Passes',
				BACK_PLACEHOLDER:
					'Fügen Sie eine Kopie der Rückseite Ihres Ausweises hinzu (falls zutreffend)',
				PASSPORT_LABEL: 'Reisepass-Dokument',
				PASSPORT_PLACEHOLDER: 'Fügen Sie eine Kopie Ihres Passdokuments hinzu',
				POR_LABEL: 'Dokument zum Nachweis Ihrer Adresse',
				POR_PLACEHOLDER:
					'Fügen Sie eine Kopie eines Dokuments hinzu, das Ihre Adresse belegt',
				SELFIE_PHOTO_ID_LABEL: 'Ihr Selfie mit Reisepass und Notiz',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'Fügen Sie eine Kopie Ihres Selfies mit Reisepass und Notiz hinzu',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'Ausweisdokument',
				PROOF_OF_RESIDENCY: 'Wohnsitznachweis',
				ID_SECTION: {
					TITLE: 'Bitte stellen Sie sicher, dass Ihre eingereichten Dokumente:',
					LIST_ITEM_1:
						'HOHE QUALITÄT (Farbbilder, 300dpi Auflösung oder höher) sind.',
					LIST_ITEM_2:
						'VOLLSTÄNDIG SICHTBAR (Wasserzeichen sind erlaubt) sind.',
					LIST_ITEM_3:
						'GÜLTIG, mit deutlich sichtbarem Gültigkeitsdatum, sind.',
					WARNING_1:
						'Es wird nur ein gültiger Reisepass akzeptiert; Fotos in hoher Qualität oder gescannte Bilder dieser Dokumente sind akzeptabel:',
					WARNING_2:
						'Stellen Sie sicher, dass Sie Ihre eigenen Dokumente hochladen. Jede Verwendung von falschen oder gefälschten Dokumenten hat rechtliche Konsequenzen und führt zur sofortigen Sperrung Ihres Kontos.',
					WARNING_3:
						'Reichen Sie bitte nicht den Reisepass als Wohnsitznachweis ein.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'Um Verzögerungen bei der Verifizierung Ihres Kontos zu vermeiden, stellen Sie bitte sicher:',
					SECTION_1_TEXT_2:
						'NAME, ADRESSE, AUSGABEDATUM und AUSSTELLER gut sichtbar sind.',
					SECTION_1_TEXT_3:
						'Das eingereichte Dokument zum Nachweis des Wohnsitzes NICHT ÄLTER ALS DREI MONATE ist.',
					SECTION_1_TEXT_4:
						'Sie Farbfotos oder gescannte Bilder in HOHER QUALITÄT (mindestens 300 DPI) eingereicht haben',
					SECTION_2_TITLE: 'EIN AKZEPTABLER WOHNSITZNACHWEIS IST:',
					SECTION_2_LIST_ITEM_1: 'Ein Bankkontoauszug.',
					SECTION_2_LIST_ITEM_2:
						'Eine Rechnung des Versorgungsunternehmens (Strom, Wasser, Internet, etc.).',
					SECTION_2_LIST_ITEM_3:
						'Ein von der Regierung ausgestelltes Dokument (Steuererklärung, Wohnsitzbescheinigung usw.).',
					WARNING:
						'Wir können die Adresse auf Ihrem eingereichten Ausweisdokument nicht als gültigen Wohnsitznachweis akzeptieren.',
				},
				SELFIE: {
					TITLE: 'Selfie mit Reisepass und Notiz',
					INFO_TEXT:
						"Bitte stellen Sie ein Foto zur Verfügung, auf dem Sie Ihren Reisepass halten. Im gleichen Bild und haben einen Hinweis auf die Austausch-Url', das heutige Datum und Ihre Unterschrift angezeigt. Achten Sie darauf, dass Ihr Gesicht deutlich zu sehen ist und Ihre Ausweisdaten gut lesbar sind.",
					REQUIRED: 'Erforderlich:',
					INSTRUCTION_1: 'Ihr Gesicht muss deutlich sichtbar sein',
					INSTRUCTION_2: 'Reisepass muss deutlich lesbar sein',
					INSTRUCTION_3: 'Schreiben Sie den Namen des Exchange.',
					INSTRUCTION_4: 'Schreiben Sie das heutige Datum',
					INSTRUCTION_5: 'Unterschreiben Sie die Notiz.',
					WARNING:
						'Selfie mit einem anderen Reisepass mit hochgeladenem Inhalt wird abgelehnt',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'Bitte geben Sie Ihren Vor- und Nachnamen ein, wie er mit Ihrem Bankkonto verbunden ist',
				ACCOUNT_NUMBER:
					'Ihre Bankkontonummer sollte weniger als 50 Ziffern haben',
				ACCOUNT_NUMBER_MAX_LENGTH:
					'Ihre Bankkontonummer hat ein Limit von 50 Zeichen',
				CARD_NUMBER: 'Ihre Kartennummer hat ein falsches Format',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'Bank Name',
				BANK_NAME_PLACEHOLDER: 'Geben Sie den Namen Ihrer Bank ein',
				ACCOUNT_NUMBER_LABEL: 'Bankkontonummer',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Geben Sie Ihre Bankkontonummer ein',
				ACCOUNT_OWNER_LABEL: 'Name des Bankkontoinhabers',
				ACCOUNT_OWNER_PLACEHOLDER: 'Type the name as on your bank account',
				CARD_NUMBER_LABEL: 'Bankkartennummer',
				CARD_NUMBER_PLACEHOLDER:
					'Geben Sie die 16-stellige Nummer ein, die sich auf der Vorderseite Ihrer Bankkarte befindet',
			},
		},
		WARNING: {
			TEXT_1:
				'Durch die Verifizierung Ihrer Identität können Sie Folgendes erhalten:',
			LIST_ITEM_1: 'Erhöhte Abhebungslimits',
			LIST_ITEM_2: 'Erhöhte Einzahlungslimits',
			LIST_ITEM_3: 'Niedrigere Gebühren',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			'Ändern Sie die Einstellungen Ihres Kontos. Von Schnittstelle, Benachrichtigungen, Benutzername und anderen Anpassungen.',
		TITLE_TEXT_2:
			'Wenn Sie die Einstellungen speichern, werden die Änderungen übernommen und gespeichert.',
		TITLE_NOTIFICATION: 'Benachrichtigung',
		TITLE_INTERFACE: 'Interface',
		TITLE_LANGUAGE: 'Sprache',
		TITLE_CHAT: 'Chat',
		TITLE_AUDIO_CUE: 'Audio-Cue abspielen', // new
		TITLE_MANAGE_RISK: 'Risikomanagement',
		ORDERBOOK_LEVEL: 'Auftragsbuch-Ebenen (max. 20)',
		SET_TXT: 'SET',
		CREATE_ORDER_WARING: 'Auftragswarnung erstellen',
		RISKY_TRADE_DETECTED: 'Riskanter Handel erkannt',
		RISKY_WARNING_TEXT_1:
			'Dieser Auftragswert liegt über dem von Ihnen festgelegten Auftragslimitbetrag {0} .',
		RISKY_WARNING_TEXT_2: '({0} des Portfolios)',
		RISKY_WARNING_TEXT_3:
			' Bitte prüfen und bestätigen Sie, dass Sie diesen Handel tatsächlich durchführen möchten.',
		GO_TO_RISK_MANAGMENT: 'ZUM RISIKOMANAGEMENT GEHEN',
		CREATE_ORDER_WARING_TEXT:
			'Erstellen eines Warn-Pop-ups, wenn Ihr Handelsauftrag mehr als {0} Ihres Portfolios verwendet',
		ORDER_PORTFOLIO_LABEL: 'Prozentualer Anteil des Portfolios:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'Handel Pop-ups',
			POPUP_ORDER_CONFIRMATION:
				'Vor dem Absenden von Bestellungen um Bestätigung bitten',
			POPUP_ORDER_COMPLETED:
				'Pop-up anzeigen, wenn die Bestellung abgeschlossen ist',
			POPUP_ORDER_PARTIALLY_FILLED:
				'Pop-up anzeigen, wenn der Auftrag teilweise gefüllt ist',
		},
		AUDIO_CUE_FORM: {
			// new
			ALL_AUDIO: 'Alle Audio-Cues',
			PUBLIC_TRADE_AUDIO: 'Wenn ein öffentlicher Handel stattgefunden hat',
			ORDERS_PARTIAL_AUDIO: 'Wenn einer Ihrer Aufträge teilweise erfüllt ist',
			ORDERS_PLACED_AUDIO: 'Wenn eine Bestellung aufgegeben wird',
			ORDERS_CANCELED_AUDIO: 'Wenn ein Auftrag storniert wird',
			ORDERS_COMPLETED_AUDIO:
				'Wenn einer Ihrer Aufträge vollständig gefüllt ist',
			CLICK_AMOUNTS_AUDIO:
				'Wenn Sie Beträge und Preise im Auftragsbuch anklicken',
			GET_QUICK_TRADE_AUDIO: 'Wenn Sie ein Angebot für das Protrading einholen',
			SUCCESS_QUICK_TRADE_AUDIO:
				'Wenn ein erfolgreicher Quick-Trade stattfindet',
			QUICK_TRADE_TIMEOUT_AUDIO: 'Wenn Quick-Trade-Timeout ',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'Erstellen Sie ein Warn-Popup, wenn der Wert eines Handelsauftrags einen bestimmten Prozentsatz Ihres Portfolios überschreitet',
			INFO_TEXT_1: 'Gesamtwert der Vermögenswerte in {0}: {1}',
			PORTFOLIO: 'Prozentsatz des Portfolios',
			TOMAN_ASSET: 'Ungefährer Wert',
			ADJUST: '(PROZENTSATZ ANPASSEN)',
			ACTIVATE_RISK_MANAGMENT: 'Aktivieren Sie das Risikomanagement',
			WARNING_POP_UP: 'Warn-Pop-ups',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'Verlauf',
		TITLE_TRADES: 'Trades Verlaufsdaten',
		TITLE_DEPOSITS: 'Verlaufsdaten der Einzahlungen',
		TITLE_WITHDRAWALS: 'Verlaufsdaten der Abhebungen',
		TEXT_DOWNLOAD: 'DOWNLOAD-HISTORIE',
		TRADES: 'Trades',
		DEPOSITS: 'Einzahlungen',
		WITHDRAWALS: 'Abhebungen',
	},
	ACCOUNT_SECURITY: {
		OTP: {
			TITLE: 'Zwei-Faktor-Authentifizierung',
			OTP_ENABLED: 'otp aktiviert',
			OTP_DISABLED: 'BITTE SCHALTEN SIE DIE 2FA FUNKTION EIN',
			ENABLED_TEXTS: {
				TEXT_1: 'OTP bei der Anmeldung verlangen',
				TEXT_2: 'OTP beim Abheben von Geldern verlangen',
			},
			DIALOG: {
				SUCCESS: 'Sie haben das OTP erfolgreich aktiviert',
				REVOKE: 'Sie haben Ihr OTP erfolgreich widerrufen',
			},
			CONTENT: {
				TITLE: 'Aktivieren der Zwei-Faktor-Authentifizierung',
				MESSAGE_1: 'Scannen',
				MESSAGE_2:
					'Scannen Sie den QR Code unten mit Google Authenticator oder Authy, um automatisch die Zwei-Faktor-Authentifizierung in Ihrem Gerät einzurichten.',
				MESSAGE_3:
					'Wenn Sie Probleme beim Scannen haben, können Sie den Code manuell eingeben',
				MESSAGE_4:
					'Sie können diesen Code sicher speichern, um Ihren 2FA wiederherzustellen, falls Sie Ihr Mobiltelefon in Zukunft wechseln oder verlieren.',
				MESSAGE_5: 'Anleitung',
				INPUT: 'Einmaliges Passwort (OTP) eingeben',
				WARNING:
					'Wir empfehlen Ihnen dringend, die 2-Faktor-Authentifizierung (2FA) einzurichten. Dadurch wird die Sicherheit Ihrer Gelder erheblich erhöht.',
				ENABLE: 'Aktivieren der Zwei-Faktoren-Authentifizierung',
				DISABLE: 'Zwei-Faktor-Authentifizierung deaktivieren',
			},
			FORM: {
				PLACEHOLDER:
					'Geben Sie Ihr von Google Authenticator bereitgestelltes OTP ein.',
				BUTTON: '2FA aktivieren',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'Passwort ändern',
			ACTIVE: 'AKTIV',
			DIALOG: {
				SUCCESS: 'Sie haben Ihr Passwort erfolgreich geändert',
			},
			FORM: {
				BUTTON: 'Passwort ändern',
				CURRENT_PASSWORD: {
					label: 'Aktuelles Passwort',
					placeholder: 'Geben Sie Ihr aktuelles Passwort ein',
				},
				NEW_PASSWORD: {
					label: 'Neues Passwort',
					placeholder: 'Geben Sie ein neues Passwort ein',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'Neues Passwort bestätigen',
					placeholder: 'Geben Sie Ihr neues Passwort erneut ein',
				},
			},
		},
	},
	CURRENCY: 'Währung',
	TYPE: 'Typ',
	TYPES_VALUES: {
		market: 'Markt',
		limit: 'Limit',
	},
	TYPES: [
		{ value: 'market', label: 'Markt' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'limit', label: 'Limit' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIDE: 'Seite',
	SIDES_VALUES: {
		buy: 'kaufen',
		sell: 'verkaufen',
	},
	SIDES: [
		{ value: 'buy', label: 'kaufen' },
		{ value: 'sell', label: 'verkaufen' },
	], // DO NOT CHANGE value, ONLY TRANSLATE label
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'an' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: false, label: 'aus' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIZE: 'Größe',
	PRICE: 'Preis',
	FEE: 'Gebühr',
	FEES: 'Gebühren',
	LIMIT: 'Limit',
	TIME: 'Zeit',
	TIMESTAMP: 'Zeitstempel',
	MORE: 'Mehr',
	VIEW: 'Ansicht',
	STATUS: 'Status',
	AMOUNT: 'Betrag',
	COMPLETE: 'Vollständig',
	PENDING: 'Ausstehend',
	REJECTED: 'Abgelehnt',
	ORDERBOOK: 'Auftragsbuch',
	CANCEL: 'Abbrechen',
	CANCEL_ALL: 'Alles abbrechen',
	GO_TRADE_HISTORY: 'Zur Transaktionshistorie gehen',
	ORDER_ENTRY: 'Auftragseingang',
	TRADE_HISTORY: 'Historie',
	CHART: 'Kurschart',
	ORDERS: 'Meine aktiven Aufträge',
	TRADES: 'Meine Transaktionshistorie',
	RECENT_TRADES: 'Meine letzten Trades', // ToDo
	PUBLIC_SALES: 'öffentliche Verkäufe', // ToDo
	REMAINING: 'Verbleibend',
	FULLFILLED: '{0} % Erfüllt',
	FILLED: 'Gefüllt', // new
	LOWEST_PRICE: 'Niedrigster Preis ({0})', // new
	PHASE: 'Phase', // new
	INCOMING: 'Eingehend', // new
	PRICE_CURRENCY: 'PREIS',
	AMOUNT_SYMBOL: 'BETRAG',
	MARKET_PRICE: 'Marktpreis',
	ORDER_PRICE: 'Bestellpreis',
	TOTAL_ORDER: 'Order Total',
	NO_DATA: 'Keine Daten',
	LOADING: 'Laden',
	CHART_TEXTS: {
		d: 'Datum',
		o: 'Open',
		h: 'Hoch',
		l: 'Tief',
		c: 'Schließen',
		v: 'Volumen',
	},
	QUICK_TRADE: 'Quick trade',
	PRO_TRADE: 'Pro trade',
	ADMIN_DASH: 'Verwaltungsseite',
	WALLET_TITLE: 'Geldbörse',
	TRADING_MODE_TITLE: 'Handelsmodus',
	TRADING_TITLE: 'Trading',
	LOGOUT: 'Abmelden',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'Die Transaktion ist zu klein zum Senden. Versuchen Sie es mit einem größeren Betrag.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'Die Transaktion ist zu groß, um sie zu senden. Versuchen Sie einen kleineren Betrag.',
	WITHDRAWALS_LOWER_BALANCE:
		'Ihr Guthaben reicht nicht aus, um diese Transaktion zu senden.',
	WITHDRAWALS_FEE_TOO_LARGE:
		'Die Gebühr beträgt mehr als {0}% Ihrer gesamten Transaktion',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'Die Bitcoin-Adresse ist ungültig. Bitte sorgfältig prüfen und erneut eingeben',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'Die Ethereum-Adresse ist ungültig. Bitte sorgfältig prüfen und erneut eingeben',
	WITHDRAWALS_BUTTON_TEXT: 'Abhebung überprüfen',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Zieladresse',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Geben Sie die Adresse ein',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'Ziel-Tag (optional)', // new
	WITHDRAWALS_FORM_MEMO_LABEL: 'Notiz (optional)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'Geben Sie das Ziel-Tag ein', // new
	WITHDRAWALS_FORM_MEMO_PLACEHOLDER: 'Geben Sie die Transaktionsnotiz ein', // new
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} abzuhebender Betrag',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Geben Sie den Betrag von {0} ein, den Sie abheben möchten',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'Transaktionsgebühr',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'Bankabhebungsgebühr',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'Geben Sie den Betrag von {0} ein, den Sie als Gebühr für die Transaktion verwenden möchten',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'Optimale Gebühr: {0} {1}', // TODO {0} -> amount {1} -> currency name
	DEPOSITS_FORM_AMOUNT_LABEL: '{0} einzuzahlender Betrag',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER:
		'Geben Sie den Betrag von {0} ein, den Sie einzahlen möchten',
	DEPOSITS_BUTTON_TEXT: 'Einzahlung überprüfen',
	DEPOSIT_PROCEED_PAYMENT: 'Bezahlen',
	DEPOSIT_BANK_REFERENCE:
		'Fügen Sie diesen "{0}"-Code in die Banktransation ein, um die Einzahlung zu identifizieren',
	DEPOSIT_METHOD: 'Zahlungsmethode {0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'Kreditkarte',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1:
		'Fahren Sie mit der Zahlungsmethode Kreditkarte fort.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'Sie verlassen die Plattform, um die Zahlung durchzuführen.',
	DEPOSIT_VERIFICATION_WAITING_TITLE: 'Verifizierung der Zahlung',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'Bitte schließen Sie die Anwendung nicht, während die Zahlung verifiziert wird',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'Wenn bei der Verifizierung etwas schief gelaufen ist, kontaktieren Sie uns bitte.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'Dies ist die ID des Vorgangs: "{0}", bitte teilen Sie uns diese ID mit, damit wir Ihnen helfen können.',
	DEPOSIT_VERIFICATION_SUCCESS: 'Zahlung verifiziert',
	DEPOSIT_VERIFICATION_ERROR:
		'Es ist ein Fehler bei der Verifizierung der Einzahlung aufgetreten.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED:
		'Die Einzahlung wurde bereits verifiziert',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'Ungültiger Status',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'Die Karte, mit der Sie die Einzahlung vorgenommen haben, ist nicht dieselbe wie Ihre registrierte Karte. Daher wird Ihre Einzahlung abgelehnt und Ihr Geld wird in weniger als einer Stunde zurückerstattet.',
	QUOTE_MESSAGE: 'Sie gehen zu {0} {1} {2} für {3} {4}',
	QUOTE_BUTTON: 'Akzeptieren',
	QUOTE_REVIEW: 'Überprüfen',
	QUOTE_COUNTDOWN_MESSAGE:
		'Sie haben {0} Sekunden, um den Handel durchzuführen',
	QUOTE_EXPIRED_TOKEN: 'Der Quote-Token ist abgelaufen.',
	QUOTE_SUCCESS_REVIEW_TITLE: 'Quick Trade',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'Sie haben erfolgreich {0} {1} {2} für {3} {4}', // you have successfully buy 1 btc from x toman
	COUNTDOWN_ERROR_MESSAGE: 'Countdown ist beende',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'Bank, an die abgehoben werden soll',
		MESSAGE_ABOUT_SEND: 'Sie sind dabei zu senden',
		MESSAGE_BTC_WARNING:
			'Bitte stellen Sie die Richtigkeit dieser Adresse sicher, da {0} Überweisungen irreversibel sind',
		MESSAGE_ABOUT_WITHDRAW: 'Sie sind dabei, auf Ihr Bankkonto zu überweisen',
		MESSAGE_FEE: 'Transaktionsgebühr von {0} ({1}) enthalten',
		MESSAGE_FEE_BASE: 'Transaktionsgebühr von {0} enthalten',
		BASE_MESSAGE_1:
			'Sie können nur auf ein Bankkonto mit einem Namen abheben, der mit dem bei Ihrem Konto registrierten Namen übereinstimmt.',
		BASE_MESSAGE_2: 'Abhebungs-Mindestbetrag',
		BASE_MESSAGE_3: 'Täglicher Abhebungs-Maximalbetragt',
		BASE_INCREASE_LIMIT: 'Erhöhen Sie Ihr Tageslimit',
		CONFIRM_VIA_EMAIL: 'Bestätigen Sie per E-Mail',
		CONFIRM_VIA_EMAIL_1:
			'Wir haben Ihnen eine Bestätigungs-E-Mail zur Abhebung geschickt.',
		CONFIRM_VIA_EMAIL_2:
			'Um den Abhebungsvorgang abzuschließen, bestätigen Sie bitte',
		CONFIRM_VIA_EMAIL_3:
			'die Abhebung über Ihre E-Mail innerhalb von 5 Minuten.',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'Ihre Abhebungsanfrage ist bestätigt. Sie wird in Kürze bearbeitet.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'Um Ihren Abhebungsstatus zu sehen, besuchen Sie bitte Ihre Abhebungs-Historienseite',
		GO_WITHDRAWAL_HISTORY: 'Zur Abhebungsverlaufsseite gehen',
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'einzahlen',
	WALLET_BUTTON_BASE_WITHDRAW: 'abheben',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'empfangen',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'senden',
	AVAILABLE_TEXT: 'Verfügbar',
	AVAILABLE_BALANCE_TEXT: 'Verfügbarer {0} Saldo: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Saldo',
	CURRENCY_BALANCE_TEXT: '{0} Balance',
	WALLET_TABLE_AMOUNT_IN: `Betrag in {0}`,
	WALLET_TABLE_TOTAL: 'Gesamtsumme',
	WALLET_ALL_ASSETS: 'Alle Vermögenswerte',
	HIDE_TEXT: 'Ausblenden',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Verkäufer',
	ORDERBOOK_BUYERS: 'BuyKäuferers',
	ORDERBOOK_SPREAD: '{0} spread', // 0 -> 660,000 T
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'Max',
	DATEFIELD_TOOGLE_DATE_GR: 'Gregorianischer Kalender',
	VERIFICATION_WARNING_TITLE: 'Verifizierung Ihrer Bankverbindung',
	VERIFICATION_WARNING_MESSAGE:
		'Bevor Sie abheben, müssen Sie Ihre Bankverbindung überprüfen.',
	ORDER_SPENT: 'Spent',
	ORDER_RECEIVED: 'Empfangen',
	ORDER_SOLD: 'Verkauft',
	ORDER_BOUGHT: 'Gekauft',
	ORDER_AVERAGE_PRICE: 'Durchschnittspreis',
	ORDER_TITLE_CREATED: 'Erfolgreich ein Limit {0} erstellt', // 0 -> buy / sell
	ORDER_TITLE_FULLY_FILLED: '{0} Order erfolgreich gefüllt', // 0 -> buy / sell
	ORDER_TITLE_PARTIALLY_FILLED: '{0} Auftrag teilweise ausgeführt', // 0 -> buy / sell
	ORDER_TITLE_TRADE_COMPLETE: '{0} {1} Auftrag wurde erfolgreich ausgeführt', // 0 -> buy / sell
	LOGOUT_TITLE: 'ie sind abgemeldet worden',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'Token ist abgelaufen',
	LOGOUT_ERROR_LOGIN_AGAIN: 'Erneut anmelden', // ip doesnt match
	LOGOUT_ERROR_INVALID_TOKEN: 'Ungültiges Token',
	LOGOUT_ERROR_INACTIVE: 'Sie wurden abgemeldet, weil Sie inaktiv waren',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	QUICK_TRADE_OUT_OF_LIMITS: 'Auftragsgröße ist außerhalb der Grenzen',
	QUICK_TRADE_TOKEN_USED: 'Token wurde verwendet',
	QUICK_TRADE_QUOTE_EXPIRED: 'Quote ist abgelaufen',
	QUICK_TRADE_QUOTE_INVALID: 'Ungültige Quote',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'Fehler bei der Berechnung der Quote',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
		'Der Auftrag mit der aktuellen Größe kann nicht gefüllt werden',
	QUICK_TRADE_ORDER_NOT_FILLED: 'Auftrag wird nicht ausgeführt',
	QUICK_TRADE_NO_BALANCE: 'Unzureichendes Guthaben zur Ausführung des Auftrags',
	YES: 'Ja',
	NO: 'Nein',
	NEXT: 'Weiter',
	SKIP_FOR_NOW: 'Vorerst überspringen',
	SUBMIT: 'einreichen',
	RESUBMIT: 'Erneut einreichen',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Fehlende Dokumente!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'Um vollen Zugriff auf die Abhebungs- und Einzahlungsfunktionen zu erhalten, müssen Sie Ihre Identitätsdokumente auf Ihrer Kontoseite einreichen.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Erfolg!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'Sie erhalten eine E-Mail-Benachrichtigung, wenn Ihre Informationen verarbeitet wurden. Die Bearbeitung kann in der Regel 1-3 Tage dauern.',
	VERIFICATION_NOTIFICATION_BUTTON: 'ZUM EXCHANGE GEHEN',
	ERROR_USER_ALREADY_VERIFIED: 'Benutzer bereits verifiziert',
	ERROR_INVALID_CARD_USER: 'Die angegebenen Bank- oder Kartendaten sind falsch',
	ERROR_INVALID_CARD_NUMBER: 'Ungültige Kartennummer',
	ERROR_LOGIN_USER_NOT_VERIFIED: 'Benutzer ist nicht verifiziert',
	ERROR_LOGIN_USER_NOT_ACTIVATED: 'Benutzer ist nicht aktiviert',
	ERROR_LOGIN_INVALID_CREDENTIALS: 'Berechtigungsnachweise sind nicht korrekt',
	SMS_SENT_TO: 'SMS gesendet an {0}', // TODO check msg
	SMS_ERROR_SENT_TO:
		'Fehler beim Senden der SMS an {0}. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut.', // TODO check msg
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'Transaktions-ID:', // TODO check msg
	CHECK_ORDER: 'Prüfen und bestätigen Sie Ihre Bestellung',
	CHECK_ORDER_TYPE: '{0} {1}', // 0 -> maker/limit  1 -> sell/buy
	CONFIRM_TEXT: 'Bestätigen',
	GOTO_XHT_MARKET: 'Zum XHT-Markt gehen', // new
	INVALID_CAPTCHA: 'Ungültiges Captcha',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL: 'Spracheinstellungen (schließt E-Mails ein)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'Pop-up zur Auftragsbestätigung anzeigen',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NEIN' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: true, label: 'Ja' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTINGS_THEME_LABEL: 'User Interface Theme', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'Weiß' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'dark', label: 'Dunkel' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTING_BUTTON: 'speichern',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'Abhebungen deaktiviert',
	VERIFICATION_NO_WITHDRAW_MESSAGE: 'Ihr Konto ist für Abhebungen gesperrt',
	UP_TO_MARKET: 'Up to market',
	VIEW_MY_FEES: 'Meine Gebühren anzeigen', // new
	DEVELOPER_SECTION: {
		TITLE: 'API-Schlüssel',
		INFORMATION_TEXT:
			'Die API bietet Funktionen wie das Abrufen von Wallet-Salden, das Verwalten von Kauf-/Verkaufsaufträgen, das Anfordern von Abhebungen sowie Marktdaten wie die letzten Trades, Orderbuch und Ticker.',
		ERROR_INACTIVE_OTP:
			'Um einen API-Schlüssel zu generieren, müssen Sie die 2-Faktor-Authentifizierung aktivieren.',
		ENABLE_2FA: '2FA aktivieren',
		WARNING_TEXT: 'Geben Sie Ihren API-Schlüssel nicht an andere weiter.',
		GENERATE_KEY: 'API-Schlüssel generieren',
		ACTIVE: 'Aktiv',
		INACTIVE: 'Inaktiv',
		INVALID_LEVEL:
			'Sie müssen Ihre Verifizierungsstufe erhöhen, um Zugriff auf diese Funktion zu haben', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'API-Schlüssel generieren',
		GENERATE_TEXT:
			'Bitte benennen Sie Ihren API-Schlüssel und bewahren Sie ihn nach der Generierung privat auf. Sie werden ihn später nicht mehr abrufen können.',
		GENERATE: 'Generieren',
		DELETE_TITLE: 'API-Schlüssel löschen',
		DELETE_TEXT:
			'Das Löschen Ihres API-Schlüssels ist nicht rückgängig zu machen, obwohl Sie jederzeit einen neuen API-Schlüssel generieren können. Möchten Sie Ihren API-Schlüssel löschen?',
		DELETE: 'LÖSCHEN',
		FORM_NAME_LABEL: 'Name',
		FORM_LABLE_PLACEHOLDER: 'Name für den API-Schlüssel',
		API_KEY_LABEL: 'API Schlüssel',
		SECRET_KEY_LABEL: 'GEHEIM-Schlüssel',
		CREATED_TITLE: 'Kopieren Sie Ihren API-Schlüssel',
		CREATED_TEXT_1:
			'Bitte kopieren Sie Ihren API-Schlüssel, da dieser in Zukunft nicht mehr erreichbar sein wird.',
		CREATED_TEXT_2: 'Halten Sie Ihren Schlüssel privat.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'Name',
		API_KEY: 'API Key',
		SECRET: 'Geheimnis',
		CREATED: 'Erstelltes Datum',
		REVOKE: 'Widerrufen',
		REVOKED: 'Widerrufen',
		REVOKE_TOOLTIP: 'Sie müssen 2FA aktivieren, um das Token zu widerrufen', // TODO
	},
	CHAT: {
		CHAT_TEXT: 'Chat',
		MARKET_CHAT: 'Market Chat',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'Mehr lesen',
		SHOW_IMAGE: 'Bild einblenden',
		HIDE_IMAGE: 'Bild ausblenden',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'Mitteilungen',
		SIGN_UP_CHAT: 'Zum Chatten anmelden',
		JOIN_CHAT: 'Benutzername für den Chat festlegen',
		TROLLBOX: 'Trollbox ({0})', // new
	},
	INVALID_USERNAME:
		'Der Benutzername muss zwischen 3 und 15 Zeichen lang sein. Enthält nur Kleinbuchstaben, Zahlen und Unterstrich',
	USERNAME_TAKEN:
		'Dieser Benutzername ist bereits vergeben. Bitte versuchen Sie einen anderen.',
	USERNAME_LABEL: 'Benutzername (wird für den Chat verwendet)',
	USERNAME_PLACEHOLDER: 'Benutzername',
	TAB_USERNAME: 'Benutzername',
	USERNAME_WARNING:
		'Ihr Benutzername kann nur einmal geändert werden. Bitte stellen Sie sicher, dass Ihr Benutzername erwünscht ist.',
	USERNAME_CANNOT_BE_CHANGED: 'Benutzername kann nicht geändert werden',
	UPGRADE_LEVEL: 'Kontostufe aktualisieren',
	LEVELS: {
		LABEL_LEVEL: 'Level',
		LABEL_LEVEL_1: 'Eins',
		LABEL_LEVEL_2: 'Zwei',
		LABEL_LEVEL_3: 'Drei',
		LABEL_MAKER_FEE: 'Maker Gebühr',
		LABEL_TAKER_FEE: 'Taker Gebühr',
		LABEL_BASE_DEPOSIT: 'Tägliche Euro-Einzahlung',
		LABEL_BASE_WITHDRAWAL: 'Tägliche Euro-Abhebung',
		LABEL_BTC_DEPOSIT: 'Tägliche Bitcoin-Einzahlung',
		LABEL_BTC_WITHDRAWAL: 'Tägliche Bitcoin-Abhebung',
		LABEL_ETH_DEPOSIT: 'Tägliche Ethereum-Einzahlung',
		LABEL_ETH_WITHDRAWAL: 'Tägliche Ethereum-Abhebung',
		LABEL_PAIR_MAKER_FEE: '{0} Maker Gebühr',
		LABEL_PAIR_TAKER_FEE: '{0} Taker Gebühr',
		UNLIMITED: 'Unbegrenzt',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: 'Geldbörse {0} generieren',
	WALLET_ADDRESS_GENERATE: 'Erzeugen',
	WALLET_ADDRESS_MESSAGE:
		'Wenn Sie eine Wallet erstellen, legen Sie eine Einzahlungs- und Auszahlungsadresse an.',
	WALLET_ADDRESS_ERROR:
		'Fehler beim Generieren der Adresse, bitte aktualisieren und erneut versuchen.',
	DEPOSIT_WITHDRAW: 'Einzahlen/Abheben',
	GENERATE_WALLET: 'Geldbörse generieren',
	TRADE_TAB_CHART: 'Grafik',
	TRADE_TAB_TRADE: 'Handeln',
	TRADE_TAB_ORDERS: 'Bestellungen',
	TRADE_TAB_POSTS: 'Beiträge', // new
	WALLET_TAB_WALLET: 'Geldbörse',
	WALLET_TAB_TRANSACTIONS: 'Transaktionen',
	RECEIVE_CURRENCY: '{0} empfangen',
	SEND_CURRENCY: '{0} senden',
	COPY_ADDRESS: 'Adresse kopieren',
	SUCCESFUL_COPY: 'Erfolgreich kopiert!',
	QUICK_TRADE_MODE: 'Quick Trade Modus',
	JUST_NOW: 'gerade jetzt',
	PAIR: 'Paar',
	ZERO_ASSET: 'Sie haben kein Vermögen',
	DEPOSIT_ASSETS: 'Assets einzahlen',
	SEARCH_TXT: 'Suchen',
	SEARCH_ASSETS: 'Assets suchen',
	TOTAL_ASSETS_VALUE: 'Gesamtwert der Vermögenswerte in {0}: {1}',
	SUMMARY: {
		TITLE: 'Zusammenfassung',
		TINY_PINK_SHRIMP_TRADER: 'Tiny Pink Shrimp Trader',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'Tiny Pink Shrimp Händlerkonto',
		LITTLE_RED_SNAPPER_TRADER: 'Little Red Snapper Trader',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'Little Red Snapper Händlerkonto',
		CUNNING_BLUE_KRAKEN_TRADING: 'Listiger blauer Kraken Handel',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: 'Cunning Blue Kraken Handelskonto',
		BLACK_LEVIATHAN_TRADING: 'Schwarzer Leviathan Handel',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: 'Schwarzer Leviathan Handelskonto',
		URGENT_REQUIREMENTS: 'Dringende Anforderungen',
		TRADING_VOLUME: 'Handelsvolumen',
		ACCOUNT_ASSETS: 'Konto Vermögen',
		ACCOUNT_DETAILS: 'Konto-Details',
		SHRIMP_ACCOUNT_TXT_1: 'Ihre Reise beginnt hier!',
		SHRIMP_ACCOUNT_TXT_2:
			'Schwimmen Sie weiter, Sie werden sich bald vom Rest des Schwarms abheben.',
		SNAPPER_ACCOUNT_TXT_1:
			'Glückwunsch, dass Sie durch die Marktschwemme hindurch Ihren Kurs halten.',
		SNAPPER_ACCOUNT_TXT_2:
			'Schmieden Sie sich durch und kämpfen Sie den Anstieg für mehr Krypto-Schätze voraus.',
		KRAKEN_ACCOUNT_TXT_1:
			'Dieses Krustentier, das eher Witze als Rümpfe reißt, hat schon so manchen Sturm überstanden!',
		LEVIATHAN_ACCOUNT_TXT_1:
			'Bestie aus dem Abgrund, die durch Altcoins in unergründliche Tiefen blickt, Meister der mitternächtlichen Gewässer und der Flutwelle.',
		VIEW_FEE_STRUCTURE: 'Gebührenstruktur und Limits anzeigen',
		UPGRADE_ACCOUNT: 'Konto aktualisieren',
		ACTIVE_2FA_SECURITY: 'Aktive 2FA-Sicherheit',
		ACCOUNT_ASSETS_TXT_1:
			'Angezeigt wird eine Übersicht über alle Ihre Assets.',
		ACCOUNT_ASSETS_TXT_2:
			'Das Halten einer großen Menge an Vermögenswerten berechtigt Sie zu einem Konto-Upgrade, das ein einzigartiges Abzeichen und niedrigere Handelsgebühren beinhaltet.',
		TRADING_VOLUME_TXT_1:
			'Ihre Handelsvolumen-Historie wird in {0} angezeigt und ist ein nominaler Wert, der am Ende eines jeden Monats aus allen Handelspaaren berechnet wird.',
		TRADING_VOLUME_TXT_2:
			'Hohe Handelsaktivitäten berechtigen Sie zu einem Konto-Upgrade, das Sie mit einem einzigartigen Abzeichen und anderen Vergünstigungen belohnt.',
		ACCOUNT_DETAILS_TXT_1:
			'Ihr Kontotyp bestimmt Ihr Kontoabzeichen, die Handelsgebühr, Einzahlungs- und Auszahlungslimits.',
		ACCOUNT_DETAILS_TXT_2:
			'Das Alter Ihres Handelskontos, das Aktivitätsniveau und die Höhe des gesamten Kontoguthabens bestimmen, ob Ihr Konto für ein Upgrade in Frage kommt.',
		ACCOUNT_DETAILS_TXT_3:
			'Die Aufrechterhaltung Ihres Kontostandes erfordert ständiges Handeln und die Aufrechterhaltung einer bestimmten Menge an eingezahltem Vermögen.',
		ACCOUNT_DETAILS_TXT_4:
			'Die Konten werden periodisch herabgestuft, wenn Aktivität und Vermögenswerte nicht beibehalten werden.',
		REQUIREMENTS: 'Anforderungen',
		ONE_REQUIREMENT: 'Nur eine Bedingung:', // new
		REQUEST_ACCOUNT_UPGRADE: 'Konto-Upgrade anfordern',
		FEES_AND_LIMIT: '{0} Gebühren- & Limitstruktur', // new
		FEES_AND_LIMIT_TXT_1:
			'Ein Krypto-Trader zu werden, markiert einen Neuanfang. Bewaffnet mit Verstand, Wille und Geschwindigkeit nur durch das Eingehen von Risiken und Handel werden Sie Ihr Konto aktualisieren dürfen.',
		FEES_AND_LIMIT_TXT_2:
			'Jedes Konto hat seine eigenen Gebühren und Ein- und Auszahlungslimits.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'Einzahlungs- und Abhebungsfreibetrag',
		TRADING_FEE_STRUCTURE: 'Struktur der Handelsgebühren',
		WITHDRAWAL: 'Abhebungen',
		DEPOSIT: 'Einzahlungen',
		TAKER: 'Taker',
		MAKER: 'Maker',
		WEBSITE: 'Website',
		VIP_TRADER_ACCOUNT_ELIGIBLITY: 'VIP-Trader-Konto Upgrade-Berechtigung',
		PRO_TRADER_ACCOUNT_ELIGIBLITY: 'Pro Trader-Konto Upgrade-Berechtigung',
		TRADER_ACCOUNT_ELIGIBILITY: 'Level {0} Kontoberechtigung',
		NOMINAL_TRADING: 'Nominaler Handel',
		NOMINAL_TRADING_WITH_MONTH: 'Nominaler Handel Letzter {0}',
		ACCOUNT_AGE_OF_MONTHS: 'Konto Alter von {0} Monaten',
		TRADING_VOLUME_EQUIVALENT: '{0} {1} Handelsvolumen Äquivalent',
		LEVEL_OF_ACCOUNT: 'Level {0} Konto',
		LEVEL_TXT_DEFAULT: 'Fügen Sie hier Ihre Levelbeschreibung hinzu',
		LEVEL_1_TXT:
			'Ihre Reise beginnt hier XIV Trader! Um Prämien zu erhalten, können Sie Ihre Identiﬁkation verifizieren und auch größere Ein- und Auszahlungslimits mit reduzierten Handelsgebühren erhalten.', // new
		LEVEL_2_TXT:
			'Handeln Sie einfach monatlich im Wert von mehr als 3.000 USDT oder haben Sie ein Guthaben von mehr als 5.000 XHT und genießen Sie niedrigere Handelsgebühren.', // new
		LEVEL_3_TXT:
			'Hier geht es richtig zur Sache! Genießen Sie reduzierte Handelsgebühren und große Ein- und Auszahlungslimits. Um zu Level 3 zu gelangen, müssen Sie Ihre Verifizierung abschließen', // new
		LEVEL_4_TXT:
			'Handeln Sie einfach monatlich im Wert von mehr als 10.000 USDT oder haben Sie ein Guthaben von mehr als 10.000 XHT und genießen Sie niedrigere Handelsgebühren.', // new
		LEVEL_5_TXT:
			'Sie haben es geschafft! Das Level 5-Konto ist ein seltenes Konto nur für Exchangebetreiber, Vault-Nutzer oder das HollaEx-Partnerprogramm (HAP). Genießen Sie große Limits und freuen Sie sich über null Maker-Gebühren.', // new
		LEVEL_6_TXT:
			'Handeln Sie einfach monatlich im Wert von über 300.000 USDT oder haben Sie ein Guthaben von über 100.000 XHT und genießen Sie niedrigere Handelsgebühren. Erhöhter Auszahlungsbetrag.', // new
		LEVEL_7_TXT:
			'Handeln Sie einfach monatlich im Wert von über 500.000 USDT oder haben Sie ein Guthaben von über 300.000 XHT und genießen Sie niedrigere Handelsgebühren. Erhöhter Auszahlungsbetrag.', // new
		LEVEL_8_TXT:
			'Handeln Sie einfach monatlich im Wert von mehr als 600.000 USDT oder haben Sie ein Guthaben von mehr als 400.000 XHT und genießen Sie niedrigere Handelsgebühren.', // new
		LEVEL_9_TXT:
			'Handeln Sie einfach monatlich im Wert von mehr als 2.000.000 USDT oder haben Sie ein Guthaben von mehr als 1.000.000 XHT und genießen Sie niedrigere Handelsgebühren.', // new
		LEVEL_10_TXT:
			'Das Waltrader-Konto, mit dem Sie Geld für Market Making zurückverdienen. Um dieses spezielle Konto zu erhalten, nehmen Sie bitte Kontakt mit uns auf.', // new
		CURRENT_TXT: 'Aktuell',
		TRADER_ACCOUNT_XHT_TEXT:
			'Ihr Konto befindet sich in der Vorverkaufsphase von XHT, das heißt, Sie können XHT für $0,10 pro XHT erhalten. Alle Einzahlungen werden in XHT umgewandelt, sobald die Transaktion abgeschlossen ist.',
		TRADER_ACCOUNT_TITLE: 'Konto - Vorverkaufszeitraum', // new
		HAP_ACCOUNT: 'HAP-Konto', // new
		HAP_ACCOUNT_TXT:
			'Ihr Konto ist ein verifiziertes Konto für das HollaEx-Partnerprogramm. Sie können jetzt 10 % Bonus für jede Person verdienen, die Sie einladen und die XHT kauft.', // new
		EMAIL_VERIFICATION: 'E-Mail-Verifizierung', // new
		DOCUMENTS: 'Dokumente', // new
		HAP_TEXT: 'HollaEx Partnerprogramm (HAP) {0}', // new
		LOCK_AN_EXCHANGE: 'Sperren einer Exchange {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'Vault-Abonnement-Benutzer {0}', // new
		TRADE_OVER_XHT: 'Handel über {0} USDT Wert', // new
		TRADE_OVER_BTC: 'Handel über {0} BTC Wert', // new
		XHT_IN_WALLET: '{0} XHT in der Geldbörse', // new
		REWARDS_BONUS: 'Belohnungen und Prämien', // new
		COMPLETE_TASK_DESC:
			'Erfüllen Sie Aufgaben und verdienen Sie Prämien im Wert von über 10.000 $.', // new
		TASKS: 'Aufgaben', // new
		MAKE_FIRST_DEPOSIT:
			'Machen Sie Ihre erste Einzahlung und erhalten Sie 1 XHT', // new
		BUY_FIRST_XHT:
			'Kaufen Sie Ihr ersten XHT und erhalten Sie einen Bonus von 5 XHT', // new
		COMPLETE_ACC_VERIFICATION:
			'Schließen Sie die Kontoverifizierung ab und erhalten Sie einen 20 XHT-Bonus', // new
		INVITE_USER:
			'Laden Sie Benutzer ein und genießen Sie Provisionen aus deren Handel', // new
		JOIN_HAP:
			'Werden Sie Mitglied bei HAP und verdienen Sie 10% für jedes verkaufte HollaEx Kit', // new
		EARN_RUNNING_EXCHANGE:
			'Verdienen Sie passives Einkommen durch den Betrieb Ihrer eigenen Exchange.', // new
		XHT_WAVE_AUCTION: 'XHT-Wellen-Auktionsdaten', // new
		XHT_WAVE_DESC_1:
			'Die Verteilung des HollaEx-Tokens (XHT) erfolgt über eine Wave-Auktion.', // new
		XHT_WAVE_DESC_2:
			'Die Wellenauktion verkauft eine zufällige Menge an XHT zu zufälligen Zeitpunkten an die Höchstbietenden im Auftragsbuch', // new
		XHT_WAVE_DESC_3:
			'Im Folgenden werden die historischen Daten der Wave-Auktionshistorie angezeigt', // new
		WAVE_AUCTION_PHASE: 'Wellenauktion Phase {0}', // new
		LEARN_MORE_WAVE_AUCTION: 'Erfahren Sie mehr über die Wave Auktion', // new
		WAVE_NUMBER: 'Wellennummer', // new
		DISCOUNT: '( {0}% Rabatt )', // new
		MY_FEES_LIMITS: ' Meine Gebühren und Limits', // new
	},
	REFERRAL_LINK: {
		TITLE: 'Freunde einladen', // new
		INFO_TEXT:
			'Empfehlen Sie Ihre Freunde, indem Sie diesen Link weitergeben und erhalten Sie Vorteile, wenn Sie andere Personen einladen.',
		COPY_FIELD_LABEL:
			'Teilen Sie den untenstehenden Link mit Freunden und verdienen Sie Provisionen:', // new
		REFERRED_USER_COUT: 'Sie haben {0} Benutzer empfohlen.', // new
		COPY_LINK_BUTTON: 'EMPFEHLUNGSLINK KOPIEREN', // new
		XHT_TITLE: 'MEINE REFERRALS', // new
		XHT_INFO_TEXT:
			'Verdienen Sie Provisionen, indem Sie Ihre Freunde einladen.', // new
		XHT_INFO_TEXT_1: 'Provisionen werden periodisch an Ihre Geldbörse gezahlt', // new
		APPLICATION_TXT:
			'Um ein HollaEx-Kit-Vertriebspartner zu werden, füllen Sie bitte einen Antrag aus.', // new
		TOTAL_REFERRAL: 'Insgesamt durch Empfehlungen gekauft:', // new
		PENDING_REFERRAL: 'Ausstehende Kommissionen:', // new
		EARN_REFERRAL: 'Verdiente Provisionen:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'ANWENDEN', // new
	},
	STAKE_TOKEN: {
		TITLE: 'Staken von  HollaEx Token', // new
		INFO_TXT1:
			'HollaEx-Tokens (XHT) müssen abgesichert (abgesteckt) werden, um die HollaEx-Kit-Tauschsoftware zu betreiben.', // new
		INFO_TXT2:
			'Sie können Ihre HollaEx-Token auf ähnliche Weise sichern und XHT verdienen, die während der Wave-Auktion nicht verkauft werden.', // new
		INFO_TXT3:
			'Gehen Sie einfach auf dash.bitholla.com und sichern Sie sich noch heute Ihren eigenen Exchange und verdienen Sie kostenlos XHT', // new
		BUTTON_TXT: 'FINDEN SIE MEHR', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'HollaEx Token-Kaufvertrag',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: 'FORTFAHREN',
		AGREE_TERMS_LABEL:
			'Ich habe den HollaEx-Token-Kaufvertrag gelesen und stimme ihm zu',
		RISK_INVOLVED_LABEL: 'Ich verstehe die damit verbundenen Risiken',
		DOWNLOAD_PDF: 'Laden Sie die PDF-Datei herunter',
		DEPOSIT_FUNDS:
			'Zahlen Sie Geld in Ihre Geldbörse ein, um HollaEx Token (XHT) zu erhalten',
		READ_FAG: 'Lesen Sie HollaEx FAQ hier: {0}',
		READ_DOCUMENTATION: 'Lesen Sie das HollaEx Whitepaper hier: {0}',
		READ_WAVES:
			'Regeln für die kommende öffentliche Wellenauktion im Dezember{0}', // new
		DOWNLOAD_BUY_XHT:
			'Laden Sie die PDF-Datei herunter, um eine visuelle Schritt-für-Schritt-Anleitung zu sehen {0}',
		HOW_TO_BUY: 'wie man HollaEx Token (XHT) kauft',
		PUBLIC_SALES: 'Öffentliche Wellen-Auktion', // new
		CONTACT_US:
			'Für weitere Informationen und bei Problemen können Sie uns gerne eine E-Mail an {0} senden.',
		VISUAL_STEP:
			'Sehen Sie eine visuelle Schritt-für-Schritt-Anleitung auf {0}', // new
		WARNING_TXT:
			'Wir werden Ihre Anfrage prüfen und Ihnen weitere Anweisungen für den Zugang zur XIV Exchange per E-Mail zusenden.', // new
		WARNING_TXT1:
			'In der Zwischenzeit können Sie sich mit Hilfe der folgenden Ressourcen mit dem HollaEx-Netzwerk vertraut machen', // new
		XHT_ORDER_TXT_1: 'Um den Handel zu starten, müssen Sie sich anmelden', // new
		XHT_ORDER_TXT_2: '', // new
		XHT_ORDER_TXT_3: '{0} or {1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: 'Anmelden, um Ihre letzten Trades zu sehen', //new
		XHT_TRADE_TXT_2: 'Sie können {0}, um Ihren letzten Handelsverlauf zu sehen', //new
		LOGIN_HERE: 'hier anmelden',
	},
	WAVES: {
		// new
		TITLE: 'Wellen Info',
		NEXT_WAVE: 'Nächste Welle',
		WAVE_AMOUNT: 'Menge in Welle',
		FLOOR: 'Etage',
		LAST_WAVE: 'Letzte Wellee',
	},
	TYPES_OF_POSTS: {
		// new
		TITLE: 'BEITRÄGE',
		ANNOUNCEMEN: 'Ankündigung',
		SYSTEM_UPDATE: 'System-Update',
		LAST_WAVE: 'Letzte Welle',
		ANNOUNCEMENT_TXT:
			'Kostenloses XHT wird an alle Geldbörsen verteilt, die sich für diese Funktion qualifizieren.',
		SYSTEM_UPDATE_TIME: 'Zeit: 12:31 PM, 19. Dezember 2019	',
		SYSTEM_UPDATE_DURATION: '1 Stunde',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: ' 12: 31 PM, 19. Dezember 2019',
	},
	USER_LEVEL: 'User Level', // new
	LIMIT_AMOUNT: 'Grenzwertbetrag', // new
	FEE_AMOUNT: 'Betrag der Gebühr', // new
	COINS: 'Münzen', // new
	PAIRS: 'Paare', // new
	NOTE_FOR_EDIT_COIN:
		'Hinweis: Zum Hinzufügen und Entfernen von {0} beachten Sie bitte die {1}.', // new
	REFER_DOCS_LINK: 'docs', // new
	RESTART_TO_APPLY:
		'Sie müssen Ihren Exchange neu starten, um diese Änderungen zu übernehmen.', // new
	TRIAL_EXCHANGE_MSG:
		'Sie verwenden eine Testversion von {0} und diese läuft in {1} Tagen ab.', // new
	EXPIRY_EXCHANGE_MSG:
		'Ihr Exchange ist abgelaufen. Gehen Sie zu dash.bitholla.com, um es wieder zu aktivieren.', // new
	EXPIRED_INFO_1: 'Ihre Testphase ist beendet.', // new
	EXPIRED_INFO_2: 'Sichern Sie Ihren Exchange, um ihn wieder zu aktivieren.', // new
	EXPIRED_BUTTON_TXT: 'ACTIVATE EXCHANGE', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: 'Ankündigung',
		ANNOUNCEMNT_TXT_3:
			'Der öffentliche Start und die Wave-Auktion wurden auf den 1. Januar 2020 verschoben. Wallet-Einzahlungen und -Abhebungen sind jetzt möglich.',
		ANNOUNCEMNT_TXT_4:
			'Frohes neues Jahr Hollaers. Wir machen ein neues Zeichen ab 2020 mit dem Start der offensten Handelsplattform mit der Hilfe von Ihnen allen.',
		ANNOUNCEMNT_TXT_1:
			'Verdienen Sie XHT mit dem HAP-Programm, indem Sie Ihre Freunde in den Exchange einladen. {0}.',
		DEFAULT_ANNOUNCEMENT:
			'In diesem Bereich werden Ihre öffentlichen Ankündigungen für den Exchange angezeigt!',
		ANNOUNCEMENT_TXT_2:
			'Kostenloses XHT wird an alle Geldbörsen verteilt, die {0}.',
		LEARN_MORE: 'Mehr erfahren',
		APPLY_TODAY: 'Heute bewerben', // new
	},
	OPEN_WALLET: 'Offener Geldbeutel', // new
	AGO: 'ago', // new
};
