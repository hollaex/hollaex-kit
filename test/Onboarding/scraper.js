const fs = require("fs");
const fileContents = fs.readFileSync('txt.txt').toString();

function chunkCleaner(str){
 return	str.replace(/(=\\r\\n|\\n|\\r|\\t)/gm,"");
}
function getURLsFromString(str) {
	var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm; 
	var m;
	var arr = [];
	while ((m = re.exec(str)) !== null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		arr.push(m[0]);
	}
	return arr;
}
function contains(a, obj) {
	for (var i = 0; i < a.length; i++) {
		if (String(a[i]).startsWith(obj)) {
			//console.log(a[i],i);
			return (a[i]);
		}
	}
	return false;
}
function addRest(str,txt){
	let UrlList = getURLsFromString(chunkCleaner(str))
	return contains(UrlList,txt);
}
module.exports = {addRest};
 //console.log(addRest(fileContents,"https://sandbox.hollaex.com/reset-password/"));
