import React from 'react';
import {compose} from 'react-apollo';
import {Grid, Typography, withStyles} from '@material-ui/core';
import {Trans} from 'react-i18next';
import EditTopBar from './EditTopBar';
import FormBuilder from './FormBuilder';

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
    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <div className={classes.metaNav}>
                    <Typography variant="overline" color="inherit"><Trans i18nKey="label.contentManager.link.academy" components={[<a key="academyLink" href={contextJsParameters.config.academyLink} target="_blank" rel="noopener noreferrer">univers</a>]}/></Typography>
                </div>
                <Grid container spacing={0}>
                    <Grid item xs={GRID_SIZE} className={classes.topBar}>
                        <EditTopBar/>
                    </Grid>
                </Grid>

                <div className={classes.appFrame}>
                    <FormBuilder/>
                </div>
            </React.Fragment>
        );
    }
}

export default compose(
    withStyles(styles)
)(EditLayout);
