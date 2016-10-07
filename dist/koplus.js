/// <reference path="../node_modules/@types/knockout/index.d.ts" />
"use strict";
var koplus;
(function (koplus) {
    function get(name, isArray) {
        // if this is not object notation (+ObjectName.SubObjectName.ObservableName)
        if (name.indexOf(".") < 0) {
            if (this[name] === null) {
                if (isArray === true) {
                    this[name] = ko.observableArray();
                }
                else {
                    this[name] = ko.observable();
                }
            }
            return this[name];
        }
        else {
            var parts = name.split(".");
            var pointer = this;
            for (var i = 0; i < parts.length - 1; i++) {
                var part = parts[i];
                if (pointer[part] === undefined) {
                    pointer[part] = {};
                }
                pointer = pointer[part];
            }
            var lastPart = parts[parts.length - 1];
            pointer[lastPart] = isArray ? ko.observableArray() : ko.observable();
            return pointer[lastPart];
        }
    }
    koplus._get = get;
    function preprocess(val, name, addBindingCallback) {
        // if no + sign return val
        if (val === undefined || val.indexOf("+") < 0)
            return val;
        var isArray = "false";
        if (arrayObservables.hasOwnProperty(name))
            isArray = "true";
        var regex = new RegExp("(\\+\\w[\\w\\.]*)", "g");
        var match = null;
        var newVal = val;
        while (match = regex.exec(val)) {
            var exp = "koplus._get.call($data,'" + match[0].substr(1) + "', " + isArray + ")";
            newVal = newVal.replace(match[0], exp);
        }
        return newVal;
    }
    var arrayObservables = {};
    function init(options) {
        if (typeof (ko) === undefined) {
            throw "Make sure to first include knockout.js";
        }
        arrayObservables = {};
        if (options !== undefined && options.arrays !== undefined) {
            for (var i = 0; i < options.arrays.length; i++) {
                arrayObservables[options.arrays[i]] = true;
            }
        }
        if (options !== undefined && options.get !== undefined) {
            koplus._get = function (n, a) {
                options.get(n, a, get);
            };
        }
        else {
            koplus._get = get;
        }
        arrayObservables["options"] = true;
        arrayObservables["items"] = true;
        for (var a in ko.bindingHandlers) {
            ko.bindingHandlers[a].preprocess = preprocess;
        }
    }
    koplus.init = init;
})(koplus || (koplus = {}));
