import React from 'react';
import {checkPermissionQuery} from "./gqlQueries";
import {Query} from "react-apollo";

class Action extends React.Component {

    render() {
        const {call, children, path, name, requiredPermission, ...rest} = this.props;
        // check permission
        const permission = requiredPermission === undefined || requiredPermission === "" ? "jcr:write" : requiredPermission;
        // todo: check nodeType or any other constraint

        return (
            <Query fetchPolicy={'network-only'} query={ checkPermissionQuery } variables={{path: path, permission: permission}}>
                {({loading, error, data}) => {
                    return !loading && data.jcr.nodeByPath.perm && children({...rest, onClick:() => call(path, name)})
                } }
            </Query>
        )
    }
}


export default Action;
