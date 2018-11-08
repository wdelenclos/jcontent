import React from 'react';
import ReactDOM from 'react-dom';
import Components, {defineComponents, overrideComponents} from "./components/components";
import ContentManager from "./components/ContentManager";
import ContentListHeader from "./components/list/ContentListHeader";
import FilesGridSizeSelector from "./components/filesGrid/FilesGridSizeSelector";
import {CssBaseline} from "@material-ui/core";

// react is loaded by jnt_template/html/template.content-manager.jsp
window.reactRender = function(target, id, dxContext) {

    defineComponents({
        ContentManager: ContentManager,
        ContentListHeader: ContentListHeader,
        FilesGridSizeSelector: FilesGridSizeSelector,
    });

    overrideComponents(window.customCmmComponents);

    ReactDOM.render(
        <React.Fragment>
            <CssBaseline/>
            <Components.ContentManager id={id} dxContext={dxContext}/>
        </React.Fragment>,
        document.getElementById(target)
    );
};