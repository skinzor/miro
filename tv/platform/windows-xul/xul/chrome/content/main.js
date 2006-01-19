function onLoad() {
    jsdump("onLoad running.");
    var py = Components.classes["@participatoryculture.org/dtv/pybridge;1"].
    	getService();
    py.QueryInterface(Components.interfaces.pcfIDTVPyBridge); // necessary?
    py.onStartup(document);
}

/*
function testCreate() {
    elt = document.createElement("browser");
    elt.setAttribute("width", "100");
    elt.setAttribute("height", "100");
    elt.setAttribute("src", "http://web.mit.edu");
    main = document.getElementById("main");
    main.appendChild(elt);
}
*/

function jsdump(str) {
    Components.classes['@mozilla.org/consoleservice;1']
	.getService(Components.interfaces.nsIConsoleService)	
	.logStringMessage(str);
}

function addChannel(url) {
    var py = Components.classes["@participatoryculture.org/dtv/pybridge;1"].
    	getService();
    py.QueryInterface(Components.interfaces.pcfIDTVPyBridge);
    py.addChannel(url);
}

// FIXME: Duplicated from dynamic.js
function getContextClickMenu(element) {
    while (1) {
	if (element.nodeType == 1 && element.getAttribute('t:contextMenu')) {
	    var ret = element.getAttribute('t:contextMenu');
	    ret = ret.replace(/\\n/g,"\n");
	    ret = ret.replace(/\\\\/g,"\\");
	    return ret;
	}
	if (element.parentNode)
	    element = element.parentNode;
	else
	    return "";
    }

    // Satisfy Mozilla that the function always returns a
    // value. Otherwise, we get an error if strict mode is enabled,
    // ultimately preventing us from getting the state change event
    // indicating that the load succeeded.
    return "";
}

//FIXME: Duplicated from dynamic.js
function eventURL(url) {
  jsdump('FIXME: eventURL called from XUL land: '+url);
}

function xulclickhandler(event) {
  var itemsAdded = 0;
  var menu = getContextClickMenu(event.target);
  var popup = document.getElementById('contextPopup');
  var kids = popup.childNodes;
  for (var i = 0; i < kids.length; i++) {
    popup.removeChild(kids[i]);
  }
 
  menu = menu.split("\n");
  while (menu.length > 0) {
    var line = menu.shift().split('|');
    if (line.length > 1) {
      var newItem = document.createElement('menuitem');
      newItem.setAttribute('label',line[1]);
      newItem.setAttribute('oncommand','eventURL("'+line[0]+'");');
      popup.appendChild(newItem);
      itemsAdded++;
    } else {
      var newItem = document.createElement('menuseparator');
      popup.appendChild(newItem);
    }
  }
  return (itemsAdded > 0); // Return false if there are no items in the menu
                           // This should hide empty menus, but
                           // apparently doesn't...

}
