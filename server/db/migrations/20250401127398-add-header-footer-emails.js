'use strict';
const TABLE = 'Status';



const contentTemplates = 
	{
		'en':  require('../../mail/strings/en.json').en,
		'ar':  require('../../mail/strings/ar.json').ar,
		'de':  require('../../mail/strings/de.json').de,
		'es':  require('../../mail/strings/es.json').es,
		'fa':  require('../../mail/strings/fa.json').fa,
		'fr':  require('../../mail/strings/fr.json').fr,
		'id':  require('../../mail/strings/id.json').id,
		'ja':  require('../../mail/strings/ja.json').ja,
		'ko':  require('../../mail/strings/ko.json').ko,
		'pt':  require('../../mail/strings/pt.json').pt,
		'vi':  require('../../mail/strings/vi.json').vi,
		'zh':  require('../../mail/strings/zh.json').zh,
	}

const models = require('../models');

const RTL = 'direction: rtl;';
module.exports = {
	async up(queryInterface) {

		const rtlLanguage = (lang) => (lang === 'fa' || lang === 'ar' ? RTL : '');


		function generateEmailTemplates(lang) {
			const htmlTemplate = `
<div style="background-color: #ffffff; padding: 1rem 0; font-family: arial; color: #000 !important">
    <div style="align-items:center; max-width: 45rem; margin: 0 auto;">
        <div style="-webkit-box-shadow: 0px 4px 10px 2px rgba(204,204,204,1) !important; -moz-box-shadow: 0px 4px 10px 2px rgba(204,204,204,1) !important; box-shadow: 0px 4px 10px 2px rgba(204,204,204,1) !important;">
            
            <div style="text-align: center; margin-bottom: 1.5rem; background-color: #333; padding-bottom: 1rem; padding-top: 1rem;">
                <a href="\${domain}"><img src="\${logoPath}" height="40"/></a>
            </div>
            
            <div style="background-color: #fff; color: #000 !important; padding: 5rem; padding-top: 30px; padding-bottom: 15px;${rtlLanguage(lang)}">
                \${content}
            </div>

            <div style = "padding: 1rem; padding-top: 1rem; padding-bottom: 3rem; background-color: transparent; color: #000 !important; font-size: 12px" >
                <div style="float: left">
                    <p><a style="text-decoration: none; color: #35b2e8 !important;" href="\${domain}">\${domain}</a><p>
                </div>
                <div style="float: right; font-size: 8px; text-align: right;">
                    <div style="margin-top: 0.5rem">
                        <a href="\${referral_link}">
                            \${referral_label}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;


			const templates = {};
			const languageTemplates = contentTemplates[lang];

			for (const [templateName, templateData] of Object.entries(languageTemplates)) {

				templates[templateName] = {
					html: htmlTemplate.replace('${content}', templateData.html),
					title: templateData.title
				};
			}

			return templates;
		}



		const statusModel = models[TABLE];
		const status = await statusModel.findOne({});

		if (!status?.email) return;
		const emailTemplates = {
			...status.email,
		};

		const languages =[
			'en','ar','de','es','fa','fr','id','ja','ko','pt','vi','zh'
		]
		for (let lang of languages) {
			const generatedTemplates = generateEmailTemplates(lang);
			const availableTemplates = Object.keys(generatedTemplates);

			for (const templete of availableTemplates) {
				emailTemplates[lang] = {
					...emailTemplates[lang],
					[templete]: generatedTemplates[templete]
				};

			}

		
		}

		await statusModel.update(
			{ email: emailTemplates },
			{ where: { id: status.id } }
		);
	
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
