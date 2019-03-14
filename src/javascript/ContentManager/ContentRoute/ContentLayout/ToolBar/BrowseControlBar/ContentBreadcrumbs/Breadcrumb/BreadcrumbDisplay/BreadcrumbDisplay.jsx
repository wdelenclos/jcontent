import React from 'react';
import PropTypes from 'prop-types';
import {Menu, MenuItem} from '@material-ui/core';
import iconRenderer from './iconRenderer';
import {withStyles} from '@material-ui/core';
import {Typography, Button} from '@jahia/ds-mui-theme';
import {translate} from 'react-i18next';
import {ellipsizeText} from '../../../../../../../ContentManager.utils';
import {compose} from 'react-apollo';

const styles = theme => ({
    contentLabel: {
        paddingLeft: theme.spacing.unit
    },
    icon: {
        color: theme.palette.font.alpha
    }
});

export class BreadcrumbDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.onMenuButtonMouseOver = this.onMenuButtonMouseOver.bind(this);
        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);

        this.menu = React.createRef();
        this.anchorButton = React.createRef();

        this.state = {
            menuActive: false,
            anchorPosition: {
                top: 5,
                left: 50
            }
        };
    }

    onMenuButtonMouseOver() {
        if (!this.state.menuActive) {
            this.setState({
                menuActive: true,
                anchorPosition: {
                    top: this.anchorButton.current.getBoundingClientRect().top - 5,
                    left: this.anchorButton.current.getBoundingClientRect().left
                }
            });
        }
    }

    onMenuItemSelected(event, node) {
        this.props.handleSelect(node.mode, node.path);
    }

    render() {
        let {menuActive, anchorPosition} = this.state;
        let {node, maxLabelLength, trimLabel, classes} = this.props;
        return (
            <span ref={this.menu}>
                <Button
                    disableRipple
                    variant="ghost"
                    size="compact"
                    buttonRef={this.anchorButton}
                    aria-haspopup="true"
                    aria-owns={'breadcrumbMenu_' + node.uuid}
                    onMouseOver={() => node.siblings && node.siblings.length > 1 && this.onMenuButtonMouseOver()}
                    onClick={ev => node.siblings && node.siblings.length === 1 && this.onMenuItemSelected(ev, node.siblings[0])}
                >
                    {iconRenderer(node, classes.icon)}
                    {!trimLabel &&
                        <Typography variant="iota" data-cm-role="breadcrumb-name" classes={{root: classes.contentLabel}}>
                            {ellipsizeText(node.name, maxLabelLength)}
                        </Typography>
                    }
                </Button>
                <Menu
                    key={node.uuid}
                    disableAutoFocusItem
                    anchorPosition={anchorPosition}
                    anchorReference="anchorPosition"
                    container={this.menu.current}
                    open={menuActive}
                    BackdropProps={{
                        style: {
                            opacity: 0
                        },
                        onMouseOver: () => {
                            this.setState({menuActive: false});
                        }
                    }}
                    onClose={() => this.setState({menuActive: false})}
                >
                    <MenuItem
                        key={'dropdown_' + node.uuid}
                        disableRipple
                        selected
                        disableGutters
                        onClick={event => this.onMenuItemSelected(event, node)}
                    >
                        {iconRenderer(node)}{node.name}
                    </MenuItem>
                    {node.siblings && node.siblings.length !== 0 &&
                        node.siblings.map(siblingNode => {
                            if (siblingNode.name === node.name) {
                                return null;
                            }
                            return (
                                <MenuItem
                                    key={siblingNode.uuid}
                                    disableRipple
                                    onClick={event => this.onMenuItemSelected(event, siblingNode)}
                                >
                                    {iconRenderer(siblingNode)}
                                    <Typography variant="iota" data-cm-role="breadcrumb-name" classes={{root: classes.contentLabel}}>
                                        {siblingNode.name}
                                    </Typography>
                                </MenuItem>
                            );
                        })
                    }
                </Menu>
            </span>
        );
    }
}

BreadcrumbDisplay.propTypes = {
    classes: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
    maxLabelLength: PropTypes.number.isRequired,
    node: PropTypes.object.isRequired,
    trimLabel: PropTypes.bool.isRequired
};

export default compose(translate(), withStyles(styles))(BreadcrumbDisplay);