import React from 'react';
import PropTypes from 'prop-types';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, IconButton, withStyles} from '@material-ui/core';
import {ExpandMore, RotateLeft, RotateRight} from '@material-ui/icons';
import {Typography} from '@jahia/ds-mui-theme';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import ImageActions from '../ImageActions';

let styles = theme => ({
    rotatePanel: {
        display: 'flex',
        flexDirection: 'column'
    },
    icons: {
        paddingTop: theme.spacing.unit * 2
    }
});

export class RotatePanel extends React.Component {
    render() {
        let {classes, t, rotate, undoChanges} = this.props;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="zeta" color="alpha">{t('label.contentManager.editImage.rotate')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.rotatePanel}>
                    <Typography variant="zeta" color="beta">
                        {t('label.contentManager.editImage.rotateImage')}
                    </Typography>
                    <div className={classes.icons}>
                        <IconButton onClick={() => rotate(-1)}>
                            <RotateLeft color="primary" fontSize="large"/>
                        </IconButton>
                        <IconButton onClick={() => rotate(1)}>
                            <RotateRight color="primary" fontSize="large"/>
                        </IconButton>
                    </div>
                    <ImageActions undoChanges={undoChanges}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

RotatePanel.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    rotate: PropTypes.number.isRequired,
    undoChanges: PropTypes.func.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(RotatePanel);
