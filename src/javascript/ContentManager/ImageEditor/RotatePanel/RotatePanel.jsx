import React from 'react';
import PropTypes from 'prop-types';
import {Tooltip, withStyles} from '@material-ui/core';
import {RotateLeft, RotateRight} from '@material-ui/icons';
import {IconButton, Typography} from '@jahia/ds-mui-theme';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';

let styles = theme => ({
    icons: {
        paddingTop: theme.spacing.unit * 2
    }
});

export const RotatePanel = ({classes, t, rotate}) => {
    return (
        <>
            <Typography variant="zeta">
                {t('label.contentManager.editImage.rotateInfo')}
            </Typography>
            <div className={classes.icons}>
                <Tooltip title={t('label.contentManager.editImage.rotateLeft')}>
                    <IconButton data-cm-role="rotate-left"
                                icon={<RotateLeft color="primary" fontSize="large"/>}
                                onClick={() => rotate(-1)}/>
                </Tooltip>
                <Tooltip title={t('label.contentManager.editImage.rotateRight')}>
                    <IconButton data-cm-role="rotate-right"
                                icon={<RotateRight color="primary" fontSize="large"/>}
                                onClick={() => rotate(1)}/>
                </Tooltip>
            </div>
        </>
    );
};

RotatePanel.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    rotate: PropTypes.func.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(RotatePanel);