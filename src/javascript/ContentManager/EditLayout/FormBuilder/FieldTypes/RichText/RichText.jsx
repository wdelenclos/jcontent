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
        const {values} = this.props.formik;

        const onEditorChange = evt => {
            values[field.definition.name] = evt.editor.getData();
        };

        return (
            <div>
                <h3>{field.definition.name}</h3>

                <CKEditor
                    data={values[field.definition.name]}
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
