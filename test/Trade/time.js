
function Hollatimestampe(){
	const timestamp = require('time-stamp');
 
	console.log(timestamp('YYYY/MM/DD HH:mm:ss'));
	const tmStamp = timestamp('YYYY/MM/DD HH:mm:ss') ;
	//console.log(newUser);

	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	}
  
	localStorage.setItem('Timestampe', tmStamp);
	//console.log(localStorage.getItem('NewUser'));
	return localStorage.getItem('Timestampe');
}
function Hollatimestampe(){
	const timestamp = require('time-stamp');
 
	//  console.log(timestamp('YYYY/MM/DD HH:mm:ss'));
	const tmStamp = timestamp('YYYY/MM/DD HH:mm:ss') ;
	//console.log(newUser);

	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	}
  
	localStorage.setItem('Timestampe', tmStamp);
	//console.log(localStorage.getItem('NewUser'));
	return localStorage.getItem('Timestampe');
}
function GetHollatimestampe(){

	//console.log(newUser);

	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	}

	return localStorage.getItem('Timestampe');
}
function getHollaTime(){
	var str = String(GetHollatimestampe());
	var res = str.substring(11, 19);
	return res;
}
module.exports = {Hollatimestampe,GetHollatimestampe, getHollaTime};
