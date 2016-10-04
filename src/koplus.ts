/// <reference path="../node_modules/@types/knockout/index.d.ts" />

namespace koplus {
    export interface optionsType {
        arrays?: Array<string>;
        get?: (name: string, isArray: boolean, getHandler: (name: string, isArray: boolean) => void) => void;
    }

    function get(name: string, isArray: boolean) {
        // if this is not object notation (+ObjectName.SubObjectName.ObservableName)
        if (name.indexOf(".") < 0) {
            if (this[name] == null) {
                if (isArray === true) {
                    this[name] = ko.observableArray();
                } else {
                    this[name] = ko.observable();
                }
            }
            return this[name];
        } else { // else for object notation
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

    export var _get: (name: string, isArray: boolean) => void = get;

    function preprocess(val:string, name:string, addBindingCallback:KnockoutAllBindingsAccessor) {
        // if no + sign returon val
        if (val.indexOf("+") < 0)
            return val;
        let isArray = 'false';
        if (arrayObservables.hasOwnProperty(name))
            isArray = 'true';
        let regex = new RegExp("(\\+\\w[\\w\\.]*)", 'g');
        let match:any = null;
        let newVal:string = val;
        while (match = regex.exec(val)) {
            let exp = "koplus._get.call($data,'" + match[0].substr(1) + "', " + isArray + ")";
            newVal = newVal.replace(match[0], exp)
        }
        return newVal;
    }

    let arrayObservables:any = {};

    export function init(options?: optionsType) {
        arrayObservables = {};
        if (options !== undefined && options.arrays !== undefined) {
            for (let i:number = 0; i < options.arrays.length; i++) {
                arrayObservables[options.arrays[i]] = true;
            }
        }

        if (options !== undefined && options.get !== undefined) {
            _get = function (n, a) {
                options.get(n, a, get);
            }
        }
        else {
            _get = get;
        }

        arrayObservables['options'] = true;
        arrayObservables['items'] = true;

        for (var a in ko.bindingHandlers) {
            ko.bindingHandlers[a].preprocess = preprocess;
        }        
    }
}