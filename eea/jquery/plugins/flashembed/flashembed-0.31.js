/**
  * flashembed 0.31. Adobe Flash embedding script
  *
  * http://flowplayer.org/tools/flash-embed.html
  *
  * Copyright (c) 2008 Tero Piirainen (tipiirai@gmail.com)
  *
  * Released under the MIT License:
  * http://www.opensource.org/licenses/mit-license.php
  *
  * >> Basically you can do anything you want but leave this header as is <<
  *
  * version 0.01 - 03/11/2008
  * version 0.31 - Tue Jul 22 2008 06:30:34 GMT+0200 (GMT+02:00)
  */
function flashembed(root, userParams, flashvars) {

  function getHTML() {

  var html = "";
  if (typeof flashvars == 'function') { flashvars = flashvars(); }


  // mozilla
  if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {

  html = '<embed type="application/x-shockwave-flash" ';

  if (params.id) {
    extend(params, {name:params.id});
  }

  for (var key in params) {
    if (params[key] !== null) {
      html += [key] + '="' +params[key]+ '"\n\t';
    }
  }

  if (flashvars) {
    html += 'flashvars=\'' + concatVars(flashvars) + '\'';
  }

  // thanks Tom Price (07/17/2008)
  html += '/>';

  // ie
  } else {

  html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
  html += 'width="' + params.width + '" height="' + params.height + '"';

  // force id for IE. otherwise embedded Flash object cannot be returned
  if (!params.id && document.all) {
    params.id = "_" + ("" + Math.random()).substring(5);
  }

  if (params.id) {html += ' id="' + params.id + '"';}

  html += '>';
  html += '\n\t<param name="movie" value="'+ params.src +'" />';

  params.id = params.src = params.width = params.height = null;

  for (var k in params) {
    if (params[k] !== null) {
      html += '\n\t<param name="'+ k +'" value="'+ params[k] +'" />';
    }
  }

  if (flashvars) {
    html += '\n\t<param name="flashvars" value=\'' + concatVars(flashvars) + '\' />';
  }

  html += "</object>";
  if (debug) {
    alert(html);
  }

  }

  return html;
}


  function init(name) {
    var timer = setInterval(function() {
      var doc = document;
      var el = doc.getElementById(name);

  if (el) {
    flashembed(el, userParams, flashvars);
    clearInterval(timer);

  } else if (doc && doc.getElementsByTagName && doc.getElementById && doc.body) {
    clearInterval(timer);
  }
}, 13);

  return true;
}


  // override extend params function
  function extend(to, from) {
    if (from) {
      for (key in from) {
        if (from.hasOwnProperty(key)) {
          to[key] = from[key];
        }
      }
    }
  }

  // setup params
  var params = {

  // very common params
  src: '#',
  width: '100%',
  height: '100%',

  // flashembed specific options
  version:null,
  onFail:null,
  expressInstall:null,
  debug: false,

  // flashembed defaults
  bgcolor: '#ffffff',
  allowfullscreen: true,
  allowscriptaccess: 'always',
  quality: 'high',
  type: 'application/x-shockwave-flash',
  pluginspage: 'http://www.adobe.com/go/getflashplayer'
};


  if (typeof userParams == 'string') {
    userParams = {src: userParams};
  }

  extend(params, userParams);

  var version = flashembed.getVersion();
  var required = params.version;
  var express = params.expressInstall;
  var debug = params.debug;


  if (typeof root == 'string') {
    var el = document.getElementById(root);
    if (el) {
      root = el;
    } else {
      return init(root);
    }
  }

  if (!root) { return; }


  // is supported
  if (!required || flashembed.isSupported(required)) {
    params.onFail = params.version = params.expressInstall = params.debug = null;
    root.innerHTML = getHTML();

  // return our API
  return root.firstChild;

  // custom fail event
  } else if (params.onFail) {
    var ret = params.onFail.call(params, flashembed.getVersion(), flashvars);
    if (ret) { root.innerHTML = ret; }


  // express install
  } else if (required && express && flashembed.isSupported([6,65])) {

  extend(params, {src: express});

  flashvars = {
    MMredirectURL: location.href,
    MMplayerType: 'PlugIn',
    MMdoctitle: document.title
  };

  root.innerHTML = getHTML();

  // not supported
  } else {

  // minor bug fixed here 08.04.2008 (thanks JRodman)

  if (root.innerHTML.replace(/\s/g, '') !== '') {
    // custom content was supplied

  } else {
    root.innerHTML =
      "<h2>Flash version " + required + " or greater is required</h2>" +
      "<h3>" +
        (version[0] > 0 ? "Your version is " + version : "You have no flash plugin installed") +
      "</h3>" +
      "<p>Download latest version from <a href='" + params.pluginspage + "'>here</a></p>";
  }
}


  function concatVars(vars) {
    var out = "";

  for (var key in vars) {
    if (vars[key]) {
      out += [key] + '=' + asString(vars[key]) + '&';
    }
  }
  return out.substring(0, out.length -1);
}



  // JSON.asString() function
  function asString(obj) {

  switch (typeOf(obj)){
    case 'string':
      return '"'+obj.replace(new RegExp('(["\\\\])', 'g'), '\\$1')+'"';

  case 'array':
    return '['+ map(obj, function(el) {
      return asString(el);
    }).join(',') +']';

  case 'function':
    return '"function()"';

  case 'object':
    var str = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        str.push('"'+prop+'":'+ asString(obj[prop]));
      }
    }
    return '{'+str.join(',')+'}';
}

  // replace ' --> "  and remove spaces
  return String(obj).replace(/\s/g, " ").replace(/\'/g, "\"");
}


  // private functions
  function typeOf(obj) {
    if (obj === null || obj === undefined) { return false; }
    var type = typeof obj;
    return (type == 'object' && obj.push) ? 'array' : type;
  }


  // version 9 bugfix: (http://blog.deconcept.com/2006/07/28/swfobject-143-released/)
  if (window.attachEvent) {
    window.attachEvent("onbeforeunload", function() {
      __flash_unloadHandler = function() {};
      __flash_savedUnloadHandler = function() {};
    });
  }

  function map(arr, func) {
    var newArr = [];
    for (var i in arr) {
      if (arr.hasOwnProperty(i)) {
        newArr[i] = func(arr[i]);
      }
    }
    return newArr;
  }

  return root;
}



// setup jquery support
if (typeof jQuery == 'function') {

  (function($) {
    $.fn.extend({
      flashembed: function(params, flashvars) {
        return this.each(function() {
          flashembed(this, params, flashvars);
        });
      }
    });
  })(jQuery);
}


flashembed = flashembed || {};

// arr[major, minor, fix]
flashembed.getVersion = function() {

  var version = [0, 0];

  if (navigator.plugins && typeof navigator.plugins["Shockwave Flash"] == "object") {
    var _d = navigator.plugins["Shockwave Flash"].description;
    if (typeof _d != "undefined") {
      _d = _d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
      var _m = parseInt(_d.replace(/^(.*)\..*$/, "$1"), 10);
      var _r = /r/.test(_d) ? parseInt(_d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
      version = [_m, _r];
    }

  } else if (window.ActiveXObject) {

  try { // avoid fp 6 crashes
    var _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");

  } catch(e) {
    try {
      _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
      version = [6, 0];
      _a.AllowScriptAccess = "always"; // throws if fp < 6.47

  } catch(ee) {
    if (version[0] == 6) { return; }
  }
  try {
    _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
  } catch(eee) {

  }

  }

  if (typeof _a == "object") {
    _d = _a.GetVariable("$version"); // bugs in fp 6.21 / 6.23
    if (typeof _d != "undefined") {
      _d = _d.replace(/^\S+\s+(.*)$/, "$1").split(",");
      version = [parseInt(_d[0], 10), parseInt(_d[2], 10)];
    }
  }
}

  return version;
};


flashembed.isSupported = function(version) {
  var now = flashembed.getVersion();
  var ret = (now[0] > version[0]) || (now[0] == version[0] && now[1] >= version[1]);
  return ret;
};


