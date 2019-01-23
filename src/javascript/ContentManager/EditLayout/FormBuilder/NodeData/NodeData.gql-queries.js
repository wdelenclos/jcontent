import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const NodeQuery = gql`
    query getNodeProperties($path:String!, $language:String!) {
        jcr {
            result:nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                displayName(language: $language)
                primaryNodeType {
                    name
                }
                properties(names: ["sharedSmallText", "sharedBigtext"]) {
                    definition {
                        requiredType
                    }
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
