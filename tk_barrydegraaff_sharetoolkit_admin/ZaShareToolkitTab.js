/*
Copyright (C) 2014-2016  Barry de Graaff

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.
 */
ZaShareToolkitTab = function(parent, entry) {
    if (arguments.length == 0) return;
    ZaTabView.call(this, parent,"ZaShareToolkitTab");
    ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaShareToolkitTab",
        contextId:"SHARE_TOOLKIT"
    });
    this.setScrollStyle(Dwt.SCROLL);

    var soapDoc = AjxSoapDoc.create("ShareToolkit", "urn:ShareToolkit", null);
    soapDoc.getMethod().setAttribute("action", "getAccounts");
    var csfeParams = new Object();
    csfeParams.soapDoc = soapDoc;
    csfeParams.asyncMode = true;
    csfeParams.callback = new AjxCallback(ZaShareToolkitTab.prototype.getAccountsCallback);
    var reqMgrParams = {} ;
    resp = ZaRequestMgr.invoke(csfeParams, reqMgrParams);

    document.getElementById('ztab__SHARE_TOOLKIT').innerHTML = '<div style="padding-left:10px"><h1>Share Toolkit</h1>' +
    '<h2>Create and remove shares</h2>This option allows you to share an entire account with another account. Useful for department and team mailboxes.<br><br><select id="ShareToolkit-action" onchange="this.value==\'createShare\' ? document.getElementById(\'ShareToolkit-withfrom\').innerHTML = \'with\' : document.getElementById(\'ShareToolkit-withfrom\').innerHTML = \'from\'" ><option value="createShare">Share</option><option value="removeShare">Unshare</option></select> the account <input type="text" id="ShareToolkit-account-a" list="ShareToolkit-datalist" placeholder="user-a@domain.com">&nbsp;<span id="ShareToolkit-withfrom">with</span>:&nbsp;<input type="text" id="ShareToolkit-account-b" list="ShareToolkit-datalist" placeholder="user-b@domain.com"><datalist id="ShareToolkit-datalist"></datalist>&nbsp;&nbsp;<button id="ShareToolkit-btnCreateShare">OK</button>' +
    '<h2>Status</h2><div id="ShareToolkit-status" style="color:#aaaaaa; font-style: italic;"></div></div>';   
    
    ZaShareToolkitTab.prototype.status('Loading auto completion...');
    
    var btnCreateShare = document.getElementById('ShareToolkit-btnCreateShare');
    btnCreateShare.onclick = AjxCallback.simpleClosure(this.btnCreateRemoveShare);
}


ZaShareToolkitTab.prototype = new ZaTabView();
ZaShareToolkitTab.prototype.constructor = ZaShareToolkitTab;
//ZaTabView.XFormModifiers["ZaShareToolkitTab"] = new Array();

ZaShareToolkitTab.prototype.getTabIcon =
    function () {
        return "ClientUpload" ;
    }

ZaShareToolkitTab.prototype.getTabTitle =
    function () {
        return "Share Toolkit";
    }

ZaShareToolkitTab.prototype.getAccountsCallback = function (result) {
   var dataList = document.getElementById('ShareToolkit-datalist');
   var users = result._data.Body.ShareToolkitResponse.users._content.split(";");
   
   users.sort();
   users.forEach(function(item) 
   {
      // Create a new <option> element.
      var option = document.createElement('option');
      // Set the value using the item in the JSON array.
      option.value = item;
      // Add the <option> element to the <datalist>.
      dataList.appendChild(option);
   });
   ZaShareToolkitTab.prototype.status('Ready.');
   return;
}

ZaShareToolkitTab.prototype.btnCreateRemoveShare = function () {
    if(document.getElementById('ShareToolkit-action').value == 'createShare')
    {
       ZaShareToolkitTab.prototype.status('Creating share...');
    }
    else
    {
       ZaShareToolkitTab.prototype.status('Removing share...');
    }   
    var accountA = document.getElementById('ShareToolkit-account-a').value;
    var accountB = document.getElementById('ShareToolkit-account-b').value;
    
    if(accountA && accountB && (accountA !== accountB))
    {
       var soapDoc = AjxSoapDoc.create("ShareToolkit", "urn:ShareToolkit", null);
       soapDoc.getMethod().setAttribute("action", document.getElementById('ShareToolkit-action').value);
       soapDoc.getMethod().setAttribute("accounta", accountA);
       soapDoc.getMethod().setAttribute("accountb", accountB);
       var csfeParams = new Object();
       csfeParams.soapDoc = soapDoc;
       csfeParams.asyncMode = true;
       csfeParams.callback = new AjxCallback(ZaShareToolkitTab.prototype.createShareCallback);
       var reqMgrParams = {} ;
       resp = ZaRequestMgr.invoke(csfeParams, reqMgrParams);
    }   
    else
    {
       ZaShareToolkitTab.prototype.status('Select or type 2 different email addresses.');
    }
}   
   
ZaShareToolkitTab.prototype.createShareCallback = function (result) {
   ZaShareToolkitTab.prototype.status('Ready. '+result._data.Body.ShareToolkitResponse.createShareResult._content);
}  

ZaShareToolkitTab.prototype.status = function (statusText) {
   document.getElementById('ShareToolkit-status').innerHTML = statusText;
}
