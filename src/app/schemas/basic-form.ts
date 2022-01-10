import { IComponent, ISchema, SchemaManager } from "src/app/components/bi-formular-engine/src/public-api";
import { schemaClassLayout } from "./schema-utils";

const hobbies = [
    'Lesen', 'Brettspiele', 'Bücher', 'Programmieren', 'Kochen', 'Tanzen', 'Zeichnen', 'Electronik', 'Mode'];

const label = (text: string): IComponent => {
	return {
		type: 'label',
		classLayout: 'col-start-1 col-label-class-layout',
		label: text,
	}
}

let senden_ok = false


export const Basic_Form: ISchema = {
    type: 'panel',
    label: 'Einfaches Formular',
    classLayout: schemaClassLayout,
    onChange() {
        senden_ok = false
    },
    initFormular(sm) {
        sm.Values = values
    },
    children: [
        label('Name'),
        {
            type: 'input',
            field: 'name',
            label: '',
            required: true,
            classLayout: 'col-start-2'
        },
        label('Geschlecht'),
        {
            type: 'radiogroup',
            field: 'geschlecht',
            class: 'mt-2',
            classLayout: 'col-start-2',
            options: ['Frau', 'Mann'],
        },
        {
            type: 'input',
            hint: 'Adresse eingeben',
            multiline: true,
            field: 'adresse',
            max: 300,
            label: '',
            classLayout: 'col-start-1 col-span-2',
            class: 'w-full',
        },
        {
            type: 'select',
            hint: 'Hobbies eingeben',
            field: 'hobbies',
            multiselect: true,
            options: hobbies,
            classLayout: 'col-start-1 col-span-2',
            label: '',
            class: 'w-full',
            validate(sm, comp, value) {
                if (value.length < 3) {
                    return 'Bitte mindestens 3 Hobbies eingeben'
                }
                return ''
            },
        },
        {
            type: 'checkbox',
            label: 'Annehmen',
            field: 'terms',
            classLayout: 'col-start-1 col-span-2',
            onChange(sm, comp, value) {
                const btn = sm.getCompByName('btnOk')
                btn.hidden = !value
            }
        },
        {
            type: 'button',
            name: 'btnOk',
            color: 'primary',
            class: 'mt-10',
            hidden: true,
            label: 'Ok',
            onClick(sm) {
                sm.validateAll()
                if (sm.Errors.length === 0) {
                    senden_ok = true
                }
            },
            classLayout: 'mt-10 col-start-1',
        },
        {
            type: 'label', 
            label: 'Daten wurden gesendet.',
            classLayout: 'col-start-1',
            hidden() {
                return !senden_ok
            }
        }
    ]

}

const values = {
    name: 'Fritz',
    adresse: 'Worblaufenstrasse 163\n3048 Ittigen',
    gender: 'Mann',
    hobbies: ['Lesen', 'Brettspiele'],
}
