import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import CKEditor from 'ckeditor4-react';

export class RichText extends React.Component {
    constructor(props) {
        super(props);

        CKEditor.editorUrl = window.CKEDITOR_BASEPATH + '/ckeditor.js';
    }

    render() {
        const {field} = this.props;
        const {values, setFieldValue} = this.props.formik;

        const onEditorChange = evt => {
            setFieldValue(field.formDefinition.name, evt.editor.getData(), true);
        };

        return (
            <div>
                <h3>{field.formDefinition.name}</h3>

                <CKEditor
                    data={values[field.formDefinition.name]}
                    onChange={onEditorChange}
                />

                <br/>
                <br/>
            </div>
        );
    }
}

export default compose(
    connect,
)(RichText);
