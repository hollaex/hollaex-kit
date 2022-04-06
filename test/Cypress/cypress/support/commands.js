// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then

//var randomstring = require('randomstring');
// import 'cypress-iframe';
// or
require('cypress-iframe');
Cypress.Commands.add('getIframe', (iframe) => {
   cy.get(iframe)
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(cy.wrap).invoke('text').then((text)=> {return text.toString()})
		
		})
// Cypress.Commands.add('defineNewUser',(User,i) =>{
// 	const newUser = randomstring.generate(i)+'@'+User ;
// 	//console.log(newUser);

// 	if (typeof localStorage === 'undefined' || localStorage === null) {
// 		var LocalStorage = require('node-localstorage').LocalStorage;
// 		localStorage = new LocalStorage('./../Utils/scratch');
// 	}
  
// 	localStorage.setItem('NewUser', newUser);
// 	//console.log(localStorage.getItem('NewUser'));
// 	return localStorage.getItem('NewUser');
// })
// Cypress.Commands.add('getNewUser',()=>{
// 	if (typeof localStorage === 'undefined' || localStorage === null) {
// 		var LocalStorage = require('node-localstorage').LocalStorage;
// 		localStorage = new LocalStorage('./../Utils/scratch');
// 	}
  
// 	return localStorage.getItem('NewUser');
// })


//var text= null;
// var Link =null;

Cypress.Commands.add('trimmer',(str,obj,Name)=>{
	let text = null;
	text = str.replace(/(=\\r\\n|\\n|\\r|\\t)/gm,"");
	
	var arr = [];
	var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm; 
	var m;
	
	console.log('command : '+Name)
	while ((m = re.exec(text)) !== null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		arr.push(m[0]);
		console.log(arr)
	}
	
		
			for (var i = 0; i < arr.length; i++) {
		if ((arr[i]).startsWith(obj)) {
			console.log("finction link",arr[i].toString())	
			return (arr[i].toString());
		}
	
	
}
expect(arr[3].toString()).to.equal(Name.toString()+';')
console.log("arr 2"+arr[3])
})


Cypress.Commands.add('forceVisit', url => {
    cy.window().then(win => {
        return win.open(url, '_self'); 
      })


});

