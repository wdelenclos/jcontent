import React from "react";
import {MuiThemeProvider} from "@material-ui/core";
import {NotificationProvider} from "@jahia/react-material";
import {anthraciteLightTheme as theme} from "@jahia/react-material/theme";
import {client} from "@jahia/apollo-dx";
import {getI18n} from "@jahia/i18next";
import {I18nextProvider} from "react-i18next";
import {Route} from "react-router";
import {BrowserRouter} from "react-router-dom";
import {ApolloProvider, ApolloConsumer} from "react-apollo";
import ManagerLayout from "./ManagerLayout";
import CMLeftNavigation from "./CMLeftNavigation";
import CMTopBar from "./CMTopBar";
import * as _ from "lodash";
import {DxContext} from "./DxContext";
import {ContentLayout} from "./ContentLayout";
import defaultActions from "./actions/defaultActions";
import actionsRegistry from "./actionsRegistry"
import CallAction from "./actions/CallAction"
import MenuAction from "./actions/MenuAction";
import eventHandlers from "./eventHandlers"

import {initFontawesomeIcons} from "./icons/initFontawesomeIcons";
import {register as eventHandlerRegister} from "./eventHandlerRegistry";

const actionComponents = {
    action: CallAction,
    menuAction: MenuAction
}

class ContentManager extends React.Component {

    constructor(props) {
        super(props);
        const {dxContext} = props;
        initFontawesomeIcons();
        // register actions
        // register actions from the configuration
        const actions = _.merge(dxContext.config.actions, defaultActions);
        _.each(Object.keys(actions), actionKey => {
            actionsRegistry[actionKey] = actions[actionKey];
            // get Component if not set yet
            if (typeof  actionsRegistry[actionKey].component === "string") {
                actionsRegistry[actionKey].component = actionComponents[actionsRegistry[actionKey].component]
            }

            // register callbacks (add callback to existing one)
            function customizer(objValue, srcValue) {
                if (_.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }

        });
    }

    setRouter(router) {
        let {dxContext, classes} = this.props;
        router && router.history.listen((location, action) => {
            const title = "DX Content Manager " + location.pathname;
            window.parent.history.replaceState(window.parent.history.state, title, dxContext.contextPath + dxContext.urlBrowser + location.pathname + location.search);
            window.parent.document.title = title;
        });
    }

    render() {
        let {dxContext, classes} = this.props;
        // register action components
        const isInFrame = window.top !== window;
        eventHandlerRegister(eventHandlers);
        return (
            <MuiThemeProvider theme={theme}>
                <NotificationProvider notificationContext={{}}>
                    <ApolloProvider client={client({contextPath: dxContext.contextPath})}>
                        <I18nextProvider i18n={getI18n({
                            lng: dxContext.uilang,
                            contextPath: dxContext.contextPath,
                            ns: ["content-manager"],
                            defaultNS: "content-manager",
                        })}>
                            <DxContext.Provider value={dxContext}>
                                <BrowserRouter basename={dxContext.contextPath + dxContext.urlbase} ref={isInFrame && this.setRouter.bind(this)}>
                                    <Route path="/:siteKey/:lang" key={"main-route_" + dxContext.siteKey + "_" + dxContext.lang} render={props => {
                                        dxContext["siteKey"] = props.match.params.siteKey;
                                        dxContext["lang"] = props.match.params.lang;
                                        return (
                                            <ManagerLayout header={<CMTopBar dxContext={dxContext}/>}
                                                           leftSide={<CMLeftNavigation/>}>
                                                <div>
                                                    <Route path={`${props.match.url}/browse`} render={props => (
                                                        <ContentLayout contentSource="browsing" lang={dxContext.lang} key={"browsing_" + dxContext.siteKey + "_" + dxContext.lang}/>
                                                    )}/>
                                                    <Route path={`${props.match.url}/browse-files`} render={props => (
                                                        <ContentLayout contentSource="files" lang={dxContext.lang} key={"browse-files_" + dxContext.siteKey + "_" + dxContext.lang}/>
                                                    )}/>
                                                    <Route path={`${props.match.url}/search`} render={props => (
                                                        <ContentLayout contentSource="search" lang={dxContext.lang} key={"search_" + dxContext.siteKey + "_" + dxContext.lang}/>
                                                    )}/>
                                                    <Route path={`${props.match.url}/sql2Search`} render={props => (
                                                        <ContentLayout contentSource="sql2Search" lang={dxContext.lang} key={"sql2Search_" + dxContext.siteKey + "_" + dxContext.lang}/>
                                                    )}/>
                                                </div>
                                            </ManagerLayout>
                                        );
                                    }}/>
                                </BrowserRouter>
                            </DxContext.Provider>
                        </I18nextProvider>
                    </ApolloProvider>
                </NotificationProvider>
            </MuiThemeProvider>
        );
    }
}

export default ContentManager;