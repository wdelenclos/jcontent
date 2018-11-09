import React from 'react';
import ReactDOM from 'react-dom';
import Components, {defineComponents, overrideComponents} from "./components/components";
import ContentManager from "./components/ContentManager";
import ContentListHeader from "./components/list/ContentListHeader";
import FilesGridSizeSelector from "./components/filesGrid/FilesGridSizeSelector";
import {LanguageSwitcherDisplay} from "./components/languageSwitcher/LanguageSwitcher";
import {CssBaseline} from "@material-ui/core";
import {Pagination} from "@jahia/react-material";
import * as _ from "lodash";

window.reactRender = function(target, id, dxContext) {
    ReactDOM.render(
        <React.Fragment>
            <CssBaseline/>
            <Components.ContentManager id={id} dxContext={dxContext}/>
        </React.Fragment>,
        document.getElementById(target)
    );
};

// Approach 1: Define/replace the entire component class in the registry.

defineComponents({
    ContentManager: ContentManager,
    ContentListHeader: ContentListHeader,
    FilesGridSizeSelector: FilesGridSizeSelector,
    LanguageSwitcherDisplay: LanguageSwitcherDisplay
});

window.overrideCmmComponents = overrideComponents;

// Approach 2: Modify the prototype of the existing component  - does not work.

const OVERRIDABLE_METHODS = [
    "componentDidMount",
    "componentDidUpdate",
    "componentWillUnmount",
    "getClasses",
    "attach",
    "createSheet",
    "detach",
    "render",
    "shouldComponentUpdate",
    "getWrappedInstance"
];

window.overrideCmmComponent = function(modulePath, componentName, OverridingComponent) {

    // Simply passing modulePath as an import parameter value does not work for some reason.
    let promise = import(`${modulePath}`);

    promise.then(module => {
        let OverriddenComponent = module[componentName];
        for (let i in OVERRIDABLE_METHODS) {
            let methodName = OVERRIDABLE_METHODS[i];
            (function(overriddenMethod) {
                let overridingMethod = OverridingComponent.prototype[methodName];
                if (overridingMethod) {
                    OverriddenComponent.prototype[methodName] = function() {
                        return overridingMethod.apply(this, overriddenMethod);
                    };
                } else {
                    OverriddenComponent.prototype[methodName] = null;
                }
            })(OverriddenComponent.prototype[methodName]);
        }
    });
};
