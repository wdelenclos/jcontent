import React from 'react';
import {TextField, withStyles} from '@material-ui/core';
import {compose} from 'react-apollo';

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
        let {field, values, handleChange, handleBlur, classes} = this.props;
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
    withStyles(styles)
)(Text);
