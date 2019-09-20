export var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
export var IS_IOS = canUseDOM && /iphone|ipad|ipod/i.test(window.navigator.userAgent);