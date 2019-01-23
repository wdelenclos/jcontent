import React from 'react';
import FieldTypes from './FieldTypes';
import {compose} from 'react-apollo';
import {connect} from 'formik';

export class FormBuilder extends React.Component {
    render() {
        let {fields, formik} = this.props;
        return (
            <form onSubmit={formik.handleSubmit}>
                {fields.map(field => {
                    let FieldComponent = FieldTypes[field.definition.fieldType];
                    return (<FieldComponent key={field.definition.name} field={field}/>);
                })}
            </form>);
    }
}

export default compose(
    connect
)(FormBuilder);
