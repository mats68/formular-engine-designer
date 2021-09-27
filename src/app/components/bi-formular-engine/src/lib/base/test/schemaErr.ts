import { IValueType, SchemaManager } from '../schemaManager';
import { ISchema, IComponent, ComponentType, ISelectOptionItems, DataType, IScreenSize, IAppearance, SchemaKeys, ComponentKeys } from '../types';

export const schemaErr: ISchema = {
    type: 'form',
    children: [
        {
            // @ts-ignore
            type: 'wrongtype',
            name: 'wrongtype',
        },
        // @ts-ignore
        {
            name: 'notype',
        },
        {
            type: 'panel',
            name: 'noChild',

        },
        {
            type: 'panel',
            name: 'noChild1',
            children: [

            ]

        },
        {
            type: 'input',
            name: 'nofield',

        },
        {
            type: 'input',
            field: 'hasfield',
            name: 'hasfield',

        },
        {
            type: 'select',
            name: 'noLabelnoField',

        },
        {
            type: 'divider',
            name: 'divider',

        },
        {
            type: 'checkbox',
            field: 'doublefield',
        },
        {
            type: 'input',
            field: 'doublefield',
        },
        {
            type: 'date',
            name: 'doublename',
        },
        {
            type: 'input',
            name: 'doublename',
            field: 'doublename',
        },
        {
            type: 'datatable',
            name: 'datatable',
            field: 'datatable',
            children: [
                {
                    type: 'input',
                    field: 'd-input',
                    name: 'd-input',
                }
            ]
        },
        {
            type: 'select',
            field: 'selectnoptions'
        },
        {
            type: 'select',
            field: 'selecthasptions',
            options: ['A', 'B']
        },
        {
            type: 'radiogroup',
            field: 'radiogroupnooptions'
        },
        {
            type: 'radiogroup',
            field: 'radiogrouphasptions',
            options: ['A', 'B']
        },
        {
            type: 'select',
            field: 'selectzerooptions',
            options: []
        },
        {
            type: 'select',
            field: 'selectwrongoptions',
            // @ts-ignore
            options: [1, 2, 3]
        },
        {
            type: 'select',
            field: 'selectwrongoptions2',
            // @ts-ignore
            options: ['1', '2', 3]
        },
        {
            type: 'select',
            field: 'selectwrongoptions3',
            // @ts-ignore
            options: [{text: '1'}]
        },
        {
            type: 'select',
            field: 'selectwrongoptions4',
            // @ts-ignore
            options: [{value: 1, text: '1'}, {val: 4, text: 'da'}]
        },
        {
            type: 'select',
            field: 'selectoptionsok1',
            options: ['1', '2', '3']
        },
        {
            type: 'select',
            field: 'selectoptionsok2',
            options: [{value: '1', text: '1'}, {value: '4', text: 'da'}]
        },
        {
            type: 'select',
            field: 'selectoptionsok3',
            options: [{value: 1, text: '1'}, {value: 4, text: 'da'}]
        },
        {
            type: 'select',
            field: 'selectoptionsDouble1',
            options: ['1', '2', '3', '4', '1']
        },
        {
            type: 'select',
            field: 'selectoptionsDouble2',
            options: [{value: '1', text: '1'}, {value: '4', text: 'da'}, {value: '1', text: 'da'}]
        },
        {
            type: 'panel',
            children: [
                {
                    type: 'button',
                    name: 'btnunn',
                    // @ts-ignore
                    label1: 'hello'
                },
                {
                    type: 'card',
                    children: [
                        {
                            type: 'icon',
                            name: 'iconmissing',
                        }
                    ]

                }

            ]
        },
        {
            type: 'datatable',
            name: 'datatableIndatatable',
            children: [
                {
                    type: 'datatable',
                    name: 'datatableNoFields',
                    children: [
                        {
                            type: 'button',
                            label: 'Lb',
                        }
                    ]
                },
                {
                    type: 'input',
                    field: 'dtInp1'
                }
            ]
        },
        {
            type: 'datatable',
            name: 'datatable2',
            children: [
                {
                    type: 'panel',
                    children: [
                        {
                            type: 'input',
                            field: 'dtInp1'
                        }
        
                    ]

                },
            ]
        }



    ]
}


