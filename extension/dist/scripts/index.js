"use strict";(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i]);}return o;}return r;})()({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.$mustExist=$mustExist;exports.$=$;exports.$$=$$;exports.log=log;function $mustExist(selector){var parent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:document;var $dom=$(selector,parent);if(!$dom)log(selector+" is missing!");return $dom;}function $(selector){var parent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:document;return parent.querySelector(selector);}function $$(selector){var parent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:document;return Array.prototype.slice.call(parent.querySelectorAll(selector));}function log(ctx){console.log("Okooo Analyzer: "+ctx);}},{}],2:[function(require,module,exports){'use strict';var _utils=require('./_utils');document.addEventListener('DOMContentLoaded',function(){console.log('Hello!');});},{"./_utils":1}]},{},[2]);