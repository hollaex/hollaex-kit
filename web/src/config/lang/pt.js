import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';
import flatten from 'flat';

const options = { safe: true };
const nestedContent = {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Plataforma Crypto',
	LOGOUT_CONFIRM_TEXT: 'Você está certo disso? Gostaria de sair da aplicação?',
	ADD_TRADING_PAIR: 'Selecionar mercado',
	ACTIVE_TRADES: 'Você deve ter {0} para acessar seus trades ativos',
	CANCEL_BASE_WITHDRAWAL: 'Cancelar {0} Saque',
	CANCEL_WITHDRAWAL: 'Cancelar Saque',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM:
		'Você gostaria de cancelar seu saque em andamento de:',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'DD/MM/YYYY HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'Login',
	SIGN_IN: 'Acessar',
	SIGNUP_TEXT: 'Cadastre-se',
	REGISTER_TEXT: 'Cadastrar',
	ACCOUNT_TEXT: 'Conta',
	HOME_TEXT: 'Home',
	CLOSE_TEXT: 'Fechar',
	COPY_TEXT: 'Copiar',
	COPY_SUCCESS_TEXT: 'Copiado com sucesso',
	CANCEL_SUCCESS_TEXT: 'Cancelado com Sucesso!',
	UPLOAD_TEXT: 'Anexar',
	ADD_FILES: 'Adicionar Arquivos',
	OR_TEXT: 'Ou',
	CONTACT_US_TEXT: 'Contato',
	HELPFUL_RESOURCES_TEXT: 'Ajuda',
	HELP_RESOURCE_GUIDE_TEXT:
		'Sinta-se a vontade para nos contatar por email se tiver qualquer problema',
	HELP_TELEGRAM_TEXT: 'Verificar a documentação da API:',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: 'Precisa de ajuda?',
	HELP_TEXT: 'ajuda',
	SUCCESS_TEXT: 'Sucesso',
	ERROR_TEXT: 'Erro',
	PROCEED: 'AVANÇAR',
	EDIT_TEXT: 'Editar',
	BACK_TEXT: 'Voltar',
	NO_OPTIONS: 'Sem opções disponí­veis',
	SECONDS: 'segundos',
	VIEW_MARKET: 'ver mercado',
	GO_TRADE: 'Trade',
	VIEW_INFO: 'Ver página de informações',
	APPLY_HERE: 'Enviar aqui',
	HOME: {
		SECTION_1_TITLE: 'Bem vindo ao HollaEx Exchange Kit!',
		SECTION_1_TEXT_1:
			' Construa sua própria corretora escalonável de ativos digitais com o HollaEx Kit e faça parte do futuro das finanças.',
		SECTION_1_TEXT_2:
			'Nós nos dedicamos a levar avanços para a tecnologia financeira por meio de um acesso simples e acessível à tecnologia de trading.',
		SECTION_1_BUTTON_1: 'Saiba mais',
		SECTION_3_TITLE: 'Recursos',
		SECTION_3_CARD_1_TITLE: 'MATCHING ENGINE ESCALONÁVEL',
		SECTION_3_CARD_1_TEXT:
			'Solução de alto desempenho de Matching Engine para Ordens usando os mais eficientes algoritmos',
		SECTION_3_CARD_2_TITLE: 'INTEGRAÇÃO BANCÁRIA',
		SECTION_3_CARD_2_TEXT:
			'Plugins com módulos costumizáveis disponíveis para integração bancária. Conhecemos as finanças tradicionais e podemos ajudá-lo a tornar seu câmbio local',
		SECTION_3_CARD_3_TITLE: 'SUPER SEGURO',
		SECTION_3_CARD_3_TEXT:
			' HollaEx usa as melhores práticas de segurança e os algoritmos mais seguros e confiáveis para manter seu capital protegido. Esta é a nossa maior prioridade e por isso tomamos um cuidado super especial com a questão da segurança.',
		SECTION_3_CARD_4_TITLE: 'RELATÓRIOS AVANÇADOS',
		SECTION_3_CARD_4_TEXT:
			' Painel do administrador com e-mail customizável e relatórios para notificar a equipe de suporte e o administrador sobre o status do sistema e das transações.',
		SECTION_3_CARD_5_TITLE: 'ATENDIMENTO',
		SECTION_3_CARD_5_TEXT:
			'Podemos cuidar mais atentamente de suas necessidades e oferecer um profissional online para ajudá-lo com seus problemas e dúvidas.',
		SECTION_3_CARD_6_TITLE: 'INTEGRAÇÃO AO KYC',
		SECTION_3_CARD_6_TEXT:
			' Módulos flexíveis e integráveis para aplicar métodos de verificação de usuários e KYC em diferentes jurisdições.',
		SECTION_3_BUTTON_1: 'Ver Demo',
	},
	FOOTER: {
		FOOTER_LEGAL: [
			'Orgulho de ter origens em Seoul, Coréia dos Sul',
			'bitHolla Inc.',
		],
		FOOTER_LANGUAGE_TEXT: 'LINGUAGEM',
		TERMS_OF_SERVICE: 'Termos de Serviço',
		PRIVACY_POLICY: 'Termo de Privacidade',
		SECTIONS: {
			SECTION_1_TITLE: 'SOBRE',
			SECTION_1_LINK_1: 'Sobre nós',
			SECTION_1_LINK_2: 'Termos de uso',
			SECTION_1_LINK_3: 'Termos de privacidade',
			SECTION_1_LINK_4: 'Contate-nos',
			SECTION_2_TITLE: 'Informação',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Contate-nos',
			SECTION_2_LINK_3: 'Carreiras',
			SECTION_3_TITLE: 'DESENVOLVEDORES',
			SECTION_3_LINK_1: 'Documentação',
			SECTION_3_LINK_2: 'Forum',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'Biblioteca',
			SECTION_3_LINK_5: 'API documentação',
			SECTION_3_LINK_6: 'API de negociações',
			SECTION_3_LINK_7: 'Ferramentas para o Desenvolvimento',
			SECTION_3_LINK_8: 'Documentação',
			SECTION_4_TITLE: 'EXCHANGE',
			SECTION_4_LINK_1: 'Login',
			SECTION_4_LINK_2: 'Registrar',
			SECTION_4_LINK_3: 'Contate-nos',
			SECTION_4_LINK_4: 'Termos de uso',
			SECTION_5_TITLE: 'RECURSOS',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'Token HollaEx(XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'FAQ',
			SECTION_6_TITLE: 'MÍDIAS SOCIAIS',
			SECTION_6_LINK_1: 'Twitter',
			SECTION_6_LINK_2: 'Telegram',
			SECTION_6_LINK_3: 'Facebook',
			SECTION_6_LINK_4: 'Instagram',
			SECTION_6_LINK_5: 'Linkedin',
			SECTION_6_LINK_6: 'Website',
			SECTION_6_LINK_7: 'Suporte',
			SECTION_6_LINK_8: 'Informação',
			SECTION_6_LINK_9: 'YouTube',
		},
		XHT_DESCRIPTION:
			' HollaEx Kit é uma plataforma de trading de código aberto construída pela bitHolla Inc. Você pode criar e listar quaisquer ativos digitais e incluir novos usuários para negociar em sua bolsa usando este Kit para corretoras. O objetivo é ajudar você a administrar sua própria exchange. {1}.',
		CLICK_HERE: 'clique aqui',
		VISIT_HERE: 'visite aqui',
	},
	ACCOUNTS: {
		TITLE: 'Conta',
		TAB_VERIFICATION: 'Verificação',
		TAB_SECURITY: 'Segurança',
		TAB_NOTIFICATIONS: 'Notificações',
		TAB_SETTINGS: 'Configurações',
		TAB_PROFILE: 'Perfil',
		TAB_WALLET: 'Carteira',
		TAB_SUMMARY: 'Sumário',
		TAB_HISTORY: 'História',
		TAB_API: 'API',
		TAB_SIGNOUT: 'Sair',
	},
	REQUEST_XHT_ACCESS: {
		REQUEST_TITLE: 'Pedir Acesso',
		REQUEST_INVITE: 'Pedir Convite',
		CATEGORY_PLACEHOLDER:
			'Selecionar a categoria que melhor se adequa ao seu problema',
		INTRODUCTION_LABEL: 'Apresente-se',
		INTRODUCTION_PLACEHOLDER:
			'Onde você mora? Você está interessado em abrir uma exchange?',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'Categoria',
		CATEGORY_PLACEHOLDER:
			'Selecione a categoria que melhor se adequa ao seu problema',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'Verificação do usuário',
			OPTION_LEVEL: 'Aumentar o nível do usuário',
			OPTION_DEPOSIT: 'Depositar & Retirar',
			OPTION_BUG: 'Relatar bug',
			OPTION_PERSONAL_INFO: 'Alterar informações pessoais',
			OPTION_BANK_TRANSFER: 'Transferência Bancária',
			OPTION_REQUEST: 'Solicitar convite para a HollaEx Exchange',
		},
		SUBJECT_LABEL: 'Assunto',
		SUBJECT_PLACEHOLDER: 'De que se trata o seu problema?',
		DESCRIPTION_LABEL: 'Descrição',
		DESCRIPTION_PLACEHOLDER: 'Dê mais detalhes sobre seu problema',
		ATTACHMENT_LABEL: 'Adicionar anexos(max 3)',
		ATTACHMENT_PLACEHOLDER:
			' Adicione um arquivo para nos ajudar a entender seu problema. São aceitos arquivos nos formatos PDF, JPG, PNG e GIF',
		SUCCESS_MESSAGE: 'Seu e-mail foi enviado para o nosso suporte',
		SUCCESS_TITLE: 'Mensagem Enviada',
		SUCCESS_MESSAGE_1:
			'Seu problema foi enviado para o atendimento ao cliente.',
		SUCCESS_MESSAGE_2:
			'Levamos em média de 1-3 dias para responder à sua solicitação.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'Seu {0} endereço de recebimento',
			DESTINATION_TAG: 'Sua {0} tag de destino',
			MEMO: 'Your {0} memo',
			BTC: 'Seu endereço para receber Bitcoins',
			ETH: 'Seu endereço para receber Ethereum',
			BCH: 'Seu endereço para receber Bitcoin cash',
		},
		INCREASE_LIMIT: 'Quer aumentar o seu limite diário?',
		QR_CODE:
			'Este código QR pode ser escaneado pela pessoa que deseja enviar moedas para você',
		NO_DATA: 'Nenhuma informação disponível',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}',
	},
	LOGIN: {
		LOGIN_TO: 'Login para {0}',
		CANT_LOGIN: 'Não consegue fazer o login?',
		NO_ACCOUNT: 'Não tem uma conta?',
		CREATE_ACCOUNT: 'Crie uma aqui',
		HELP: 'Ajuda',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'E-mail',
		EMAIL_PLACEHOLDER: 'Digite seu e-mail',
		PASSWORD_LABEL: 'Senha',
		PASSWORD_PLACEHOLDER: 'Digite sua senha',
		PASSWORD_REPEAT_LABEL: 'Digite sua senha novamente',
		PASSWORD_REPEAT_PLACEHOLDER: 'Digite sua senha novamente',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'Forneça o código OTP para fazer login',
		CAPTCHA: 'Sessão expirada. Por favor, atualize a página',
		FROZEN_ACCOUNT: 'Esta conta está suspensa',
		INVALID_EMAIL: 'Endereço de e-mail inválido',
		TYPE_EMAIL: 'Digite seu e-mail',
		REQUIRED: ' Campo obrigatório',
		INVALID_DATE: ' Data inválida',
		INVALID_PASSWORD:
			'Senha inválida. Ela deve conter pelo menos 8 caracteres, um dígito e um caractere especial.',
		INVALID_PASSWORD_2:
			'Senha inválida. Ela deve conter pelo menos 8 caracteres, um dígito e um caractere especial.',
		INVALID_CURRENCY: 'Endereço {0} Inválido({1})',
		INVALID_BALANCE:
			'Saldo disponível insuficiente ({0}) para realizar a operação ({1}).',
		MIN_VALUE: 'O valor deve ser igual a {0} ou superior.',
		MAX_VALUE: 'O valor deve ser igual a {0} ou inferior.',
		MIN_VALUE_NE: 'O valor deve ser maior que {0}.',
		MAX_VALUE_NE: 'O valor deve ser menor que {0}.',
		INSUFFICIENT_BALANCE: 'Saldo insuficiente',
		PASSWORDS_DONT_MATCH: 'A senha não confere',
		USER_EXIST: 'Este e-mail já foi registrado',
		ACCEPT_TERMS:
			'Você não concordou com os Termos de uso e Política de Privacidade',
		STEP: 'Valor inválido, o passo é {0}',
		ONLY_NUMBERS: 'O valor deve conter apenas números',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'Política de Privacidade',
			SUBTITLE:
				'Última atualização em 1º de abril de 2019. Ela substitui a versão anterior em sua totalidade.',
			TEXTS: [
				'HollaEx Web é uma plataforma de trading online de propriedade total da bitHolla Inc. BitHolla Inc (doravante denominada bitHolla) foi constituída em Seul, Coréia do Sul.',
				'O uso deste site HollaEx (â€œWebsiteâ€) e do serviço oferecido no site (â€œServiceâ€) são regidos pelos termos contidos nesta página de Termos e Condições (â€œTermsâ€). Este acordo constitui inteiramente o acordo entre as partes. Todas as outras informações fornecidas no site ou declarações orais / escritas feitas estão excluídas deste acordo; a política de câmbio é fornecida apenas para orientação e não constitui um acordo legal entre as partes.',
				'Ao acessar, visualizar ou baixar informações do site e usar o serviço fornecido pela bitHolla, você reconhece que leu, compreendeu e concorda incondicionalmente com estes Termos. BitHolla pode, a qualquer momento, sem aviso prévio, alterar os Termos. Você concorda em continuar submetido a quaisquer termos e condições alterados e que a bitHolla não tem obrigação de notificá-lo de tais alterações. Você aceita que é sua responsabilidade verificar estes Termos periodicamente em busca de alterações e que o uso continuado do Site e dos Serviços oferecidos pela bitHolla após a publicação de quaisquer alterações aos Termos significa sua aceitação de tais alterações.',
				'O Site e os direitos autorais de todos os textos, gráficos, imagens, software e quaisquer outros materiais no Site são de propriedade da bitHolla, incluindo todas as marcas registradas e outros direitos de propriedade intelectual em relação aos materiais e serviços no Site. Os materiais neste site só podem ser usados para uso pessoal e para fins não comerciais.',
				'Você pode exibir trechos do site em uma tela de computador ou imprimi-los para os fins acima mencionados, desde que preserve quaisquer direitos autorais e outros avisos de propriedade ou quaisquer marcas registradas ou logotipos bitHolla, conforme mostrado na impressão inicial ou download que não sofra alteração, adição ou exclusão. Com exceção do que já foi mencionado de forma expressa neste documento, você não pode, sem a permissão prévia por escrito da bitHollaâ€™s, alterar, modificar, reproduzir, distribuir ou usar em qualquer outro contexto comercial quaisquer materiais do Site.',
				'Você reconhece que â€˜bitHollaâ€™ e o logotipo bitHolla são marcas comerciais da bitHolla Inc. Você pode reproduzir tais marcas comerciais sem alteração em materiais baixados deste site desde de que esteja dento das medidas autorizadas acima. Entretanto, você não pode usar, copiar, adaptar ou apagá-las.',
				'Você não deve, em nenhuma circunstância, obter quaisquer direitos sobre ou em relação ao Site (exceto os direitos de usar o Site de acordo com estes Termos e quaisquer outros termos e condições que regem um serviço específico ou parte do Site) ou se passar como detentor de tais direitos sobre ou em relação ao Site.',
			],
		},
		GENERAL_TERMS: {
			TITLE: 'Termos Gerais de Serviço',
			SUBTITLE:
				'Última atualização em 1º de abril de 2019. Ela substitui a versão anterior em sua totalidade.',
			TEXTS: [
				'HollaEx Web é uma plataforma de trading online de propriedade total da bitHolla Inc. BitHolla Inc (doravante denominada bitHolla) foi constituída em Seul, Coréia do Sul.',
				'O uso deste site HollaEx (â€œWebsiteâ€) e do serviço oferecido no site (â€œServiceâ€) são regidos pelos termos contidos nesta página de Termos e Condições (â€œTermsâ€). Este acordo constitui inteiramente o acordo entre as partes. Todas as outras informações fornecidas no site ou declarações orais / escritas feitas estão excluídas deste acordo; a política de câmbio é fornecida apenas para orientação e não constitui um acordo legal entre as partes.',
				'Ao acessar, visualizar ou baixar informações do site e usar o serviço fornecido pela bitHolla, você reconhece que leu, compreendeu e concorda incondicionalmente com estes Termos. BitHolla pode, a qualquer momento, sem aviso prévio, alterar os Termos. Você concorda em continuar submetido a quaisquer termos e condições alterados e que a bitHolla não tem obrigação de notificá-lo de tais alterações. Você aceita que é sua responsabilidade verificar estes Termos periodicamente em busca de alterações e que o uso continuado do Site e dos Serviços oferecidos pela bitHolla após a publicação de quaisquer alterações aos Termos significa sua aceitação de tais alterações.',
				'O Site e os direitos autorais de todos os textos, gráficos, imagens, software e quaisquer outros materiais no Site são de propriedade da bitHolla, incluindo todas as marcas registradas e outros direitos de propriedade intelectual em relação aos materiais e serviços no Site. Os materiais neste site só podem ser usados para uso pessoal e para fins não comerciais.',
				'Você pode exibir trechos do site em uma tela de computador ou imprimi-los para os fins acima mencionados, desde que preserve quaisquer direitos autorais e outros avisos de propriedade ou quaisquer marcas registradas ou logotipos bitHolla, conforme mostrado na impressão inicial ou download que não sofra alteração, adição ou exclusão. Com exceção do que já foi mencionado de forma expressa neste documento, você não pode, sem a permissão prévia por escrito da bitHollaâ€™s, alterar, modificar, reproduzir, distribuir ou usar em qualquer outro contexto comercial quaisquer materiais do Site.',
				'Você reconhece que â€˜bitHollaâ€™ e o logotipo bitHolla são marcas comerciais da bitHolla Inc. Você pode reproduzir tais marcas comerciais sem alteração em materiais baixados deste site desde de que esteja dento das medidas autorizadas acima. Entretanto, você não pode usar, copiar, adaptar ou apagá-las.',
				'Você não deve, em nenhuma circunstância, obter quaisquer direitos sobre ou em relação ao Site (exceto os direitos de usar o Site de acordo com estes Termos e quaisquer outros termos e condições que regem um serviço específico ou parte do Site) ou se passar como detentor de tais direitos sobre ou em relação ao Site.',
			],
		},
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'Ok',
			START_TRADING: 'faça trade agora',
			SEE_HISTORY: 'ver histórico',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} Depósito recebido',
			TITLE_INCOMING: 'Entradas {0}',
			SUBTITLE_RECEIVED: 'você está recebendo seu {0} depósito',
			SUBTITLE_INCOMING: 'Você tem um total de receita de {0}',
			INFORMATION_PENDING_1:
				'Seu {0} requer 1 verificação antes de começar a fazer trade.',
			INFORMATION_PENDING_2:
				'Isso pode levar de 10 a 30 minutos. Enviaremos um e-mail assim que seu {0} for confirmado na blockchain.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: ' Solicitação Enviada',
		BUTTON_TEXT: 'Ok',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: 'Digite seu código de autenticação para continuar',
		OTP_LABEL: 'Código OTP',
		OTP_PLACEHOLDER: 'Digite o código de autenticação',
		OTP_TITLE: 'Código do Autenticador',
		OTP_HELP: 'ajuda',
		OTP_BUTTON: 'enviar',
		ERROR_INVALID: 'Código OTP inválido',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Trade Rápido',
		TOTAL_COST: 'Custo Total',
		BUTTON: 'Revisar Ordem',
		INPUT: '{0} to {1}',
		TRADE_TITLE: '{0} {1}',
	},
	PREVIOUS_PAGE: 'página anterior',
	NEXT_PAGE: 'próxima página',
	WALLET: {
		LOADING_ASSETS: 'Carregando ativos...',
		TOTAL_ASSETS: 'Total de ativos',
		AVAILABLE_WITHDRAWAL: 'Disponível para trading',
		AVAILABLE_TRADING: 'Disponível para retirada',
		ORDERS_PLURAL: 'ordens',
		ORDERS_SINGULAR: 'ordem',
		HOLD_ORDERS:
			'Você {0} em aberto {1}, resultando em uma reserva de {2} {3} depositada em seu {4} saldo',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'Recuperação de conta',
		SUBTITLE: ' Recupere sua conta abaixo',
		SUPPORT: 'Contatar o Suporte',
		BUTTON: 'Enviar link de recuperação',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'Redefinição de senha enviada',
		TEXT:
			'Se existir uma conta para o endereço de e-mail, um e-mail foi enviado para ela com instruções de redefinição de senha. Verifique seu e-mail e clique no link para concluir a redefinição de senha.',
	},
	RESET_PASSWORD: {
		TITLE: 'Definir nova senha',
		SUBTITLE: 'Definir nova senha',
		BUTTON: 'Definir nova senha',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'Você configurou com sucesso uma nova senha.',
		TEXT_2: 'Clique no login abaixo para prosseguir.',
	},
	SIGN_UP: {
		SIGNUP_TO: 'Inscreva-se para {0}',
		NO_EMAIL: 'Não recebeu o e-mail?',
		REQUEST_EMAIL: 'Solicite outro aqui',
		HAVE_ACCOUNT: 'Já tem uma conta?',
		GOTO_LOGIN: 'Vá para a página de login',
		AFFILIATION_CODE: 'Código de indicação (opcional)',
		AFFILIATION_CODE_PLACEHOLDER: 'Digite seu código de indicação',
		TERMS: {
			terms: 'Termos gerais',
			policy: 'Política de Privacidade',
			text: 'Eu li e concordo com os {0} e {1}',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'E-mail enviado',
		TEXT_1: 'Verifique seu e-mail e clique no link para confirmar seu e-mail.',
		TEXT_2:
			'Verifique seu e-mail e clique no link para confirmar seu e-mail. Se você não recebeu nenhuma confirmação de e-mail e já verificou seu lixo eletrônico, gentileza clicar em reenviar logo abaixo.',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'Reenviar Solicitação de E-mail',
		BUTTON: 'Solicitar E-mail',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'Reenviar e-mail',
		TEXT_1:
			'Se depois de alguns minutos você ainda não receber a verificação de e-mail, entre em contato conosco abaixo.',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'Código inválido',
		TEXT_1: 'Você confirmou seu e-mail com sucesso.',
		TEXT_2: 'Você pode agora fazer o seu login',
	},
	USER_VERIFICATION: {
		INFO_TXT:
			'Aqui você pode monitorar seu progresso com relação à verificação e upgrade de conta.',
		INFO_TXT_1:
			'Por favor, forneça as informações relevantes e necessárias para cada seção abaixo. Suas informações serão analisadas e aprovadas para um upgrade de conta somente após o envio das informações referentes a todas as seções',
		INFO_TXT_2:
			'* A verificação da parte de identidade exige que você {0} certos documentos.',
		DOCUMENTATIONS: 'Fazer upload',
		COMPLETED: ' Concluído',
		PENDING_VERIFICATION: 'Verificação pendente',
		TITLE_EMAIL: 'E-mail',
		MY_EMAIL: 'Meu E-mail',
		MAKE_FIRST_DEPOSIT: 'Faça seu primeiro depósito',
		OBTAIN_XHT: 'Compre XHT',
		TITLE_USER_DOCUMENTATION: 'Identificação',
		TITLE_ID_DOCUMENTS: 'Fazer upload',
		TITLE_BANK_ACCOUNT: 'Conta Bancária',
		TITLE_MOBILE_PHONE: 'Telefone celular',
		TITLE_PERSONAL_INFORMATION: 'Dados pessoais',
		VERIFY_EMAIL: 'Verificar e-mail',
		VERIFY_MOBILE_PHONE: 'Verificar número de telefone celular',
		VERIFY_USER_DOCUMENTATION: 'Verificar documentação do usuário',
		VERIFY_ID_DOCUMENTS: 'Verificar documentos de identificação',
		VERIFY_BANK_ACCOUNT: 'Verificar conta bancária',
		BUTTON: 'Enviar pedido de verificação',
		TITLE_IDENTITY: 'Identidade',
		TITLE_MOBILE: 'Celular',
		TITLE_MOBILE_HEADER: 'Número de celular',
		TITLE_BANK: 'Banco',
		TITLE_BANK_HEADER: 'Dados bancários',
		CHANGE_VALUE: 'Alterar valor',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'Estamos processando seus dados pessoais',
		PENDING_VERIFICATION_BANK: 'Estamos processando seus dados bancários',
		PENDING_VERIFICATION_DOCUMENTS: 'Estamos processando seus documentos',
		GOTO_VERIFICATION: 'Vá para verificação',
		GOTO_WALLET: 'Ir para a carteira',
		CONNECT_BANK_ACCOUNT: 'Vincular uma conta bancária',
		ACTIVATE_2FA: 'Ativar 2FA',
		INCOMPLETED: 'Incompleto',
		BANK_VERIFICATION: 'Verificação de banco',
		IDENTITY_VERIFICATION: 'Verificação de Identidade',
		PHONE_VERIFICATION: 'Verificação de telefone',
		DOCUMENT_VERIFICATION: 'Verificação de Documento',
		START_BANK_VERIFICATION: 'Iniciar verificação bancária',
		START_IDENTITY_VERIFICATION: 'Iniciar verificação de identidade',
		START_PHONE_VERIFICATION: 'Iniciar verificação de telefone',
		START_DOCUMENTATION_SUBMISSION: 'Iniciar envio da documentação',
		GO_BACK: 'Retornar',
		BANK_VERIFICATION_TEXT_1:
			'Você pode adicionar até 3 contas bancárias. É uma exigência que você entre em contato com o atendimento ao cliente para contas bancárias internacionais e elas terão limites aplicados ao saques',
		BANK_VERIFICATION_TEXT_2:
			'Ao verificar sua conta bancária, você terá acesso a:',
		BASE_WITHDRAWAL: 'Saques Fiat',
		BASE_DEPOSITS: 'Depósitos Fiat',
		ADD_ANOTHER_BANK_ACCOUNT: 'Adicionar outra conta bancária',
		BANK_NAME: 'Nome do banco',
		ACCOUNT_NUMBER: 'Número da conta',
		CARD_NUMBER: 'Número do cartão',
		BANK_VERIFICATION_HELP_TEXT:
			'Para que esta seção seja verificada, você deve completar a seção {0}.',
		DOCUMENT_SUBMISSION: 'Envio de Documento',
		REVIEW_IDENTITY_VERIFICATION: 'Revisar Verificação de Identidade',
		PHONE_DETAILS: 'Dados telefônicos',
		PHONE_COUNTRY_ORIGIN: 'Telefone do País de Origem',
		MOBILE_NUMBER: 'Número de celular',
		DOCUMENT_PROOF_SUBMISSION: 'Envio de Documentos de Comprovação',
		START_DOCUMENTATION_RESUBMISSION: 'Iniciar Reenvio de Documentação',
		SUBMISSION_PENDING_TXT:
			'* Esta seção já foi concluída e a documentação enviada. Caso você faça alguma alteração e reenvie seus documentos, essas novas informações irão substituir as informações anteriores.',
		CUSTOMER_SUPPORT_MESSAGE: 'Mensagem de Atendimento ao Cliente',
		DOCUMENT_PENDING_NOTE:
			'Seus documentos foram enviados e serão analisados em breve. Por favor, seja paciente.',
		DOCUMENT_VERIFIED_NOTE: 'Sua documentação está completa.',
		NOTE_FROM_VERIFICATION_DEPARTMENT:
			'Mensagem da equipe de revisão de documentos',
		CODE_EXPIRES_IN: 'O código expira em',
		EMAIL_VERIFICATION: 'Enviar e-mail de verificação',
		VERIFICATION_SENT: 'Verificação enviada',
		VERIFICATION_SENT_INFO:
			'Confira seu e-mail e clique no link para verificar o e-mail.',
		OKAY: 'Ok',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'Nome',
				FIRST_NAME_PLACEHOLDER:
					'Digite seu nome exatamente como aparece em seu documento de identidade',
				LAST_NAME_LABEL: 'Último sobrenome',
				LAST_NAME_PLACEHOLDER:
					'Digite seu último sobrenome exatamente como aparece em seu documento de identidade',
				FULL_NAME_LABEL: 'Nome Completo',
				FULL_NAME_PLACEHOLDER:
					'Digite seu nome completo exatamente como aparece em seu documento de identidade',
				GENDER_LABEL: 'Gênero',
				GENDER_PLACEHOLDER: 'Digite seu gênero',
				GENDER_OPTIONS: {
					MAN: 'Masculino',
					WOMAN: 'Feminino',
				},
				NATIONALITY_LABEL: 'Nacionalidade',
				NATIONALITY_PLACEHOLDER:
					'Digite a nacionalidade que está escrita no seu documento de identidade',
				DOB_LABEL: 'Data de nascimento',
				COUNTRY_LABEL: 'País em que você mora',
				COUNTRY_PLACEHOLDER: 'Selecione o país em que você mora atualmente',
				CITY_LABEL: 'Cidade',
				CITY_PLACEHOLDER: 'Digite a cidade em que você mora',
				ADDRESS_LABEL: 'Endereço',
				ADDRESS_PLACEHOLDER: 'Digite o endereço em que você mora atualmente',
				POSTAL_CODE_LABEL: 'CEP',
				POSTAL_CODE_PLACEHOLDER: 'Digite seu CEP',
				PHONE_CODE_LABEL: 'Country',
				PHONE_CODE_PLACEHOLDER: 'Selecione o país de registro do seu telefone',
				PHONE_CODE_DISPLAY: '({0}) {1}',
				PHONE_NUMBER_LABEL: 'Número de Telefone',
				PHONE_NUMBER_PLACEHOLDER: 'Digite seu número de telefone ',
				CONNECTING_LOADING: 'Conectando',
				SMS_SEND: 'Enviando SMS',
				SMS_CODE_LABEL: 'Código SMS',
				SMS_CODE_PLACEHOLDER: 'Insira o seu código SMS',
			},
			INFORMATION: {
				TEXT:
					'IMPORTANTE: Digite seu nome nos campos abaixo exatamente como aparece em seu documento de identidade (nome completo com iniciais e sobrenome (s) completo (s)). Você tem um negócio? Entre em contato com o atendimento ao cliente para abrir uma conta PJ.',
				TITLE_PERSONAL_INFORMATION: 'Dados pessoais',
				TITLE_PHONE: 'Phone',
				PHONE_VERIFICATION_TXT:
					'O fornecimento de dados de contato válidos nos ajudará muito na resolução de conflitos, evitando transações indesejadas em sua conta.',
				PHONE_VERIFICATION_TXT_1:
					'Forneça seu número de telefone celular para receber atualizações em tempo real sobre depósitos e saques.',
				PHONE_VERIFICATION_TXT_2:
					'Comprove ainda mais sua identidade e endereço compartilhando seu número de telefone fixo (opcional).',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'Selecione um tipo de documento de identidade',
				ID_NUMBER: 'Por favor, digite o número de cada documento',
				ISSUED_DATE: 'Selecione a data de emissão de seu documento',
				EXPIRATION_DATE: 'Selecione a data de validade de seu documento',
				FRONT:
					'Por favor, faça um upload de uma foto ou escaneamento de seu passaporte',
				PROOF_OF_RESIDENCY:
					'Por favor, faça um upload de uma foto ou digitalização de um documento que comprove o endereço que você mora atualmente',
				SELFIE_PHOTO_ID:
					'Por favor, faça o upload de uma foto sua (selfie) segurando seu passaporte e o papel contendo as informações necessárias',
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'Tipo de documento de identidade',
				TYPE_PLACEHOLDER: 'Selecione o tipo de documento de identidade',
				TYPE_OPTIONS: {
					ID: 'Identidade',
					PASSPORT: 'Passporte',
				},
				ID_NUMBER_LABEL: 'Número do Passaporte',
				ID_NUMBER_PLACEHOLDER: 'Digite o número do seu passaporte',
				ID_PASSPORT_NUMBER_LABEL: 'Número do Passaporte',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'Digite o número do seu passaporte',
				ISSUED_DATE_LABEL: 'Data de emissão do passaporte',
				EXPIRATION_DATE_LABEL: 'Data de validade do passaporte',
				FRONT_LABEL: 'Passporte',
				FRONT_PLACEHOLDER: 'Adicione uma cópia do seu passaporte ',
				BACK_LABEL: 'Verso do passaporte',
				BACK_PLACEHOLDER:
					'Adicione uma cópia do verso do seu documento de identidade (se for o caso)',
				PASSPORT_LABEL: 'Passaporte',
				PASSPORT_PLACEHOLDER: 'Adicione uma cópia do seu passaporte',
				POR_LABEL: 'Comprovante de endereço',
				POR_PLACEHOLDER:
					'Adicione uma cópia de um documento que comprove o seu endereço',
				SELFIE_PHOTO_ID_LABEL:
					'Sua selfie segurando seu passaporte e papel contendo as informações exigidas',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'Adicione uma cópia da sua selfie segurando seu passaporte e papel contendo as informações exigidas',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'Documento de identidade',
				PROOF_OF_RESIDENCY: 'Comprovante de residência',
				ID_SECTION: {
					TITLE:
						'Por favor, certifique-se de que os documentos enviados sejam:',
					LIST_ITEM_1:
						'DE ALTA QUALIDADE (imagens coloridas, resolução de 300 dpi ou superior).',
					LIST_ITEM_2: "TOTALMENTE VISÍVEIS (marcas d'água são permitidas).",
					LIST_ITEM_3: 'VÁLIDOS, com a data de validade bem visível.',
					WARNING_1:
						'Apenas passaportes válidos serão aceitos; aceitamos fotos de alta qualidade ou imagens digitalizadas desses documentos.',
					WARNING_2:
						'Somente você poderá subir seus próprios documentos. Qualquer uso de documentos errados ou falsos terá consequências legais e resultará na suspensão de sua conta imediatamente.',
					WARNING_3:
						'Por favor, não utilize o seu passaporte como comprovante de residência.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'Para evitar atrasos no processo de verificação da sua conta, tenha certeza de que:',
					SECTION_1_TEXT_2:
						'Seu NOME, ENDEREÇO, DATA DE EMISSÃO e EMISSOR estejam bem visíveis;',
					SECTION_1_TEXT_3:
						'O comprovante de residência enviado SEJA RECENTE (MÁXIMO 3 MESES); e',
					SECTION_1_TEXT_4:
						'As fotos coloridas ou imagens digitalizadas enviadas sejam de ALTA QUALIDADE (pelo menos 300 DPI)',
					SECTION_2_TITLE:
						'ACEITAMOS OS SEGUINTES DOCUMENTOS COMO COMPROVANTES DE RESIDÊNCIA:',
					SECTION_2_LIST_ITEM_1: 'Extratos bancários',
					SECTION_2_LIST_ITEM_2: 'Contas de luz, água, internet, etc.).',
					SECTION_2_LIST_ITEM_3:
						'Um documento emitido pelo seu governo (imposto de renda, certificado de residência, etc.).',
					WARNING:
						'Não aceitamos o endereço escrito no documento de identidade apresentado como sendo um comprovante de residência válido.',
				},
				SELFIE: {
					TITLE: 'Selfie com passaporte e Anotação exigida',
					INFO_TEXT:
						' Gentileza providenciar uma foto sua segurando seu passaporte e um papel com as seguintes informações: endereço eletrônico da exchange urlâ€™, a data de hoje e sua assinatura. Certifique-se de que seu rosto esteja bem visível e que as informações de seu documento estejam legíveis e nítidas.',
					REQUIRED: 'Exigências:',
					INSTRUCTION_1: 'Rosto bem visível ',
					INSTRUCTION_2: 'Passaporte bem legível',
					INSTRUCTION_3: 'Escreva o nome da exchange',
					INSTRUCTION_4: 'Escreva a data de hoje ',
					INSTRUCTION_5: 'Assine o papel',
					WARNING:
						'Selfies com passaportes diferentes daqueles fornecidos não serão aceitos',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'Por favor, digite seu nome e sobrenome conforme registrado em sua conta bancária',
				ACCOUNT_NUMBER:
					'O número da sua conta bancária deve ter menos de 50 dígitos',
				ACCOUNT_NUMBER_MAX_LENGTH:
					'O número da sua conta bancária deve ter no máximo 50 caracteres',
				CARD_NUMBER: 'O número do seu cartão está com um formato errado',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'Nome do banco',
				BANK_NAME_PLACEHOLDER: 'Digite o nome do seu banco',
				ACCOUNT_NUMBER_LABEL: 'Número da conta bancária',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Digite o número da sua conta bancária',
				ACCOUNT_OWNER_LABEL: 'Nome do Ownerâ€™s da conta bancária',
				ACCOUNT_OWNER_PLACEHOLDER:
					'Digite seu nome exatamente como aparece em sua conta bancária',
				CARD_NUMBER_LABEL: 'Número do cartão do banco',
				CARD_NUMBER_PLACEHOLDER:
					'Digite o número de 16 dígitos que está na frente do seu cartão do banco',
			},
		},
		WARNING: {
			TEXT_1: 'Ao verificar a sua identidade, você terá acesso a:',
			LIST_ITEM_1: 'Aumento no limite de saques',
			LIST_ITEM_2: 'Aumento no limite de depósitos',
			LIST_ITEM_3: 'Taxas mais baixas',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			'Altere as configurações da sua conta: interface, notificações, nome de usuário e outras personalizações.',
		TITLE_TEXT_2:
			'Ao salvar suas configurações, todas as alterações serão aplicadas e salvas.',
		TITLE_NOTIFICATION: 'Notificações',
		TITLE_INTERFACE: 'Interface',
		TITLE_LANGUAGE: 'Idioma',
		TITLE_CHAT: 'Chat',
		TITLE_AUDIO_CUE: 'Tocar Aviso de Áudio',
		TITLE_MANAGE_RISK: 'Gerenciar Risco',
		ORDERBOOK_LEVEL: 'Níveis do livro de ordens (máx. 20)',
		SET_TXT: 'SET',
		CREATE_ORDER_WARING: 'Criar Aviso de Ordem',
		RISKY_TRADE_DETECTED: 'Trade arriscado detectado',
		RISKY_WARNING_TEXT_1:
			'O valor desta ordem está acima do valor limite da ordem que você definiu {0}.',
		RISKY_WARNING_TEXT_2: '({0} do portfolio)',
		RISKY_WARNING_TEXT_3:
			'Por favor, verifique se você realmente quer fazer este trade.',
		GO_TO_RISK_MANAGMENT: 'IR PARA GESTÃO DE RISCO',
		CREATE_ORDER_WARING_TEXT:
			'Crie uma janela pop-up de aviso quando sua ordem de trading usar mais de {0} da sua carteira',
		ORDER_PORTFOLIO_LABEL: 'Valor percentual da carteira:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'Pop-ups de Trade',
			POPUP_ORDER_CONFIRMATION: 'Pedir confirmação antes de enviar ordens',
			POPUP_ORDER_COMPLETED: 'Mostrar pop-up quando a ordem for concluída',
			POPUP_ORDER_PARTIALLY_FILLED:
				'Mostrar pop-up quando a ordem estiver parcialmente preenchida',
		},
		AUDIO_CUE_FORM: {
			ALL_AUDIO: 'Todas os avisos de áudio',
			PUBLIC_TRADE_AUDIO: 'Quando um trade público for feito',
			ORDERS_PARTIAL_AUDIO:
				'Quando uma de suas ordens for parcialmente realizada',
			ORDERS_PLACED_AUDIO: 'Quando uma ordem for processada',
			ORDERS_CANCELED_AUDIO: 'Quando uma ordem for cancelada',
			ORDERS_COMPLETED_AUDIO:
				'Quando uma de suas ordens for totalmente realizada',
			CLICK_AMOUNTS_AUDIO: 'Ao clicar em valores e preços no livro de ordens',
			GET_QUICK_TRADE_AUDIO: 'Ao fazer uma cotação para trade rápido',
			SUCCESS_QUICK_TRADE_AUDIO: 'Quando ocorrer um trade rápido bem-sucedido',
			QUICK_TRADE_TIMEOUT_AUDIO: 'Quando o tempo do trade rápido se esgota',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'Criar um aviso de pop-up quando o valor de uma ordem de trading ultrapassar uma porcentagem de valor determinada de seu portfólio',
			INFO_TEXT_1: 'Valor total dos ativos em {0}: {1}',
			PORTFOLIO: 'Porcentagem da carteira',
			TOMAN_ASSET: 'Valor aproximado',
			ADJUST: '(AJUSTAR PORCENTAGEM)',
			ACTIVATE_RISK_MANAGMENT: 'Ativar gerenciamento de risco',
			WARNING_POP_UP: 'Pop-ups de aviso',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'Histórico',
		TITLE_TRADES: 'Histórico de Compra/Venda',
		TITLE_DEPOSITS: 'Histórico de Depósitos',
		TITLE_WITHDRAWALS: 'Histórico de Saques',
		TEXT_DOWNLOAD: 'BAIXAR HISTÓRICO',
		TRADES: 'Trades',
		DEPOSITS: 'Depósitos',
		WITHDRAWALS: 'Saques',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'Ajuste as configurações de segurança para sua conta: autenticação de dois fatores (2FA), senha, chaves API e outras funções relacionadas à segurança.',
		OTP: {
			TITLE: '2FA',
			OTP_ENABLED: 'otp habilitado',
			OTP_DISABLED: 'HABILITAR O 2FA',
			ENABLED_TEXTS: {
				TEXT_1: 'Exigir OTP ao fazer login',
				TEXT_2: 'Exigir OTP ao fazer saques',
			},
			DIALOG: {
				SUCCESS: 'Você ativou a 2FA com sucesso',
				REVOKE: 'Você desativou a 2FA com sucesso ',
			},
			CONTENT: {
				TITLE: 'Ativar autenticação de dois fatores (2FA)',
				MESSAGE_1: 'Escanear',
				MESSAGE_2:
					'Escaneie o código QR abaixo com o Google Authenticator ou Authy para configurar automaticamente a autenticação de dois fatores em seu dispositivo.',
				MESSAGE_3:
					'Se você tiver alguma problema ao fazer o escaneamento, você pode inserir manualmente o código abaixo.',
				MESSAGE_4:
					'Você deve guardar este código com em um lugar seguro pois ele será necessário quando você for recuperar seu 2FA. Isso pode acontecer caso você troque ou perca seu telefone celular.',
				MESSAGE_5: 'Manual',
				WARNING:
					'É altamente recomendável que você configure a autenticação de dois fatores (2FA). Isso aumentará muito a segurança de seus recursos.',
				ENABLE: 'Ativar autenticação de dois fatores',
				DISABLE: 'Desativar autenticação de dois fatores',
			},
			FORM: {
				PLACEHOLDER: 'Digite seu OTP fornecido pelo Google Authenticator.',
				BUTTON: 'Ativar 2FA',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'Senha',
			ACTIVE: 'Ativar',
			DIALOG: {
				SUCCESS: 'Você mudou sua senha com sucesso',
			},
			FORM: {
				BUTTON: 'Alterar a senha',
				CURRENT_PASSWORD: {
					label: 'Senha atual',
					placeholder: 'Digite sua senha atual',
				},
				NEW_PASSWORD: {
					label: 'Nova Senha',
					placeholder: 'Digite uma nova senha',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'Confirme a nova senha',
					placeholder: 'Digite novamente sua nova senha',
				},
			},
		},
		LOGIN: {
			TITLE: 'Histórico de Login',
			IP_ADDRESS: 'Endereço de IP',
			TIME: 'Date/Time',
			CONTENT: {
				TITLE: 'Histórico de logins',
				MESSAGE:
					'Abaixo está a lista de histórico de login com dados de IP, país e hora. Se você observar qualquer atividade suspeita, você deve alterar sua senha e entrar em contato com nosso suporte',
			},
		},
		FREEZE: {
			TITLE: 'Congelar conta',
			CONTENT: {
				MESSAGE_1:
					'O congelamento de sua conta interromperá os saques e também todos os trading existentes.',
				WARNING_1:
					'Utilize este recurso apenas se você achar que sua conta tenha sido comprometida',
				TITLE_1: 'Congele sua conta',
				TITLE_2: 'Congelamento de conta',
				MESSAGE_2:
					'O congelamento de sua conta pode ajudar a protegê-la de ataques cibernéticos.',
				MESSAGE_3:
					'Caso você opte pelo congelamento de conta, acontecerá o seguinte:',
				MESSAGE_4: '1. Os saques pendentes serão cancelados.',
				MESSAGE_5:
					'2. Todos os trades serão interrompidos e as ordens não processadas serão canceladas.',
				MESSAGE_6:
					'3. Será necessária a ajuda do suporte técnico para reativar sua conta.',
				WARNING_2: 'Você realmente deseja congelar sua conta?',
			},
		},
	},
	CURRENCY: 'Moeda',
	TYPE: 'Tipo',
	TYPES_VALUES: {
		market: 'mercado',
		limit: 'limite',
	},
	TYPES: [
		{
			value: 'market',
			label: 'mercado',
		},
		{
			value: 'limit',
			label: 'limite',
		},
	],
	SIDE: 'Side',
	SIDES_VALUES: {
		buy: 'comprar',
		sell: 'vender',
	},
	SIDES_VERBS: {
		buy: 'comprado',
		sell: 'vendido',
	},
	SIDES: [
		{
			value: 'buy',
			label: 'comprar',
		},
		{
			value: 'sell',
			label: 'vender',
		},
	],
	DEFAULT_TOGGLE_OPTIONS: [
		{
			value: true,
			label: 'on',
		},
		{
			value: false,
			label: 'off',
		},
	],
	SIZE: 'Tamanho',
	PRICE: 'Preço',
	FEE: 'Taxa',
	FEES: 'Taxas',
	LIMIT: 'Limite',
	TIME: 'Tempo',
	TIMESTAMP: 'Timestamp',
	MORE: 'Mais',
	VIEW: 'Visualizar',
	STATUS: 'Status',
	AMOUNT: 'Quantia',
	COMPLETE: 'Finaliar',
	PENDING: 'Pendente',
	REJECTED: 'Rejeitado',
	ORDERBOOK: 'Livro de ordens',
	CANCEL: 'Cancelar',
	CANCEL_ALL: 'Cancelar tudo',
	GO_TRADE_HISTORY: 'Ir para o histórico de transações',
	ORDER_ENTRY: 'entrada de ordem',
	TRADE_HISTORY: 'histórico',
	CHART: 'tabela de preços',
	ORDERS: 'minhas ordens ativas',
	TRADES: 'meu histórico de transações',
	RECENT_TRADES: 'meus trades recentes',
	ORDER_HISTORY: 'Histórico de ordens',
	PUBLIC_SALES: 'vendas públicas',
	REMAINING: 'Restante',
	FULLFILLED: '{0} % Processada',
	FILLED: 'Processada',
	LOWEST_PRICE: 'Menor preço ({0})',
	PHASE: 'Fase',
	INCOMING: 'Entrada ',
	PRICE_CURRENCY: 'PREÇO ({0})',
	AMOUNT_SYMBOL: 'QUANTIA ({0})',
	MARKET_PRICE: 'Preço de mercado',
	ORDER_PRICE: 'Preço da ordem',
	TOTAL_ORDER: 'Total de ordens',
	NO_DATA: 'Sem dados',
	LOADING: 'Carregando',
	CHART_TEXTS: {
		d: 'Dados',
		o: 'Abrir',
		h: 'alto',
		l: 'baixo',
		c: 'Fechar',
		v: 'Volume',
	},
	QUICK_TRADE: 'Trade rápido',
	PRO_TRADE: 'Trade Pro',
	ADMIN_DASH: 'Página Admin',
	WALLET_TITLE: 'Carteira',
	TRADING_MODE_TITLE: 'Modo Trading',
	TRADING_TITLE: 'Trading',
	LOGOUT: 'Logout',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'A transação é muito pequena para ser enviada. Experimente uma quantia maior.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'A transação é muito grande para ser enviada. Experimente uma quantidade menor.',
	WITHDRAWALS_LOWER_BALANCE:
		'Você não tem {0} suficiente em seu saldo para enviar essa transação',
	WITHDRAWALS_FEE_TOO_LARGE: 'A taxa é mais do que {0}% de sua transação total',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'O endereço Bitcoin é inválido. Por favor, verifique com atenção e insira novamente ',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'O endereço Ethereum é inválido. Por favor, verifique com atenção e insira novamente',
	WITHDRAWALS_BUTTON_TEXT: 'revisar saque',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Endereço de destino',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Digite o endereço',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'Tag de destino (opcional)',
	WITHDRAWALS_FORM_MEMO_LABEL: 'Memorando (opcional)',
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'Digite a tag de destino',
	WITHDRAWALS_FORM_MEMO_PLACEHOLDER: 'Digite o memorando de transação',
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} quantia para sacar ',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Digite a quantia de {0} que deseja sacar',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'Taxa de transação',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'Taxa de saque em bancos',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'Digite o valor de {0} que deseja usar na taxa da transação',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'Taxa ideal: {0} {1}',
	DEPOSITS_FORM_AMOUNT_LABEL: '{0} quantia a depositar',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER: 'Digite a quantia de {0} que deseja sacar',
	DEPOSITS_BUTTON_TEXT: 'revisar depósito',
	DEPOSIT_PROCEED_PAYMENT: 'Pagar',
	DEPOSIT_BANK_REFERENCE:
		'Adicione este código {0} à transação bancária para identificar o depósito',
	DEPOSIT_METHOD: 'Método de Pagamento {0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'Cartão de crédito',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1:
		'Prossiga para o meio de pagamento com cartão de crédito.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'Você vai sair da plataforma para fazer o pagamento.',
	DEPOSIT_VERIFICATION_WAITING_TITLE: 'Verificando o pagamento',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'Por favor, não feche o aplicativo enquanto o pagamento estiver sendo verificado',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'Se algo deu errado durante a verificação, entre em contato conosco.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'Este é o ID da operação: {0} , gentileza fornecer este ID para que possamos ajudá-lo(a).',
	DEPOSIT_VERIFICATION_SUCCESS: 'Pagamento verificado',
	DEPOSIT_VERIFICATION_ERROR: 'Ocorreu um erro ao verificar o depósito.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: 'O depósito já foi verificado',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'Status inválido',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'O cartão que você fez o depósito não é o mesmo que o cartão registrado conosco. Por isso, seu depósito foi rejeitado e seus fundos serão reembolsados em até uma hora.',
	QUOTE_MESSAGE: 'Você vai para {0} {1} {2} por {3} {4}',
	QUOTE_BUTTON: 'Aceitar',
	QUOTE_REVIEW: 'Revisar',
	QUOTE_COUNTDOWN_MESSAGE: 'Você tem {0} segundos para fazer seu trading',
	QUOTE_EXPIRED_TOKEN: 'O token de cotação expirou.',
	QUOTE_SUCCESS_REVIEW_TITLE: 'Trade Rápido',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'Você conseguiu {0} {1} {2} para {3} {4}',
	COUNTDOWN_ERROR_MESSAGE: 'A contagem regressiva terminou',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'Banco para sacar',
		MESSAGE_ABOUT_SEND: 'Você está prestes a enviar',
		MESSAGE_BTC_WARNING:
			'Por favor, tenha certeza de que o endereço esteja correto, pois {0} as transferências são irreversíveis ',
		MESSAGE_ABOUT_WITHDRAW:
			'Você está prestes a transferir para sua conta bancária',
		MESSAGE_FEE: 'Taxa de transações de {0} ({1}) incluída',
		MESSAGE_FEE_BASE: 'Taxa de transação de {0} incluída',
		BASE_MESSAGE_1:
			'Você só pode sacar para uma conta bancária que tenha em seu registro um nome que corresponda ao nome registrado em sua conta.',
		BASE_MESSAGE_2: 'Valor mínimo para saque',
		BASE_MESSAGE_3: 'Quantidade máxima para saques diários',
		BASE_INCREASE_LIMIT: 'Aumente o seu limite diário',
		CONFIRM_VIA_EMAIL: 'Confirmar via e-mail',
		CONFIRM_VIA_EMAIL_1: 'Enviamos a você um e-mail de confirmação de saque.',
		CONFIRM_VIA_EMAIL_2:
			'Para concluir o processo de saque, por favor confirme',
		CONFIRM_VIA_EMAIL_3: 'o saque através de seu e-mail dentro de 5 minutos.',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'Seu pedido de saque está confirmado e será processado em breve. ',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'Para ver o seu status de seu saque, visite a sua página de histórico de saques.',
		GO_WITHDRAWAL_HISTORY: 'Ir para o histórico de saques',
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'depósito',
	WALLET_BUTTON_BASE_WITHDRAW: 'saque',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'receber',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'enviar',
	AVAILABLE_TEXT: 'Disponível',
	AVAILABLE_BALANCE_TEXT: 'Saldo {0} disponível: {1} {2}',
	BALANCE_TEXT: 'Saldo',
	CURRENCY_BALANCE_TEXT: '{0} Saldo',
	WALLET_TABLE_AMOUNT_IN: 'Quantidade em {0}',
	WALLET_TABLE_TOTAL: 'Total geral',
	WALLET_ALL_ASSETS: 'Todos os ativos',
	WALLET_HIDE_ZERO_BALANCE: 'Ocultar saldo zero',
	WALLET_ESTIMATED_TOTAL_BALANCE: 'Balanço total estimado',
	WALLET_ASSETS_SEARCH_TXT: 'Pesquisar',
	HIDE_TEXT: 'Ocultar',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Vendedores ',
	ORDERBOOK_BUYERS: 'Compradores',
	ORDERBOOK_SPREAD: 'spread {0}',
	ORDERBOOK_SPREAD_PRICE: '{0} {1}',
	CALCULATE_MAX: 'Max',
	DATEFIELD_TOOGLE_DATE_GR: 'Calendário gregoriano',
	VERIFICATION_WARNING_TITLE: 'Verificação de seus dados bancários',
	VERIFICATION_WARNING_MESSAGE:
		'Você precisa verificar seus dados bancários antes de efetuar o saque.',
	ORDER_SPENT: 'Gasto ',
	ORDER_RECEIVED: 'Recebido ',
	ORDER_SOLD: 'Vendido',
	ORDER_BOUGHT: 'Comprado',
	ORDER_AVERAGE_PRICE: 'Preço médio',
	ORDER_TITLE_CREATED: 'Limite criado com sucesso {0}',
	ORDER_TITLE_FULLY_FILLED: '{0} ordem processada com sucesso',
	ORDER_TITLE_PARTIALLY_FILLED: '{0} ordem parcialmente processada',
	ORDER_TITLE_TRADE_COMPLETE: '{0} {1} ordem foi bem-sucedida',
	LOGOUT_TITLE: 'Você foi deslogado',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'O token expirou',
	LOGOUT_ERROR_LOGIN_AGAIN: 'Faça o login novamente',
	LOGOUT_ERROR_INVALID_TOKEN: 'Token inválido',
	LOGOUT_ERROR_INACTIVE: 'Você foi deslogado por ter ficado inativo',
	ORDER_ENTRY_BUTTON: '{0} {1}',
	ORDER_ENTRY_ADVANCED: 'Avançado',
	QUICK_TRADE_OUT_OF_LIMITS: 'O tamanho da ordem está fora dos limites',
	QUICK_TRADE_TOKEN_USED: 'Este token já foi usado',
	QUICK_TRADE_QUOTE_EXPIRED: 'A cotação expirou',
	QUICK_TRADE_QUOTE_INVALID: 'Cotação inválida',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'Erro ao calcular a cotação',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
		'A ordem com o tamanho atual não pode ser processada',
	QUICK_TRADE_ORDER_NOT_FILLED: 'Ordem não processada',
	QUICK_TRADE_NO_BALANCE: 'Saldo insuficiente para lançar a ordem',
	QUICK_TRADE_SUCCESS: 'Sucesso!',
	QUICK_TRADE_INSUFFICIENT_FUND: 'Fundos insuficientes',
	QUICK_TRADE_INSUFFICIENT_FUND_MESSAGE:
		'Você não tem fundos suficientes em sua carteira para concluir esta transação.',
	YES: 'Sim',
	NO: 'Não',
	NEXT: 'Próximo ',
	SKIP_FOR_NOW: 'Pular por agora',
	SUBMIT: 'enviar',
	RESUBMIT: 'Reenviar',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Faltando documentos!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'Para obter acesso total às funções de saque e depósito, você deve enviar seus documentos de identidade na página de sua conta.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Sucesso!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'Você receberá uma notificação por e-mail quando suas informações forem processadas. O processamento normalmente leva de 1 a 3 dias.',
	VERIFICATION_NOTIFICATION_BUTTON: 'PROSSEGUIR PARA A EXCHANGE',
	ERROR_USER_ALREADY_VERIFIED: 'Usuário já verificado',
	ERROR_INVALID_CARD_USER:
		'As informações bancárias ou do cartão fornecidas estão incorretas',
	ERROR_INVALID_CARD_NUMBER: 'Número de cartão inválido',
	ERROR_LOGIN_USER_NOT_VERIFIED: 'Usuário não verificado',
	ERROR_LOGIN_USER_NOT_ACTIVATED: 'O usuário não está ativo',
	ERROR_LOGIN_INVALID_CREDENTIALS: 'Credenciais incorretas',
	SMS_SENT_TO: 'SMS enviado para {0}',
	SMS_ERROR_SENT_TO:
		'Erro ao enviar SMS para {0}. Atualize a página e tente novamente.',
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'ID da transação:',
	CHECK_ORDER: 'Verifique e confirme sua ordem',
	CHECK_ORDER_TYPE: '{0} {1}',
	CONFIRM_TEXT: 'Confirmar',
	GOTO_XHT_MARKET: 'Vá para o mercado XHT',
	INVALID_CAPTCHA: 'Captcha inválido',
	NO_FEE: 'N/D',
	SETTINGS_LANGUAGE_LABEL: 'Preferências de idioma (inclui e-mails)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'Exibir pop-up de confirmação de ordem',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{
			value: false,
			label: 'NÃO',
		},
		{
			value: true,
			label: 'SIM',
		},
	],
	SETTINGS_THEME_LABEL: 'Tema da interface do usuário',
	SETTINGS_THEME_OPTIONS: [
		{
			value: 'white',
			label: 'Branco',
		},
		{
			value: 'dark',
			label: 'Escuro',
		},
	],
	SETTING_BUTTON: 'salvar',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'Saques desabilitadas',
	VERIFICATION_NO_WITHDRAW_MESSAGE: 'Sua conta está desabilitada para saques',
	UP_TO_MARKET: 'Ir até o mercado',
	VIEW_MY_FEES: 'Ver minhas taxas',
	DEVELOPER_SECTION: {
		TITLE: 'Chave API',
		INFORMATION_TEXT:
			'A API fornece funcionalidades como obtenção de saldos de carteira, gerenciamento de ordens de compra / venda, solicitação de saques, bem como dados de mercado, negociações recentes, livro de ordens e ticker.',
		ERROR_INACTIVE_OTP:
			'Para gerar uma chave API, você precisa habilitar a autenticação de dois fatores.',
		ENABLE_2FA: 'Ativar 2FA',
		WARNING_TEXT: 'Não compartilhe sua chave de API com outras pessoas.',
		GENERATE_KEY: 'Gerar chave API',
		ACTIVE: 'Ativa ',
		INACTIVE: 'Inativa',
		INVALID_LEVEL:
			'Você precisa atualizar seu nível de verificação para ter acesso a este recurso',
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'Gerar chave API',
		GENERATE_TEXT:
			'Por favor, nomeie sua chave de API e guarde em um lugar seguro e privado após ser gerada. Você não poderá recuperá-la novamente depois.',
		GENERATE: 'Gerar',
		DELETE_TITLE: 'Excluir chave API',
		DELETE_TEXT:
			'A exclusão de sua chave de API é algo irreversível, embora você possa gerar uma nova chave de API a qualquer momento. Você quer deletar sua chave de API?',
		DELETE: 'DELETAR',
		FORM_NAME_LABEL: 'Nomear',
		FORM_LABLE_PLACEHOLDER: 'Nome da chave API',
		API_KEY_LABEL: 'Chave API',
		SECRET_KEY_LABEL: 'Chave secreta',
		CREATED_TITLE: 'Copie sua chave de API',
		CREATED_TEXT_1:
			'Por favor, copie sua chave de API em algum lugar agora, pois você não terá mais acesso à ela no futuro.',
		CREATED_TEXT_2: 'Mantenha sua chave segura e em um lugar privado.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'Nome',
		API_KEY: 'Chave API',
		SECRET: 'Sigilo',
		CREATED: 'Data Gerada',
		REVOKE: 'Anular',
		REVOKED: 'Anulado',
		REVOKE_TOOLTIP: 'Você tem que habilitar 2FA para anular o token',
	},
	CHAT: {
		CHAT_TEXT: 'chat',
		MARKET_CHAT: 'Chat do Mercado',
		CHAT_UNREAD: '{0} ({1})',
		READ_MORE: 'Saiba mais',
		SHOW_IMAGE: 'Mostrar imagem',
		HIDE_IMAGE: 'Ocultar imagem',
		CHAT_MESSAGE_BOX_PLACEHOLDER: ' Mensagem ',
		SIGN_UP_CHAT: 'Inscreva-se para entrar no chat',
		JOIN_CHAT: 'Definir nome de usuário para o chat',
		TROLLBOX: 'Trollbox ({0})',
	},
	INVALID_USERNAME:
		'O nome de usuário deve ter entre 3 e 15 caracteres, conter apenas letras minúsculas, números e traços',
	USERNAME_TAKEN:
		'Este nome de usuário já foi escolhido. Por favor, tente outro. ',
	USERNAME_LABEL: 'Nome de usuário (usado para o chat)',
	USERNAME_PLACEHOLDER: 'Nome de usuário',
	TAB_USERNAME: 'Nome de usuário',
	USERNAME_WARNING:
		'Seu nome de usuário só pode ser alterado uma vez. Certifique-se de que seu nome de usuário é realmente aquele que você quer.',
	USERNAME_CANNOT_BE_CHANGED: 'Nome de usuário não pode ser alterado',
	UPGRADE_LEVEL: 'Faça o upgrade do nível de conta',
	LEVELS: {
		LABEL_LEVEL: 'Nível',
		LABEL_LEVEL_1: 'Um',
		LABEL_LEVEL_2: 'Dois',
		LABEL_LEVEL_3: 'Três',
		LABEL_MAKER_FEE: 'Taxa do prestador',
		LABEL_TAKER_FEE: 'Taxa de tomador',
		LABEL_BASE_DEPOSIT: 'Depósito diário em euros',
		LABEL_BASE_WITHDRAWAL: 'Saque diário em euros',
		LABEL_BTC_DEPOSIT: 'Depósito diário em Bitcoins',
		LABEL_BTC_WITHDRAWAL: 'Saque diário em Bitcoins',
		LABEL_ETH_DEPOSIT: 'Depósito diário em Ethereum',
		LABEL_ETH_WITHDRAWAL: 'Saque diário em Ethereum',
		LABEL_PAIR_MAKER_FEE: '{0} Taxa do prestador',
		LABEL_PAIR_TAKER_FEE: '{0} Taxa de tomador',
		UNLIMITED: 'Ilimitado',
		BLOCKED: 'Desativado',
	},
	WALLET_ADDRESS_TITLE: 'Criar {0} carteira',
	WALLET_ADDRESS_GENERATE: 'Criar',
	WALLET_ADDRESS_MESSAGE:
		'Quando você cria uma carteira, você cria um endereço de depósito e de saque.',
	WALLET_ADDRESS_ERROR:
		'Erro ao criar o endereço. Atualize a página e tente novamente.',
	DEPOSIT_WITHDRAW: 'Depósito / Saque',
	GENERATE_WALLET: 'Criar carteira',
	TRADE_TAB_CHART: 'Gráfico',
	TRADE_TAB_TRADE: 'Trade',
	TRADE_TAB_ORDERS: 'Ordens',
	TRADE_TAB_POSTS: 'Posts',
	WALLET_TAB_WALLET: ' Carteira',
	WALLET_TAB_TRANSACTIONS: 'Transações',
	RECEIVE_CURRENCY: 'Receber {0}',
	SEND_CURRENCY: 'Enviar {0}',
	COPY_ADDRESS: 'Copiar Endereço',
	SUCCESFUL_COPY: 'Copiado com sucesso!',
	QUICK_TRADE_MODE: 'Modo de trade rápido',
	JUST_NOW: 'Agora mesmo',
	PAIR: 'Par',
	ZERO_ASSET: 'Você não tem nenhum ativo.',
	DEPOSIT_ASSETS: 'Depositar ativos',
	SEARCH_TXT: 'Pesquisar',
	SEARCH_ASSETS: 'Pesquisar Ativos',
	TOTAL_ASSETS_VALUE: 'Valor total dos ativos em {0}: {1}',
	SUMMARY: {
		TITLE: 'Resumo',
		TINY_PINK_SHRIMP_TRADER: 'Trader Básico',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'Conta do trader Básico',
		LITTLE_RED_SNAPPER_TRADER: 'Trader Gold',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'Conta do trader Gold',
		CUNNING_BLUE_KRAKEN_TRADING: 'Trader Platinum',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: 'Conta do trader Platinum',
		BLACK_LEVIATHAN_TRADING: 'Trader Diamond Black',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: 'Conta do trader Diamond Black',
		URGENT_REQUIREMENTS: 'Requisitos Urgentes',
		TRADING_VOLUME: 'Volume de trading',
		ACCOUNT_ASSETS: 'Ativos da conta',
		ACCOUNT_DETAILS: 'Detalhes da conta',
		SHRIMP_ACCOUNT_TXT_1: 'Sua jornada começa aqui!',
		SHRIMP_ACCOUNT_TXT_2:
			'Continue fazendo cada vez mais trading e logo você vai se destacar dos demais traders',
		SNAPPER_ACCOUNT_TXT_1:
			'Parabéns por manter-se firme em meio às flutuações do mercado.',
		SNAPPER_ACCOUNT_TXT_2:
			'Continue nesta jornada do trading que em breve você encontrará novas recompensas criptográficos à frente.',
		KRAKEN_ACCOUNT_TXT_1:
			'Um trader persistente e motivado resiste bem à qualquer dificuldade.',
		LEVIATHAN_ACCOUNT_TXT_1:
			'Ser um trader Diamond Black com certeza é para poucos! Apenas os mais fortes tem a resiliência de passar por desafios incalculáveis.',
		VIEW_FEE_STRUCTURE: 'Ver Estrutura e Limites de Taxas',
		UPGRADE_ACCOUNT: 'Fazer o upgrade da conta',
		ACTIVE_2FA_SECURITY: 'Segurança 2FA ativa',
		ACCOUNT_ASSETS_TXT_1: 'Exibido é um resumo de todos os seus ativos.',
		ACCOUNT_ASSETS_TXT_2:
			'Ao manter uma grande quantidade de ativos em sua carteira, você terá direito a um upgrade de conta que inclui uma badge exclusiva e taxas de trading mais baixas.',
		TRADING_VOLUME_TXT_1:
			'Seu histórico de volume de trading é exibido em {0} e é nominalmente calculado no final de cada mês a partir de todos os pares de moedas.',
		TRADING_VOLUME_TXT_2:
			'Uma alta atividade de trading lhe dará direito a um upgrade de conta, recompensando-o com uma badge exclusiva além de outras vantagens.',
		ACCOUNT_DETAILS_TXT_1:
			'Seu tipo de conta determina sua badge de conta, taxa de negociação, limites para depósitos e saques.',
		ACCOUNT_DETAILS_TXT_2:
			'O tempo de abertura de uma conta trading, a intensidade de sua atividade na plataforma e o valor total dos ativos da sua conta irão determinar se a sua conta é elegível para um upgrade ou não.',
		ACCOUNT_DETAILS_TXT_3:
			'Para manter o nível da sua conta, é necessário fazer trades constantes e manter uma certa quantidade de ativos depositados.',
		ACCOUNT_DETAILS_TXT_4:
			'O downgrading periódico das contas ocorrerá se o usuário não for muito ativo na plataforma e nem manter seus ativos na conta.',
		REQUIREMENTS: 'Exigências',
		ONE_REQUIREMENT: 'Apenas uma exigência:',
		REQUEST_ACCOUNT_UPGRADE: 'Solicitar um upgrade de conta',
		FEES_AND_LIMIT: '{0} Estrutura de taxas e limites ',
		FEES_AND_LIMIT_TXT_1:
			'Tornar-se um crypto trader marca um novo começo. Você somente terá permissão para atualizar sua conta se estiver munido de inteligência, vontade, velocidade e capacidade de assumir riscos ao fazer trading.',
		FEES_AND_LIMIT_TXT_2:
			'Cada conta tem suas próprias taxas e limites de depósito e saque.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'Provisão para depósito & saque',
		TRADING_FEE_STRUCTURE: 'Estrutura da taxa de negociação',
		WITHDRAWAL: 'Saque ',
		DEPOSIT: 'Depósito',
		TAKER: 'Tomador',
		MAKER: 'Prestador',
		WEBSITE: 'website',
		VIP_TRADER_ACCOUNT_ELIGIBLITY:
			'Elegibilidade para upgrade de conta VIP Trader ',
		PRO_TRADER_ACCOUNT_ELIGIBLITY:
			'Elegibilidade para upgrade de conta Pro Trader ',
		TRADER_ACCOUNT_ELIGIBILITY: 'Nível {0} de elegibilidade da conta ',
		NOMINAL_TRADING: ' Trading Nominal',
		NOMINAL_TRADING_WITH_MONTH: 'Trading Nominal Último {0}',
		ACCOUNT_AGE_OF_MONTHS: 'Tempo da conta de {0} meses',
		TRADING_VOLUME_EQUIVALENT: '{0} {1} Volume de trading equivalente',
		LEVEL_OF_ACCOUNT: 'Nível {0} da conta',
		TITLE_OF_ACCOUNT: '{0} Conta',
		LEVEL_TXT_DEFAULT: 'Adicione a descrição do seu nível aqui',
		LEVEL_1_TXT:
			'Sua jornada começa aqui, jovem crypto trader! Para ganhar bônus, basta verificar sua identidade e também conseguir limites maiores de depósito e saque com taxas de trading reduzidas.',
		LEVEL_2_TXT:
			'Basta fazer um volume de trading mensal acima de $ 3.000 USDT ou ter um saldo de mais de 5.000 XHT para desfrutar de taxas de trading mais baixas.',
		LEVEL_3_TXT:
			'É aqui que as coisas viram realidade! Desfrute de taxas de trading reduzidas e maiores limites de depósito e saque. Para chegar ao nível 3, é preciso completar sua verificação ',
		LEVEL_4_TXT:
			'Basta fazer um volume de trading mensal acima de $ 10.000 USDT ou ter um saldo de mais de 10.000 XHT para desfrutar de taxas de trading mais baixas.',
		LEVEL_5_TXT:
			'- Você conseguiu! A conta de nível 5 é uma conta rara, apenas para operadores de câmbio, usuários do Vault ou participantes do Programa de Afiliados da HollaEx (HAP). Desfrute de limites maiores e de taxa zero para prestadores.',
		LEVEL_6_TXT:
			'Basta fazer um volume de trading mensal acima de $ 300.000 USDT ou ter um saldo de mais de 100.000 XHT para desfrutar de taxas de trading mais baixas e maior quantidade de saques.',
		LEVEL_7_TXT:
			'Basta fazer um volume de trading mensal acima de $ 500.000 USDT ou ter um saldo de mais de 300.000 XHT para desfrutar de taxas de trading mais baixas e maior quantidade de saques.',
		LEVEL_8_TXT:
			'Basta fazer um volume de trading mensal acima de $ 600.000 USDT ou ter um saldo de mais de 400.000 XHT para desfrutar de taxas de trading mais baixa.',
		LEVEL_9_TXT:
			'Basta fazer um volume de trading mensal acima de $ 2.000.000 USDT ou ter um saldo de mais de 1.000.000 XHT para desfrutar de taxas de trading mais baixa.',
		LEVEL_10_TXT:
			'A conta de whale trader que faz você ganhar dinheiro de volta ao criar mercados. Para obter essa conta especial, entre em contato conosco.',
		CURRENT_TXT: 'Atual',
		TRADER_ACCOUNT_XHT_TEXT:
			'Sua conta está no período de pré-venda de XHT. Isso significa que você pode comprar XHT no valor de $ 0,10 para cada XHT. Todos os depósitos serão convertidos em XHT assim que a transação for concluída.',
		TRADER_ACCOUNT_TITLE: 'Conta - Período de pré-venda',
		HAP_ACCOUNT: 'Conta HAP',
		HAP_ACCOUNT_TXT:
			'Sua conta é uma conta verificada do Programa de Afiliados HollaEx (HAP). Agora você pode ganhar um bônus de 10% para cada pessoa que você convidar, e que venha a comprar XHT.',
		EMAIL_VERIFICATION: 'Verificação de e-mail',
		DOCUMENTS: 'Documentos',
		HAP_TEXT: 'Programa de Afiliados HollaEx(HAP) {0}',
		LOCK_AN_EXCHANGE: 'Bloquear uma Exchange {0}',
		WALLET_SUBSCRIPTION_USERS: 'Usuários Assinantes do Vault {0}',
		TRADE_OVER_XHT: 'Faça trading acima de {0} com valor equivalente em USDT',
		TRADE_OVER_BTC: 'Faça trading acima de {0} com valor equivalente em BTC',
		XHT_IN_WALLET: '{0} XHT na carteira ',
		REWARDS_BONUS: 'Recompensas e Bônus',
		COMPLETE_TASK_DESC:
			'Complete as tarefas e ganhe bônus no valor de mais de $ 10.000.',
		TASKS: 'Tasks',
		MAKE_FIRST_DEPOSIT: 'Faça seu primeiro depósito e receba 1 XHT',
		BUY_FIRST_XHT: 'Compre seu primeiro XHT e receba um bônus de 5 XHT ',
		COMPLETE_ACC_VERIFICATION:
			'Conclua a verificação da sua conta e receba um bônus de 20 XHT',
		INVITE_USER: 'Convide outros usuários e ganhe comissões dos trading deles',
		JOIN_HAP:
			'Faça parte do HAP e ganhe 10% para cada Kit HollaEx que você vender',
		EARN_RUNNING_EXCHANGE:
			'Ganhe uma renda passiva ao ter a sua própria exchange',
		XHT_WAVE_AUCTION: 'Dados de leilão XHT Wave',
		XHT_WAVE_DESC_1:
			'A distribuição do token HollaEx (XHT) é feita por meio de um Leilão Wave.',
		XHT_WAVE_DESC_2:
			'O Leilão Wave vende uma quantidade aleatória de XHT, em momentos aleatórios, para os maiores lances feitos no livro de ordens',
		XHT_WAVE_DESC_3: 'Abaixo temos os dados históricos do Leilão Wave',
		WAVE_AUCTION_PHASE: 'Fase de Leilão Wave {0}',
		LEARN_MORE_WAVE_AUCTION: 'Saiba mais sobre o Leilão Wave ',
		WAVE_NUMBER: 'Número Wave',
		DISCOUNT: '( {0}% de desconto )',
		MY_FEES_LIMITS: 'Minhas taxas e limites',
		MARKETS: 'Mercados',
		CHANGE_24H: 'Variação em 24H',
		VOLUME_24H: 'Volume em 24H ',
		PRICE_GRAPH_24H: 'Gráfico de preço 24H',
		VIEW_MORE_MARKETS: 'Ver mais mercados',
	},
	REFERRAL_LINK: {
		TITLE: 'Convide seu amigo',
		INFO_TEXT:
			'Indique seus amigos por meio deste link e receba benefícios toda vez que alguém fizer trade.',
		COPY_FIELD_LABEL: 'Compartilhe o link abaixo com amigos e ganhe comissões:',
		REFERRED_USER_COUT: 'Você indicou {0} usuários',
		COPY_LINK_BUTTON: 'COPIAR LINK DE INDICAÇÃO',
		XHT_TITLE: 'MINHAS INDICAÇÕES',
		XHT_INFO_TEXT: 'Ganhe comissões ao convidar seus amigos.',
		XHT_INFO_TEXT_1: 'As comissões são pagas periodicamente em sua carteira',
		APPLICATION_TXT:
			'Para se tornar um distribuidor HollaEx Kit, preencha o formulário.',
		TOTAL_REFERRAL: 'Total comprado vindo de indicações:',
		PENDING_REFERRAL: 'Comissões pendentes:',
		EARN_REFERRAL: 'Comissões ganham:',
		XHT_COUNT: '{0} XHT',
		APPLY_BUTTON: 'SOLICITAR',
	},
	STAKE_TOKEN: {
		TITLE: 'Realizar o stake do Token HollaEx',
		INFO_TXT1:
			'Os tokens HollaEx (XHT) devem ter uma garantia (staked) para rodar o software do HollaEx Kit exchange.',
		INFO_TXT2:
			'Você pode fazer uma garantia igual a essa para seu token HollaEx e ganhar os XHT não vendidos durante o leilão Wave.',
		INFO_TXT3:
			'Basta ir para dash.bitholla.com e fazer a garantia da sua própria exchange hoje e ganhar XHTs grátis',
		BUTTON_TXT: 'SAIBA MAIS',
	},
	TERMS_OF_SERVICES: {
		TITLE: 'Contrato de Compra de Token HollaEx',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: ' CONTINUAR',
		AGREE_TERMS_LABEL:
			'Eu li e concordo com o Contrato de Compra de Token HollaEx',
		RISK_INVOLVED_LABEL: 'Eu entendo os riscos envolvidos',
		DOWNLOAD_PDF: 'Baixar o PDF',
		DEPOSIT_FUNDS:
			'Deposite fundos em sua carteira para obter HollaEx Token (XHT)',
		READ_FAG: 'Leia o FAQ da HollaEx aqui: {0}',
		READ_DOCUMENTATION: 'Leia o white paper da HollaEx aqui: {0}',
		READ_WAVES: 'Regras para o próximo leilão público Wave de dezembro{0}',
		DOWNLOAD_BUY_XHT:
			'Baixe o PDF para ver o passo a passo de um processo visual na {0}',
		HOW_TO_BUY: 'como comprar HollaEx Token (XHT)',
		PUBLIC_SALES: 'Leilão público Wave',
		CONTACT_US:
			'Sinta-se à vontade para nos contatar para mais informações ou qualquer dúvida. Basta enviar um e-mail para {0}',
		VISUAL_STEP: 'Vee o passo a passo de um processo visual na {0}',
		WARNING_TXT:
			'Analisaremos sua solicitação e enviaremos mais instruções para seu e-mail sobre como acessar a HollaEx exchange.',
		WARNING_TXT1:
			'Enquanto isso, você pode se familiarizar com a rede HollaEx através dos recursos abaixo',
		XHT_ORDER_TXT_1:
			'Você deve fazer o login primeiro para começar a fazer trade',
		XHT_ORDER_TXT_2: '',
		XHT_ORDER_TXT_3: '{0} or {1}',
		XHT_TITLE: 'XHT',
		XHT_TRADE_TXT_1: 'Faça o login para ver seus trades recentes',
		XHT_TRADE_TXT_2: 'Você pode {0} ver o seu histórico de trading recente',
		LOGIN_HERE: 'faça seu login aqui',
	},
	WAVES: {
		TITLE: 'Informação sobre Wave',
		NEXT_WAVE: 'Próxima Wave',
		WAVE_AMOUNT: 'Quantia em Wave',
		FLOOR: 'Fundo',
		LAST_WAVE: 'Última wave',
	},
	TYPES_OF_POSTS: {
		TITLE: 'POSTAGENS',
		ANNOUNCEMEN: 'Aviso',
		SYSTEM_UPDATE: 'Atualização do sistema',
		LAST_WAVE: 'Última Wave',
		ANNOUNCEMENT_TXT:
			'Serão distribuídos XHTs gratuitos para todas as carteiras que fizerem a solicitação',
		SYSTEM_UPDATE_TIME: 'Hora:12:31, 19 de dezembro de 2019',
		SYSTEM_UPDATE_DURATION: '1 hora',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: ' 12h31, 19 de dezembro de 2019 ',
	},
	USER_LEVEL: 'Nível do usuário',
	LIMIT_AMOUNT: 'Quantia limite',
	FEE_AMOUNT: 'Valor da taxa',
	COINS: ' Moedas ',
	PAIRS: 'Pares',
	NOTE_FOR_EDIT_COIN: 'Nota: Para adicionar e remover {0}, consulte o {1}.',
	REFER_DOCS_LINK: 'docs',
	RESTART_TO_APPLY:
		'Você precisa reiniciar sua exchange para aplicar essas alterações.',
	TRIAL_EXCHANGE_MSG:
		'Você está usando uma versão de teste de {0} e ela expirará em {1} dias.',
	EXPIRY_EXCHANGE_MSG:
		'Sua exchange expirou. Vá para dash.bitholla.com para ativá-la novamente.',
	EXPIRED_INFO_1: 'Seu período de teste terminou.',
	EXPIRED_INFO_2:
		'Colateralize ou faça uma garantia da sua exchange para ativá-la novamente.',
	EXPIRED_BUTTON_TXT: 'ATIVAR EXCHANGE',
	TRADE_POSTS: {
		ANNOUNCEMENT: 'Avisos',
		ANNOUNCEMNT_TXT_3:
			'Lançamento público e Leilão Wave está remarcado para 1º de janeiro de 2020. Os depósitos e saques da carteira estão agora liberados.',
		ANNOUNCEMNT_TXT_4:
			'Feliz ano novo a todos e todas! Estamos iniciando um novo marco a partir de 2020 com o lançamento da plataforma de trading mais aberta do mercado. Isso só foi possível com a ajuda de todos vocês.',
		ANNOUNCEMNT_TXT_1:
			'Ganhe XHT com o programa HAP ao apresentar a exchange para seus amigos. {0}.',
		DEFAULT_ANNOUNCEMENT:
			'Esta seção exibe seus avisos públicos de sua exchange!',
		ANNOUNCEMENT_TXT_2:
			'Serão distribuídos XHTs gratuitos para todas as carteiras que {0}.',
		LEARN_MORE: 'Saiba mais',
		APPLY_TODAY: 'Solicite hoje',
	},
	OPEN_WALLET: 'Abrir carteira',
	AGO: 'atrás',
	CUMULATIVE_AMOUNT_SYMBOL: ' Cumulativo ',
	POST_ONLY: 'Publicar apenas',
	CLEAR: 'Limpar',
	ORDER_TYPE: 'tipo',
	TRIGGER_CONDITIONS: 'Condições de trigger',
	TRANSACTION_STATUS: {
		PENDING: 'Pendente ',
		REJECTED: ' Rejeitado ',
		COMPLETED: 'Concluído',
	},
	DEPOSIT_STATUS: {
		NEW: 'Novo',
		SEARCH_FIELD_LABEL: 'Cole seu ID de transação',
		SEARCH: 'PESQUISAR',
		SEARCHING: 'PESQUISANDO',
		CHECK_DEPOSIT_STATUS: 'Verificar o status do depósito',
		STATUS_DESCRIPTION:
			'Você pode verificar o status do seu depósito passando o ID da transação (hash) abaixo.',
		TRANSACTION_ID: 'ID de transação (hash)',
		SEARCH_SUCCESS: 'Pesquisa finalizada',
		ADDRESS_FIELD_LABEL: 'Cole o seu endereço',
		CURRENCY_FIELD_LABEL: 'Selecione a moeda',
	},
	CANCEL_ORDERS: {
		HEADING: 'Cancelar ordens',
		SUB_HEADING: 'Cancelar todas as ordens',
		INFO_1: 'Isso irá cancelar suas ordens abertas para este mercado.',
		INFO_2:
			'Tem certeza de que deseja cancelar todos as suas ordens em aberto?',
	},
	AMOUNT_IN: 'Montante em',
	LIMITS_BLOCK: {
		HEADER_ROW_DESCRIPTION:
			'Provisão para depósito e saques para todos os ativos ({0})',
		HEADER_ROW_TYPE: 'Tipo (todos os ativos)',
		HEADER_ROW_AMOUNT: 'Valor ({0})',
	},
};

const content = flatten(nestedContent, options);

export default content;
