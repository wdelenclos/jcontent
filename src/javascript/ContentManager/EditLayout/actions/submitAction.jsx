import {composeActions} from '@jahia/react-material';
import requirementsAction from '../../actions/requirementsAction';
import EditLayoutConstants from '../EditLayout.constants';

export default composeActions(requirementsAction, {
    init: () => {},
    onClick: context => {
        if (context.formProps) {
            let {setFieldValue, submitForm} = context.formProps;
            if (context.submitOperation) {
                setFieldValue(EditLayoutConstants.systemFields.SYSTEM_SUBMIT_OPERATION, context.submitOperation, false);
            }
            submitForm();
        }
    }
});
