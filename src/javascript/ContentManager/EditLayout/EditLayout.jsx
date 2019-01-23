import React from 'react';
import {compose, withApollo} from 'react-apollo';
import {Grid, Typography, withStyles, Paper} from '@material-ui/core';
import {Trans, translate} from 'react-i18next';
import EditTopBar from './EditTopBar';
import FormBuilder from './FormBuilder';
import {actionsRegistry, withNotifications} from '@jahia/react-material';
import initEditActions from './actions/initEditActions';
import EditLayoutConstants from './EditLayout.constants';
import {Formik} from 'formik';
import FormDefinitions from './FormBuilder/FormDefinitions';
import * as _ from 'lodash';
import NodeData from './FormBuilder/NodeData';
import {getPropertiesToSave} from './EditLayout.utils';
import {SavePropertiesMutation} from './FormBuilder/NodeData/NodeData.gql-mutation';
import {connect} from 'react-redux';
import {NodeQuery} from './FormBuilder/NodeData/NodeData.gql-queries';

const styles = theme => ({
    topBar: {
        paddingTop: theme.spacing.unit * 2,
        color: theme.palette.primary.contrastText
    },
    appFrame: {
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
        maxWidth: 'calc(100vw - 140px)',
        backgroundColor: theme.palette.background.paper
    },
    mainContainer: {
        height: 'calc( 100vh - ' + theme.contentManager.topBarHeight + 'px )',
        flexGrow: 1,
        transitionDuration: '.25s',
        backgroundColor: theme.palette.background.default,
        marginLeft: 0,
        marginRight: 0,
        width: '100%'
    },
    formContainer: {
        padding: theme.spacing.unit * 3
    },
    metaNav: {
        position: 'absolute',
        width: '50%',
        height: theme.spacing.unit * 3,
        top: 0,
        right: 0,
        paddingRight: theme.spacing.unit * 4,
        textAlign: 'right',
        color: theme.palette.text.contrastText + '!important',
        background: 'linear-gradient(to right, rgba(78, 81, 86, 0) 0%, ' + theme.palette.layout.main + ' 100%) !important;',
        '& a': {
            color: 'inherit !important'
        }
    }
});

const GRID_SIZE = 12;

export class EditLayout extends React.Component {
    constructor(props) {
        super(props);

        initEditActions(actionsRegistry);
    }

    render() {
        const {classes, client, notificationContext, t, path, lang} = this.props;
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
                                render={() => {
                                    return (
                                        <React.Fragment>
                                            <div className={classes.metaNav}>
                                                <Typography variant="overline" color="inherit"><Trans i18nKey="label.contentManager.link.academy" components={[<a key="academyLink" href={contextJsParameters.config.academyLink} target="_blank" rel="noopener noreferrer">univers</a>]}/></Typography>
                                            </div>
                                            <Grid container spacing={0}>
                                                <Grid item xs={GRID_SIZE} className={classes.topBar}>
                                                    <EditTopBar title={nodeData.displayName}/>
                                                </Grid>
                                            </Grid>

                                            <div className={classes.appFrame}>
                                                <div className={classes.mainContainer}>
                                                    <Paper className={classes.formContainer}>
                                                        <FormBuilder fields={fields}/>
                                                    </Paper>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                }}
                                onSubmit={(values, actions) => {
                                    switch (values[EditLayoutConstants.systemFields.SYSTEM_SUBMIT_OPERATION]) {
                                        case EditLayoutConstants.submitOperation.SAVE:
                                            client.mutate({
                                                variables: {
                                                    path: nodeData.path,
                                                    properties: getPropertiesToSave(values, fields)
                                                },
                                                mutation: SavePropertiesMutation,
                                                refetchQueries: [
                                                    {
                                                        query: NodeQuery,
                                                        variables: {
                                                            path: path,
                                                            language: lang
                                                        }
                                                    }
                                                ]
                                            }).then(() => {
                                                notificationContext.notify(t('label.contentManager.edit.action.save.success'), ['closeButton']);
                                                actions.setSubmitting(false);
                                            }, error => {
                                                console.error(error);
                                                notificationContext.notify(t('label.contentManager.edit.action.save.error'), ['closeButton']);
                                                actions.setSubmitting(false);
                                            });
                                            break;
                                        case EditLayoutConstants.submitOperation.SAVE_PUBLISH:
                                            console.log('TODO SAVE_PUBLISH');
                                            actions.setSubmitting(false);
                                            break;
                                        default:
                                            console.log('Unknown submit operation: ' + values[EditLayoutConstants.systemFields.SYSTEM_SUBMIT_OPERATION]);
                                            actions.setSubmitting(false);
                                            break;
                                    }
                                }}
                            />);
                    }
                }}
            </NodeData>
        );
    }
}

const mapStateToProps = state => ({
    path: state.path,
    lang: state.language
});

export default compose(
    translate(),
    withNotifications(),
    withStyles(styles),
    connect(mapStateToProps),
    withApollo
)(EditLayout);
