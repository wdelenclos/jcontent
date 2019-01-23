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
            <TextField
                className={classes.textField}
                id={field.definition.name}
                name={field.definition.name}
                label={field.definition.name}
                value={values[field.definition.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                />
        );
    }
}

export default compose(
    connect,
    withStyles(styles)
)(Text);
