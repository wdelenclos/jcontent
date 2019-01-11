import React from 'react';
import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    Paper,
    withStyles
} from '@material-ui/core';
import {VirtualsiteIcon} from '@jahia/icons';

import {Lock} from '@material-ui/icons';
import ContentListHeader from './ContentListHeader';
import {ContextualMenu, DisplayActions, iconButtonRenderer, Pagination} from '@jahia/react-material';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {translate} from 'react-i18next';
import DxContext from '../../DxContext';
import PublicationStatus from '../../PublicationStatus';
import Moment from 'react-moment';
import {CM_DRAWER_STATES, cmGoto, cmSetPage, cmSetPageSize, cmSetSelection, cmSetSort} from '../../ContentManager.redux-actions';
import {allowDoubleClickNavigation, isMarkedForDeletion} from '../../ContentManager.utils';
import BrowseBar from '../BrowseBar';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import UploadTransformComponent from '../UploadTransformComponent';
import classNames from 'classnames';

const allColumnData = [
    {id: 'name', label: 'label.contentManager.listColumns.name', sortable: true, property: 'displayName'},
    {id: 'wip', label: '', sortable: false, property: ''},
    {id: 'lock', label: '', sortable: false, property: ''},
    {
        id: 'type',
        label: 'label.contentManager.listColumns.type',
        sortable: true,
        property: 'primaryNodeType.displayName'
    },
    {
        id: 'lastModified',
        label: 'label.contentManager.listColumns.lastModified',
        sortable: true,
        property: 'lastModified.value'
    },
    {id: 'createdBy', label: 'label.contentManager.listColumns.createdBy', sortable: true, property: 'createdBy.value'}
];

const reducedColumnData = [
    {id: 'name', label: 'label.contentManager.listColumns.name', sortable: true, property: 'displayName'},
    {id: 'wip', label: '', sortable: false, property: ''},
    {id: 'lock', label: '', sortable: false, property: ''},
    {
        id: 'lastModified',
        label: 'label.contentManager.listColumns.lastModified',
        sortable: true,
        property: 'lastModified.value'
    },
    {id: 'createdBy', label: 'label.contentManager.listColumns.createdBy', sortable: true, property: 'createdBy.value'}
];

const APP_TABLE_CELLS = 2;

const styles = theme => ({

    tableWrapper: {
        minHeight: 'calc(100vh - ' + (theme.contentManager.topBarHeight + theme.contentManager.toolbarHeight + theme.contentManager.paginationHeight) + 'px)',
        maxHeight: 'calc(100vh - ' + (theme.contentManager.topBarHeight + theme.contentManager.toolbarHeight + theme.contentManager.paginationHeight) + 'px)',
        overflow: 'auto'
    },
    row: {
        '&&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default + '7F'
        },
        '&&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    rowCursor: {
        '&&:hover': {
            cursor: 'pointer'
        }
    },
    selectedRow: {
        '&&&': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white
        }
    },
    cell: {
        maxWidth: '2vw',
        textOverflow: 'ellipsis'
    },
    selectedCell: {
        '&&': {
            color: 'white'
        }
    },
    publicationCell: {
        position: 'relative'
    },
    nameCell: {
        maxWidth: '15vw',
        '& img': {
            marginRight: '6px',
            verticalAlign: 'sub'
        }
    },
    actionsCell: {
        minWidth: theme.spacing.unit * 18,
        width: theme.spacing.unit * 18,
        color: theme.palette.primary.dark
    },
    isDeleted: {
        textDecoration: 'line-through'
    },
    empty: {
        textAlign: 'center'
    },
    publicationStatus: {
        minWidth: 500
    }
});

export class ContentListTable extends React.Component {
    getCellClasses(node, classes, column, isSelected, isPreviewOpened) {
        let selected = isSelected && isPreviewOpened;
        let cellClasses = {
            root: classNames(classes.cell, classes[column + 'Cell'], {[classes.selectedCell]: selected, [classes[column + 'CellSelected']]: selected, [classes.isDeleted]: isMarkedForDeletion(node)})
        };
        return cellClasses;
    }

    isWip(node, lang) {
        switch (node.wipStatus) {
            case 'ALL_CONTENT':
                return true;
            case 'LANGUAGES':
                return _.includes(node.wipLangs, lang);
            default:
                return false;
        }
    }

    addIconSuffix(icon) {
        return (!icon.includes('.png') ? icon + '.png' : icon);
    }

    renderLock(row) {
        let {t} = this.props;
        return row.isLocked ?
            <Tooltip title={t('label.contentManager.locked')}>
                <Lock
                      fontSize="small"
                      color="inherit"/>
            </Tooltip> : null;
    }

    renderWip(row, dxContext) {
        let {t, lang} = this.props;
        if (this.isWip(row, lang)) {
            return (
                <Tooltip title={t('label.contentManager.workInProgress', {wipLang: dxContext.langName})}>
                    <VirtualsiteIcon fontSize="small"
                                     color="inherit"/>
                </Tooltip>
            );
        }
        return null;
    }

    render() {
        const {
            rows, contentNotFound, pagination, sort, setCurrentPage, setPageSize,
            onRowSelected, selection, totalCount, t, classes, uiLang, setSort, setPath, path, previewState
        } = this.props;
        let columnData = previewState === CM_DRAWER_STATES.SHOW ? reducedColumnData : allColumnData;
        let showActions = previewState !== CM_DRAWER_STATES.SHOW;
        let isPreviewOpened = previewState === CM_DRAWER_STATES.SHOW;
        let selectedRow = isPreviewOpened ? classes.selectedRow : '';
        return (
            <Paper>
                <BrowseBar/>
                <div className={classes.tableWrapper}>
                    <Table aria-labelledby="tableTitle" data-cm-role="table-content-list">
                        <ContentListHeader
                            order={sort.order}
                            orderBy={sort.orderBy}
                            columnData={columnData}
                            classes={classes}
                            setSort={setSort}
                            showActions={showActions}
                        />
                        <DxContext.Consumer>
                            {dxContext => (
                                <UploadTransformComponent uploadTargetComponent={TableBody} uploadPath={path}>
                                    {contentNotFound ?
                                        <ContentNotFound columnData={columnData} translate={t} class={classes.empty}/> : _.isEmpty(rows) ?
                                            <EmptyRow columnData={columnData}
                                                      translate={t}/> : rows.map(n => {
                                                let isSelected = n.path === selection && isPreviewOpened;
                                                let renderWip = this.renderWip(n, dxContext);
                                                let renderLock = this.renderLock(n);
                                                let icon = this.addIconSuffix(n.icon);
                                                // Let isDeleted = isMarkedForDeletion(n);
                                                let contextualMenu = React.createRef();
                                                return (
                                                    <TableRow
                                                        key={n.uuid}
                                                        hover
                                                        classes={{
                                                            root: classNames(classes.row, {[classes.rowCursor]: isPreviewOpened}),
                                                            selected: selectedRow
                                                        }}
                                                        data-cm-node-path={n.path}
                                                        data-cm-role="table-content-list-row"
                                                        selected={isSelected}
                                                        onClick={() => onRowSelected(n.path)}
                                                        onContextMenu={event => {
                                                            event.stopPropagation();
                                                            contextualMenu.current.open(event);
                                                        }}
                                                        onDoubleClick={allowDoubleClickNavigation(n.primaryNodeType, () => setPath(n.path))}
                                                    >
                                                        <ContextualMenu ref={contextualMenu}
                                                                        actionKey="contextualMenuContent"
                                                                        context={{path: n.path}}/>

                                                        <TableCell padding="none"
                                                                   classes={{root: classes.publicationCell}}
                                                                   data-cm-role="table-content-list-cell-publication"
                                                        >
                                                            <PublicationStatus node={n} classes={{root: classes.publicationStatus}}/>
                                                        </TableCell>
                                                        <TableCell padding="checkbox"
                                                                   classes={this.getCellClasses(n, classes, 'checkbox', isSelected, isPreviewOpened)}
                                                        >
                                                            <Checkbox checked={false}/>
                                                        </TableCell>
                                                        {columnData.map(column => {
                                                            if (column.id === 'name') {
                                                                return (
                                                                    <TableCell key={column.id}
                                                                               classes={this.getCellClasses(n, classes, column.id, isSelected, isPreviewOpened)}
                                                                               data-cm-role="table-content-list-cell-name"
                                                                    >
                                                                        <Typography noWrap variant="body2" color="inherit">
                                                                            <img src={icon}/>
                                                                            {n[column.id]}
                                                                        </Typography>
                                                                    </TableCell>
                                                                );
                                                            }
                                                            if (column.id === 'wip') {
                                                                return (
                                                                    <TableCell key={column.id}
                                                                               classes={this.getCellClasses(n, classes, column.id, isSelected, isPreviewOpened)}
                                                                               padding="none"
                                                                    >{renderWip}
                                                                    </TableCell>
                                                                );
                                                            }
                                                            if (column.id === 'lock') {
                                                                return (
                                                                    <TableCell key={column.id}
                                                                               classes={this.getCellClasses(n, classes, column.id, isSelected, isPreviewOpened)}
                                                                               padding="none"
                                                                    >{renderLock}
                                                                    </TableCell>
                                                                );
                                                            }
                                                            if (column.id === 'type') {
                                                                return (
                                                                    <TableCell key={column.id}
                                                                               classes={this.getCellClasses(n, classes, column.id, isSelected, isPreviewOpened)}
                                                                               data-cm-role="table-content-list-cell-type"
                                                                    >
                                                                        <Typography noWrap variant="body2" color="inherit">
                                                                            {n[column.id]}
                                                                        </Typography>
                                                                    </TableCell>
                                                                );
                                                            }
                                                            if (column.id === 'lastModified') {
                                                                return (
                                                                    <TableCell key={column.id}
                                                                               classes={this.getCellClasses(n, classes, column.id, isSelected, isPreviewOpened)}
                                                                               data-cm-role={'table-content-list-cell-' + column.id}
                                                                    >
                                                                        <Typography noWrap variant="body2" color="inherit">
                                                                            <Moment format="ll"
                                                                                    locale={uiLang}
                                                                            >{n[column.id]}
                                                                            </Moment>
                                                                        </Typography>
                                                                    </TableCell>
                                                                );
                                                            }
                                                            return (
                                                                <TableCell key={column.id}
                                                                           classes={this.getCellClasses(n, classes, column.id, isSelected, isPreviewOpened)}
                                                                           data-cm-role={'table-content-list-cell-' + column.id}
                                                                >
                                                                    <Typography noWrap variant="body2" color="inherit">
                                                                        {n[column.id]}
                                                                    </Typography>
                                                                </TableCell>
                                                            );
                                                        })}
                                                        {showActions &&
                                                        <TableCell
                                                            padding="none"
                                                            classes={this.getCellClasses(n, classes, 'actions', isSelected, isPreviewOpened)}
                                                            data-cm-role="table-content-list-cell-actions"
                                                        >
                                                            <DisplayActions
                                                                target="tableActions"
                                                                context={{path: n.path}}
                                                                render={iconButtonRenderer({
                                                                    color: 'inherit',
                                                                    disableRipple: true
                                                                }, true)}
                                                            />
                                                        </TableCell>
                                                        }
                                                    </TableRow>
                                                );
                                            })}
                                </UploadTransformComponent>
                            )}
                        </DxContext.Consumer>
                    </Table>
                </div>
                <Pagination
                    totalCount={totalCount}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.currentPage}
                    onChangeRowsPerPage={setPageSize}
                    onChangePage={setCurrentPage}
                />
            </Paper>
        );
    }
}

let EmptyRow = props => {
    return (
        <TableRow>
            <TableCell colSpan={props.columnData.length + APP_TABLE_CELLS + 2}>
                <Typography variant="subtitle1">{props.translate('label.contentManager.noResults')}</Typography>
            </TableCell>
        </TableRow>
    );
};

let ContentNotFound = props => {
    return (
        <TableRow>
            <TableCell colSpan={props.columnData.length + APP_TABLE_CELLS}>
                <Typography variant="subtitle1" className={props.class}>{props.translate('label.contentManager.contentNotFound')}</Typography>
            </TableCell>
        </TableRow>
    );
};

const mapStateToProps = state => ({
    mode: state.mode,
    selection: state.selection,
    uiLang: state.uiLang,
    siteKey: state.site,
    path: state.path,
    lang: state.language,
    params: state.params,
    searchTerms: state.params.searchTerms,
    searchContentType: state.params.searchContentType,
    sql2SearchFrom: state.params.sql2SearchFrom,
    sql2SearchWhere: state.params.sql2SearchWhere,
    pagination: state.pagination,
    sort: state.sort,
    previewState: state.previewState
});

const mapDispatchToProps = dispatch => ({
    onRowSelected: selection => dispatch(cmSetSelection(selection)),
    setPath: (path, params) => dispatch(cmGoto({path, params})),
    setCurrentPage: page => dispatch(cmSetPage(page)),
    setPageSize: pageSize => dispatch(cmSetPageSize(pageSize)),
    setSort: state => dispatch(cmSetSort(state)),
    clearSearch: params => {
        params = _.clone(params);
        _.unset(params, 'searchContentType');
        _.unset(params, 'searchTerms');
        _.unset(params, 'sql2SearchFrom');
        _.unset(params, 'sql2SearchWhere');
        dispatch(cmGoto({mode: 'browse', params: params}));
    }
});

ContentListTable.propTypes = {
    rows: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles),
    translate(),
    connect(mapStateToProps, mapDispatchToProps)
)(ContentListTable);