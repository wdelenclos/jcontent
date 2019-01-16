import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

export class EditLayout extends React.Component {
    render() {
        const {path} = this.props;
        return (
            <React.Fragment>
                <div>TODO display edit form for: {path}</div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        path: state.path
    };
};

export default compose(
    connect(mapStateToProps)
)(EditLayout);
