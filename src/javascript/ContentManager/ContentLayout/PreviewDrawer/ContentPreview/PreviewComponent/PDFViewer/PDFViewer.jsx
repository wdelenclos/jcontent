import React from 'react';
import PropTypes from 'prop-types';
import Pdf from 'react-pdf-js';
import {translate} from 'react-i18next';
import {IconButton, Tooltip, Typography, withStyles} from '@material-ui/core';
import {
    ChevronLeft,
    ChevronRight,
    MagnifyMinusOutline,
    MagnifyPlusOutline,
    StepBackward,
    StepForward
} from 'mdi-material-ui';
import {compose} from 'react-apollo';
import classNames from 'classnames';

const styles = theme => ({
    pdfContainer: {
        height: 'calc(100% - ' + (theme.spacing.unit * 6) + 'px)',
        maxWidth: '550px',
        margin: '0 auto',
        '& canvas': {
            display: 'block',
            paddingTop: (theme.spacing.unit * 3) + 'px',
            paddingBottom: (theme.spacing.unit * 9) + 'px',
            maxHeight: '100%',
            margin: '0 auto'
        },
        '&$fullScreen': {
            maxWidth: '90%'
        }
    },
    fullScreen: {},
    controlsContainer: {
        position: 'fixed',
        height: (theme.spacing.unit * 6) + 'px',
        width: '100%',
        background: theme.palette.background.paper,
        display: 'flex'
    },
    controlLeft: {
        flex: 1,
        margin: 'auto'
    },
    controlCenter: {
        margin: 'auto',
        alignSelf: 'center'
    },
    controlRight: {
        flex: 1,
        margin: 'auto',
        textAlign: 'end'
    },
    scale: {
        top: '38px !important'
    }
});

const scaleSizes = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];

export class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: null,
            pages: null,
            scaleSize: 6,
            showScale: false
        };
        this.scaleTimeout = null;
        this.onDocumentComplete = this.onDocumentComplete.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
    }

    onDocumentComplete(pages) {
        this.setState({page: 1, pages});
    }

    handleNavigation(event, value) {
        this.setState(prevState => {
            let {page, pages} = prevState;
            let newPage = page;
            switch (value) {
                case 'first':
                    newPage = 1;
                    break;
                case 'last':
                    newPage = pages;
                    break;
                case 'next':
                    newPage = ++page;
                    break;
                case 'previous':
                    newPage = --page;
                    break;
                default:
                    break;
            }
            return {page: newPage};
        });
    }

    handleZoom(event, value) {
        this.setState(prevState => {
            let {scaleSize} = prevState;
            let newScaleSize = scaleSize;
            switch (value) {
                case 'in':
                    newScaleSize = ++scaleSize;
                    break;
                case 'out':
                    newScaleSize = --scaleSize;
                    break;
                default:
                    break;
            }
            clearTimeout(this.scaleTimeout);
            this.scaleTimeout = setTimeout(() => {
                this.setState({showScale: false});
            }, 1000);
            return {scaleSize: newScaleSize, showScale: true};
        });
    }

    render() {
        let {page, pages, scaleSize, showScale} = this.state;
        let {classes, file, fullScreen} = this.props;

        return (
            <React.Fragment>
                <Tooltip title={Math.floor(scaleSizes[this.state.scaleSize] * 100) + ' %'}
                         placement="top-end"
                         open={showScale}
                         classes={{popper: classes.scale}}
                >
                    <div className={classNames(classes.pdfContainer, fullScreen && classes.fullScreen)}>
                        <Pdf file={file}
                             scale={scaleSizes[scaleSize]}
                             page={page}
                             onDocumentComplete={this.onDocumentComplete}
                        />
                    </div>
                </Tooltip>

                <div className={classes.controlsContainer}>
                    <div className={classes.controlLeft}/>
                    <Typography className={classes.controlCenter} variant="caption" component="div">
                        <IconButton disabled={page === 1}
                                    onClick={event => {
                                        this.handleNavigation(event, 'first');
                                    }}
                        >
                            <StepBackward/>
                        </IconButton>
                        <IconButton disabled={page === 1}
                                    onClick={event => {
                                        this.handleNavigation(event, 'previous');
                                    }}
                        >
                            <ChevronLeft/>
                        </IconButton>
                        {page}/{pages}
                        <IconButton disabled={page === pages}
                                    onClick={event => {
                                        this.handleNavigation(event, 'next');
                                    }}
                        >
                            <ChevronRight/>
                        </IconButton>
                        <IconButton disabled={page === pages}
                                    onClick={event => {
                                        this.handleNavigation(event, 'last');
                                    }}
                        >
                            <StepForward/>
                        </IconButton>
                    </Typography>
                    <div className={classes.controlRight}>
                        <IconButton disabled={scaleSize === 0}
                                    onClick={event => {
                                        this.handleZoom(event, 'out');
                                    }}
                        >
                            <MagnifyMinusOutline/>
                        </IconButton>
                        <IconButton disabled={scaleSize === scaleSizes.length - 1}
                                    onClick={event => {
                                        this.handleZoom(event, 'in');
                                    }}
                        >
                            <MagnifyPlusOutline/>
                        </IconButton>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PDFViewer.propTypes = {
    classes: PropTypes.object,
    file: PropTypes.string.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

PDFViewer.defaultProps = {
    classes: null
};

export default compose(
    translate(),
    withStyles(styles)
)(PDFViewer);