import {Save} from '@material-ui/icons';
import React from 'react';
import EditLayoutConstants from '../EditLayout.constants';
import submitAction from './submitAction';

function initEditActions(actionsRegistry) {
    actionsRegistry.add('submitSave', submitAction, {
        buttonLabel: 'label.contentManager.edit.action.save.name',
        buttonIcon: <Save/>,
        target: ['editHeaderActions:1'],
        submitOperation: EditLayoutConstants.submitOperation.SAVE
    });
}

export default initEditActions;
