import React from 'react';
import {TextField} from '@material-ui/core';

export default class Text extends React.Component {
    render() {
        let {field, values, handleChange, handleBlur} = this.props;
        return (
            <TextField
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
