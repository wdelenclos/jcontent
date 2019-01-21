import React from 'react';
import {Formik} from 'formik';
import NodeData from './NodeData';
import FormDefinitions from './FormDefinitions';
import * as _ from 'lodash';
import FieldTypes from './FieldTypes';

export default class FormBuilder extends React.Component {
    render() {
        return (
            <NodeData>
                {({nodeData}) => {
                    let jsonFormDefinition = FormDefinitions[nodeData.primaryNodeType.name];

                    if (jsonFormDefinition) {
                        let fields = _.map(_.find(jsonFormDefinition.targets, {name: 'content'}).fields, fieldDefinition => {
                            return {
                                definition: fieldDefinition,
                                data: _.find(nodeData.properties, {name: fieldDefinition.name})
                            };
                        });

                        let initialValues = _.mapValues(_.keyBy(fields, 'definition.name'), 'data.value');

                        return (
                            <Formik
                                initialValues={initialValues}
                                render={props => {
                                    let {isSubmitting, handleSubmit} = props;

                                    return (
                                        <form onSubmit={handleSubmit}>

                                            {fields.map(field => {
                                                let FieldComponent = FieldTypes[field.definition.fieldType];
                                                return (<FieldComponent key={field.definition.name} {...props} field={field}/>);
                                            })}

                                            <button type="submit" disabled={isSubmitting}>
                                                Submit
                                            </button>
                                        </form>
                                    );
                                }}
                                onSubmit={(values, actions) => {
                                    // TODO save action
                                    console.log(JSON.stringify(values, null, 2));
                                    actions.setSubmitting(false);
                                }}
                            />);
                    }
                }}
            </NodeData>
        );
    }
}
