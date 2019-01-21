let QAAllFieldFormDefinition = {
    nodeType: 'qant:allFields',
    targets: [
        {
            name: 'content',
            fields: [
                {
                    name: 'sharedSmallText',
                    fieldType: 'Text',
                    i18n: false
                }
            ]
        }
    ]
};

let FormDefinitions = {
    'qant:allFields': QAAllFieldFormDefinition
};

export default FormDefinitions;
