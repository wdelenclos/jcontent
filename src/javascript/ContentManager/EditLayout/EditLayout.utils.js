import EditLayoutConstants from './EditLayout.constants';
import * as _ from 'lodash';

function isSystemField(fieldKey) {
    return fieldKey in EditLayoutConstants.systemFields;
}

function getPropertiesToSave(formValues, fields) {
    return _.map(_.filter(_.keys(formValues), key => !isSystemField(key)), key => {
        let field = _.find(fields, {definition: {name: key}});
        return {
            name: key,
            type: field.data.definition.requiredType,
            value: formValues[key]
        };
    });
}

export {
    isSystemField,
    getPropertiesToSave
};
