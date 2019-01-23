import {composeActions} from '@jahia/react-material';
import EditLayoutConstants from '../EditLayout.constants';
import {withFormikAction} from './withFormikAction';

export default composeActions(withFormikAction, {
    init: () => {},
    onClick: context => {
        if (context.formik) {
            let {setFieldValue, submitForm} = context.formik;
            if (context.submitOperation) {
                setFieldValue(EditLayoutConstants.systemFields.SYSTEM_SUBMIT_OPERATION, context.submitOperation, false);
            }
            submitForm();
        }
    }
});
