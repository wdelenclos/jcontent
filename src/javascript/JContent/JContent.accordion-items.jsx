import React from 'react';
import {File, FolderSpecial, Collections, Setting} from '@jahia/moonstone/dist/icons';
import ContentTree from './ContentTree';
import JContentConstants from './JContent.constants';
import AdditionnalApps from './AdditionnalApps';

export const jContentAccordionItems = registry => {
    const getPath = (site, pathElements, registryItem) => {
        let path = '/sites/' + site + ('/' + pathElements.join('/'));
        if (!path.startsWith('/sites/' + site + registryItem.config.rootPath)) {
            return registryItem.defaultUrl(site);
        }

        return path;
    };

    const renderDefaultContentTrees = registry.add('accordionItem', 'renderDefaultContentTrees', {
        render: item => (
            <ContentTree item={item}/>
        ),
        getPath: getPath
    });

    registry.add('accordionItem', JContentConstants.mode.PAGES, renderDefaultContentTrees, {
        targets: ['jcontent:50'],
        icon: <File/>,
        label: 'label.contentManager.navigation.pages',
        defaultUrl: siteKey => '/sites/' + siteKey,
        config: {
            hideRoot: true,
            rootPath: '',
            selectableTypes: ['jnt:page', 'jnt:virtualsite'],
            type: 'pages',
            openableTypes: ['jnt:page', 'jnt:virtualsite', 'jnt:navMenuText'],
            rootLabel: 'jcontent:label.contentManager.browsePages',
            key: 'browse-tree-pages'
        }
    });

    registry.add('accordionItem', JContentConstants.mode.CONTENT_FOLDERS, renderDefaultContentTrees, {
        targets: ['jcontent:60'],
        icon: <FolderSpecial/>,
        label: 'label.contentManager.navigation.contentFolders',
        defaultUrl: siteKey => '/sites/' + siteKey + '/contents',
        config: {
            rootPath: '/contents',
            selectableTypes: ['jmix:cmContentTreeDisplayable', 'jmix:visibleInContentTree', 'jnt:contentFolder'],
            type: 'contents',
            openableTypes: ['jmix:cmContentTreeDisplayable', 'jmix:visibleInContentTree', 'jnt:contentFolder'],
            rootLabel: 'jcontent:label.contentManager.browseFolders',
            key: 'browse-tree-content'
        }
    });

    registry.add('accordionItem', JContentConstants.mode.MEDIA, renderDefaultContentTrees, {
        targets: ['jcontent:70'],
        icon: <Collections/>,
        label: 'label.contentManager.navigation.media',
        defaultUrl: siteKey => '/sites/' + siteKey + '/files',
        config: {
            rootPath: '/files',
            selectableTypes: ['jnt:folder'],
            type: 'files',
            openableTypes: ['jnt:folder'],
            rootLabel: 'jcontent:label.contentManager.browseFiles',
            key: 'browse-tree-files'
        }
    });

    registry.add('accordionItem', JContentConstants.mode.APPS, {
        targets: ['jcontent:80'],
        icon: <Setting/>,
        label: 'label.contentManager.navigation.apps',
        defaultUrl: () => '',
        render: () => (
            <AdditionnalApps/>
        ),
        getPath: getPath,
        config: {
            rootPath: ''
        }
    });
};
