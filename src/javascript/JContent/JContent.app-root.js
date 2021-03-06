import {DSProvider} from '@jahia/design-system-kit';
import {ComponentRendererProvider, DxContext, NotificationProvider} from '@jahia/react-material';
import PushEventHandler from './PushEventHandler';
import {ComponentRendererProvider as NewComponentRendererProvider} from '@jahia/ui-extender';
import React from 'react';
import {refetchContentTreeAndListData} from './JContent.refetches';
import Upload from './ContentRoute/ContentLayout/Upload';

export const jContentAppRoot = registry => {
    registry.add('app', 'jcontent-ds-provider', {
        targets: ['root:10'],
        render: next => (<DSProvider>{next}</DSProvider>)
    });

    registry.add('app', 'jcontent-notification-provider', {
        targets: ['root:11'],
        render: next => (<NotificationProvider notificationContext={{}}>{next}</NotificationProvider>)
    });

    registry.add('app', 'jcontent-context', {
        targets: ['root:13'],
        render: next => (<DxContext.Provider value={window.contextJsParameters}>{next}</DxContext.Provider>)
    });
    registry.add('app', 'jcontent-push-event-handler', {
        targets: ['root:14'],
        render: next => (
            <>
                <PushEventHandler/>
                {next}
            </>
        )
    });
    registry.add('app', 'jcontent-renderer', {
        targets: ['root:15'],
        render: next => (<ComponentRendererProvider>{next}</ComponentRendererProvider>)
    });
    registry.add('app', 'jcontent-new-renderer', {
        targets: ['root:16'],
        render: next => (<NewComponentRendererProvider>{next}</NewComponentRendererProvider>)
    });
    registry.add('app', 'jcontent-upload', {
        targets: ['root:17'],
        render: next => (
            <>
                <Upload
                    dxContext={window.contextJsParameters}
                    uploadUpdateCallback={status => {
                        if (status && status.uploading === 0) {
                            const refetchCallbacks = registry.find({type: 'refetch-upload'});
                            if (refetchCallbacks.length > 0) {
                                refetchCallbacks.forEach(refetchCallback => {
                                    if (refetchCallback.refetch) {
                                        refetchCallback.refetch();
                                    }
                                });
                            } else {
                                refetchContentTreeAndListData();
                            }
                        }
                    }}
                />
                {next}
            </>
        )
    });
};
