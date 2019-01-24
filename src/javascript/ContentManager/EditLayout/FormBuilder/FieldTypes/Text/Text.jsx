import React from 'react';
import {TextField, withStyles} from '@material-ui/core';
import {compose} from 'react-apollo';
import {connect} from 'formik';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 250,
        '& label': {
            color: theme.palette.text.secondary
        }
    }
});

export class Text extends React.Component {
    render() {
        let {field, classes} = this.props;
        let {values, handleChange, handleBlur} = this.props.formik;

        return (
            <div>
                <TextField
                    className={classes.textField}
                    id={field.formDefinition.name}
                    name={field.formDefinition.name}
                    label={field.formDefinition.name}
                    value={values[field.formDefinition.name]}
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
)(Text);
