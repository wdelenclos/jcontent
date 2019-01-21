import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const NodeQuery = gql`
    query getFiles($path:String!, $language:String!) {
        jcr {
            result:nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                displayName(language: $language)
                primaryNodeType {
                    name
                }
                properties(names: ["sharedSmallText"]) {
                    name
                    value
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {
    NodeQuery
};
