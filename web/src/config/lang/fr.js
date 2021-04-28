import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';

export default {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Ouvrir votre Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: 'Êtes vous sûrs?. Voulez-vous vous déconnecter?',
	ADD_TRADING_PAIR: 'Ajouter Trading Pair',
	ACTIVE_TRADES: 'Vous devez {0} pour accéder à vos échanges actifs',
	CANCEL_BASE_WITHDRAWAL: 'Annuler {0} Retrait',
	CANCEL_WITHDRAWAL: 'Annuler le retrait',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM: 'Voulez-vous annuler le retrait de :',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'AAAA/MM/JJ HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'Connexion',
	SIGN_IN: "S'identifier",
	SIGNUP_TEXT: "S'enregistrer",
	REGISTER_TEXT: "S'inscrire",
	ACCOUNT_TEXT: 'Compte',
	HOME_TEXT: 'Acceuil',
	CLOSE_TEXT: 'Fermer',
	COPY_TEXT: 'Copier',
	COPY_SUCCESS_TEXT: 'Copie réussie',
	CANCEL_SUCCESS_TEXT: 'Annulation réussie!',
	UPLOAD_TEXT: 'Télécharger',
	ADD_FILES: 'AJOUTER DES FICHIERS', // ToDo
	OR_TEXT: 'Ou',
	CONTACT_US_TEXT: 'Contactez-nous',
	HELPFUL_RESOURCES_TEXT: 'Ressources utiles',
	HELP_RESOURCE_GUIDE_TEXT:
		"N'hésitez pas à nous contacter pour plus d'information ou en cas d'éventuels problèmes en nous envoyant un email",
	HELP_TELEGRAM_TEXT: "Consulter pour ouvrir la documentation de l'API:",
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	HELP_TEXT: 'aide',
	NEED_HELP_TEXT: "Besoin d'aide?",
	SUCCESS_TEXT: 'Réussi',
	ERROR_TEXT: 'Erreur',
	PROCEED: 'POURSUIVRE',
	EDIT_TEXT: 'Editer',
	BACK_TEXT: 'Retour',
	NO_OPTIONS: 'Aucune option de disponible',
	SECONDS: 'secondes',
	VIEW_MARKET: 'Voir le marché', // new
	GO_TRADE: 'Aller dans les échanges', // new
	VIEW_INFO: "Voir la page d'informations", // new
	APPLY_HERE: 'Inscrivez-vous ici', // new
	HOME: {
		SECTION_1_TITLE: 'Bienvenue dans le HollaEx Exchange Kit!',
		SECTION_1_TEXT_1:
			"Créez votre propre échange évolutif de monnaies digitales avec le kit HollaEx et faites parti de l'avenir de la finance",
		SECTION_1_TEXT_2:
			'Nous nous efforçons de faire progresser la technologie financière grâce à un accès simple et abordable aux échanges.»',
		SECTION_1_BUTTON_1: 'Pour en savoir plus',
		SECTION_3_TITLE: 'Fonctionnalités',
		SECTION_3_CARD_1_TITLE: 'MOTEUR DE CORRESPONDANCE ÉVOLUTIF',
		SECTION_3_CARD_1_TEXT:
			'Grâce à des algorithmes plus efficaces notre moteur de correspondance est évolutif et permet de meilleures performances',
		SECTION_3_CARD_2_TITLE: 'INTEGRATION BANCAIRE',
		SECTION_3_CARD_2_TEXT:
			"Plugins avec des modules personnalisables disponibles pour l'intégration bancaire. Nous connaissons la finance traditionnelle et pouvons vous aider à rendre votre échange disponible à la population locale ou globale.",
		SECTION_3_CARD_3_TITLE: 'SÉCURITÉ FORTE',
		SECTION_3_CARD_3_TEXT:
			"HollaEx utilise les meilleurs systèmes de sécurité et les algorithmes les plus sûrs et fiables pour assurer la sécurité des fonds. C'est notre priorité absolue et nous en avons pris soin tout particulièrement",
		SECTION_3_CARD_4_TITLE: 'REPORTING AVANCÉS',
		SECTION_3_CARD_4_TEXT:
			"Panneau d'administration avec email et rapports personnalisables pour informer l'administrateur et l'équipe technique de l'état du système et des transactions.",
		SECTION_3_CARD_5_TITLE: 'SUPPORT',
		SECTION_3_CARD_5_TEXT:
			'Nous pouvons vous aider plus particulièrement et vous proposer de parler directement avec un professionnel en ligne pour vous aider avec vos problèmes et vos demandes.',
		SECTION_3_CARD_6_TITLE: 'PROCESSUS KYC',
		SECTION_3_CARD_6_TEXT:
			'Modules flexibles et intégrables pour appliquer les processus KYC et de vérification des utilisateurs dans différentes jurisdictions.',
		SECTION_3_BUTTON_1: 'Voir la Demo',
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'LANGUES',
		SECTIONS: {
			SECTION_1_TITLE: ' À PROPOS',
			SECTION_1_LINK_1: 'NOTRE HISTOIRE',
			SECTION_1_LINK_2: "Conditions d'utilisation",
			SECTION_1_LINK_3: 'Politique de confidentialité',
			SECTION_1_LINK_4: 'Nous contacter',
			SECTION_2_TITLE: 'Information',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Nous contacter',
			SECTION_2_LINK_3: 'Carrière',
			SECTION_3_TITLE: 'DÉVELOPPEURS',
			SECTION_3_LINK_1: 'Documentation',
			SECTION_3_LINK_2: 'Forum',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'Bibliothèque',
			SECTION_3_LINK_5: 'API doc',
			SECTION_3_LINK_6: 'Trading API',
			SECTION_3_LINK_7: 'Outils de développement',
			SECTION_3_LINK_8: 'Documentation',
			SECTION_4_TITLE: 'ÉCHANGES',
			SECTION_4_LINK_1: "S'identifier",
			SECTION_4_LINK_2: "S'inscrire",
			SECTION_4_LINK_3: 'Nous contacter',
			SECTION_4_LINK_4: "Conditions d'utilisation",
			SECTION_5_TITLE: 'RESSOURCES',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'HollaEx Token (XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'FAQ', // new
			SECTION_6_TITLE: 'COMMUNAUTÉ',
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
			"HollaEx Kit est une plateforme de trading open source construite par bitHolla Inc. Vous pouvez créer et répertorier tous vos digital assets et inviter des utilisateurs sur votre échange à l'aide de ce kit. Pour simplement avoir votre propre échange {1}",
		CLICK_HERE: 'Cliquez ici',
		VISIT_HERE: 'Visitez ici',
	},
	ACCOUNTS: {
		TITLE: 'Compte',
		TAB_VERIFICATION: 'Verification',
		TAB_SECURITY: 'Securité',
		TAB_NOTIFICATIONS: 'Notifications',
		TAB_SETTINGS: 'Paramètres',
		TAB_PROFILE: 'Profil',
		TAB_WALLET: 'Portefeuille',
		TAB_SUMMARY: 'Tableau de bord',
		TAB_HISTORY: 'Historique',
		TAB_API: 'API',
		TAB_SIGNOUT: 'Se déconnecter',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: "Demander l'accès",
		REQUEST_INVITE: 'Demander une invitation',
		CATEGORY_PLACEHOLDER:
			'Selectionnez la catégorie qui correspond le mieux à votre problème',
		INTRODUCTION_LABEL: 'Présentez-vous',
		INTRODUCTION_PLACEHOLDER:
			'Où êtes-vous localisé, voudriez-vous créer votre propre échange?',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'Catégorie',
		CATEGORY_PLACEHOLDER:
			'Selectionnez la catégorie qui correspond le mieux à votre problème',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: "Vérification de l'utilisateur",
			OPTION_LEVEL: "Augmenter le niveau de l'utilisateur",
			OPTION_DEPOSIT: 'Dépôt & Retrait',
			OPTION_BUG: 'Rapporter une erreur', // ToDo:
			OPTION_PERSONAL_INFO: 'Changer vos informations personnelles', // ToDo:
			OPTION_BANK_TRANSFER: 'Virement bancaire', // new
			OPTION_REQUEST: 'Demander une invitation pour le HollaEx Exchange', // new
		},
		SUBJECT_LABEL: 'Sujet',
		SUBJECT_PLACEHOLDER: 'Indiquez le sujet de votre problème',
		DESCRIPTION_LABEL: 'Description',
		DESCRIPTION_PLACEHOLDER: 'Décrivez en détails le probème',
		ATTACHMENT_LABEL: 'Ajouter des documents(3 max)', // ToDo:
		ATTACHMENT_PLACEHOLDER:
			'Ajoutez un fichier si nécessaire pour expliquer le problème. Formats acceptés: PDF, JPG, PNG et GIF',
		SUCCESS_MESSAGE: "Cet email a été envoyé à l'équipe technique",
		SUCCESS_TITLE: 'Message Envoyé',
		SUCCESS_MESSAGE_1: 'Votre problème a été envoyé au service clients',
		SUCCESS_MESSAGE_2: 'Délai de réponse entre 1 à 3 jours.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'Votre {0} adresse de réception', // new
			DESTINATION_TAG: 'Votre {0} destination tag', // new
			MEMO: 'Votre {0} memo', // new
			BTC: 'Votre adresse de réception de Bitcoin',
			ETH: "Votre adresse de réception d'Ethereum",
			BCH: 'Votre adresse de réception de Bitcoin Cash',
		},
		INCREASE_LIMIT: 'Voudriez-vous augmenter votre limite quotidienne?',
		QR_CODE:
			'Ce QR Code peut être scanner par une personne qui souhaite vous envoyer des fonds',
		NO_DATA: 'Aucune information disponible',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: "S'identifier à {0}",
		CANT_LOGIN: 'Identification impossible?',
		NO_ACCOUNT: "Vous n'avez pas de compte?",
		CREATE_ACCOUNT: 'Créez-en un ici',
		HELP: 'Aide',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'Email',
		EMAIL_PLACEHOLDER: 'Adresse email',
		PASSWORD_LABEL: 'Mot de passe',
		PASSWORD_PLACEHOLDER: 'Indiquez votre mot de passe',
		PASSWORD_REPEAT_LABEL: 'Saisissez à nouveau votre mot de passe',
		PASSWORD_REPEAT_PLACEHOLDER: 'Saisissez à nouveau votre mot de passe',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'Indiquez un code OTP pour vous identifier',
		CAPTCHA: 'Session expirée. Veuillez actualiser la page.',
		FROZEN_ACCOUNT: 'Ce compte est bloqué',
		INVALID_EMAIL: 'Adresse email invalide',
		TYPE_EMAIL: 'Indiquez votre adresse email',
		REQUIRED: 'Champs obligatoire',
		INVALID_DATE: 'Date invalide',
		INVALID_PASSWORD:
			'Mot de passe invalide. Le mot de passe doit contenir 8 lettres, un chiffre et un caractère spécial.',
		INVALID_PASSWORD_2:
			'Mot de passe invalide. Le mot de passe doit contenir au moins 8 lettres, au moins un chiffre et un caractère.',
		INVALID_CURRENCY: 'Adresse {1} invalide ({0})',
		INVALID_BALANCE:
			"Solde disponible insuffisant ({0}) pour effectuer l'opération ({1}).",
		MIN_VALUE: 'La valeur doit être {0} ou supérieure.',
		MAX_VALUE: 'La valeur doit être {0} ou inférieure.',
		INSUFFICIENT_BALANCE: 'Solde insuffisant',
		PASSWORDS_DONT_MATCH: 'Le mot de passe ne correspond pas',
		USER_EXIST: 'Cet email est déjà inscrit',
		ACCEPT_TERMS:
			"Vous n'avez pas accepté les conditions d'utilisation et politique de confidentialité.",
		STEP: "Valeur invalide, l'étape est {0}",
		ONLY_NUMBERS: 'La valeur ne peut contenir que des chiffres',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'Politique de confidentialité',
			SUBTITLE:
				'Dernière mise à jour le 1er avril 2019. Cette présente remplace la version précédente complètement',
			TEXTS: [
				'HollaEx Web est une plateforme de trading virtuelle appartenant entièrement à bitHolla Inc. bitHolla Inc (dénommée bitHolla ci-après) a été créée à Séoul, en Corée du Sud.',
				'L\'utilisation du site internet HollaEx ("Site Web") et les services ("Service") proposés sur le Site Web sont régis par les conditions rédigées et disponible sur la page Termes et Conditions ("Termes"). Cet accord constitue entièrement l\'accord entre les deux parties. Toutes autres informations se trouvant sur le Site Web ou autres informations reçues via email ou téléphone (voie orale/ écrite) sont exclues de cet accord; la politique de l\'échange a pour but d\'informer et conseiller uniquement et ne constitue pas un accord légal entre les parties.',
				"En accédant et en vous informant ainsi qu'en téléchargeant les informations de ce Site Web et en utilisant les Services de bitHolla vous confirmez que vous avez lu et compris ces Termes et que vous les acceptés complètement sans conditions. bitHolla peut à n'importe quel moment, sans prévenir, modifier ces Termes. Vous acceptez de continuer à être liés à ces Termes et conditions et confirmez que bitHolla n'a aucune obligation de vous informer de quelconque changement. Vous acceptez que c'est de votre responsabilité de vous informer et de vérifier ces Termes périodiquement afin de voir si des annotations ont été faites. Ainsi votre action de continuer à consulter le Site Web ainsi que l'utilisation des Services proposés par bitHolla indique votre acceptation de ces Termes.",
				"Le Site Web et les droits d'auteur dans tous les textes, graphiques, images, logiciels et autre matériel situés sur le Site Web appartiennent entièrement à bitHolla et ceci en incluant toutes les marques déposées et autres droits de propriété intellectuelle en ce qui concerne le matériel et Services du Site Web. Le matériel de ce Site Web ne peut être utilisé qu'à des fins personnels et non commerciales.",
				"Vous pouvez afficher sur un écran d'ordinateur ou imprimer des extraits du Site Web pour des fins mentionnées précédemment à condition que vous conserviez les droits d'auteur et autres avis de propriété telles que les marques ou logos de bitHolla, comme indiqué sur l'impression initiale ou le téléchargement sans altération (ajout ou suppression non autorisés). Sauf indication claire dans les présentes, vous ne pouvez sans l'autorisation écrite préalable de bitHolla changer, modifier, reproduire, distribuer ou utiliser dans tout autre contexte commercial le matériel du Site Web.",
				'Vous reconnaissez que « bitHolla » et le logo bitHolla sont des marques de commerce de bitHolla Inc. Vous pouvez reproduire ces marques sans altération du matériel téléchargé à partir de ce Site Web dans la mesure autorisée ci-dessus, mais vous ne pouvez pas les utiliser, les copier, les adapter ou les effacer autrement.',
				"Vous ne devez en aucun cas obtenir des droits sur ou à l'égard du Site Web (autres que les droits d'utiliser le Site Web conformément aux présentes conditions et à toute autre condition régissant un service ou une section particulier du Site Web) ou vous présenter comme avoir de tels droits sur ou à l'égard du Site.",
			],
		},
		GENERAL_TERMS: {
			TITLE: 'Conditions générales de service',
			SUBTITLE:
				'Dernière mise à jour le 1er avril 2019. Cette présente remplace la version précédente complètement',
			TEXTS: [
				'HollaEx Web est une plateforme de trading virtuelle appartenant entièrement à bitHolla Inc. bitHolla Inc (dénommée bitHolla ci-après) a été créée à Séoul, en Corée du Sud.',
				'L\'utilisation du site internet HollaEx ("Site Web") et les services ("Service") proposés sur le Site Web sont régis par les conditions rédigées et disponible sur la page Termes et Conditions ("Termes"). Cet accord constitue entièrement l\'accord entre les deux parties. Toutes autres informations se trouvant sur le Site Web ou autres informations reçues via email ou téléphone (voie orale/ écrite) sont exclues de cet accord; la politique de l\'échange a pour but d\'informer et conseiller uniquement et ne constitue pas un accord légal entre les parties.',
				"En accédant et en vous informant ainsi qu'en téléchargeant les informations de ce Site Web et en utilisant les Services de bitHolla vous confirmez que vous avez lu et compris ces Termes et que vous les acceptés complètement sans conditions. bitHolla peut à n'importe quel moment, sans prévenir, modifier ces Termes. Vous acceptez de continuer à être liés à ces Termes et conditions et confirmez que bitHolla n'a aucune obligation de vous informer de quelconque changement. Vous acceptez que c'est de votre responsabilité de vous informer et de vérifier ces Termes périodiquement afin de voir si des annotations ont été faites. Ainsi votre action de continuer à consulter le Site Web ainsi que l'utilisation des Services proposés par bitHolla indique votre acceptation de ces Termes.",
				"Le Site Web et les droits d'auteur dans tous les textes, graphiques, images, logiciels et autre matériel situés sur le Site Web appartiennent entièrement à bitHolla et ceci en incluant toutes les marques déposées et autres droits de propriété intellectuelle en ce qui concerne le matériel et Services du Site Web. Le matériel de ce Site Web ne peut être utilisé qu'à des fins personnels et non commerciales.",
				"Vous pouvez afficher sur un écran d'ordinateur ou imprimer des extraits du Site Web pour des fins mentionnées précédemment à condition que vous conserviez les droits d'auteur et autres avis de propriété telles que les marques ou logos de bitHolla, comme indiqué sur l'impression initiale ou le téléchargement sans altération (ajout ou suppression non autorisés). Sauf indication claire dans les présentes, vous ne pouvez sans l'autorisation écrite préalable de bitHolla changer, modifier, reproduire, distribuer ou utiliser dans tout autre contexte commercial le matériel du Site Web.",
				'Vous reconnaissez que « bitHolla » et le logo bitHolla sont des marques de commerce de bitHolla Inc. Vous pouvez reproduire ces marques sans altération du matériel téléchargé à partir de ce Site Web dans la mesure autorisée ci-dessus, mais vous ne pouvez pas les utiliser, les copier, les adapter ou les effacer autrement.',
				"Vous ne devez en aucun cas obtenir des droits sur ou à l'égard du Site Web (autres que les droits d'utiliser le Site Web conformément aux présentes conditions et à toute autre condition régissant un service ou une section particulier du Site Web) ou vous présenter comme avoir de tels droits sur ou à l'égard du Site.",
			],
		},
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'Okay',
			START_TRADING: 'Commencez le trading',
			SEE_HISTORY: "Voir l'historique",
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} Dépôt reçu',
			TITLE_INCOMING: 'Transaction entrante{0}',
			SUBTITLE_RECEIVED: 'Vous avez reçu votre {0} de caution',
			SUBTITLE_INCOMING: 'Vous avez une transaction entrante {0}',
			INFORMATION_PENDING_1:
				'Votre {0} a besoin de 1 confirmation avant de commencer trading.',
			INFORMATION_PENDING_2:
				'Cela peut prendre entre 10 à 30 minutes. Nous vous enverrons un email une fois que votre {0} est confirmé sur la blockchain.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: 'Demande envoyée',
		BUTTON_TEXT: 'Okay',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: "Entrez votre code d'authentification pour continuer",
		OTP_LABEL: 'OTP Code',
		OTP_PLACEHOLDER: "Entrez votre code d'authentification",
		OTP_TITLE: "Code d'authentification",
		OTP_HELP: 'aide',
		OTP_BUTTON: 'soumettre',
		ERROR_INVALID: 'Code OTP invalide',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Quick Trade',
		TOTAL_COST: 'Coût total',
		BUTTON: 'Vérifier la commande {0}',
		INPUT: '{0} à {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: 'page précédente',
	NEXT_PAGE: 'page suivante',
	WALLET: {
		LOADING_ASSETS: 'téléchargement des actifs...', // new
		TOTAL_ASSETS: 'Total des actifs',
		AVAILABLE_WITHDRAWAL: 'Disponible pour trading',
		AVAILABLE_TRADING: 'Disponible en retrait',
		ORDERS_PLURAL: 'Transactions',
		ORDERS_SINGULAR: 'Transaction',
		HOLD_ORDERS:
			'Vous avez {0} ouverts {1}, ce qui entraîne une retenue de {2} {3} placée sur votre {4} de solde',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'Compte de récupération',
		SUBTITLE: `Récupérez votre compte ci-dessous`,
		SUPPORT: 'Contactez Support',
		BUTTON: 'Envoyer le lien de récupération',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'Réinitialisation du mot de passe envoyée',
		TEXT:
			'Si un compte existe avec cet adresse email, un email lui a été envoyé avec des instructions de réinitialisation. Veuillez vérifier vos emails et cliquer sur le lien pour terminer la réinitialisation de votre mot de passe',
	},
	RESET_PASSWORD: {
		TITLE: 'Définir un nouveau mot de passe',
		SUBTITLE: 'Définir un nouveau mot de passe',
		BUTTON: 'Définir un nouveau mot de passe',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'Vous avez correctement configuré un nouveau mot de passe.',
		TEXT_2: 'Cliquez sur Connexion ci-dessous pour continuer.',
	},
	SIGN_UP: {
		SIGNUP_TO: 'Inscrivez-vous pour {0}',
		NO_EMAIL: "Vous n'avez pas reçu l'e-mail?",
		REQUEST_EMAIL: 'Demandez-en un autre ici',
		HAVE_ACCOUNT: 'Vous avez déjà un compte?',
		GOTO_LOGIN: 'Aller à la page Connexion',
		AFFILIATION_CODE: 'Code de parrainage (facultatif)',
		AFFILIATION_CODE_PLACEHOLDER: 'Saisissez votre code de parrainage',
		TERMS: {
			terms: 'Conditions générales',
			policy: 'Politique de confidentialité',
			text: "J'ai lu et j'accepte les {0} et {1}",
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'Email envoyé',
		TEXT_1:
			'Vérifiez votre email et cliquez sur le lien pour vérifier votre email.',
		TEXT_2:
			"Si vous n'avez reçu aucune vérification par email et que vous avez vérifié vos indésirables, vous pouvez essayer de cliquer sur Renvoyer ci-dessous.",
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'Renvoyer la demande par email',
		BUTTON: 'Recevoir un email',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'Renvoyé email',
		TEXT_1:
			"Si après quelques minutes, vous n'avez toujours pas reçu de vérification par email, veuillez nous contacter ci-dessous.",
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'Code invalide',
		TEXT_1: 'Vous avez vérifié votre email correctement',
		TEXT_2: 'Vous pouvez maintenant vous connecter',
	},
	USER_VERIFICATION: {
		INFO_TXT:
			"Vous pouvez suivre ici l'évolution des vérifications et les mises à jour de comptes.",
		INFO_TXT_1:
			"Veuillez soumettre toutes les informations pertinentes nécessaires pour chaque section ci-dessous. Ce n'est que lorsque toutes les sections seront complétées que vos informations seront examinées et approuvées pour une mise à niveau de compte.",
		INFO_TXT_2:
			"* La vérification de la section d'identité vous oblige à {0} certains documents.",
		DOCUMENTATIONS: 'Télécharger',
		COMPLETED: 'Completé',
		PENDING_VERIFICATION: 'Vérification en attente',
		TITLE_EMAIL: 'Email',
		MY_EMAIL: 'Mon email',
		MAKE_FIRST_DEPOSIT: 'Effectuer le premier dépôt', // new
		OBTAIN_XHT: 'Obtenir des XHT', // new
		TITLE_USER_DOCUMENTATION: 'Identification',
		TITLE_ID_DOCUMENTS: 'Télécharger',
		TITLE_BANK_ACCOUNT: 'Compte bancaire',
		TITLE_MOBILE_PHONE: 'Téléphone portable',
		TITLE_PERSONAL_INFORMATION: 'Informations personnelles',
		VERIFY_EMAIL: 'Vérifiez votre émail',
		VERIFY_MOBILE_PHONE: 'Vérifiez votre téléphone portable',
		VERIFY_USER_DOCUMENTATION: "Vérifier la documentation de l'utilisateur",
		VERIFY_ID_DOCUMENTS: "Vérifier les documents d'identité",
		VERIFY_BANK_ACCOUNT: 'Vérifier compte bancaire',
		BUTTON: 'Soumettre une demande de vérification',
		TITLE_IDENTITY: 'Identité',
		TITLE_MOBILE: 'Téléphone',
		TITLE_MOBILE_HEADER: 'Numéro de téléphone',
		TITLE_BANK: 'Banque',
		TITLE_BANK_HEADER: 'Coordonnées bancaire',
		CHANGE_VALUE: 'Changer la valeur',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'Vos informations personnelles sont en cours de traitement',
		PENDING_VERIFICATION_BANK:
			'Vos coordonnées bancaires sont en cours de vérification',
		PENDING_VERIFICATION_DOCUMENTS:
			'Vos documents sont en cours de vérification',
		GOTO_VERIFICATION: 'Aller à la vérification',
		GOTO_WALLET: 'Aller au portefeuille', // new
		CONNECT_BANK_ACCOUNT: 'Connectez votre compte bancaire',
		ACTIVATE_2FA: 'Activer le code 2FA',
		INCOMPLETED: 'Incomplet',
		BANK_VERIFICATION: 'Vérification bancaire',
		IDENTITY_VERIFICATION: "vérification d'identité",
		PHONE_VERIFICATION: 'Vérification du téléphone',
		DOCUMENT_VERIFICATION: 'Document de vérification',
		START_BANK_VERIFICATION: 'Lancer la vérification bancaire',
		START_IDENTITY_VERIFICATION: 'Démarrer la vérification de votre identité',
		START_PHONE_VERIFICATION: 'Démarrer la vérification du téléphone',
		START_DOCUMENTATION_SUBMISSION: 'Commencer la soumission des documents',
		GO_BACK: 'Retour',
		BANK_VERIFICATION_TEXT_1:
			"Vous pouvez ajouter jusqu'à 3 comptes bancaires. Les comptes bancaires internationaux vous obligeront à contacter le service client et auront des limites de retrait.",
		BANK_VERIFICATION_TEXT_2:
			'En vérifiant votre compte bancaire, vous pouvez obtenir les éléments suivants:',
		BASE_WITHDRAWAL: 'Retrait Fiat',
		BASE_DEPOSITS: 'Dépôts Fiat',
		ADD_ANOTHER_BANK_ACCOUNT: 'Ajouter un autre compte bancaire',
		BANK_NAME: 'Nom de la banque',
		ACCOUNT_NUMBER: 'Numéro de compte',
		CARD_NUMBER: 'Numéro de carte',
		BANK_VERIFICATION_HELP_TEXT:
			'Pour que cette section soit vérifiée, vous devez remplir la section {0}.',
		DOCUMENT_SUBMISSION: 'Soumission de documents',
		REVIEW_IDENTITY_VERIFICATION: "Vérifier la vérification d'identité",
		PHONE_DETAILS: 'Détails du téléphone',
		PHONE_COUNTRY_ORIGIN: "Pays d'origine du téléphone",
		MOBILE_NUMBER: 'Numéro de portable',
		DOCUMENT_PROOF_SUBMISSION: 'Preuve de la soumission',
		START_DOCUMENTATION_RESUBMISSION:
			'Lancer la nouvelle soumission de la documentation',
		SUBMISSION_PENDING_TXT:
			'*Cette section a déjà été soumise. Effectuer des modifications et soumettre à nouveau écrasera vos informations précédentes.',
		CUSTOMER_SUPPORT_MESSAGE: "Message d'assistance client",
		DOCUMENT_PENDING_NOTE:
			"Vos documents ont été soumis et sont actuellement en train d'être éxaminés. Veuillez patienter.",
		DOCUMENT_VERIFIED_NOTE: 'Vos documents sont complétés.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: 'Note du service de vérification',
		CODE_EXPIRES_IN: 'Le code expire dans',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'Prénom',
				FIRST_NAME_PLACEHOLDER:
					"Entrez votre prénom tel qu'il apparaît sur votre pièce d'identité",
				LAST_NAME_LABEL: 'Nom de famille',
				LAST_NAME_PLACEHOLDER:
					"Entrez votre nom tel qu'il apparaît sur votre pièce d'identité",
				FULL_NAME_LABEL: 'Votre nom complet',
				FULL_NAME_PLACEHOLDER:
					"Entrez votre nom complet tel qu'il apparaît sur votre pièce d'identité ",
				GENDER_LABEL: 'Sexe',
				GENDER_PLACEHOLDER: 'Saisissez votre sexe',
				GENDER_OPTIONS: {
					MAN: 'Masculin',
					WOMAN: 'Féminin',
				},
				NATIONALITY_LABEL: 'Nationalité',
				NATIONALITY_PLACEHOLDER:
					"Entrez la nationalité sur votre pièce d'identité",
				DOB_LABEL: 'Date de naissance',
				COUNTRY_LABEL: 'Votre pays de résidence',
				COUNTRY_PLACEHOLDER:
					'Sélectionnez le pays dans lequel vous résidez actuellement',
				CITY_LABEL: 'Ville',
				CITY_PLACEHOLDER: 'Entrez la ville dans laquelle vous vivez',
				ADDRESS_LABEL: 'Adresse',
				ADDRESS_PLACEHOLDER: "Entrez l'adresse où vous vivez actuellement",
				POSTAL_CODE_LABEL: 'Code postal',
				POSTAL_CODE_PLACEHOLDER: 'Entrez votre code postal',
				PHONE_CODE_LABEL: 'Pays',
				PHONE_CODE_PLACEHOLDER:
					'Sélectionnez le pays dans lequel votre téléphone opère',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: 'Numéro de téléphone',
				PHONE_NUMBER_PLACEHOLDER: 'Entrez votre numéro de téléphone',
				CONNECTING_LOADING: 'Connecting',
				SMS_SEND: 'Envoyer SMS',
				SMS_CODE_LABEL: 'Code SMS',
				SMS_CODE_PLACEHOLDER: 'Saisissez votre code SMS',
			},
			INFORMATION: {
				TEXT:
					"IMPORTANT: Entrez votre nom dans les champs exactement comme il apparaît sur votre pièce d'identité (prénom complet + deuxièmes prénoms / initiales et nom (s) complet (s)). Êtes-vous une entreprise? Contactez le service client pour un compte d'entreprise.",
				TITLE_PERSONAL_INFORMATION: 'Informations personnelles',
				TITLE_PHONE: 'Téléphone',
				PHONE_VERIFICATION_TXT:
					'Indiquer des coordonnées valides nous aidera grandement à résoudre les conflits tout en empêchant les transactions indésirables sur votre compte.',
				PHONE_VERIFICATION_TXT_1:
					'Recevez des mises à jour en temps réel pour les dépôts et les retraits en partageant votre numéro de téléphone mobile.',
				PHONE_VERIFICATION_TXT_2:
					'Prouvez davantage votre identité et votre adresse en partageant votre numéro de téléphone LAN (facultatif).',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: "Veuillez sélectionner un type de pièce d'identité",
				ID_NUMBER: 'Veuillez saisir le numéro du document',
				ISSUED_DATE:
					'Veuillez sélectionner la date à laquelle votre document a été émis',
				EXPIRATION_DATE:
					"Veuillez sélectionner la date d'expiration de votre document",
				FRONT: 'Veuillez télécharger un scan de votre passeport',
				PROOF_OF_RESIDENCY:
					'Veuillez télécharger un scan du document prouvant votre adresse de résidence actuelle',
				SELFIE_PHOTO_ID:
					'Veuillez télécharger un selfie avec passeport et note',
			},
			FORM_FIELDS: {
				TYPE_LABEL: "Type de document d'identité",
				TYPE_PLACEHOLDER: "Sélectionnez le type de pièce d'identité",
				TYPE_OPTIONS: {
					ID: 'Identité',
					PASSPORT: 'Passeport',
				},
				ID_NUMBER_LABEL: 'Numéro de passeport',
				ID_NUMBER_PLACEHOLDER: 'Entrez votre numéro de passeport',
				ID_PASSPORT_NUMBER_LABEL: 'Numéro de passeport',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'Entrez votre numéro de passeport',
				ISSUED_DATE_LABEL: "Date d'émission du passeport",
				EXPIRATION_DATE_LABEL: "date d'expiration du passeport",
				FRONT_LABEL: 'Passeport',
				FRONT_PLACEHOLDER: 'Ajoutez une copie de votre passeport',
				BACK_LABEL: 'Verso du passeport',
				BACK_PLACEHOLDER:
					"Ajoutez une copie du verso de votre pièce d'identité (le cas échéant) ",
				PASSPORT_LABEL: 'Passeport',
				PASSPORT_PLACEHOLDER: 'Ajouter une copie de votre passeport',
				POR_LABEL: 'Document prouvant votre adresse',
				POR_PLACEHOLDER:
					"Ajoutez une copie d'un document qui prouve votre adresse",
				SELFIE_PHOTO_ID_LABEL: 'Votre selfie avec passeport et note',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'Ajoutez une copie de votre selfie avec passeport et note',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: "Document d'identité",
				PROOF_OF_RESIDENCY: 'Justificatif de domicile',
				ID_SECTION: {
					TITLE: 'Veuillez vous assurer que vos documents soumis sont:',
					LIST_ITEM_1:
						'DE HAUTE QUALITÉ (images en couleur, résolution 300dpi ou plus)',
					LIST_ITEM_2: 'VISIBLE ENTIÈREMENT (les filigranes sont autorisés).',
					LIST_ITEM_3: "VALIDE, avec la date d'expiration clairement visible.",
					WARNING_1:
						'Seul un passeport valide est accepté; Photos (haute qualité) ou scan de ces documents sont acceptés:',
					WARNING_2:
						'Assurez-vous de télécharger vos propres documents. Toute utilisation de documents falsifiés ou faux aura des conséquences juridiques et entraînera le gel de votre compte immédiatement.',
					WARNING_3:
						'Veuillez ne pas soumettre le passeport comme preuve de résidence.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'Pour éviter des retards lors de la vérification de votre compte, veuillez vous assurer que:',
					SECTION_1_TEXT_2:
						"Votre NOM, ADRESSE, DATE D'ÉMISSION et PAYS ÉMETTEUR sont clairement visibles.",
					SECTION_1_TEXT_3:
						"Le document de preuve de résidence soumis n'a PAS PLUS DE TROIS MOIS.",
					SECTION_1_TEXT_4:
						'Vous soumettez des photographies couleur ou des images numérisées de HAUTE QUALITÉ (au moins 300 DPI)',
					SECTION_2_TITLE: 'UNE PREUVE DE RÉSIDENCE ACCEPTABLE EST:',
					SECTION_2_LIST_ITEM_1: 'Un relevé de compte bancaire.',
					SECTION_2_LIST_ITEM_2:
						'Une facture des services publics (électricité, eau, internet, etc.).',
					SECTION_2_LIST_ITEM_3:
						'Un document émis par le gouvernement (déclaration fiscale, certificat de résidence, etc.).',
					WARNING:
						"Nous ne pouvons pas accepter l'adresse sur votre document d'identité soumis comme une preuve de résidence valide.",
				},
				SELFIE: {
					TITLE: 'Selfie avec passeport et note',
					INFO_TEXT:
						"Veuillez fournir une photo de vous tenant votre passeport. Sur la même photo mettre la référence à l'url de l'échange, la date du jour et votre signature. Assurez-vous que votre visage est clairement visible et que les détails de votre identité sont clairement lisibles.",
					REQUIRED: 'Obligatoire:',
					INSTRUCTION_1: 'Votre visage doit être clairement visible',
					INSTRUCTION_2: 'Votre passeport doit être clairement lisible',
					INSTRUCTION_3: "Écrivez le nom d'échange",
					INSTRUCTION_4: 'Écrivez la date du jour',
					INSTRUCTION_5: 'Signez la photo / écrivez votre signature',
					WARNING:
						"Le selfie d'un passeport différent avec le contenu téléchargé sera rejeté",
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'Veuillez saisir votre prénom et votre nom associés à votre compte bancaire',
				ACCOUNT_NUMBER:
					'Votre numéro de compte bancaire doit comporter moins de 50 chiffres',
				ACCOUNT_NUMBER_MAX_LENGTH:
					'Votre numéro de compte bancaire est limité à 50 caractères',
				CARD_NUMBER: 'Votre numéro de carte a un format incorrect',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'Nom de la banque',
				BANK_NAME_PLACEHOLDER: 'Entrez le nom de votre banque',
				ACCOUNT_NUMBER_LABEL: 'Numéro du compte bancaire',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Saisissez votre numéro de compte bancaire',
				ACCOUNT_OWNER_LABEL: 'Nom du titulaire du compte bancaire',
				ACCOUNT_OWNER_PLACEHOLDER:
					'Saisissez le même nom indiqué sur votre compte bancaire',
				CARD_NUMBER_LABEL: 'Numéro de carte bancaire',
				CARD_NUMBER_PLACEHOLDER:
					'Tapez le numéro à 16 chiffres qui se trouve au recto de votre carte bancaire',
			},
		},
		WARNING: {
			TEXT_1:
				'En vérifiant votre identité, vous pouvez obtenir les éléments suivants:',
			LIST_ITEM_1: 'Augmentation des limites de retrait',
			LIST_ITEM_2: 'Augmentation des limites de dépôt',
			LIST_ITEM_3: 'Frais moins élevés',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			"Modifiez les paramètres de votre compte. Depuis l'interface, les notifications, le nom d'utilisateur et d'autres personnalisations.",
		TITLE_TEXT_2:
			"L'enregistrement de vos paramètres appliquera les modifications et les enregistrera.",
		TITLE_NOTIFICATION: 'Notification',
		TITLE_INTERFACE: 'Interface',
		TITLE_LANGUAGE: 'Langues',
		TITLE_CHAT: 'Chat',
		TITLE_AUDIO_CUE: 'Tester le signal audio',
		TITLE_MANAGE_RISK: 'Gérer le risque',
		ORDERBOOK_LEVEL: "Niveau de l'Orderbook (Max 20)",
		SET_TXT: 'DÉTERMINÉ',
		CREATE_ORDER_WARING: 'Créer un avertissement de transaction',
		RISKY_TRADE_DETECTED: 'Échange risqué détecté',
		RISKY_WARNING_TEXT_1:
			'La valeur de cette transaction dépasse le montant de la limite de commande que vous avez défini {0} .',
		RISKY_WARNING_TEXT_2: '({0} du portefeuille)',
		RISKY_WARNING_TEXT_3:
			' Veuillez vérifier que vous souhaitez effectivement effectuer cette transaction.',
		GO_TO_RISK_MANAGMENT: 'ALLEZ À LA GESTION DES RISQUES',
		CREATE_ORDER_WARING_TEXT:
			"Créez une fenêtre d'avertissement lorsque votre transaction utilise plus de {0} de votre portefeuille",
		ORDER_PORTFOLIO_LABEL: 'Montant en pourcentage du portefeuille:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'Avertissement transactions',
			POPUP_ORDER_CONFIRMATION:
				'Demander une confirmation avant de soumettre la transaction',
			POPUP_ORDER_COMPLETED:
				'Ouvrir une nouvelle fenêtre lorsque la commande est terminée',
			POPUP_ORDER_PARTIALLY_FILLED:
				'Ouvrir une nouvelle fenêtre lorsque la commande est partiellement complétée',
		},
		AUDIO_CUE_FORM: {
			// new
			ALL_AUDIO: 'Tous les signaux audio',
			PUBLIC_TRADE_AUDIO: "Lorsqu'un échange public a été effectué",
			ORDERS_PARTIAL_AUDIO:
				"Lorsqu'une de vos transactions est partiellement exécutée",
			ORDERS_PLACED_AUDIO: 'Quand une transaction est passée',
			ORDERS_CANCELED_AUDIO: "Lorsqu'une transaction est annulée",
			ORDERS_COMPLETED_AUDIO:
				"Quand l'une de vos transactions est entièrement complétée.",
			CLICK_AMOUNTS_AUDIO:
				"En cliquant sur les montants et les prix de l'Orderbook",
			GET_QUICK_TRADE_AUDIO:
				"Lors de l'obtention d'un devis pour un échange rapide",
			SUCCESS_QUICK_TRADE_AUDIO:
				"Lorsqu'un échange rapide (quick trade) réussi est réalisé",
			QUICK_TRADE_TIMEOUT_AUDIO: "Lorsque l'échange rapide s'arrête",
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				"Créez une fenêtre d'avertissement lorsqu'une valeur d'une transaction dépasse un pourcentage défini de votre portefeuille",
			INFO_TEXT_1: 'Valeur totale des actifs en {0}: {1}',
			PORTFOLIO: 'Pourcentage du portefeuille ',
			TOMAN_ASSET: 'Valeur approximative',
			ADJUST: '(AJUSTER LE POURCENTAGE)',
			ACTIVATE_RISK_MANAGMENT: 'Activer la gestion des risques',
			WARNING_POP_UP: "Fenêtre d'avertissement",
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'Historique',
		TITLE_TRADES: 'Historique des échanges',
		TITLE_DEPOSITS: 'Historique des dépôts',
		TITLE_WITHDRAWALS: 'Historique des retraits',
		TEXT_DOWNLOAD: "TÉLÉCHARGER L'HISTOIRIQUE",
		TRADES: 'Échanges',
		DEPOSITS: 'Dépôts',
		WITHDRAWALS: 'Retraits',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'Adjust the security settings for your account. From Two-factor authentication, password, API keys and other security related functions.',
		OTP: {
			TITLE: 'Authentification à deux facteurs',
			OTP_ENABLED: 'otp activé',
			OTP_DISABLED: 'VEUILLEZ ACTIVER 2FA',
			ENABLED_TEXTS: {
				TEXT_1: 'Exiger OTP lors de la connexion',
				TEXT_2: 'Exiger OTP lors du retrait de fonds',
			},
			DIALOG: {
				SUCCESS: "Vous avez activé avec succès l'OTP",
				REVOKE: 'Vous avez révoqué avec succès votre OTP',
			},
			CONTENT: {
				TITLE: "Activer l'authentification à deux facteurs",
				MESSAGE_1: 'Scan',
				MESSAGE_2:
					"Scannez le code QR ci-dessous avec Google Authenticator ou Authy pour configurer automatiquement l'authentification à deux facteurs sur votre appareil.",
				MESSAGE_3:
					'Si vous rencontrez des problèmes lors de la numérisation, vous pouvez saisir manuellement le code ci-dessous',
				MESSAGE_4:
					'Vous pouvez sauvegarder ce code en toute sécurité pour récupérer votre 2FA au cas où vous changeriez ou perdriez votre téléphone portable.',
				MESSAGE_5: 'Manuellement',
				INPUT: 'Entrez votre One-Time Password (OTP)',
				WARNING:
					"Nous vous recommandons vivement de configurer l'authentification à 2 facteurs (2FA). Cela augmentera considérablement la sécurité de vos fonds.",
				ENABLE: "Activer l'authentification à deux facteurs ",
				DISABLE: "Désactiver l'authentification à deux facteurs",
				SECRET_1: 'Enter yor secret key',
				SECRET_2: 'Please enter your secret key to confirm you wrote it down.',
				SECRET_3:
					'This secret key will help you recover your account if you lost access to your phone.',
				INPUT_1: 'Secret Key',

				TITLE_2: 'Enter One-Time Password (OTP)',
				MESSAGE_6: 'Please enter your 6-digit one-time password below.',
				INPUT_2: 'One-Time Password (OTP)',
			},
			FORM: {
				PLACEHOLDER: 'Saisissez votre OTP fourni par Google Authenticator.',
				BUTTON: 'Activer 2FA',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'Changer le mot de passe',
			ACTIVE: 'ACTIF',
			DIALOG: {
				SUCCESS: 'vous avez changé votre mot de passe',
			},
			FORM: {
				BUTTON: 'Changer le mot de passe',
				CURRENT_PASSWORD: {
					label: 'Mot de passe actuel',
					placeholder: 'Entrez votre mot de passe actuel',
				},
				NEW_PASSWORD: {
					label: 'Nouveau mot de passe',
					placeholder: 'Entrez un nouveau mot de passe',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'Confirmer le nouveau mot de passe',
					placeholder: 'Veuillez reconfimer votre nouveau mot de passe',
				},
			},
		},
		LOGIN: {
			TITLE: 'Login History',
			CONTENT: {
				TITLE: 'Logins History',
				MESSAGE:
					'Below is login history list with details IP, country and time details. If you see any suspicious activity you should change your password and contact support',
			},
		},
		FREEZE: {
			TITLE: 'Freeze Account',
			CONTENT: {
				MESSAGE_1:
					'Freezing your account will stop whitdrawals and halts all tradings.',
				WARNING_1:
					'Use only if you fear that your account has been compromised',
				TITLE_1: 'Freeze your Account',
				TITLE_2: 'Account freezing',
				MESSAGE_2:
					'Freezing your account may help guard your account from cyber attacks.',
				MESSAGE_3:
					'The following will occur if you choose to freeze your account:',
				MESSAGE_4: '1. Pending withdrawals will be canceled.',
				MESSAGE_5:
					'2. All tradings will be halted and unfilled orders will be canceled.',
				MESSAGE_6:
					'3. Containing support will be required to reactivate your account.',
				WARNING_2: 'Do you really want to freeze your account?',
			},
		},
	},
	CURRENCY: 'Devise',
	TYPE: 'Type',
	TYPES_VALUES: {
		market: 'marché',
		limit: 'limite',
	},
	TYPES: [
		{ value: 'market', label: 'marché' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'limit', label: 'limite' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIDE: 'Acheter/Vendre',
	SIDES_VALUES: {
		buy: 'acheter',
		sell: 'vendre',
	},
	SIDES: [
		{ value: 'buy', label: 'acheter' },
		{ value: 'sell', label: 'vendre' },
	], // DO NOT CHANGE value, ONLY TRANSLATE label
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'on' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: false, label: 'off' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIZE: 'Taille',
	PRICE: 'Prix',
	FEE: 'Frais',
	FEES: 'Frais',
	LIMIT: 'Limite',
	TIME: 'Heure',
	TIMESTAMP: 'Horodatage',
	MORE: 'Plus',
	VIEW: 'Vue',
	STATUS: 'Statut',
	AMOUNT: 'Montant',
	COMPLETE: 'Completé',
	PENDING: 'En attente',
	REJECTED: 'Rejeté',
	ORDERBOOK: 'Order book',
	CANCEL: 'Annuler',
	CANCEL_ALL: 'Tout Annuler',
	GO_TRADE_HISTORY: "Accéder à l'historique des transactions",
	ORDER_ENTRY: 'Saisie des transactions',
	TRADE_HISTORY: 'historique',
	CHART: 'tableau des prix',
	ORDERS: 'mes transactions actives',
	TRADES: 'mon historique de transactions',
	RECENT_TRADES: 'Mes échanges récents', // ToDo
	PUBLIC_SALES: 'ventes publiques', // ToDo
	REMAINING: 'restante',
	FULLFILLED: '{0} % Complétée',
	FILLED: 'Remplie', // new
	LOWEST_PRICE: 'Prix le plus bas ({0})', // new
	PHASE: 'Phase', // new
	INCOMING: 'Entrante', // new
	PRICE_CURRENCY: 'PRIX',
	AMOUNT_SYMBOL: 'MONTANT',
	MARKET_PRICE: 'Prix du marché',
	ORDER_PRICE: 'Prix de la transaction',
	TOTAL_ORDER: 'Total de la transaction',
	NO_DATA: 'Aucune donnée',
	LOADING: 'Chargement',
	CHART_TEXTS: {
		d: 'Date',
		o: 'Open',
		h: 'High',
		l: 'Low',
		c: 'Close',
		v: 'Volume',
	},
	QUICK_TRADE: 'Échange rapide / Quick trade',
	PRO_TRADE: 'Pro trade',
	ADMIN_DASH: 'Page administrateur',
	WALLET_TITLE: 'Portefeuille',
	TRADING_MODE_TITLE: 'Trading Mode',
	TRADING_TITLE: 'Trading',
	LOGOUT: 'Se déconnecter',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'La transaction est trop petite pour être envoyée. Essayez un montant plus élevé.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'La transaction est trop grande pour être envoyée. Essayez un montant plus petit.',
	WITHDRAWALS_LOWER_BALANCE:
		"Vous n'avez pas suffisamment de {0} dans votre solde pour envoyer cette transaction",
	WITHDRAWALS_FEE_TOO_LARGE:
		'Les frais représentent plus de {0}% de votre transaction totale',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		"L'adresse Bitcoin n'est pas valide. Veuillez vérifier et saisir à nouveau",
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		"L'adresse Ethereum n'est pas valide. Veuillez vérifier et saisir à nouveau",
	WITHDRAWALS_BUTTON_TEXT: 'vérifier le retrait',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Adresse de destination',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: "Entrez l'adresse",
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'Destination tag (facultatif)', // new
	WITHDRAWALS_FORM_MEMO_LABEL: 'Memo (facultatif)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'Entrez destination tag', // new
	WITHDRAWALS_FORM_MEMO_PLACEHOLDER: 'Entrez le memo de la transaction', // new
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} montant à retirer',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Saisissez le montant de {0} que vous souhaitez retirer',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'Frais de transaction',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'Frais de retrait bancaire',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'Saisissez le montant de {0} que vous souhaitez utiliser dans les frais de transaction',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'Frais optimaux: {0} {1}', // TODO {0} -> amount {1} -> currency name
	DEPOSITS_FORM_AMOUNT_LABEL: '{0} montant à déposer',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER:
		'Saisissez le montant de {0} que vous souhaitez retirer',
	DEPOSITS_BUTTON_TEXT: 'vérifier le dépôt',
	DEPOSIT_PROCEED_PAYMENT: 'Payer',
	DEPOSIT_BANK_REFERENCE:
		'Ajoutez ce code "{0}" à la transaction bancaire pour identifier le virement',
	DEPOSIT_METHOD: 'Mode de paiement {0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'Carte de crédit',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1: 'Payer par carte de crédit.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'Vous allez quitter la plateforme pour effectuer le paiement.',
	DEPOSIT_VERIFICATION_WAITING_TITLE: 'Vérification du paiement',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		"Veuillez ne pas fermer l'application pendant la vérification du paiement",
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'En cas de problème lors de la vérification, veuillez nous contacter.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		"Il s'agit de l'Identité de l'opération: \"{0}\", veuillez nous fournir cet Identité pour vous aider.",
	DEPOSIT_VERIFICATION_SUCCESS: 'Paiement vérifié',
	DEPOSIT_VERIFICATION_ERROR:
		'Il y a eu une erreur lors de la vérification du dépôt.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: 'Le dépôt a déjà été vérifié',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'Statut invalide',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		"La carte sur laquelle vous avez effectué le dépôt n'est pas la même que votre carte enregistrée. Par conséquent, votre dépôt a été refusé et vos fonds vous seront remboursés en moins d'une heure.",
	QUOTE_MESSAGE: 'Vous allez à {0} {1} {2} pour {3} {4}',
	QUOTE_BUTTON: 'Accepter',
	QUOTE_REVIEW: 'Vérifier',
	QUOTE_COUNTDOWN_MESSAGE: "Vous avez {0} secondes pour effectuer l'échange",
	QUOTE_EXPIRED_TOKEN: 'Le devis du token a expiré.',
	QUOTE_SUCCESS_REVIEW_TITLE: 'Échange rapide / Quick Trade',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'Vous avez réussi {0} {1} {2} pour {3} {4}', // you have successfully buy 1 btc from x toman
	COUNTDOWN_ERROR_MESSAGE: 'Le compte à rebours est terminé',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'Banque sur laquelle vous souhaiter retirer',
		MESSAGE_ABOUT_SEND: "Vous êtes sur le point d'envoyer",
		MESSAGE_BTC_WARNING:
			"Veuillez vous assurer de l'exactitude de cette adresse, car {0} les transferts sont irréversibles",
		MESSAGE_ABOUT_WITHDRAW:
			"Vous êtes sur le point d'effectuer un virement sur votre compte bancaire",
		MESSAGE_FEE: 'Frais de transaction de {0} ({1}) inclus dedans',
		MESSAGE_FEE_BASE: 'Frais de transaction de {0} inclus dedans',
		BASE_MESSAGE_1:
			'Vous ne pouvez effectuer de retrait que sur un compte bancaire dont le nom correspond au nom enregistré avec votre compte',
		BASE_MESSAGE_2: 'Montant minimum de retrait',
		BASE_MESSAGE_3: 'Montant maximum du retrait quotidien',
		BASE_INCREASE_LIMIT: 'Augmentez votre limite quotidienne',
		CONFIRM_VIA_EMAIL: 'Confirmer par email',
		CONFIRM_VIA_EMAIL_1:
			'Nous vous avons envoyé un email de confirmation de retrait.',
		CONFIRM_VIA_EMAIL_2:
			'Afin de terminer le processus de retrait, veuillez confirmer',
		CONFIRM_VIA_EMAIL_3: 'le retrait via votre email dans les 5 minutes.',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'Votre demande de retrait est confirmée. Elle sera traitée sous peu.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			"Afin de voir votre statut de retrait, veuillez visiter votre page d'historique de retrait.",
		GO_WITHDRAWAL_HISTORY: "Aller à l'historique des retraits",
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'dépôt',
	WALLET_BUTTON_BASE_WITHDRAW: 'retrait',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'recevoir',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'envoyer',
	AVAILABLE_TEXT: 'Disponible',
	AVAILABLE_BALANCE_TEXT: 'Disponible {0} Solde: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Solde',
	CURRENCY_BALANCE_TEXT: '{0} Solde',
	WALLET_TABLE_AMOUNT_IN: `Montant en {0}`,
	WALLET_TABLE_TOTAL: 'Grand Total',
	WALLET_ALL_ASSETS: 'Toutes les monnaies',
	HIDE_TEXT: 'Cacher',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Vendeurs',
	ORDERBOOK_BUYERS: 'Acheteurs',
	ORDERBOOK_SPREAD: '{0} transactions', // 0 -> 660,000 T
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'Max',
	DATEFIELD_TOOGLE_DATE_GR: 'Calendrier Grégorien',
	VERIFICATION_WARNING_TITLE: 'Vérification de vos coordonnées bancaires',
	VERIFICATION_WARNING_MESSAGE:
		'Avant de retirer, vous devez vérifier vos coordonnées bancaires.',
	ORDER_SPENT: 'Dépensé',
	ORDER_RECEIVED: 'Reçu',
	ORDER_SOLD: 'Vendu',
	ORDER_BOUGHT: 'Acheté',
	ORDER_AVERAGE_PRICE: 'Prix moyen',
	ORDER_TITLE_CREATED: 'Une limite a bien été créée {0}', // 0 -> buy / sell
	ORDER_TITLE_FULLY_FILLED: '{0} transaction complétée correctement', // 0 -> buy / sell
	ORDER_TITLE_PARTIALLY_FILLED: '{0} transaction partiellement complétée', // 0 -> buy / sell
	ORDER_TITLE_TRADE_COMPLETE: '{0} {1} la transaction est complète', // 0 -> buy / sell
	LOGOUT_TITLE: 'Vous avez été déconnecté',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'Le token a expiré',
	LOGOUT_ERROR_LOGIN_AGAIN: 'Connectez-vous à nouveau', // ip doesnt match
	LOGOUT_ERROR_INVALID_TOKEN: 'Token invalide',
	LOGOUT_ERROR_INACTIVE: 'Vous avez été déconnecté car vous avez été inactif',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	QUICK_TRADE_OUT_OF_LIMITS: 'La taille de la transaction est hors limites',
	QUICK_TRADE_TOKEN_USED: 'Le token a été utilisé',
	QUICK_TRADE_QUOTE_EXPIRED: 'Le devis a expiré',
	QUICK_TRADE_QUOTE_INVALID: 'Devis invalide',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'Erreur lors du calcul du devis',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
		'La transaction avec la taille actuelle ne peut pas être complétée',
	QUICK_TRADE_ORDER_NOT_FILLED: "La transaction n'est pas complète",
	QUICK_TRADE_NO_BALANCE: 'Solde insuffisant pour exécuter la transaction',
	YES: 'Oui',
	NO: 'Non',
	NEXT: 'Suivant',
	SKIP_FOR_NOW: "Ignorer pour l'instant",
	SUBMIT: 'soumettre',
	RESUBMIT: 'soumettre à nouveau',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Documents manquants!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		"Pour obtenir un accès complet aux fonctions de retrait et de dépôt, vous devez soumettre vos documents d'identité sur la page dédiée à votre compte et informations personnelles.",
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Success!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'Vous recevrez une notification par email lorsque vos informations auront été traitées. Le traitement peut généralement prendre 1 à 3 jours.',
	VERIFICATION_NOTIFICATION_BUTTON: "PROCÉDER À L'ÉCHANGE",
	ERROR_USER_ALREADY_VERIFIED: 'Utilisateur déjà vérifié',
	ERROR_INVALID_CARD_USER:
		'Les informations bancaires ou de carte fournies sont incorrectes',
	ERROR_INVALID_CARD_NUMBER: 'Numéro de carte invalide',
	ERROR_LOGIN_USER_NOT_VERIFIED: "L'utilisateur n'est pas vérifié",
	ERROR_LOGIN_USER_NOT_ACTIVATED: "L'utilisateur n'est pas activé",
	ERROR_LOGIN_INVALID_CREDENTIALS: 'Identifiants incorrects',
	SMS_SENT_TO: 'SMS envoyé à {0}', // TODO check msg
	SMS_ERROR_SENT_TO:
		"Erreur lors de l'envoi du SMS à {0}. Veuillez actualiser la page et réessayer.", // TODO check msg
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'Identité de la transaction:', // TODO check msg
	CHECK_ORDER: 'Vérifiez et confirmez votre transaction',
	CHECK_ORDER_TYPE: '{0} {1}', // 0 -> maker/limit  1 -> sell/buy
	CONFIRM_TEXT: 'Confirmer',
	GOTO_XHT_MARKET: 'Aller sur le marché XHT', // new
	INVALID_CAPTCHA: 'Captcha invalide',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL: 'Préférences de langue (incluant les emails)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL:
		"Afficher une fenêtre d'avertissement de confirmation de la transaction",
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NON' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: true, label: 'OUI' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTINGS_THEME_LABEL: "Thème de l'interface utilisateur", // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'Blanc' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'dark', label: 'Sombre' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTING_BUTTON: 'sauvegarder',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'Retraits désactivés',
	VERIFICATION_NO_WITHDRAW_MESSAGE:
		'Votre compte est désactivé pour les retraits',
	UP_TO_MARKET: "Jusqu'au marché",
	VIEW_MY_FEES: 'Voir mes frais', // new
	DEVELOPER_SECTION: {
		TITLE: 'Clé API ',
		INFORMATION_TEXT:
			"L'API fournit des fonctionnalités telles que l'obtention des soldes de portefeuille, la gestion des ordres d'achat / de vente, la demande de retraits ainsi que des données de marché telles que les transactions récentes, le carnet d'ordres (Orderbook) et le ticker.",
		ERROR_INACTIVE_OTP:
			"Pour générer une clé API, vous devez activer l'authentification à 2 facteurs.",
		ENABLE_2FA: 'Activer le 2FA',
		WARNING_TEXT: "Ne partagez pas votre clé API avec d'autres.",
		GENERATE_KEY: 'Générer la clé API',
		ACTIVE: 'Active',
		INACTIVE: 'Inactive',
		INVALID_LEVEL:
			'Vous devez mettre à niveau votre niveau de vérification pour avoir accès à cette fonctionnalité', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'Générer la clé API',
		GENERATE_TEXT:
			'Veuillez nommer votre clé API et la conserver en privé après sa création. Vous ne pourrez plus le récupérer plus tard.',
		GENERATE: 'Générer',
		DELETE_TITLE: 'Supprimer la clé API',
		DELETE_TEXT:
			'La suppression de votre clé API est irréversible bien que vous puissiez générer une nouvelle clé API à tout moment. Voulez-vous supprimer votre clé API?',
		DELETE: 'SUPPRIMER',
		FORM_NAME_LABEL: 'Nom',
		FORM_LABLE_PLACEHOLDER: 'Nom de la clé API',
		API_KEY_LABEL: 'Clé API',
		SECRET_KEY_LABEL: 'Clé SECRÈTE',
		CREATED_TITLE: 'Copiez votre clé API',
		CREATED_TEXT_1:
			"Veuillez copier votre clé API car elle ne sera plus accessible à l'avenir.",
		CREATED_TEXT_2: 'Gardez votre clé privée.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'Nom',
		API_KEY: 'Clé API',
		SECRET: 'Secret',
		CREATED: 'Date de création',
		REVOKE: 'Révoquer',
		REVOKED: 'Révoqué',
		REVOKE_TOOLTIP: 'Vous devez activer 2FA pour révoquer le token ', // TODO
	},
	CHAT: {
		CHAT_TEXT: 'chat',
		MARKET_CHAT: 'Chat du marché',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'Lire la suite',
		SHOW_IMAGE: "Afficher l'image",
		HIDE_IMAGE: "Cacher l'image",
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'Message',
		SIGN_UP_CHAT: 'Inscrivez-vous au chat',
		JOIN_CHAT: "Définir le nom d'utilisateur pour discuter",
		TROLLBOX: 'Trollbox ({0})', // new
	},
	INVALID_USERNAME:
		"Le nom d'utilisateur doit comporter entre 3 et 15 caractères. Ne contient que des minuscules, des chiffres et des traits de soulignement",
	USERNAME_TAKEN:
		"Ce nom d'utilisateur a déjà été pris. Veuillez en essayer un autre.",
	USERNAME_LABEL: "Nom d'utilisateur (utilisé pour le chat)",
	USERNAME_PLACEHOLDER: "Nom d'utilisateur",
	TAB_USERNAME: "Nom d'utilisateur",
	USERNAME_WARNING:
		"Votre nom d'utilisateur ne peut être modifié qu'une seule fois. Veuillez vous assurer que votre nom d'utilisateur est acceptable.",
	USERNAME_CANNOT_BE_CHANGED: "Le nom d'utilisateur ne peut pas être changé",
	UPGRADE_LEVEL: 'Mettre à niveau le niveau du compte',
	LEVELS: {
		LABEL_LEVEL: 'Niveau',
		LABEL_LEVEL_1: 'Un',
		LABEL_LEVEL_2: 'Deux',
		LABEL_LEVEL_3: 'Trois',
		LABEL_MAKER_FEE: 'Frais du Maker',
		LABEL_TAKER_FEE: 'Frais du Taker',
		LABEL_BASE_DEPOSIT: 'Dépôt quotidien en euros',
		LABEL_BASE_WITHDRAWAL: 'Retrait quotidien en euros',
		LABEL_BTC_DEPOSIT: 'Dépôt Bitcoin quotidien',
		LABEL_BTC_WITHDRAWAL: 'Retrait quotidien de Bitcoin',
		LABEL_ETH_DEPOSIT: "Dépôt quotidien d'Ethereum",
		LABEL_ETH_WITHDRAWAL: "Retrait quotidien d'Ethereum",
		LABEL_PAIR_MAKER_FEE: '{0} Frais du Maker',
		LABEL_PAIR_TAKER_FEE: '{0} Frais du Taker',
		UNLIMITED: 'Illimité',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: 'Générer {0} portefeuille',
	WALLET_ADDRESS_GENERATE: 'Générer',
	WALLET_ADDRESS_MESSAGE:
		'Lorsque vous générez un portefeuille, vous créez une adresse de dépôt et de retrait.',
	WALLET_ADDRESS_ERROR:
		"Erreur lors de la génération de l'adresse, veuillez actualiser et réessayer.",
	DEPOSIT_WITHDRAW: 'Dépôt/Retrait',
	GENERATE_WALLET: 'Générer portefeuille',
	TRADE_TAB_CHART: 'Graphique',
	TRADE_TAB_TRADE: 'Échanges',
	TRADE_TAB_ORDERS: 'Transactions',
	TRADE_TAB_POSTS: 'Postes', // new
	WALLET_TAB_WALLET: 'Portefeuille',
	WALLET_TAB_TRANSACTIONS: 'Transactions',
	RECEIVE_CURRENCY: 'Recevoir {0}',
	SEND_CURRENCY: 'Envoyer {0}',
	COPY_ADDRESS: "Copier l'adresse",
	SUCCESFUL_COPY: 'Correctement copié!',
	QUICK_TRADE_MODE: 'Échanges rapide/ Quick Trade Mode',
	JUST_NOW: 'maintenant',
	PAIR: 'Paire',
	ZERO_ASSET: 'Vous avez aucun actif',
	DEPOSIT_ASSETS: "Dépôt d'actifs",
	SEARCH_TXT: 'Rechercher',
	SEARCH_ASSETS: 'Chercher des actifs',
	TOTAL_ASSETS_VALUE: 'Total de la valeur des actifs en{0}: {1}',
	SUMMARY: {
		TITLE: 'Tableau de bord',
		TINY_PINK_SHRIMP_TRADER: 'Trader Crevettes Roses',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'Compte du Trader Crevettes Roses ',
		LITTLE_RED_SNAPPER_TRADER: 'Trader Petit Poisson Rouge',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'Compte du Trader Petit Poisson Rouge',
		CUNNING_BLUE_KRAKEN_TRADING: 'Échange Kraken Bleu Rusé',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: "Compte de l'échange Kraken Bleu Rusé",
		BLACK_LEVIATHAN_TRADING: 'Échange Léviathan Noir',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: "Compte de l'échange Léviathan Noir",
		URGENT_REQUIREMENTS: 'Besoins urgents',
		TRADING_VOLUME: "Volume d'échanges",
		ACCOUNT_ASSETS: 'Compte des actifs',
		ACCOUNT_DETAILS: 'Détails du compte',
		SHRIMP_ACCOUNT_TXT_1: 'Votre expérience commence ici!',
		SHRIMP_ACCOUNT_TXT_2:
			'Continuez à nager, vous vous démarquerez bientôt du reste du banc',
		SNAPPER_ACCOUNT_TXT_1:
			'Félicitations pour garder le cap à travers la houle du marché.',
		SNAPPER_ACCOUNT_TXT_2:
			'Forgez et combattez la vague pour plus de trésors cryptographiques à venir.',
		KRAKEN_ACCOUNT_TXT_1: 'Ce crustacé a résisté à son lot de tempêtes!',
		LEVIATHAN_ACCOUNT_TXT_1:
			"Bête de l'abîme, voyant à travers les altcoins dans des profondeurs insondables, maîtres des eaux de minuit et des raz-de-marée.",
		VIEW_FEE_STRUCTURE: 'Afficher la structure des frais et les limites',
		UPGRADE_ACCOUNT: 'Mettre à jour le compte',
		ACTIVE_2FA_SECURITY: 'Sécurité 2FA active',
		ACCOUNT_ASSETS_TXT_1: "Un résumé de tous vos actifs s'affiche.",
		ACCOUNT_ASSETS_TXT_2:
			"Détenir une grande quantité d'actifs vous donnera droit à une élévation de votre niveau de compte qui comprend un badge unique et des frais d'échanges inférieurs.",
		TRADING_VOLUME_TXT_1:
			"L'historique de votre volume d'échanges est affiché dans {0} et est nominalement calculé à la fin de chaque mois à partir de toutes les paires d'échanges.",
		TRADING_VOLUME_TXT_2:
			"Une activité de trading élevée vous donnera droit à une élévation de votre niveau de compte vous récompensant avec un badge unique et d'autres avantages.",
		ACCOUNT_DETAILS_TXT_1:
			'Votre type de compte détermine votre badge, les frais de trading, les dépôts et les limites de retrait.',
		ACCOUNT_DETAILS_TXT_2:
			"L'âge de votre compte de trading, le niveau d'activité et le montant total des actifs du compte détermineront si votre compte est éligible pour une mise à niveau.",
		ACCOUNT_DETAILS_TXT_3:
			"Maintenir le niveau de votre compte nécessite des échanges constants et le maintien d'un certain montant d'actifs déposés.",
		ACCOUNT_DETAILS_TXT_4:
			"Une rétrogradation périodique des comptes se produira si l'activité et les actifs ne sont pas maintenus.",
		REQUIREMENTS: 'Obligation',
		ONE_REQUIREMENT: 'Une seule exigence:', // new
		REQUEST_ACCOUNT_UPGRADE: 'Demander une mise à jour du compte',
		FEES_AND_LIMIT: '{0} Structure des frais et des limites', // new
		FEES_AND_LIMIT_TXT_1:
			"Devenir un crypto trader marque un nouveau départ. Armé d'esprit, de volonté et de rapidité, ce n'est qu'en prenant des risques et en réalisant des transactions que vous serez autorisé à mettre à jour votre compte.",
		FEES_AND_LIMIT_TXT_2:
			'Chaque compte a ses propres frais et limites de dépôt et de retrait.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'Dépôt et indemnité de retrait',
		TRADING_FEE_STRUCTURE: "Structure des frais d'échanges",
		WITHDRAWAL: 'Retraits',
		DEPOSIT: 'Dépôts',
		TAKER: 'Taker',
		MAKER: 'Maker',
		WEBSITE: 'website',
		VIP_TRADER_ACCOUNT_ELIGIBLITY:
			'Éligibilité à la mise à niveau du compte VIP Trader',
		PRO_TRADER_ACCOUNT_ELIGIBLITY:
			'Éligibilité à la mise à niveau du compte Pro Trader',
		TRADER_ACCOUNT_ELIGIBILITY: 'Éligibilité du compte de niveau {0}',
		NOMINAL_TRADING: 'Échange nominale',
		NOMINAL_TRADING_WITH_MONTH: 'Échange nominale en dernier {0}',
		ACCOUNT_AGE_OF_MONTHS: 'Âge du compte de {0} mois',
		TRADING_VOLUME_EQUIVALENT: "{0} {1} Équivalent du volume d'échanges",
		LEVEL_OF_ACCOUNT: 'Compte de niveau {0} ',
		LEVEL_TXT_DEFAULT: 'Ajoutez la description de votre niveau ici',
		LEVEL_1_TXT:
			'Votre voyage commence ici, jeune cryptotrader! Pour obtenir des bonus, vous pouvez vérifier votre identiﬁcation et obtenir des limites de dépôt et de retrait plus importantes avec des frais de transactions réduits.', // new
		LEVEL_2_TXT:
			"Il vous suffit de négocier mensuellement plus de 3000 USD ou d'avoir un solde supérieur à 5000 XHT et de profiter de frais de transactions inférieurs.", // new
		LEVEL_3_TXT:
			"C'est là que les choses deviennent réelles! Profitez de frais de transactions réduits et de plus grandes limites de dépôt et de retrait. Pour arriver au niveau 3, vous devez terminer votre vériﬁcation", // new
		LEVEL_4_TXT:
			"Il vous suffit de négocier mensuellement plus de 10000 USD ou d'avoir un solde de plus de 10000 XHT et de profiter de frais de transactions inférieurs.", // new
		LEVEL_5_TXT:
			"Vous avez réussi! Le compte de niveau 5 est un compte rare uniquement pour les opérateurs d'échange, les utilisateurs de Vault ou le programme d'affiliation HollaEx (HAP). Profitez de larges limites et profitez de zéro frais de création.", // new
		LEVEL_6_TXT:
			"Il vous suffit de négocier mensuellement plus de 300 000 USD ou d'voir un solde supérieur à 100 000 XHT et de bénéficier de frais de transactions inférieurs. Augmentation du montant de retrait.", // new
		LEVEL_7_TXT:
			"Il vous suffit de négocier mensuellement plus de 500 000 USD ou d'avoir un solde supérieur à 300 000 XHT et de bénéficier de frais de transactions inférieurs. Augmentation du montant de retrait.", // new
		LEVEL_8_TXT:
			"Il vous suffit de négocier mensuellement plus de 600000 USD ou d'avoir un solde de plus de 400000 XHT et de profiter de frais de transactions inférieurs.", // new
		LEVEL_9_TXT:
			"Il vous suffit de négocier mensuellement plus de 2000000 USD ou d'avoir un solde supérieur à 1000000 XHT et de profiter de frais de transactions inférieurs.", // new
		LEVEL_10_TXT:
			"The compte whale trader vous rapporte de l'argent pour la création de marché. Pour obtenir ce compte spécial, veuillez nous contacter.", // new
		CURRENT_TXT: 'Actuel',
		TRADER_ACCOUNT_XHT_TEXT:
			'Votre compte est en période de prévente de XHT, cela signifie que vous pouvez obtenir XHT pour 0,10 $ par XHT. Tous les dépôts seront convertis en XHT une fois la transaction effacée.',
		TRADER_ACCOUNT_TITLE: 'Compte - Période de prévente', // new
		HAP_ACCOUNT: 'Compte HAP', // new
		HAP_ACCOUNT_TXT:
			"Votre compte est un compte de programme d'affiliation HollaEx vérifié. Vous pouvez maintenant gagner 10% de bonus pour chaque personne que vous invitez qui achète XHT.", // new
		EMAIL_VERIFICATION: "Verification de l'email ", // new
		DOCUMENTS: 'Documents', // new
		HAP_TEXT: "Programme d'affiliation HollaEx(HAP) {0}", // new
		LOCK_AN_EXCHANGE: 'Verrouiller un échange {0}', // new
		WALLET_SUBSCRIPTION_USERS: "Utilisateur de l'abonnement Vaults {0}", // new
		TRADE_OVER_XHT: 'Tradez plus de {0} USDT', // new
		TRADE_OVER_BTC: 'Tradez plus de {0} BTC', // new
		XHT_IN_WALLET: '{0} XHT dans le portefeuille', // new
		REWARDS_BONUS: 'Récompenses et bonus', // new
		COMPLETE_TASK_DESC:
			"Terminez des tâches et gagnez des bonus d'une valeur de plus de 10 000 $.", // new
		TASKS: 'Tâches', // new
		MAKE_FIRST_DEPOSIT: 'Faites votre premier dépôt recevez 1 XHT', // new
		BUY_FIRST_XHT: 'Achetez votre premier XHT et recevez un bonus de 5 XHT ', // new
		COMPLETE_ACC_VERIFICATION:
			'Terminez la vérification du compte et obtenez un bonus de 20 XHT', // new
		INVITE_USER:
			'Invitez des utilisateurs et profitez des commissions de leur échanges', // new
		JOIN_HAP:
			'Rejoignez HAP et gagnez 10% pour chaque kit HollaEx que vous vendez', // new
		EARN_RUNNING_EXCHANGE:
			'Gagnez un revenu passif en gérant votre propre échange', // new
		XHT_WAVE_AUCTION: 'XHT Wave Auction Data', // new
		XHT_WAVE_DESC_1:
			"La distribution du token HollaEx (XHT) se fait par le biais d'une vente aux enchères par vague (Wave Auction).", // new
		XHT_WAVE_DESC_2:
			"L'enchère Wave vend une quantité aléatoire de XHT à des moments aléatoires aux plus offrants de l'Orderbook", // new
		XHT_WAVE_DESC_3:
			"Ci-dessous s'affiche les données sur l'historique de l'enchère Wave", // new
		WAVE_AUCTION_PHASE: 'Phase Wave Auction {0}', // new
		LEARN_MORE_WAVE_AUCTION: "En savoir plus l'enchère", // new
		WAVE_NUMBER: 'Wave Number', // new
		DISCOUNT: '( {0}% discount )', // new
		MY_FEES_LIMITS: ' Mes frais et limites', // new
	},
	REFERRAL_LINK: {
		TITLE: 'Inviter un ami', // new
		INFO_TEXT:
			"Parrainez vos amis en leur donnant ce lien et bénéficiez d'avantages en intégrant d'autres personnes.",
		COPY_FIELD_LABEL:
			'Partagez le lien ci-dessous avec des amis et gagnez des commissions:', // new
		REFERRED_USER_COUT: 'Vous avez parrainé {0} utilisateur(s)', // new
		COPY_LINK_BUTTON: 'COPIER LE LIEN DE PARRAINAGE', // new
		XHT_TITLE: 'MES PARRAINAGES', // new
		XHT_INFO_TEXT: 'Gagnez des commissions en invitant vos amis.', // new
		XHT_INFO_TEXT_1:
			'Les commissions sont payées périodiquement sur votre portefeuille', // new
		APPLICATION_TXT:
			'Pour devenir un distributeur HollaEx Kit, veuillez remplir une demande.', // new
		TOTAL_REFERRAL: 'Total des achats via parrainage:', // new
		PENDING_REFERRAL: 'Commissions en attente:', // new
		EARN_REFERRAL: 'Commissions gagnées:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'INSCRIPTION', // new
	},
	STAKE_TOKEN: {
		TITLE: 'Revendiquer HollaEx Token', // new
		INFO_TXT1:
			"HollaEx tokens (XHT) doivent être garantis (collateralized) pour exécuter le logiciel d'échange HollaEx Kit.", // new
		INFO_TXT2:
			"Vous pouvez garantir votre token HollaEx de la même manière et gagner du XHT non vendu pendant l'enchère Wave.", // new
		INFO_TXT3:
			"Rendez-vous simplement sur dash.bitholla.com et garantissez votre propre échange aujourd'hui et gagnez des XHT gratuits", // new
		BUTTON_TXT: 'EN SAVOIR PLUS', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: "Condition d'achat du token HollaEx",
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: 'PROCEDÉ',
		AGREE_TERMS_LABEL:
			"J'ai lu et j'accepte le contrat d'achat du token HollaEx ",
		RISK_INVOLVED_LABEL: 'Je comprends les risques encourus',
		DOWNLOAD_PDF: 'Télécharger le PDF',
		DEPOSIT_FUNDS:
			'Déposez des fonds dans votre portefeuille pour obtenir un token HollaEx (XHT)',
		READ_FAG: 'Lisez la FAQ HollaEx ici: {0}',
		READ_DOCUMENTATION: 'Lisez le livre blanc HollaEx ici: {0}',
		READ_WAVES:
			'Règles pour la prochaine vente aux enchères publique de décembre {0}', // new
		DOWNLOAD_BUY_XHT:
			'Téléchargez le PDF pour voir un processus visuel étape par étape sur {0}',
		HOW_TO_BUY: 'Comment acheter un token HollaEx(XHT)',
		PUBLIC_SALES: ' Enchère publique (Public Wave Auction)', // new
		CONTACT_US:
			"N'hésitez pas à nous contacter pour plus d'informations et pour tout problème en nous envoyant un email à {0}",
		VISUAL_STEP: 'Voir un processus visuel étape par étape sur {0}', // new
		WARNING_TXT:
			"Nous examinerons votre demande et enverrons des instructions supplémentaires sur votre adresse email sur la façon d'accéder à l'échange HollaEx.", // new
		WARNING_TXT1:
			'En attendant, vous pouvez vous familiariser avec le réseau HollaEx avec les ressources ci-dessous', // new
		XHT_ORDER_TXT_1: 'Pour commencer à trader, vous devez vous connecter', // new
		XHT_ORDER_TXT_2: '', // new
		XHT_ORDER_TXT_3: '{0} ou {1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: 'Connectez-vous pour voir vos transactions récentes', //new
		XHT_TRADE_TXT_2: "Vous pouvez {0} voir l'historique de vos échanges", //new
		LOGIN_HERE: 'lConnectez-vous ici',
	},
	WAVES: {
		// new
		TITLE: 'Info Wave',
		NEXT_WAVE: 'Prochaine enchère Wave',
		WAVE_AMOUNT: 'Montant en Wave',
		FLOOR: 'Floor',
		LAST_WAVE: 'Dernière enchère wave',
	},
	TYPES_OF_POSTS: {
		// new
		TITLE: 'POSTES',
		ANNOUNCEMEN: 'Annonce',
		SYSTEM_UPDATE: 'Mise à jour du système',
		LAST_WAVE: 'Dernière Wave',
		ANNOUNCEMENT_TXT:
			"XHT gratuit sera distribué à tous les portefeuilles qui s'appliquent",
		SYSTEM_UPDATE_TIME: 'Heure: 12 h 31, 19 décembre 2019 ',
		SYSTEM_UPDATE_DURATION: '1 heure',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: ' 12:31 PM, 19 décembre 2019',
	},
	USER_LEVEL: "Niveau de l'utilisateur", // new
	LIMIT_AMOUNT: 'montant limite', // new
	FEE_AMOUNT: 'Montant des frais', // new
	COINS: 'Coins', // new
	PAIRS: 'Paires', // new
	NOTE_FOR_EDIT_COIN:
		'Remarque: pour ajouter et supprimer {0}, veuillez consulter le {1}.', // new
	REFER_DOCS_LINK: 'documents', // new
	RESTART_TO_APPLY:
		'Vous devez redémarrer votre échange pour appliquer ces modifications.', // new
	TRIAL_EXCHANGE_MSG:
		"Vous utilisez une version d'essai de {0} et elle expirera dans {1} jours.", // new
	EXPIRY_EXCHANGE_MSG:
		"Votre échange a expiré. Accédez à dash.bitholla.com pour l'activer à nouveau.", // new
	EXPIRED_INFO_1: 'Votre essai est terminé.', // new
	EXPIRED_INFO_2: "Garantissez votre échange pour l'activer à nouveau.", // new
	EXPIRED_BUTTON_TXT: 'ACTIVER LES ÉCHANGES ', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: 'Annonce',
		ANNOUNCEMNT_TXT_3:
			'Le lancement public et la vente aux enchères sont reportés au 1er janvier 2020. Le dépôt et les retraits de portefeuille sont maintenant ouverts.',
		ANNOUNCEMNT_TXT_4:
			"Bonne année Hollaers. Nous avons fais une nouvelle marque à partir de 2020 avec le lancement de la plateforme de trading la plus ouverte avec l'aide de vous tous.",
		ANNOUNCEMNT_TXT_1:
			"Gagnez XHT avec le programme HAP en présentant l'échange à vos amis.{0}.",
		DEFAULT_ANNOUNCEMENT:
			"Cette section affiche vos annonces publiques d'échange!",
		ANNOUNCEMENT_TXT_2:
			'Des XHT gratuits seront distribué à tous les portefeuilles {0}.',
		LEARN_MORE: 'En savoir plus',
		APPLY_TODAY: "S'inscrire aujourd'hui", // new
	},
	OPEN_WALLET: 'Ouvrir portefeuille', // new
	AGO: 'ago', // new
};
