import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';

export default {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Open Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: '¿Está seguro?. Quiere cerrar sesión',
	ADD_TRADING_PAIR: 'Agregar Par de Intercambio',
	ACTIVE_TRADES: 'Necesita {0} para accesar al intercambio de activos',
	CANCEL_BASE_WITHDRAWAL: 'Cancelar {0} Retiro',
	CANCEL_WITHDRAWAL: 'Cancelar Retiro',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM: 'Quiere cancelar su retiro pendiente de:',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'Iniciar Sesión',
	SIGN_IN: 'Iniciar Sesión',
	SIGNUP_TEXT: 'Registrarse',
	REGISTER_TEXT: 'Registrar',
	ACCOUNT_TEXT: 'Cuenta',
	HOME_TEXT: 'Home',
	CLOSE_TEXT: 'Cerrar',
	COPY_TEXT: 'Copiar',
	COPY_SUCCESS_TEXT: 'Copiado Exitosamente',
	CANCEL_SUCCESS_TEXT: '¡Cancelado Exitosamente',
	UPLOAD_TEXT: 'Cargar',
	ADD_FILES: 'AGREGAR ARCHIVOS', // ToDo
	OR_TEXT: 'O',
	CONTACT_US_TEXT: 'Contáctenos',
	HELPFUL_RESOURCES_TEXT: 'Recursos de Ayuda',
	HELP_RESOURCE_GUIDE_TEXT:
		'Contáctar support@hollaex.com para más información y enviar correo si hay algún problema',
	HELP_TELEGRAM_TEXT: 'Revisar documentación API abierta:',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: '¿Necesita ayuda?', // new
	HELP_TEXT: 'help',
	SUCCESS_TEXT: 'Éxito',
	ERROR_TEXT: 'Error',
	PROCEED: 'CONTINUAR',
	EDIT_TEXT: 'Editar',
	BACK_TEXT: 'Atrás',
	NO_OPTIONS: 'No hay opciones disponibles',
	SECONDS: 'seconds',
	VIEW_MARKET: 'ver mercardo', // new
	GO_TRADE: 'Ir a Intercambiar', // new
	VIEW_INFO: 'Ver Página de Info', // new
	APPLY_HERE: 'Aplicar Aquí', // new
	HOME: {
		SECTION_1_TITLE: '¡Bienvenido a HollaEx Exchange Kit!',
		SECTION_1_TEXT_1:
			'Construya su propio exchange de activos digitales escalables con el Kit HollaEx y sea parte del futuro de las finanzas.',
		SECTION_1_TEXT_2:
			'Nos esforzamos por hacer avanzar la tecnología financiera a través de un acceso simple y adquirible a la tecnología de intercambio.',
		SECTION_1_BUTTON_1: 'Aprender más',
		SECTION_3_TITLE: 'Funciones',
		SECTION_3_CARD_1_TITLE: 'BUSCADOR DE COINCIDENCIA ESCALABLE',
		SECTION_3_CARD_1_TEXT:
			'Buscador usando el más eficiente algoritmo de alto rendimiento y pedidos coincididos escalables',
		SECTION_3_CARD_2_TITLE: 'INTEGRACIÓN BANCARIA',
		SECTION_3_CARD_2_TEXT:
			'Complementos con módulos personalizables disponibles para integración bancaria. Conocemos las finanzas tradicionales y podemos ayudarle que su exchange sea local',
		SECTION_3_CARD_3_TITLE: 'SEGURIDAD FUERTE',
		SECTION_3_CARD_3_TEXT:
			'HollaEx utiliza las mejores prácticas de seguridad y los algoritmos más eguros y confiables para mentener seguros los fondos. Es nuestra máxima prioridad y la cuidamos especialemente.',
		SECTION_3_CARD_4_TITLE: 'REPORTE AVANZADO',
		SECTION_3_CARD_4_TEXT:
			'Panel de administración con correo electrónico y reportes personalizables para notificar al soporte y administrador sobre el estado del sistema y transacción.',
		SECTION_3_CARD_5_TITLE: 'SOPORTE',
		SECTION_3_CARD_5_TEXT:
			'Podemos ocuparnos de sus necesidades y tener a un profesional en línea para ayudarlo con sus problemas y consultas.',
		SECTION_3_CARD_6_TITLE: 'INTEGRACIÓN KYC',
		SECTION_3_CARD_6_TEXT:
			'Módulos flexibles e inegrables para aplicar KYC y métodos de verificación de usuarios en diferentes jurisdicciones.',
		SECTION_3_BUTTON_1: 'Ver Demo',
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
		SECTIONS: {
			SECTION_1_TITLE: 'ABOUT',
			SECTION_1_LINK_1: 'About Us',
			SECTION_1_LINK_2: 'Términos de Uso',
			SECTION_1_LINK_3: 'Política de Privacidad',
			SECTION_1_LINK_4: 'Contact Us',
			SECTION_2_TITLE: 'INFORMATION',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Contact Us',
			SECTION_2_LINK_3: 'Career',
			SECTION_3_TITLE: 'DEVELOPERS',
			SECTION_3_LINK_1: 'Documentation',
			SECTION_3_LINK_2: 'Forum',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'Library',
			SECTION_3_LINK_5: 'API doc',
			SECTION_3_LINK_6: 'API',
			SECTION_3_LINK_7: 'Developer tools',
			SECTION_3_LINK_8: 'Docus',
			SECTION_4_TITLE: 'EXCHANGE',
			SECTION_4_LINK_1: 'Iniciar Sesión',
			SECTION_4_LINK_2: 'Registrarse',
			SECTION_4_LINK_3: 'Contáct Usd',
			SECTION_4_LINK_4: 'Terms of Use',
			SECTION_5_TITLE: 'RESOURCES',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'HollaEx Token (XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'FAQ', // new
			SECTION_6_TITLE: 'SOCIAL',
			SECTION_6_LINK_1: 'Twitter',
			SECTION_6_LINK_2: 'Telegram',
			SECTION_6_LINK_3: 'Facebook', // new
			SECTION_6_LINK_4: 'Instagram', // new
			SECTION_6_LINK_5: 'Linkedin', // new
			SECTION_6_LINK_6: 'Sitio Web', // new
			SECTION_6_LINK_7: 'Helpdesk', // new
			SECTION_6_LINK_8: 'Información', // new
			SECTION_6_LINK_9: 'YouTube', // new
		},
		XHT_DESCRIPTION:
			'HollaEx es una plataforma de intercambio de código abbierto creada por bitHolla Inc. Puede crear y enumerar cualquier activo digital y abordar usuarios para intercambiar en su exchange usando el Kit de exchange. Para simpletemente ejecutar uno usted mismo {1}.',
		CLICK_HERE: 'click aquí',
		VISIT_HERE: 'visitar aquí',
	},
	ACCOUNTS: {
		TITLE: 'Cuenta',
		TAB_VERIFICATION: 'Verificación',
		TAB_SECURITY: 'Seguridad',
		TAB_NOTIFICATIONS: 'Notificaciones',
		TAB_SETTINGS: 'Configuración',
		TAB_PROFILE: 'Perfil',
		TAB_WALLET: 'Monedero',
		TAB_SUMMARY: 'Resumen',
		TAB_HISTORY: 'Historial',
		TAB_API: 'API',
		TAB_SIGNOUT: 'Cerrar Sesión',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: 'Solicitar Acceso',
		REQUEST_INVITE: 'Solicitar Invitación',
		CATEGORY_PLACEHOLDER:
			'Seleccionar la categoría que mejor se adapta a su problema',
		INTRODUCTION_LABEL: 'Introducirse',
		INTRODUCTION_PLACEHOLDER:
			'¿Dónde está basado?, ¿está interesado en ejecutar una exchange?',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'Categoría',
		CATEGORY_PLACEHOLDER:
			'Seleccionar la categoría que mejor se adapta a su problema',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'Verificación de usuario',
			OPTION_LEVEL: 'Subir nivel del usuario',
			OPTION_DEPOSIT: 'Depósito & Retiro',
			OPTION_BUG: 'Reportar error', // ToDo:
			OPTION_PERSONAL_INFO: 'Cambiar información personal', // ToDo:
			OPTION_BANK_TRANSFER: 'Transferencia bancaria', // new
			OPTION_REQUEST: 'Solicitar invitación para HollaEx Exchange', // new
		},
		SUBJECT_LABEL: 'Tema',
		SUBJECT_PLACEHOLDER: 'Escribir el tema de su problema',
		DESCRIPTION_LABEL: 'Descripción',
		DESCRIPTION_PLACEHOLDER: 'Escribir en detalle cuál es el problema',
		ATTACHMENT_LABEL: 'Subir adjuntos (3 max)', // ToDo:
		ATTACHMENT_PLACEHOLDER:
			'Agregar un archivo para ayudar su comunicado del problema. Archivos PDF, JPG, y GIF son aceptados',
		SUCCESS_MESSAGE: 'El correo ha sido enviado a nuestro soporte',
		SUCCESS_TITLE: 'Mensaje Enviado',
		SUCCESS_MESSAGE_1: 'Su problema ha sido enviado a soporte de cliente.',
		SUCCESS_MESSAGE_2: 'Puede esperar una respuesta en 1-3 días.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'Su {0} dirección de recepción', // new
			DESTINATION_TAG: 'Su {0} etiqueta de destino (Destination Tag)', // new
			MEMO: 'Su {0} memo', // new
			BTC: 'Su dirección de recepcción Bitcoin',
			ETH: 'Su dirección de recepción Ethereum',
			BCH: 'Su dirección de recepción Bitcoin Cash',
		},
		INCREASE_LIMIT: '¿Quiere incrementar su límite diario?',
		QR_CODE:
			'Este Código QR se puede escanear por la persona que quiere enviarle fondos',
		NO_DATA: 'No hay información disponible',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: 'Iniciar sesión a {0}',
		CANT_LOGIN: '¿No puede iniciar sesión?',
		NO_ACCOUNT: '¿No tiene cuenta?',
		CREATE_ACCOUNT: 'Crear uno aquí',
		HELP: 'Ayuda',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'Email',
		EMAIL_PLACEHOLDER: 'Escribir su dirección de correo electrónico',
		PASSWORD_LABEL: 'Contraseña',
		PASSWORD_PLACEHOLDER: 'Escribir su contraseña',
		PASSWORD_REPEAT_LABEL: 'Confirmar su contraseña',
		PASSWORD_REPEAT_PLACEHOLDER: 'Confirmar su contraseña',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'Proveer código OTP para iniciar sesión',
		CAPTCHA: 'Expired Session. Please refresh the page',
		FROZEN_ACCOUNT: 'This account is frozen.',
		INVALID_EMAIL: 'Dirección de correo electrónico inválido',
		TYPE_EMAIL: 'Introducir su E-mail',
		REQUIRED: 'Campo requerido',
		INVALID_DATE: 'Fecha inválida',
		INVALID_PASSWORD:
			'Contraseña inválida. Tiene que contener por lo menos 8 carácteres, un dígito y un carácter especial.',
		INVALID_PASSWORD_2:
			'Contraseña inválida. Tiene que contener por lo menos 8 carácteres,, por lo menos un dígito y un carácter.',
		INVALID_CURRENCY: 'Dirección {0} inválida ({1})',
		INVALID_BALANCE:
			'Balance disponible insuficiente ({0}) para realizar operaciones ({1}).',
		MIN_VALUE: 'Valor tiene que ser {0} o mayor.',
		MAX_VALUE: 'Valor tiene que ser {0} o menor.',
		INSUFFICIENT_BALANCE: 'Balance insuficiente',
		PASSWORDS_DONT_MATCH: 'Contraseña no coincide',
		USER_EXIST: 'El correo electrónico ya ha sido registrado',
		ACCEPT_TERMS: 'No ha aceptado los Términos de uso y Política de Privacidad',
		STEP: 'Valor inválido, step is {0}',
		ONLY_NUMBERS: 'Valor puede contener sólo números',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'Política de Privacidad',
			SUBTITLE:
				'Última actualización Abril 1, 2019. Reemplaza la versión anterior en su totalidad.',
			TEXTS: [
				'HollaEx Web es una plataforma virtual de intercambio que pertenece en su totalidad a bitHolla Inc. bitHolla Inc (referido como bitHolla) se incorporó en Seúl Corea del Sur.',
				'El uso de este sitio web de HollaEx ("Sitio Web") y el servicio ofrecido en el sitio web ("Servicio") se rigen por los términos contenidos en esta página de Términos y condiciones ("Términos"). Este acuerdo constituye en su totalidad el acuerdo entre las partes. Toda otra información proporcionada en el sitio web o declaraciones orales/escritas excluidas en este acuerdo; la política de exchange se proporciona solo como guía y no constituye un acuerdo legal entre las partes.',
				'Al acceder, ver o descargar información del sitio web y usar el Servicio proporcionado por bitHolla, usted reconoce que ha leído, comprendido y aceptado incondicionalmente estar sujeto a estos Términos. bitHolla puede en cualquier momento, sin previo aviso, modificar los Términos. Usted acepta seguir estando sujeto a los términos y condiciones modificados y que bitHolla no tiene la obligación de notificarle dichas modificaciones. Usted reconoce que es su responsabilidad verificar estos Términos periódicamente para ver si hay cambios y que su uso continuo del sitio web y los Servicios ofrecidos por bitHolla después de la publicación de cualquier cambio en los Términos indicando su aceptación de dichos cambios.',
				'El sitio web y los derechos de autor de todos los textos, gráficos, imágenes, software y cualquier otro material en el sitio web son propiedad de bitHolla, incluidas todas las marcas comerciales y otros derechos de propiedad intelectual con respecto a los materiales y servicios en el sitio web. Los materiales de este sitio web solo se pueden utilizar para uso personal y con fines no comerciales.',
				'Puede mostrar en una pantalla de computadora o imprimir extractos del sitio web para el propósito mencionado anteriormente solo siempre que conserve los derechos de autor y otros avisos de propiedad o cualquier marca comercial o logotipo de bitHolla, como se muestra en la impresión inicial o descarga sin alteración, adición o supresión. Salvo que se indique expresamente en este documento, no puede sin el permiso previo por escrito de bitHolla alterar, modificar, reproducir, distribuir o utilizar en cualquier otro contexto comercial en cualquier material del sitio web.',
				'Usted reconoce que "bitHolla" y el logotipo de bitHolla son marcas comerciales de bitHolla Inc. Puede reproducir dichas marcas comerciales sin alterar el material descargado de este sitio web en la medida autorizada anteriormente, pero no puede usarlos, copiarlos, adaptarlos o borrarlos de otro modo.',
				'En ninguna circunstancia obtendrá ningún derecho sobre o con respecto al sitio web (que no sean los derechos de uso del sitio web de conformidad con estos Términos y cualquier otro término y condición que rija un servicio o sección en particular del sitio web) o declarar que tiene cualquiera de dichos derechos sobre o con respecto al sitio web.',
			],
		},
		GENERAL_TERMS: {
			TITLE: 'Términos Generales de Servicio',
			SUBTITLE:
				'Última actualización Abril 1, 2019. Reemplaza la versión anterior en su totalidad.',
			TEXTS: [
				'HollaEx Web es una plataforma virtual de intercambio que pertenece en su totalidad a bitHolla Inc. bitHolla Inc (referido como bitHolla) se incorporó en Seúl Corea del Sur.',
				'El uso de este sitio web de HollaEx ("Sitio Web") y el servicio ofrecido en el sitio web ("Servicio") se rigen por los términos contenidos en esta página de Términos y condiciones ("Términos"). Este acuerdo constituye en su totalidad el acuerdo entre las partes. Toda otra información proporcionada en el sitio web o declaraciones orales/escritas excluidas en este acuerdo; la política de exchange se proporciona solo como guía y no constituye un acuerdo legal entre las partes.',
				'Al acceder, ver o desargar información del sitio web y usar el Servicio proporcionado por bitHolla, usted reconoce que ha leído, comprendido y aceptado incondicionalmente estar sujeto a estos Términos. bitHolla puede en cualquier momento, sin previo aviso, modificar los Términos. Usted acepta seguir estando sujeto a los términos y condiciones modificados y que bitHolla no tiene la obligación de notificarle dichas modificaciones. Usted reconoce que es su responsabilidad verificar estos Términos periódicamente para ver si hay cambios y que su uso continuo del sitio web y los Servicios ofrecidos por bitHolla después de la publicación de cualquier cambio en los Términos indicando su aceptación de dichos cambios.',
				'El sitio web y los derechos de autor de todos los textos, gráficos, imágenes, software y cualquier otro material en el sitio web son propiedad de bitHolla, incluidas todas las marcas comerciales y otros derechos de propiedad intelectual con respecto a los materiales y servicios en el sitio web. Los materiales de este sitio web solo se pueden utilizar para uso personal y con fines no comerciales.',
				'Puede mostrar en una pantalla de computadora o imprimir extractos del sitio web para el propósio mencionado anteriormente solo siempre que conserve los derechos de autor y otros avisos de propiedad o cualquier marca comercial o logotipo de bitHolla, como se muestra en la impresión inicial o descarga sin alteración, adición o supresión. Salvo que se indique expresamente en este documento, no puede sin el permiso previo por escrito de bitHolla alterar, modificar, reproducr, distribuir o utilizar en cualquier otro contexto conmercial en cualquier material del sitio web.',
				'Usted reconoce que "bitHolla" y el logotipo de bitHolla son marcas comerciales de bitHolla Inc. Puede reproducir dichas marcas comerciales sin alterar el material descargado de este sitio web en la medida autorizada anteriormente, pero no puede usarlos, copiarlos, adaptarlos o borrarlos de otro modo.',
				'En ninguna circunstancia obtendrá ningún derecho sobre o con respecto al sitio web (que no sean los derechos de uso del sitio web de conformidad con estos Términos y cualquier otro término y condición que rija un servicio o sección en particular del sitio web) o declarar que tiene cualquiera de dichos derechos sobre o con respecto al sitio web.',
			],
		},
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'Okay',
			START_TRADING: 'empezar a intercambiar',
			SEE_HISTORY: 'ver historial',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} Depósito recibido',
			TITLE_INCOMING: 'Entrante {0}',
			SUBTITLE_RECEIVED: 'Usted recibió su {0} depósito',
			SUBTITLE_INCOMING: 'Usted tiene entrante {0}',
			INFORMATION_PENDING_1:
				'Su {0} requiere 1 confirmation antes de que pueda empezar a intercambiar.',
			INFORMATION_PENDING_2:
				'Estoy puede tardar 10-30 minutos. Vamos a enviar un correo una vez que {0} es confirmado en el blockchain.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: 'Solicitud enviada',
		BUTTON_TEXT: 'Okay',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: 'Introducir su código de autenticación para continuar',
		OTP_LABEL: 'Código OTP',
		OTP_PLACEHOLDER: 'Introducir su código de autenticación',
		OTP_TITLE: 'Código Autenticador',
		OTP_HELP: 'ayuda',
		OTP_BUTTON: 'enviar',
		ERROR_INVALID: 'Código OTP Inválido',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Rápido',
		TOTAL_COST: 'Costo Total',
		BUTTON: 'Revisar {0} orden',
		INPUT: '{0} a {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: 'página anterior',
	NEXT_PAGE: 'página siguiente',
	WALLET: {
		LOADING_ASSETS: 'Cargando activos...', // new
		TOTAL_ASSETS: 'Activos totales',
		AVAILABLE_WITHDRAWAL: 'Disponible para intercambiar',
		AVAILABLE_TRADING: 'Disponible para retiro',
		ORDERS_PLURAL: 'órdenes',
		ORDERS_SINGULAR: 'órden',
		HOLD_ORDERS:
			'You have {0} open {1}, resulting in a hold of {2} {3} placed on your {4} balance',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'Recuperar Cuenta',
		SUBTITLE: `Recuperar su cuenta abajo`,
		SUPPORT: 'Contactar a Soporte',
		BUTTON: 'Enviar link de recuperación',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'Establecimiento de contraseña enviado',
		TEXT:
			'Si una cuenta existe por el correo electrónico, un correo ha sido enviado con instrucciones de establecimiento. Por favor, revisar su correo y dar click en el link para completar su establecimiento de contraseña.',
	},
	RESET_PASSWORD: {
		TITLE: 'Establecer nueva contraseña',
		SUBTITLE: 'Establecer nueva contraseña',
		BUTTON: 'Establecer nueva contraseña',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'Usted ha establecido una nueva contraseña exitosamente.',
		TEXT_2: 'Click en iniciar sesión abajo para continuar.',
	},
	SIGN_UP: {
		SIGNUP_TO: 'Registrarse para {0}',
		NO_EMAIL: '¿No ha recibido el correo?',
		REQUEST_EMAIL: 'Solicitar otro aquí',
		HAVE_ACCOUNT: '¿Ya tiene una cuenta?',
		GOTO_LOGIN: 'Ir a página de inicio',
		AFFILIATION_CODE: 'Código de referencia (opcional)',
		AFFILIATION_CODE_PLACEHOLDER: 'Escriba su código de referencia',
		TERMS: {
			terms: 'Términos Generales',
			policy: 'Política de Privacidad',
			text: 'He leído y aceptado al {0} y {1}',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'Correo enviado',
		TEXT_1:
			'Revisar su correo y dar click en el link para verificar su correo electrónico.',
		TEXT_2:
			'Si no ha recibido algún correo de verificación y ha revisado su correo no deseado después usted puede intentar dándole click en reenviar abajo.',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'Reenviar Solicitud de Correo',
		BUTTON: 'Solicitar Correo',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'Reenviar Correo',
		TEXT_1:
			'Si después de unos minutos usted todavía no recibe un correo de verificación entonces por favor contactarnos.',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'Código Inválido',
		TEXT_1: 'Usted ha verificado su correo exitosamente.',
		TEXT_2: 'Usted puede continar con el inicio de sesión',
	},
	USER_VERIFICATION: {
		INFO_TXT:
			'Aquí puede monitorear su progreso hacia la verificación y una mejora de cuenta.',
		INFO_TXT_1:
			'Por favor enviar la información relevante requerida para cada sección debajo. Solo cuando todas las secciones tienen envíos completos su información va a ser revisada y aprobada para ascender su cuenta.',
		INFO_TXT_2:
			'* Verificación de su sección de identidad requiere a {0} ciertos documentos.',
		DOCUMENTATIONS: 'Subir',
		COMPLETED: 'Completo',
		PENDING_VERIFICATION: 'Verificación pendiente',
		TITLE_EMAIL: 'Email',
		MY_EMAIL: 'Mi Email',
		MAKE_FIRST_DEPOSIT: 'Realizar primer depósito', // new
		OBTAIN_XHT: 'Obtener XHT', // new
		TITLE_USER_DOCUMENTATION: 'Identification',
		TITLE_ID_DOCUMENTS: 'Subir',
		TITLE_BANK_ACCOUNT: 'Cuenta Bancaria',
		TITLE_MOBILE_PHONE: 'Teléfono Móbil',
		TITLE_PERSONAL_INFORMATION: 'Información Personal',
		VERIFY_EMAIL: 'Verificar email',
		VERIFY_MOBILE_PHONE: 'Verificar teléfono móbil',
		VERIFY_USER_DOCUMENTATION: 'Verificar documentación del usuario',
		VERIFY_ID_DOCUMENTS: 'Verificar documentos de id',
		VERIFY_BANK_ACCOUNT: 'Verificar cuenta bancaria',
		BUTTON: 'Subir Solicitud de Verificación',
		TITLE_IDENTITY: 'Identidad',
		TITLE_MOBILE: 'Móbi',
		TITLE_MOBILE_HEADER: 'Número de Teléfono Móbil',
		TITLE_BANK: 'Banco',
		TITLE_BANK_HEADER: 'Detalles de Banco',
		CHANGE_VALUE: 'Cambiar valor',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'Su información personal está en proceso',
		PENDING_VERIFICATION_BANK:
			'Los detalles del banco están siendo verificados',
		PENDING_VERIFICATION_DOCUMENTS: 'Sus documentos están siendo verificados',
		GOTO_VERIFICATION: 'Ir a verificación',
		GOTO_WALLET: 'Ir a monedero', // new
		CONNECT_BANK_ACCOUNT: 'Connectar Cuenta Bancaria',
		ACTIVATE_2FA: 'Activar 2FA',
		INCOMPLETED: 'Incompleta',
		BANK_VERIFICATION: 'Verificación Bancaria',
		IDENTITY_VERIFICATION: 'Verificación de Identidad',
		PHONE_VERIFICATION: 'Verificación de teléfono',
		DOCUMENT_VERIFICATION: 'Verificación de Documento',
		START_BANK_VERIFICATION: 'Empezar Verificación Bancaria',
		START_IDENTITY_VERIFICATION: 'Empezar Verificación de Identidad',
		START_PHONE_VERIFICATION: 'Empezar Verificación de Teléfono',
		START_DOCUMENTATION_SUBMISSION: 'Empezar Documentación Submisión',
		GO_BACK: 'Ir atrás',
		BANK_VERIFICATION_TEXT_1:
			'Puede agregar hasta 3 cuentas bancarias. Cuentas bancarias internacionales requieren que usted contacte a soporte de cliente y va a tener un límite de retiro.',
		BANK_VERIFICATION_TEXT_2:
			'Por verificar su cuenta bancaria usted puede obtener lo siguiente:',
		BASE_WITHDRAWAL: 'Retiro Fiat',
		BASE_DEPOSITS: 'Depósito Fiat',
		ADD_ANOTHER_BANK_ACCOUNT: 'Agregar Otra Cuenta Bancaria',
		BANK_NAME: 'Nombre de Banco',
		ACCOUNT_NUMBER: 'Número de Cuenta',
		CARD_NUMBER: 'Número de Tarjeta',
		BANK_VERIFICATION_HELP_TEXT:
			'Para que esta sección sea verificada debe completar la {0} sección.',
		DOCUMENT_SUBMISSION: 'Subimisión de Documento',
		REVIEW_IDENTITY_VERIFICATION: 'Revisar Verificación de Identidad',
		PHONE_DETAILS: 'Detalles de Teléfono',
		PHONE_COUNTRY_ORIGIN: 'Teléfono País de Origen',
		MOBILE_NUMBER: 'Número Móbil',
		DOCUMENT_PROOF_SUBMISSION: 'Documento de Prueba de Submisión',
		START_DOCUMENTATION_RESUBMISSION: 'Empezar Documentación Re-Submisión',
		SUBMISSION_PENDING_TXT:
			'*Esta sección ya ha sido enviada. Realizar cambios o volver a enviar va a sobrescribir su información previa.',
		CUSTOMER_SUPPORT_MESSAGE: 'Mensajear a Soporte al Cliente',
		DOCUMENT_PENDING_NOTE:
			'Su documento está enviada y está pendiente de revisión. Por favor sea paciente.',
		DOCUMENT_VERIFIED_NOTE: 'Sus documentos están completos.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: 'Nota del departamento de verificación',
		CODE_EXPIRES_IN: 'Código expira en',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'Primer nombre',
				FIRST_NAME_PLACEHOLDER:
					'Escriba su primer nombre como aparece en su documento de identidad',
				LAST_NAME_LABEL: 'Apellido',
				LAST_NAME_PLACEHOLDER:
					'Escriba su apellido como aparece en su documento de identidad',
				FULL_NAME_LABEL: 'Su nombre completo',
				FULL_NAME_PLACEHOLDER:
					'Escriba su nombre completo como aparece en su documento de identidad',
				GENDER_LABEL: 'Género',
				GENDER_PLACEHOLDER: 'Escribir su género',
				GENDER_OPTIONS: {
					MAN: 'Masculino',
					WOMAN: 'Femenino',
				},
				NATIONALITY_LABEL: 'Nacionalidad',
				NATIONALITY_PLACEHOLDER:
					'Escribir su nacionalidad que aparece en su documento de identidad',
				DOB_LABEL: 'Fecha de nacimiento',
				COUNTRY_LABEL: 'País que reside',
				COUNTRY_PLACEHOLDER: 'Seleccionar el país que reside actualmente',
				CITY_LABEL: 'Ciudad',
				CITY_PLACEHOLDER: 'Escriba la ciudad en la que vive',
				ADDRESS_LABEL: 'Dirección',
				ADDRESS_PLACEHOLDER: 'Escribir su dirección que vive actualmente',
				POSTAL_CODE_LABEL: 'Código postal',
				POSTAL_CODE_PLACEHOLDER: 'Escriba su código postal',
				PHONE_CODE_LABEL: 'País',
				PHONE_CODE_PLACEHOLDER:
					'Seleccione el país donde su teléfono está conectado',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: 'Número telefónico',
				PHONE_NUMBER_PLACEHOLDER: 'Escribir su número telefónico',
				CONNECTING_LOADING: 'Conectando',
				SMS_SEND: 'Envar SMS',
				SMS_CODE_LABEL: 'Código SMS',
				SMS_CODE_PLACEHOLDER: 'Escribir el código SMS',
			},
			INFORMATION: {
				TEXT:
					'IMPORTANTE: Introducir su nombre en el campo exactamente como aparece en su documento de identidad (primer nombre completo, segundo nombre completo y apellido(s) completo). ¿Es una empreasa? Contactar al soporte al cliente para una cuenta corporativa.',
				TITLE_PERSONAL_INFORMATION: 'Información Personal',
				TITLE_PHONE: 'Teléfono',
				PHONE_VERIFICATION_TXT:
					'Proporcionar detalles de contacto válido va a ayudarnos mucho en la resolución de conflictos mientras se evitan transacciones no deseadas en su cuenta.',
				PHONE_VERIFICATION_TXT_1:
					'Recibir mejoras a tiempo real para depósitos y retiros por compartir su número de teléfono móbil.',
				PHONE_VERIFICATION_TXT_2:
					' Comprobar su identidad y dirección compartiendo su número telefónico LAN (opcional).',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'Por favor seleccionar el tipo de documento de identidad',
				ID_NUMBER: 'Por favor escriba el número de documento',
				ISSUED_DATE:
					'Por favor selccionar la fecha en la que su documento fue emitido',
				EXPIRATION_DATE:
					'Por favor selccionar la fecha cuando su documento expira',
				FRONT: 'Por favor subir el escaneo de su pasaporte',
				PROOF_OF_RESIDENCY:
					'Por favor subir el escaneo de su documento que compruebe su dirección donde vive actualmente',
				SELFIE_PHOTO_ID: 'Por favor subir una selfie con pasaporte y nota',
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'Tipo de Documento ID',
				TYPE_PLACEHOLDER: 'Seleccionar Tipo de Identidad de documento',
				TYPE_OPTIONS: {
					ID: 'ID',
					PASSPORT: 'Pasaporte',
				},
				ID_NUMBER_LABEL: 'Número de pasaporte',
				ID_NUMBER_PLACEHOLDER: 'Escribir su número de pasaporte',
				ID_PASSPORT_NUMBER_LABEL: 'Número de Pasaporte',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'Escribir su número de pasaporte',
				ISSUED_DATE_LABEL: 'Fecha de emisión de Pasaporte',
				EXPIRATION_DATE_LABEL: 'Fecha de expiración de Pasaporte',
				FRONT_LABEL: 'Pasaporte',
				FRONT_PLACEHOLDER: 'Agregar copia de su pasaporte',
				BACK_LABEL: 'Parte trasera del pasaporte',
				BACK_PLACEHOLDER:
					'Agregar copia de la parte trasera de su ID (si aplica)',
				PASSPORT_LABEL: 'Documento de Pasaporte',
				PASSPORT_PLACEHOLDER: 'Agregar copia del documento de pasaporte',
				POR_LABEL: 'Documento comprobando su dirección',
				POR_PLACEHOLDER:
					'Agregar una copia del documento comprobando la dirección',
				SELFIE_PHOTO_ID_LABEL: 'Su selfie con pasaporte y Nota',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'Agregar una copia de su selfie con pasaporte y Nota',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'Identity Document',
				PROOF_OF_RESIDENCY: 'Prueba de residencia',
				ID_SECTION: {
					TITLE: 'Por favor revisar los documentos que subió:',
					LIST_ITEM_1:
						'ALTA CALIDAD (color de imagen, resolución 300dpi o mayor).',
					LIST_ITEM_2: 'VISIBLE EN SU TOTALIDAD (watermarks están permitidos).',
					LIST_ITEM_3: 'VÁLIDo, con la fecha de expiración visible claramente.',
					WARNING_1:
						'Solo se acepta un pasaporte válido; fotos de alta calidad o imágenes escaneadas de estos documentos son aceptables:',
					WARNING_2:
						'Revisar que los documentos que sube seas documentos propios. Cualquier uso de documentos erróneos o falsos va a tener consecuencias legales y se congelará su cuenta inmediatamente.',
					WARNING_3:
						'Por favor no subir el pasaporte como prueba de residencia.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'Para evitar demoras al verificar su cuenta, por favor asegúrese de:',
					SECTION_1_TEXT_2:
						'Su NOMBRE, DIRECCIÓN, FECHA DE EMISIÓN y EMISOR son claramente visibles.',
					SECTION_1_TEXT_3:
						'El documento de prueba de residencia presentado no debe tener más de tres meses de antigüedad.',
					SECTION_1_TEXT_4:
						'Usted envía fotografías en color o imágenes escaneadas en ALTA CALIDAD ( mínimo 300 DPI)',
					SECTION_2_TITLE: 'AUNA PRUEBA ACEPTABLE DE RESIDENCIA ES:',
					SECTION_2_LIST_ITEM_1: 'Un estado de cuenta bancaria.',
					SECTION_2_LIST_ITEM_2:
						'Una factura de servicios públicos (electricidad, agua, internet, etc.).',
					SECTION_2_LIST_ITEM_3:
						'Un documento expedido por el gobierno (declaración de impuestos, certificado de residencia, etc.).',
					WARNING:
						'No podemos aceptar la dirección que figura en su documento de identidad presentado como prueba válida de residencia.',
				},
				SELFIE: {
					TITLE: 'Selfie con pasaporte y nota',
					INFO_TEXT:
						'Por favor proporcionar una foto de usted sosteniendo su pasaporte. En la misma foto, mostrar una referencia del URL del exchange, la fecha de hoy y su firma.Revisar que su cara sea visible claramente y que los detalles del ID sean claramente legible.',
					REQUIRED: 'Requerido:',
					INSTRUCTION_1: 'Su cara claramente visible',
					INSTRUCTION_2: 'Pasaporte claramente legible',
					INSTRUCTION_3: 'Escriba el nombre del intercambio',
					INSTRUCTION_4: 'Escriba la fecha de hoy',
					INSTRUCTION_5: 'Escriba su firma',
					WARNING:
						'Selfie con un pasaporte diferente con el contenido cargado será rechazado',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'Por favor, escriba su nombre y apellido como asociado a su cuenta bancaria',
				ACCOUNT_NUMBER:
					'El número de su cuenta bancaria debe ser de menos de 50 dígitos',
				ACCOUNT_NUMBER_MAX_LENGTH:
					'Su número de cuenta bancaria tiene un límite de 50 caracteres',
				CARD_NUMBER: 'Su número de tarjeta tiene un formato incorrecto',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'Nombre del banco',
				BANK_NAME_PLACEHOLDER: 'Escriba el nombre de su banco',
				ACCOUNT_NUMBER_LABEL: 'Número de cuenta bancaria',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Escriba su número de cuenta bancaria',
				ACCOUNT_OWNER_LABEL: 'Nombre del propietario de la cuenta bancaria',
				ACCOUNT_OWNER_PLACEHOLDER:
					'Escriba el nombre como en su cuenta bancaria',
				CARD_NUMBER_LABEL: 'Número de tarjeta bancaria',
				CARD_NUMBER_PLACEHOLDER:
					'Escriba los 16 dígitos del número que está en la parte delantera de su tarjeta bancaria',
			},
		},
		WARNING: {
			TEXT_1: 'Al verificar su identidad puede obtener lo siguiente:',
			LIST_ITEM_1: 'Aumento de los límites de retiro',
			LIST_ITEM_2: 'Aumento de los límites de los depósitos',
			LIST_ITEM_3: 'Tarifas más bajas',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			'Cambie la configuración de su cuenta. Desde la interfaz, las notificaciones, el nombre de usuario y otras personalizaciones.',
		TITLE_TEXT_2:
			'Al guardar la configuración se aplicarán los cambios y se guardará.',
		TITLE_NOTIFICATION: 'Notificación',
		TITLE_INTERFACE: 'Interfaz',
		TITLE_LANGUAGE: 'Idioma',
		TITLE_CHAT: 'Chat',
		TITLE_AUDIO_CUE: 'Reproducir Audio Cue', // new
		TITLE_MANAGE_RISK: 'Administrar Riesgo',
		ORDERBOOK_LEVEL: 'Niveles de pedido (Máximo 20)',
		SET_TXT: 'CONFIGURAR',
		CREATE_ORDER_WARING: 'Crear Orden de Advertenca',
		RISKY_TRADE_DETECTED: 'Transacciòn Riesgosa Detectada',
		RISKY_WARNING_TEXT_1:
			'Estos valore de òrdenes estàn sobre su lìmite de cantidad de orden designado que ha configurado {0} .',
		RISKY_WARNING_TEXT_2: '({0} de portafolio)',
		RISKY_WARNING_TEXT_3:
			' Por favor revisar y verificar que usted quiere realizar este cambio.',
		GO_TO_RISK_MANAGMENT: 'IR A ADMINISTRACIÒN DE RIEGSO',
		CREATE_ORDER_WARING_TEXT:
			'Crear un pop de adventencia cuando su orden de cambio usa màs de {0} de su portafolio',
		ORDER_PORTFOLIO_LABEL: 'Cantidad de Porcentaje del Portafolio:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'Pop ups de Cambio',
			POPUP_ORDER_CONFIRMATION:
				'Pedir confirmación antes de presentar los pedidos',
			POPUP_ORDER_COMPLETED: 'Mostrar pop up cuando el pedido se ha completado',
			POPUP_ORDER_PARTIALLY_FILLED:
				'Mostrar pop up cuando el pedido se ha llenado parcialmente',
		},
		AUDIO_CUE_FORM: {
			// new
			ALL_AUDIO: 'Todas las señales de audio',
			PUBLIC_TRADE_AUDIO: 'Cuando se hace un cambio pùblico',
			ORDERS_PARTIAL_AUDIO:
				'Cuando una de sus òrdenes està filtrado parcialmente',
			ORDERS_PLACED_AUDIO: 'Cuando se hace una orden',
			ORDERS_CANCELED_AUDIO: 'Cuando se cancela una orden',
			ORDERS_COMPLETED_AUDIO:
				'Cuand una de sus òrdenes està filtrado completamente',
			CLICK_AMOUNTS_AUDIO:
				'Cuando clickear cantidades y precios en el libro de orden',
			GET_QUICK_TRADE_AUDIO:
				'Cuando se obtiene una citaciòn para cambios ràpidos',
			SUCCESS_QUICK_TRADE_AUDIO: 'Cuando ocurre un cambio ràpido y exitoso',
			QUICK_TRADE_TIMEOUT_AUDIO: 'Cuando se acaba el tiempo del cambio ràpido',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'Creaar un pop up de adventencia cuando el valor de orden de cambio supera una cantidad en porcentaje de su portafolio',
			INFO_TEXT_1: 'Valor total de activos en {0}: {1}',
			PORTFOLIO: 'Porcentaje de portafolio',
			TOMAN_ASSET: 'Valor Aproximado',
			ADJUST: '(ADJUSTAR PORCENTAJE)',
			ACTIVATE_RISK_MANAGMENT: 'Activar Administraciòn de Riesgo',
			WARNING_POP_UP: 'pop ups de Advertencia',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'Historial',
		TITLE_TRADES: 'Historial de Cambios',
		TITLE_DEPOSITS: 'Historial de Depòsitos',
		TITLE_WITHDRAWALS: 'Historial de Retiros',
		TEXT_DOWNLOAD: 'DESCARGAR HISTORIAL',
		TRADES: 'Cambios',
		DEPOSITS: 'Depósitos',
		WITHDRAWALS: 'Retiros',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'Adjust the security settings for your account. From Two-factor authentication, password, API keys and other security related functions.',
		OTP: {
			TITLE: 'Autenticación de dos factores',
			OTP_ENABLED: 'habilitar otp',
			OTP_DISABLED: 'POR FAVOR ACTIVAR 2FA',
			ENABLED_TEXTS: {
				TEXT_1: 'Requiere OTP cuando inicia sesiòn',
				TEXT_2: 'Requiere OTP cuando retira fondos',
			},
			DIALOG: {
				SUCCESS: 'Ha activado con éxito el OTP',
				REVOKE: 'Ha revocado con éxito su OTP',
			},
			CONTENT: {
				TITLE: 'Activar la autenticación de dos factores',
				MESSAGE_1: 'Escanear',
				MESSAGE_2:
					'Escanea el código QR que aparece a continuación con Google Authenticator o Authy para configurar automáticamente la autenticación de dos factores en su dispositivo.',
				MESSAGE_3:
					'Si tiene problemas para escanear esto, puede introducir manualmente el código siguiente',
				MESSAGE_4:
					'Puede almacenar este código de forma segura para recuperar su 2FA en caso de que cambie o pierda su teléfono móvil en el futuro.',
				MESSAGE_5: 'Manual',
				INPUT: 'Introducir contraseña de una-vez (OTP)',
				WARNING:
					'Le recomendamos encarecidamente que establezca una autenticación de dos factores (2FA). Haciendo esto aumentará enormemente la seguridad de sus fondos.',
				ENABLE: 'Habilitar la autenticación de dos factores',
				DISABLE: 'Desactivar la autenticación de dos factores',
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
				PLACEHOLDER:
					'Introducir su OTP proporcionado por Google Authenticator.',
				BUTTON: 'Activar 2FA',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'Cambiar Contraseña',
			ACTIVE: 'ACTIVO',
			DIALOG: {
				SUCCESS: 'Ha cambiado con éxito su contraseña',
			},
			FORM: {
				BUTTON: 'Cambiar Contraseña',
				CURRENT_PASSWORD: {
					label: 'Contraseña actual',
					placeholder: 'Escriba su contraseña actual',
				},
				NEW_PASSWORD: {
					label: 'Nueva contraseña',
					placeholder: 'Escriba una nueva contraseña',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'Confirmar la nueva contraseña',
					placeholder: 'Vuelva a escribir su nueva contraseña',
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
	CURRENCY: 'Divisa',
	TYPE: 'Type',
	TYPES_VALUES: {
		market: 'market',
		limit: 'limit',
	},
	TYPES: [
		{ value: 'market', label: 'market' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'limit', label: 'limit' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIDE: 'Side',
	SIDES_VALUES: {
		buy: 'compra',
		sell: 'venta',
	},
	SIDES: [
		{ value: 'buy', label: 'compra' },
		{ value: 'sell', label: 'venta' },
	], // DO NOT CHANGE value, ONLY TRANSLATE label
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'Sí' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: false, label: 'No' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIZE: 'Cantidad',
	PRICE: 'Precio',
	FEE: 'Tarifa',
	FEES: 'Tarifas',
	LIMIT: 'Límite',
	TIME: 'Tiempo',
	TIMESTAMP: 'Sello de tiempo',
	MORE: 'Más',
	VIEW: 'Ver',
	STATUS: 'Estado',
	AMOUNT: 'Cantidad',
	COMPLETE: 'Completar',
	PENDING: 'Pendiente',
	REJECTED: 'Rechazado',
	ORDERBOOK: 'Libro de órdenes',
	CANCEL: 'Cancelar',
	CANCEL_ALL: 'Cancelar todo',
	GO_TRADE_HISTORY: 'Ir a la historia de la transacción',
	ORDER_ENTRY: 'entrada de órdenes',
	TRADE_HISTORY: 'historia',
	CHART: 'tabla de precios',
	ORDERS: 'mis órdenes activas',
	TRADES: 'mi historial de transacciones',
	RECENT_TRADES: 'mis recientes transacciones', // ToDo
	PUBLIC_SALES: 'ventas públicas', // ToDo
	REMAINING: 'restante',
	FULLFILLED: '{0} % Cumplido',
	FILLED: 'Cumplido', // new
	LOWEST_PRICE: 'Precio más bajo ({0})', // new
	PHASE: 'Fase', // new
	INCOMING: 'Recibido', // new
	PRICE_CURRENCY: 'PRECIO',
	AMOUNT_SYMBOL: 'CANTIDAD',
	MARKET_PRICE: 'Precio de mercado',
	ORDER_PRICE: 'Predio de la orden',
	TOTAL_ORDER: 'Orden total',
	NO_DATA: 'Sin datos',
	LOADING: 'Cargando',
	CHART_TEXTS: {
		d: 'Fecha',
		o: 'Abierto',
		h: 'Alto',
		l: 'Bajo',
		c: 'Close',
		v: 'Volumen',
	},
	QUICK_TRADE: 'Cambio ràpido',
	PRO_TRADE: 'Intercambio Pro',
	ADMIN_DASH: 'Pàgina Admin',
	WALLET_TITLE: 'Monedero',
	TRADING_MODE_TITLE: 'Modo Intercambio',
	TRADING_TITLE: 'Intercambio',
	LOGOUT: 'Cerrar sesión',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'La transacciòn es un pequeña para enviar. Intentar una cantidad mayor.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'La transacciòn a enviar es muy grande. Intentar una cantidad menor.',
	WITHDRAWALS_LOWER_BALANCE:
		'Usted no tiene suficiente {0} en su balance para enviar la transacciòn ',
	WITHDRAWALS_FEE_TOO_LARGE: 'La tarifa es màs de {0}% de su transacciòn total',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'La direcciòn de Bitcoin es invàlida. Por favor revisar cuidadosamente e introducir otra vez',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'La direcciòn de Ethereum es invàlida. Por favor revisar cuidadosamente e introducir otra vez',
	WITHDRAWALS_BUTTON_TEXT: 'Revisar Retiro',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Dirección Destinatario',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Type the address',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'Destination tag (optional)', // new
	WITHDRAWALS_FORM_MEMO_LABEL: 'Memo (optional)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'Type the destination tag', // new
	WITHDRAWALS_FORM_MEMO_PLACEHOLDER: 'Type the transaction memo', // new
	WITHDRAWALS_FORM_AMOUNT_LABEL: 'Cantidad de {0} para retirar',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'Tarifa de Transacción',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'Bank withdrawal fee',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'Type the amount of {0} you wish to use in the fee of the transaction',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'Optimal fee: {0} {1}', // TODO {0} -> amount {1} -> currency name
	DEPOSITS_FORM_AMOUNT_LABEL: '{0} amount to deposit',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	DEPOSITS_BUTTON_TEXT: 'review deposit',
	DEPOSIT_PROCEED_PAYMENT: 'Pagar',
	DEPOSIT_BANK_REFERENCE:
		'Añade este código "{0}" a la transacción bancaria para identificar el depósito',
	DEPOSIT_METHOD: 'Método de pago {0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'Tarjeta de crédito',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1:
		'Proceda a la forma de pago con tarjeta de crédito.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'Saldrá de la plataforma para realizar el pago.',
	DEPOSIT_VERIFICATION_WAITING_TITLE: 'Verificando el pago',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'Por favor, no cierre la solicitud mientras se verifica el pago.',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'Si algo salió mal en la verificación, por favor contáctenos.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'Esta es la identificación de la operación: "{0}", por favor, proporciónenos esta identificación para ayudarle.',
	DEPOSIT_VERIFICATION_SUCCESS: 'Pago verificado',
	DEPOSIT_VERIFICATION_ERROR: 'Ha habido un error al verificar el depósito.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: 'El depósito ya ha sido verificado',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'Estado inválido',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'La tarjeta que realizó el depósito no es el mismo de la tarjeta que registró. Por lo tanto, su depósito es rechazado y los fondos van a ser reembolsados en menos de una hora.',
	QUOTE_MESSAGE: 'Usted va a {0} {1} {2} para {3} {4}',
	QUOTE_BUTTON: 'Aceptar',
	QUOTE_REVIEW: 'Revisar',
	QUOTE_COUNTDOWN_MESSAGE:
		'Usted tiene {0} segundos para realizar la operación',
	QUOTE_EXPIRED_TOKEN: 'The quote token has expired.',
	QUOTE_SUCCESS_REVIEW_TITLE: 'Quick Trade',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'You have successfully {0} {1} {2} for {3} {4}', // you have successfully buy 1 btc from x toman
	COUNTDOWN_ERROR_MESSAGE: 'Countdown is finished',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'Bank to Withdraw to',
		MESSAGE_ABOUT_SEND: 'Está a punto de enviar',
		MESSAGE_BTC_WARNING:
			'Por favor, asegúrese de la exactitud de esta dirección ya que las transferencias de {0} son irreversibles',
		MESSAGE_ABOUT_WITHDRAW:
			'Está a punto de hacer una transferencia a su cuenta bancaria',
		MESSAGE_FEE: 'Se incluye una tasa de transacción de {0} ({1})',
		MESSAGE_FEE_BASE: 'Se incluye una tasa de transacción de {0}',
		BASE_MESSAGE_1:
			'Sólo se puede retirar a una cuenta bancaria a un nombre que coincida con el nombre registrado en su cuenta.',
		BASE_MESSAGE_2: 'Cantidad mínima de retiro',
		BASE_MESSAGE_3: 'Cantidad máxima de retiro diario',
		BASE_INCREASE_LIMIT: 'Aumente su límite diario',
		CONFIRM_VIA_EMAIL: 'Confirmar por correo electrónico',
		CONFIRM_VIA_EMAIL_1:
			'Le hemos enviado un correo electrónico de confirmación del retiro.',
		CONFIRM_VIA_EMAIL_2:
			'Para completar el proceso del retiro, favor de confirmar',
		CONFIRM_VIA_EMAIL_3:
			'el retiro a través de su correo electrónico dentro de 5 minutos.',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'Su solicitud de retiro está confirmada. Será procesada en breve.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'Para ver el estado de su retiro, por favor visite su página de historial de retiro.',
		GO_WITHDRAWAL_HISTORY: 'Ir al historial de retiros',
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'depósito',
	WALLET_BUTTON_BASE_WITHDRAW: 'retirar',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'recibir',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'enviar',
	AVAILABLE_TEXT: 'Disponible',
	AVAILABLE_BALANCE_TEXT: 'Balance Disponible {0} : {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Balance',
	CURRENCY_BALANCE_TEXT: '{0} Balance',
	WALLET_TABLE_AMOUNT_IN: `Cantidad en {0}`,
	WALLET_TABLE_TOTAL: 'Gran Total',
	WALLET_ALL_ASSETS: 'Todos los activos',
	HIDE_TEXT: 'Hide',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Vendedores',
	ORDERBOOK_BUYERS: 'Compradores',
	ORDERBOOK_SPREAD: '{0} spread', // 0 -> 660,000 T
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'Max',
	DATEFIELD_TOOGLE_DATE_GR: 'Gregorian calendar',
	VERIFICATION_WARNING_TITLE: 'Verification you bank details',
	VERIFICATION_WARNING_MESSAGE:
		'Antes de hacer un retiro, debe verificar sus datos bancarios.',
	ORDER_SPENT: 'Spent',
	ORDER_RECEIVED: 'Recibido',
	ORDER_SOLD: 'Vendido',
	ORDER_BOUGHT: 'Comprado',
	ORDER_AVERAGE_PRICE: 'Precio promedio',
	ORDER_TITLE_CREATED: 'Ha creado con éxito un límite {0}', // 0 -> buy / sell
	ORDER_TITLE_FULLY_FILLED: '{0} order successfully filled', // 0 -> buy / sell
	ORDER_TITLE_PARTIALLY_FILLED: '{0} order partially filled', // 0 -> buy / sell
	ORDER_TITLE_TRADE_COMPLETE: '{0} {1} order was successful', // 0 -> buy / sell
	LOGOUT_TITLE: 'Se ha cerrado la sesión',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'El Token ha expirado',
	LOGOUT_ERROR_LOGIN_AGAIN: 'Inicia sesión de nuevo.', // ip doesnt match
	LOGOUT_ERROR_INVALID_TOKEN: 'Token inválido',
	LOGOUT_ERROR_INACTIVE: 'Has sido desconectado porque has estado inactivo',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	QUICK_TRADE_OUT_OF_LIMITS: 'El tamaño del pedido está fuera de los límites',
	QUICK_TRADE_TOKEN_USED: 'Se ha usado el Token',
	QUICK_TRADE_QUOTE_EXPIRED: 'Quote has expired',
	QUICK_TRADE_QUOTE_INVALID: 'Invalid quote',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'Error calculating the quote',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
		'El pedido con el tamaño actual no puede ser llenado',
	QUICK_TRADE_ORDER_NOT_FILLED: 'Order is not filled',
	QUICK_TRADE_NO_BALANCE: 'Insufficient balance to perform the order',
	YES: 'Yes',
	NO: 'No',
	NEXT: 'Next',
	SKIP_FOR_NOW: 'Skip for now',
	SUBMIT: 'Enviar',
	RESUBMIT: 'Resubmit',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Missing Documents!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'Para tener acceso completo a la función de retiro y depósito, usted tiene que enviar sus documentos de identidad en la página de su cuenta.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Success!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'Usted va a recibir un correo de notificación cuando su información esté procesada. El proceso toma normalmente 1-3 días.',
	VERIFICATION_NOTIFICATION_BUTTON: 'PROCEED TO EXCHANGE',
	ERROR_USER_ALREADY_VERIFIED: 'User already verified',
	ERROR_INVALID_CARD_USER: 'Bank or card information provided is incorrect',
	ERROR_INVALID_CARD_NUMBER: 'Invalid Card number',
	ERROR_LOGIN_USER_NOT_VERIFIED: 'User is not verified',
	ERROR_LOGIN_USER_NOT_ACTIVATED: 'User is not activated',
	ERROR_LOGIN_INVALID_CREDENTIALS: 'Credentials incorrect',
	SMS_SENT_TO: 'SMS sent to {0}', // TODO check msg
	SMS_ERROR_SENT_TO:
		'Error sending the SMS to {0}. Please refresh the page and try again.', // TODO check msg
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'Transaction ID:', // TODO check msg
	CHECK_ORDER: 'Check and confirm your order',
	CHECK_ORDER_TYPE: '{0} {1}', // 0 -> maker/limit  1 -> sell/buy
	CONFIRM_TEXT: 'Confirm',
	GOTO_XHT_MARKET: 'Go to XHT market', // new
	INVALID_CAPTCHA: 'Invalid captcha',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL:
		'Preferencia de Idioma (Incluye correos electrònicos)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'Display order confirmation popup',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NO' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: true, label: 'Si' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTINGS_THEME_LABEL: 'Tema de Interface de Usuario', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'White' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'dark', label: 'Dark' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTING_BUTTON: 'guardar',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'Retiros deshabilitados',
	VERIFICATION_NO_WITHDRAW_MESSAGE: 'Su cuenta està deshabilitada para retiros',
	UP_TO_MARKET: 'Arriba de mercado',
	VIEW_MY_FEES: 'Ver mis tarifas', // new
	DEVELOPER_SECTION: {
		TITLE: 'Clave API',
		INFORMATION_TEXT:
			'El API proporciona funcionalidad como obtener balances de monedero, administrar órdenes de compra/venta, solicitar retiros al igual que información del mercado como intercambios recientes, ordenar libros y tickers.',
		ERROR_INACTIVE_OTP:
			'Para generar una clave API necesita habilitar la autenticaciòn de 2 factores.',
		ENABLE_2FA: 'Habilitar 2FA',
		WARNING_TEXT: 'No compartir la clave API con otros.',
		GENERATE_KEY: 'Generar clave API',
		ACTIVE: 'Activo',
		INACTIVE: 'Inactivo',
		INVALID_LEVEL:
			'Usted necesita ascender su nivel de verificaciòn para tener acceso a esta funciòn', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'Generar Clave API',
		GENERATE_TEXT:
			'Por favor nombrar su clave API y mantener en privado después de que se genere. Usted no podrá recuperarlo después.',
		GENERATE: 'Generar',
		DELETE_TITLE: 'Eliminar Clave API',
		DELETE_TEXT:
			'Borrar su clave API is ireversable aunque usted puede generar una nueva clave API cuando quiera. ¿Quiere borrar su clave API?',
		DELETE: 'ELIMINAR',
		FORM_NAME_LABEL: 'Nombre',
		FORM_LABLE_PLACEHOLDER: 'Nombre de la Clave API',
		API_KEY_LABEL: 'Clave API',
		SECRET_KEY_LABEL: 'Clave SECRETA',
		CREATED_TITLE: 'Copiar su clave API',
		CREATED_TEXT_1:
			'Por favor copiar su clave API porque no se puede obtener en el futuro.',
		CREATED_TEXT_2: 'Mantener su clave privado.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'Nombre',
		API_KEY: 'Clave API',
		SECRET: 'Secreto',
		CREATED: 'Fecha Generada',
		REVOKE: 'Revocar',
		REVOKED: 'Revocado',
		REVOKE_TOOLTIP: 'Tiene que habilitar 2FA para revocar el token', // TODO
	},
	CHAT: {
		CHAT_TEXT: 'chat',
		MARKET_CHAT: 'Market Chat',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'Leer Màs',
		SHOW_IMAGE: 'Mostrar Imàgenes',
		HIDE_IMAGE: 'Esconder Imàgenes',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'Mensaje',
		SIGN_UP_CHAT: 'Registrase en el Chat',
		JOIN_CHAT: 'Configurar nombre de usuario en el Chat',
		TROLLBOX: 'Trollbox ({0})', // new
	},
	INVALID_USERNAME:
		'El nombre de usuario debe tener entre 3 y 15 caracteres de longitud. Sólo contiene minúsculas, números y guión bajo',
	USERNAME_TAKEN:
		'Este nombre de usuario ya ha sido tomado. Por favor, pruebe con otro.',
	USERNAME_LABEL: 'Nombre de usuario (usado para el chat)',
	USERNAME_PLACEHOLDER: 'Nombre de usuario',
	TAB_USERNAME: 'Nombre de usuario',
	USERNAME_WARNING:
		'Su nombre de usuario puede ser cambiado solo una vez. Por favor asegurar que su nombre de usuario sea deseable.',
	USERNAME_CANNOT_BE_CHANGED: 'El nombre de usuario no puede ser cambiado',
	UPGRADE_LEVEL: 'Actualizar el nivel de la cuenta',
	LEVELS: {
		LABEL_LEVEL: 'Nivel',
		LABEL_LEVEL_1: 'One',
		LABEL_LEVEL_2: 'Two',
		LABEL_LEVEL_3: 'Three',
		LABEL_MAKER_FEE: 'Maker Fee',
		LABEL_TAKER_FEE: 'Taker Fee',
		LABEL_BASE_DEPOSIT: 'Depòsito Diario de Euro',
		LABEL_BASE_WITHDRAWAL: 'Retiro Diario de Euro',
		LABEL_BTC_DEPOSIT: 'Depòsito Diario de Bitcoin',
		LABEL_BTC_WITHDRAWAL: 'Retiro Diario de Bitcoin',
		LABEL_ETH_DEPOSIT: 'Depòsito Diario de Ethereum',
		LABEL_ETH_WITHDRAWAL: 'Retiro Diario de Ethereum',
		LABEL_PAIR_MAKER_FEE: '{0} Maker Fee',
		LABEL_PAIR_TAKER_FEE: '{0} Taker Fee',
		UNLIMITED: 'Sin lìmite',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: 'Generar {0} Billetera',
	WALLET_ADDRESS_GENERATE: 'Generar',
	WALLET_ADDRESS_MESSAGE:
		'Cuando se genera una billetera se crea una dirección de depósito y retiro.',
	WALLET_ADDRESS_ERROR:
		'Error al generar la dirección, por favor, actualícela e inténtelo de nuevo.',
	DEPOSIT_WITHDRAW: 'Depósito/Retiro',
	GENERATE_WALLET: 'Generar billetera',
	TRADE_TAB_CHART: 'Diagrama',
	TRADE_TAB_TRADE: 'Comercio',
	TRADE_TAB_ORDERS: 'Pedidos',
	TRADE_TAB_POSTS: 'Mensajes', // new
	WALLET_TAB_WALLET: 'Billetera',
	WALLET_TAB_TRANSACTIONS: 'Transacciones',
	RECEIVE_CURRENCY: 'Recibir {0}',
	SEND_CURRENCY: 'Enviar {0}',
	COPY_ADDRESS: 'Copiar la dirección',
	SUCCESFUL_COPY: '¡Copiado con éxito!',
	QUICK_TRADE_MODE: 'Modo de comercio rápido',
	JUST_NOW: 'ahora mismo',
	PAIR: 'Pareja',
	ZERO_ASSET: 'No tiene ningún activo',
	DEPOSIT_ASSETS: 'Activos de depósito',
	SEARCH_TXT: 'Buscar',
	SEARCH_ASSETS: 'Buscar activos',
	TOTAL_ASSETS_VALUE: 'Valor total de los activos en {0}: {1}',
	SUMMARY: {
		TITLE: 'Resumen',
		TINY_PINK_SHRIMP_TRADER: 'Tiny Pink Shrimp Trader',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'Tiny Pink Shrimp Trader Account',
		LITTLE_RED_SNAPPER_TRADER: 'Little Red Snapper Trader',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'Little Red Snapper Trader Account',
		CUNNING_BLUE_KRAKEN_TRADING: 'Cunning Blue Kraken Trading',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: 'Cunning Blue Kraken Trading Account',
		BLACK_LEVIATHAN_TRADING: 'Black Leviathan Trading',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: 'Black Leviathan Trading Account',
		URGENT_REQUIREMENTS: 'Urgent Requirements',
		TRADING_VOLUME: 'Trading Volume',
		ACCOUNT_ASSETS: 'Cuenta de Activos',
		ACCOUNT_DETAILS: 'Account Details',
		SHRIMP_ACCOUNT_TXT_1: 'Your journey begins here!',
		SHRIMP_ACCOUNT_TXT_2:
			'Keep swimming true, you’ll soon stand out from the rest of the shoal',
		SNAPPER_ACCOUNT_TXT_1:
			'Congrats on staying your course through the swell of the market.',
		SNAPPER_ACCOUNT_TXT_2:
			'Forge through and fight the surge for more crypto treasures ahead.',
		KRAKEN_ACCOUNT_TXT_1:
			'Likelier to crack jokes than hulls, this crustacean has weathered his share of storms!',
		LEVIATHAN_ACCOUNT_TXT_1:
			'Beast from the abyss, seeing through altcoins into unfathomable depths, masters of midnight waters and tidal wave.',
		VIEW_FEE_STRUCTURE: 'Ver Estructura de Tarifas y Límites',
		UPGRADE_ACCOUNT: 'Actualizar la cuenta',
		ACTIVE_2FA_SECURITY: 'Seguridad activa de 2FA',
		ACCOUNT_ASSETS_TXT_1: 'Se muestra un resumen de todos sus activos.',
		ACCOUNT_ASSETS_TXT_2:
			'Poseer una gran cantidad de activos lo va a titular a una mejora de cuenta que incluye una medalla única y tarifas de transacción bajas.',
		TRADING_VOLUME_TXT_1:
			'Su historial de volumen de intercambios está desplegado en {0} y es nominalmente calculado al final de cada mes de todos los pares de intercambio.',
		TRADING_VOLUME_TXT_2:
			'Actividad de intercambios altos lo va a titular a una mejora de cuenta premiándole una medalla única y otras ventajas.',
		ACCOUNT_DETAILS_TXT_1:
			'El tipo de cuenta determina su medalla de cuenta, tarifa de intercambio, límite de depósitos y retiros.',
		ACCOUNT_DETAILS_TXT_2:
			'La edad de su cuenta de intercambio, nivel de actividad y cuenta de activos totales se van a determinar si su cuenta es aplicable por una mejora.',
		ACCOUNT_DETAILS_TXT_3:
			'Matener su el nivel de su cuenta requiere intercambios constantes y mantener una cierta cantidad de activos depositados.',
		ACCOUNT_DETAILS_TXT_4:
			'Descensos periódicamente de su cuenta va a ocurrir si las actividad y activos no son mantenidos .',
		REQUIREMENTS: 'Requisitos',
		ONE_REQUIREMENT: 'Un solo requisito:', // new
		REQUEST_ACCOUNT_UPGRADE: 'Solicitar una actualización de cuenta',
		FEES_AND_LIMIT: '{0} Estructura de tarifas y límites', // new
		FEES_AND_LIMIT_TXT_1:
			'Volverse un crypto trader marca un nuevo comienzo. Armado con ingenio, deseo y velocidad solo por tomar riesgos e deseos de intercambiar, usted puede mejorar su cuenta.',
		FEES_AND_LIMIT_TXT_2:
			'Cada cuenta tiene sus propias tarifas y límites de depósito y retiro.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'Permiso de depósito y retiro',
		TRADING_FEE_STRUCTURE: 'Estructura de la tasa de comercio',
		WITHDRAWAL: 'Retiro',
		DEPOSIT: 'Depósito',
		TAKER: 'beneficiario',
		MAKER: 'Fabricante',
		WEBSITE: 'página web',
		VIP_TRADER_ACCOUNT_ELIGIBLITY:
			'Elegibilidad para la actualización de la cuenta de comerciante VIP',
		PRO_TRADER_ACCOUNT_ELIGIBLITY:
			'Elegibilidad para la actualización de la cuenta Pro Trader',
		TRADER_ACCOUNT_ELIGIBILITY: 'Nivel {0} Elegibilidad de la cuenta',
		NOMINAL_TRADING: 'Comercio nominal',
		NOMINAL_TRADING_WITH_MONTH: 'Comercio nominal duró {0}',
		ACCOUNT_AGE_OF_MONTHS: 'Edad de la cuenta de {0} meses',
		TRADING_VOLUME_EQUIVALENT: '{0} {1} Equivalente de volumen de comercio',
		LEVEL_OF_ACCOUNT: 'Nivel {0} Cuenta',
		LEVEL_TXT_DEFAULT: 'Agregue la descripción de su nivel aquí',
		LEVEL_1_TXT:
			'¡Su viaje comienza aquí joven crypto trader! Para obtener bonos, usted puede verificar su identificación y también un gran depósito y límites de retiro con tarifas reducidad.', // new
		LEVEL_2_TXT:
			'Simplemente intercambie mensualmente sobre $3,000 USDT o tener un balance sobre 5,000 XHT y disfrute su tarifa de intercambio baja.', // new
		LEVEL_3_TXT:
			'¡Aquí es donde las cosas son reales! Disfrute tarifas de intercambio bajos y depósitos grandes y límites de retiro. Para llegar a nivel 3 necesita completar su verificación', // new
		LEVEL_4_TXT:
			'Simplemente intercambie mensualmente sobre $10,000 USDT o tener un balance sobre 10,000 XHT y disfrute su tarifa de intercambio baja.', // new
		LEVEL_5_TXT:
			'¡Usted lo logró! Una cuenta nivel 5 es una cuenta rara solo por operadores de exchange, usuarios Vault o HollaEx Affiliate Program (HAP). Disfrute de límites grandes y tarifas creadores de cero.', // new
		LEVEL_6_TXT:
			'Simplemente intercambie mensualmente sobre $300,000 USDT o tener un balance sobre 100,000 XHT y disfrute su tarifa de intercambio baja. Cantidad de retiro incrementado.', // new
		LEVEL_7_TXT:
			'Simplemente intercambie mensualmente sobre $500,000 USDT o tener un balance sobre 300,000 XHT y disfrute su tarifa de intercambio baja. Cantidad de retiro incrementado.', // new
		LEVEL_8_TXT:
			'Simplemente intercambie mensualmente sobre $600,000 USDT o tener un balance sobre 400,000 XHT y disfrute su tarifa de intercambio baja.', // new
		LEVEL_9_TXT:
			'Simplemente intercambie mensuamente sobre $2,000,000 USDT o tener un balance sobre 1,000,000 XHT y disfrute su tarifa de intercambio baja.', // new
		LEVEL_10_TXT:
			'La cuenta whale trader le gana dinero de vuelta por market making. Para obtener esta cuenta especial, por favor contactarnos.', // new
		CURRENT_TXT: 'Actual',
		TRADER_ACCOUNT_XHT_TEXT:
			'Su cuenta está en el periodo de preventa de XHT, esto significa que puede obtener XHT por $0.10 por XHT. Todos los depósitos se van a convertir a XHT una vez que la transacción esté despejada.',
		TRADER_ACCOUNT_TITLE: 'Cuenta - Período de preventa', // new
		HAP_ACCOUNT: 'Cuenta de HAP', // new
		HAP_ACCOUNT_TXT:
			'Su cuenta es una cuenta verificada por HollaEx affiliate program. Ahora puede ganar 10% bonus por cada persona que usted invite y compre XHT.', // new
		EMAIL_VERIFICATION: 'Verificación del correo electrónico', // new
		DOCUMENTS: 'Documentos', // new
		HAP_TEXT: 'Programa de Afiliados de HollaEx (HAP) {0}', // new
		LOCK_AN_EXCHANGE: 'Bloquear un intercambio {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'Vault Subscription users {0}', // new
		TRADE_OVER_XHT: 'Trade over {0} USDT worth', // new
		TRADE_OVER_BTC: 'Trade over {0} BTC worth', // new
		XHT_IN_WALLET: '{0} XHT en la billetera', // new
		REWARDS_BONUS: 'Recompensas y bonos', // new
		COMPLETE_TASK_DESC:
			'Completa las tareas y gana bonos por un valor de más de 10.000 dólares.', // new
		TASKS: 'Tareas', // new
		MAKE_FIRST_DEPOSIT: 'Haga su primer depósito y reciba 1 XHT', // new
		BUY_FIRST_XHT: 'Compre su primer XHT y reciba un bono de 5 XHT', // new
		COMPLETE_ACC_VERIFICATION:
			'Complete la verificación de la cuenta y obtenga un bono de 20 XHT', // new
		INVITE_USER:
			'Invite a usuarios y disfrute de las comisiones de sus comercios', // new
		JOIN_HAP: 'Únase a HAP y gane un 10% por cada kit de HollaEx que venda', // new
		EARN_RUNNING_EXCHANGE:
			'Gane ingresos pasivos por dirigir su propio intercambio', // new
		XHT_WAVE_AUCTION: 'Datos de la subasta de olas XHT', // new
		XHT_WAVE_DESC_1:
			'La distribución del HollaEx token (XHT) por medio de una subasta de olas.', // new
		XHT_WAVE_DESC_2:
			'La Subasta de ola vende una cantidad aleatoria de XHT en momentos aleatorios a los mayores oferentes de la cartera de pedidos', // new
		XHT_WAVE_DESC_3:
			'A continuación se muestran los datos históricos de la historia de la Subasta de Ondas', // new
		WAVE_AUCTION_PHASE: 'Fase de subasta de olas {0}', // new
		LEARN_MORE_WAVE_AUCTION: 'Aprenda más sobre la Subasta de Olas', // new
		WAVE_NUMBER: 'Número de ola', // new
		DISCOUNT: '( {0}% descuento )', // new
		MY_FEES_LIMITS: ' Mis tarifas y límites', // new
	},
	REFERRAL_LINK: {
		TITLE: 'Invite a su amigo', // new
		INFO_TEXT:
			'Recomiende a sus amigos dando este enlace y reciba los beneficios de incluir a otras personas.',
		COPY_FIELD_LABEL:
			'Comparta el enlace de abajo con sus amigos y gane comisiones:', // new
		REFERRED_USER_COUT: 'Usted ha referido a {0} usuarios', // new
		COPY_LINK_BUTTON: 'COPIAR EL ENLACE DE REFERENCIA', // new
		XHT_TITLE: 'MIS REFERIDOS', // new
		XHT_INFO_TEXT: 'Gane comisiones invitando a sus amigos.', // new
		XHT_INFO_TEXT_1: 'Las comisiones se pagan periódicamente a su billetera', // new
		APPLICATION_TXT:
			'Para ser un distribuidor de HollaEx Kit por favor llene una solicitud.', // new
		TOTAL_REFERRAL: 'Total comprado de referidos:', // new
		PENDING_REFERRAL: 'Comisiones pendientes:', // new
		EARN_REFERRAL: 'Comisiones ganadas:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'SOLICITAR', // new
	},
	STAKE_TOKEN: {
		TITLE: 'Stake HollaEx Token', // new
		INFO_TXT1:
			'Las HollaEx tokens (XHT) deben ser colateralizadas (apostadas) para ejecutar el software de intercambio del kit de HollaEx.', // new
		INFO_TXT2:
			'Puede colateralizar su HollaEx token de manera similar y ganar XHT no vendidos durante la subasta de la Ola.', // new
		INFO_TXT3:
			'Simplemente ve a dash.bitholla.com y colateralize su propio intercambio hoy y gane XHT gratis', // new
		BUTTON_TXT: 'ENCUENTRE MÁS INFORMACIÓN', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'Acuerdo de compra de HollaEx tokens',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: 'CONTINUAR',
		AGREE_TERMS_LABEL:
			'He leído y estoy de acuerdo con el Acuerdo de Compra del HollaEx Token',
		RISK_INVOLVED_LABEL: 'Entiendo los riesgos que implica',
		DOWNLOAD_PDF: 'Descargue el PDF',
		DEPOSIT_FUNDS:
			'Deposite fondos en su billetera para obtener HollaEx Token (XHT)',
		READ_FAG: 'Lea las preguntas frecuentes de HollaEx aquí: {0}',
		READ_DOCUMENTATION: 'Lea el whitepaper de HollaEx aquí: {0}',
		READ_WAVES: 'Reglas para la subasta pública de diciembre próximo.', // new
		DOWNLOAD_BUY_XHT:
			'Descargue el PDF para ver un proceso visual paso a paso en {0}',
		HOW_TO_BUY: 'Cómo comprar HollaEx Token (XHT)',
		PUBLIC_SALES: ' Subasta pública de olas', // new
		CONTACT_US:
			'No dude en contactarnos para más información y cualquier asunto enviándonos un correo electrónico a {0}',
		VISUAL_STEP: 'Vea un proceso visual paso a paso en {0}', // new
		WARNING_TXT:
			'Revisaremos su solicitud y le enviaremos más instrucciones a su correo electrónico sobre cómo acceder al intercambio de HollaEx.', // new
		WARNING_TXT1:
			'Mientras tanto, puede familiarizarse con la red HollaEx con los siguientes recursos', // new
		XHT_ORDER_TXT_1: 'Para empezar a comerciar tiene que iniciar sesión', // new
		XHT_ORDER_TXT_2: '', // new
		XHT_ORDER_TXT_3: '{0} o {1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: 'Inicie sesión para ver sus recientes transacciones', //new
		XHT_TRADE_TXT_2: 'Puede {0} ver su historia reciente de transacciones', //new
		LOGIN_HERE: 'Ingresa aquí',
	},
	WAVES: {
		// new
		TITLE: 'Información sobre la ola',
		NEXT_WAVE: 'próxima ola',
		WAVE_AMOUNT: 'Cantidad en la Ola',
		FLOOR: 'Piso',
		LAST_WAVE: 'última ola',
	},
	TYPES_OF_POSTS: {
		// new
		TITLE: 'PUBLICACIONES',
		ANNOUNCEMEN: 'Anuncio',
		SYSTEM_UPDATE: 'Actualización del sistema',
		LAST_WAVE: 'última ola',
		ANNOUNCEMENT_TXT:
			'XHT gratuito se distribuirá a todas las carteras que lo soliciten',
		SYSTEM_UPDATE_TIME: 'Hora: 12:31 PM, 19 de diciembre de 2019	',
		SYSTEM_UPDATE_DURATION: '1 hora',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: ' 12: 31 PM, 19 de diciembre de 2019',
	},
	USER_LEVEL: 'Nivel del usuario', // new
	LIMIT_AMOUNT: 'Cantidad límite', // new
	FEE_AMOUNT: 'Importe de tasa', // new
	COINS: 'Monedas', // new
	PAIRS: 'Pares', // new
	NOTE_FOR_EDIT_COIN:
		'Nota: Para agregar y quitar {0} por favor consulte el {1}.', // new
	REFER_DOCS_LINK: 'docs', // new
	RESTART_TO_APPLY:
		'Necesita reiniciar su intercambio para aplicar estos cambios.', // new
	TRIAL_EXCHANGE_MSG:
		'Está usando una versión de prueba de {0} y expirará en {1} días.', // new
	EXPIRY_EXCHANGE_MSG:
		'Su intercambio ha expirado. Vaya a dash.bitholla.com para activarlo de nuevo.', // new
	EXPIRED_INFO_1: 'Su prueba ha terminado.', // new
	EXPIRED_INFO_2: 'Colabora con el intercambio para activarlo de nuevo.', // new
	EXPIRED_BUTTON_TXT: 'ACTIVAR INTERCAMBIO', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: 'Anuncio',
		ANNOUNCEMNT_TXT_3:
			'Lanzamiento Pùblico y Subasta Wave es reprogramado a Enero 1 del 2020. Depòsitos y retiros de monederos estàn abiertos.',
		ANNOUNCEMNT_TXT_4:
			'Feliz año nuevo Hollaers. Estamos haciendo un nuevo marco empezando el 2020 con el lanzamiento de la plataforma de intercambio màs abierto con la ayuda de todos ustedes.',
		ANNOUNCEMNT_TXT_1:
			'Obtenga XHT con el programa HAP al introducir a su amigos al intercambio. {0}.',
		DEFAULT_ANNOUNCEMENT:
			'Esta sección muestra sus anuncios públicos del intercambio!',
		ANNOUNCEMENT_TXT_2:
			'XHT gratuito será distribuido a todas las billeteras que {0}.',
		LEARN_MORE: 'Aprender más',
		APPLY_TODAY: 'Aplicar hoy', // new
	},
	OPEN_WALLET: 'Abrir billetera', // new
	AGO: 'ago', // new
};
