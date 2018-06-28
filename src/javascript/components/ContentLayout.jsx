import React from 'react';
import {Query} from 'react-apollo';
import {allContentQuery, TableQueryVariables} from "./gqlQueries";
import * as _ from "lodash";
import ContentListTable from "./list/ContentListTable";
import ContentPreview from "./ContentPreview";
import {Grid, Button, withStyles} from "@material-ui/core";
import ContentBrowser from "./ContentBrowser";
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import ContentBreadcrumbs from "./ContentBreadcrumbs";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class ContentLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
            showBrowser: false,
            showPreview: false
        };
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleShowTree = this.handleShowTree.bind(this);
        this.handleShowPreview = this.handleShowPreview.bind(this);
    }

    handleChangePage = newPage => {
        this.setState({page: newPage});
    };

    handleChangeRowsPerPage = value => {
        this.setState({rowsPerPage: value});
    };

    handleShowTree = () => {
        this.setState((prevState, props) => {
            return {
                showBrowser: !prevState.showBrowser
            }
        })
    };

    handleShowPreview = () => {
        this.setState((prevState, props) => {
            return {
                showPreview: !prevState.showPreview
            }
        })
    };

    render() {
        const { showPreview, showBrowser: showTree } = this.state;
        const path = this.props.match.url;
        return <Query fetchPolicy={'network-only'} query={allContentQuery} variables={TableQueryVariables(this.state, path)}>
            { ({loading, error, data}) => {
                let rows = [];
                let totalCount = 0;
                if (data.jcr && data.jcr.nodesByCriteria) {
                    totalCount = data.jcr.nodesByCriteria.pageInfo.totalCount;
                    rows = _.map(data.jcr.nodesByCriteria.nodes, contentNode => {
                        return {
                            uuid: contentNode.uuid,
                            name: contentNode.displayName,
                            type: contentNode.primaryNodeType.name,
                            created: contentNode.created.value,
                            createdBy: contentNode.createdBy.value,
                            path: contentNode.path,
                            isPublished: contentNode.aggregatedPublicationInfo.publicationStatus === 'PUBLISHED',
                            isLocked: contentNode.property !== null,
                            isMarkedForDeletion: contentNode.aggregatedPublicationInfo.publicationStatus === 'MARKED_FOR_DELETION'
                        }
                    })
                }
                const xs = 12 - (showTree ? 3 : 0) - (showPreview ? 3 : 0);
                return (
                    <div className={this.props.classes.root}>
                        <Grid item xs={12}>
                            <ContentBreadcrumbs path={this.props.match.url}/>
                            <Button onClick={this.handleShowTree}>{showTree ? "Hide" : "Show"} Tree</Button>
                            <Button onClick={this.handleShowPreview}>{showPreview ? "Hide" : "Show"} Preview</Button>
                        </Grid>
                        <Grid container spacing={0}>
                            {showTree && <Grid item xs={3}><ContentBrowser match={this.props.match}/></Grid>}
                            <Grid item xs={xs}>
                                <ContentListTable
                                    match={this.props.match}
                                    totalCount={totalCount}
                                    rows={rows}
                                    pageSize={this.state.rowsPerPage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    onChangePage={this.handleChangePage}
                                    page={this.state.page}
                                />
                            </Grid>
                            {showPreview &&  <Grid item xs={3}><ContentPreview/></Grid>}
                        </Grid>
                    </div>
                )
            }}
        </Query>;
    }
}

ContentLayout = compose(
    withStyles(styles)
)(ContentLayout);

export {ContentLayout};