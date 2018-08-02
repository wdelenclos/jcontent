<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ page import="org.jahia.settings.SettingsBean"%>

<c:set var="mainResourceLocale" value="${renderContext.mainResourceLocale}"/>

<html lang="${mainResourceLocale.language}">

<head>
    <meta charset="utf-8">
    <title>${fn:escapeXml(renderContext.mainResource.node.displayableName)}</title>
</head>

<body>
<template:addResources type="javascript" resources="apps/content-manager.js" />
<c:set var="targetId" value="reactComponent${fn:replace(currentNode.identifier,'-','_')}"/>

<div id="${targetId}">loading..</div>
<script type="text/javascript">
    contextJsParameters['urlBrowser'] = '/cms/contentmanager';
    contextJsParameters['urlbase'] = '${renderContext.servletPath}';
    contextJsParameters['langName'] = '${functions:displayLocaleNameWith(mainResourceLocale, mainResourceLocale)}';
    contextJsParameters['userName'] = '${renderContext.user.username}';
    contextJsParameters['siteName'] = '${renderContext.site.displayableName}';
    contextJsParameters['config'] = {
        sql2CheatSheetUrl: "<%= SettingsBean.getInstance().getString("sql2CheatSheet.link", null) %>",
        actions: {
            translate: {
                priority: 2.51,
                component: "action",
                call: () => alert("Translate !!!"),
                icon: "Edit",
                target: ["previewBar"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.translate'

            },
            tableActions: {
                priority: 2.5,
                component: "menuAction",
                menuId: "tableMenuActions",
                target: ["tableActions"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.edit'
            },
            edit: {
                priority: 2.5,
                component: "action",
                call: (path, name) => window.parent.editContent(path, name, ['jnt:content'], ['nt:base']),
                icon: "Edit",
                target: ["previewBar", "tableMenuActions"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.edit'
            },
            publish: {
                component: "menuAction",
                menuId: "publishMenu",
                icon: "Edit",
                target: ["previewBar", "tableMenuActions"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.publish'

            },
            publishAll: {
                component: "action",
                call: (path, name) => window.parent.editContent(path, name, ['jnt:content'], ['nt:base']),
                icon: "Edit",
                target: ["publishMenu"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.publishAll'

            },
            unPublish: {
                component: "action",
                call: (path, name) => window.parent.editContent(path, name, ['jnt:content'], ['nt:base']),
                icon: "Edit",
                target: ["publishMenu"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.unpublish'

            },
            additionalPreview: {
                component: "menuAction",
                menuId: "additionalPreviewMenu",
                icon: "Edit",
                target: ["additionalMenu"],
                requiredPermission: "",
                iconButton: true

            },
            duplicate: {
                component: "action",
                call: (path, name) => window.parent.editContent(path, name, ['jnt:content'], ['nt:base']),
                icon: "Edit",
                target: ["additionalPreviewMenu"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.duplicate'

            },
            copy: {
                component: "action",
                call: (path, name) => window.parent.editContent(path, name, ['jnt:content'], ['nt:base']),
                icon: "Edit",
                target: ["additionalPreviewMenu"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.copy'

            },
            delete: {
                component: "action",
                call: (path, name) => window.parent.editContent(path, name, ['jnt:content'], ['nt:base']),
                icon: "Edit",
                target: ["additionalPreviewMenu"],
                requiredPermission: "",
                labelKey: 'label.contentManager.contentPreview.delete'

            }
        }
    }
    reactRender('${targetId}', "${currentNode.identifier}", contextJsParameters);
</script>
</body>