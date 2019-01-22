import React from 'react';
import FieldTypes from './FieldTypes';

export default class FormBuilder extends React.Component {
    render() {
        let {fields, formProps} = this.props;
        return (
            <form onSubmit={formProps.handleSubmit}>
                {fields.map(field => {
                    let FieldComponent = FieldTypes[field.definition.fieldType];
                    return (<FieldComponent key={field.definition.name} formProps={formProps} field={field}/>);
                })}
            </form>);
    }
}
