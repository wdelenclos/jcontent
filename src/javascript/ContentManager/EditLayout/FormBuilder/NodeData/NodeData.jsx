import React from 'react';
import {compose, Query, withApollo} from 'react-apollo';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {NodeQuery} from './NodeData.gql-queries';

export class NodeData extends React.Component {
    render() {
        const {t, path, lang, children} = this.props;

        let queryParams = {
            path: path,
            language: lang
        };

        return (
            <Query query={NodeQuery} variables={queryParams} fetchPolicy="cache-first">
                {({loading, error, data}) => {
                if (error) {
                    let message = t('label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')});
                    return (<React.Fragment>{message}</React.Fragment>);
                }

                if (loading) {
                    return (<ProgressOverlay/>);
                }

                return (
                    <React.Fragment>
                        {children({
                            nodeData: data.jcr.result
                        })}
                    </React.Fragment>
                );
            }}
            </Query>
        );
    }
}

const mapStateToProps = state => ({
    path: state.path,
    lang: state.language
});

export default compose(
    withNotifications(),
    translate(),
    withApollo,
    connect(mapStateToProps)
)(NodeData);
