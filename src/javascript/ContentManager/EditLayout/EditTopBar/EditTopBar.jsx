import React from 'react';
import {withStyles, Typography, Grid} from '@material-ui/core';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    typoTitle: {
        width: '260px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    topBar: {
        width: 'min-content',
        display: 'flex',
        flexDirection: 'row-reverse',
        paddingTop: theme.spacing.unit * 3
    },
    topBarGrid: {
        marginBottom: theme.spacing.unit * 2,
        '& button': {
            margin: '0px'
        }
    },
    buttons: {
        '&&': {
            marginLeft: theme.spacing.unit
        }
    }
});

export class EditTopBar extends React.Component {
    render() {
        const {classes, t, title} = this.props;

        return (
            <div className={classes.root} data-cm-role="cm-top-bar">
                <Grid container spacing={0} alignItems="center">
                    <Grid item xs={2} className={classes.topBarGrid}>
                        <Typography variant="body1" color="inherit">
                            {t('label.contentManager.edit.title')}
                        </Typography>
                        <Typography variant="h5" color="inherit" className={classes.typoTitle}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={9} className={classes.topBar}>
                        <DisplayActions target="editHeaderActions"
                                        context={{}}
                                        render={buttonRenderer({variant: 'contained', color: 'primary', size: 'small', classes: {root: classes.buttons}}, true)}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default compose(
    translate(),
    withStyles(styles)
)(EditTopBar);
