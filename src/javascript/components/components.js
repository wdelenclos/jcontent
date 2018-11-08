import * as _ from "lodash";

let Components = {
};

function defineComponents(components) {
    Components = _.assign(Components, components);
}

function overrideComponents(overridingComponents) {
    Components = _.assign(Components, overridingComponents);
}

export default Components;
export {defineComponents, overrideComponents};