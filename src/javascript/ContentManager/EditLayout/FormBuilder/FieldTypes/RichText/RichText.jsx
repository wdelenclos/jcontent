import React from 'react';
import {TextField, withStyles} from '@material-ui/core';
import {compose} from 'react-apollo';
import {connect} from 'formik';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 500,
        '& label': {
            color: theme.palette.text.secondary
        }
    }
});

// TODO: Integrate CKEditor to replace the TextField component

export class RichText extends React.Component {
    render() {
        let {field, classes} = this.props;
        let {values, handleChange, handleBlur} = this.props.formik;

        return (
            <div>
                <TextField
                    className={classes.textField}
                    id={field.definition.name}
                    name={field.definition.name}
                    label={field.definition.name}
                    value={values[field.definition.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />

                <br/>
                <br/>
            </div>
        );
    }
}

export default compose(
    connect,
    withStyles(styles)
)(RichText);
