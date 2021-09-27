import { DataType, IComponent, IComponentBoolFunction, IComponentString, IComponentStringFunction, IValueType, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
// import { adress_suche_fn, adress_suche_panel } from './panel-adress-suche';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

export const w_full = '100%'
const date_width = '20ch'

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const initLabels = (sm: SchemaManager) => {
    sm.traverseSchema(comp => {
        if (typeof comp.label === 'undefined') {
            comp.label = ''
        }
        setInputWidth(comp)
    })
}

export const initInputWidths = (sm: SchemaManager) => {
    sm.traverseSchema(comp => {
        setInputWidth(comp)
    })
}


export const setInputWidth = (comp: IComponent) => {
    if (comp.type === 'date') {
        comp.width = date_width
    } else if (comp.type === 'input' || comp.type === 'select') {
        if (!comp.width && comp.max) {
            let max = comp.max
            if (comp.prefix) max = max + comp.prefix.length + 2
            if (comp.suffix) max = max + comp.suffix.length + 2
            // TODO: temporär
            max = max + 3
            // TODO: temporär
            max = max + 4
            comp.width = `${max}ch`
        }
    }
}

export const cb_single = (label: string, field: string, defaultValue?: boolean): IComponent => ({
    type: 'checkbox',
    default: defaultValue,
    classLayout: 'col-start-2',
    field,
    label,
})


export const label = (text: string | IComponentString, full?: boolean, zus_class?: string, noMargin?: boolean): IComponent => {
    return {
        type: 'label',
        //   classLayout: 'col-start-1 ' + (!noMargin ? 'mt-4 ' : '') + (full ? 'col-span-2 ' : ''),
        classLayout: 'col-start-1 col-label-class-layout' + (full ? ' col-span-2 ' : ''),
        class: 'whitespace-pre-line ' + zus_class,
        label: text
    }
}

export const label_Input = (label: string | IComponentString, field: string, max: number, options?: string[], hidden?: boolean, required?: boolean, datatype?: keyof typeof DataType): IComponent[] => {
    const dataType: keyof typeof DataType =  datatype || 'string'
    return [
        {
            type: 'label',
            name: `lb_${field}`,
            //classLayout: 'col-start-1 mt-4',
            classLayout: 'col-start-1 col-label-class-layout',
            label,
            hidden
        },
        {
            type: 'input',
            field,
            classLayout: 'col-start-2',
            class: 'max-w-full',
            label: '',
            options,
            required,
            dataType,
            max,
            hidden
        },

    ]
}

export const ISO_Date_Format = 'YYYY-MM-DD[T]HH:mm:ss'

export const label_Input_Date_ISO = (label: string | IComponentString, field: string): IComponent[] => {
    return [
        {
            type: 'label',
            name: `lb_${field}`,
            //classLayout: 'col-start-1 mt-4',
            classLayout: 'col-start-1 col-label-class-layout',
            label,
        },
        {
            type: 'date',
            field,
            classLayout: 'col-start-2',
            label: '',
            dateParseFormat: ISO_Date_Format
        },

    ]
}


export const label_cb = (label: string, field: string): IComponent[] => ([
    {
        type: 'label',
        classLayout: 'col-start-1 mb-8',
        label
    },
    {
        type: 'checkbox',
        classLayout: 'col-start-2 col-span-2',
        field
    }
])


export const labelhtml = (text: string): IComponent => {
    return {
        type: 'html',
        classLayout: 'col-start-1 mt-2',
        html: text,
    }
}

export const schemaClassLayout = 'grid grid-cols-form'

export const card_panel = (label: string, name, children: IComponent[]): IComponent => {
    return card_hint_panel(label, name, '', children);
}

export const card_hint_panel = (label: string, name, hint, children: IComponent[]): IComponent => {
    return {
        type: 'card',
        name,
        label,
        hint,
        classLayout: "w-full mt-5",
        children: [
            {
                type: 'panel',
                classLayout: schemaClassLayout,
                class: 'col-span-2',
                children
            }
        ]
    }
}

export const card_expansionspanel = (label: string, name, expanded, children: IComponent[]): IComponent => {
    return card_hint_expansionspanel(label, name, '', expanded, children);
}

export const card_hint_expansionspanel = (label: string, name, hint, expanded, children: IComponent[]): IComponent => {
    return {
        type: 'expansionspanel',
        name,
        label,
        hint,
        expanded,
        classLayout: "w-full mt-5",
        children: [
            {
                type: 'panel',
                classLayout: schemaClassLayout,
                class: 'col-span-2',
                children
            }
        ]
    }
}

export const normal_panel = (name: string, children: IComponent[], hidden?: any, addClassLayout?: string): IComponent => {
    return {
        type: 'panel',
        name: name,
        class: 'col-start-1 col-span-2',
        classLayout: 'col-start-1 col-span-2 ' + schemaClassLayout + (addClassLayout ? ` ${addClassLayout}` : ''),
        children,
        hidden
    }
}

export const switch_panel = (label: string, name, field: string, defaultValue: boolean, children: IComponent[]): IComponent => {
    return switch_hint_panel(label, name, field, defaultValue, '', children)
}

export const switch_hint_panel = (label: string, name, field: string, defaultValue: boolean, hint, children: IComponent[]): IComponent => {
    return {
        type: 'switchpanel',
        field,
        default: defaultValue,
        name,
        label,
        hint,
        classLayout: "w-full mt-5",
        children: [
            {
                type: 'panel',
                classLayout: schemaClassLayout,
                class: 'col-span-2',
                children
            }
        ]
    }
}

export const inputGroup = (children: IComponent[]): IComponent => {
    return inputGroupCL('mr-6', children);
}

export const inputGroupCL = (classLayout: string, children: IComponent[]): IComponent => {
    children.forEach(c => c.classLayout = classLayout);
    return {
        type: 'panel',
        classLayout: 'col-start-2 col-span-1 flex flex-wrap items-center',
        children
    }
}

export const condHideInput = (sm: SchemaManager, field: string, cond: boolean) => {
    const comp = sm.getCompByField(field)
    if (comp) {
        comp.hidden = cond
    }
}

export interface CheckBoxDef { label: string; field: string };
export interface CheckBoxDefOptions {
    required?: boolean | IComponentBoolFunction,
    multipleSelection?: boolean | IComponentBoolFunction,
    additionalClasses?: string | IComponentStringFunction,
    classLayout?: string,
};

export const checkBoxGroup = (checkBoxDefs: CheckBoxDef[], opt: CheckBoxDefOptions = { required: true }): IComponent => {
    const checkBoxes: IComponent[] = []
    checkBoxDefs.forEach((cbd) => {
        checkBoxes.push({
            type: 'checkbox',
            field: cbd.field,
            label: cbd.label,
            default: false,
            onChange(sm, comp, value) { comp.parentComp.onChange(sm, comp, value) },
            classLayout: 'mr-6',
        })
    });
    let parentField = checkBoxDefs.map(cbd => cbd.field).join('_');
    return {
        type: 'panel',
        classLayout: opt.classLayout ? opt.classLayout : 'col-start-2 col-span-1 flex flex-wrap items-center mb-2',
        children: checkBoxes,
        field: parentField,
        required: opt.required,
        class: 'mt-checkbox-group ' + opt.additionalClasses,
        onInit(sm, comp, value) {
            if (sm.Values[comp.field]) {
                comp.class = '';
            }
            else {
                comp.class = 'mt-checkbox-group';
            }
            // this.onChange(sm, comp, value);
        },
        onChange(sm, comp, value) {
            if (value) {
                sm.Values[comp.parentComp.field] = true;
                if (!opt.multipleSelection)
                    comp.parentComp.children.forEach(c => { if (c !== comp) sm.Values[c.field] = false });
                comp.parentComp.class = `${comp.parentComp.class}`.replace(/mt-checkbox-group/g, '');
            }
            else {
                let oneTrue: boolean = comp.parentComp.children.find(c => sm.Values[c.field]) !== undefined;
                if(!opt.multipleSelection || !oneTrue){
                    sm.Values[comp.parentComp.field] = undefined;
                    comp.parentComp.class = 'mt-checkbox-group';
                }
            }
        },
    }
}

export const multiple_checkboxes_with_cust = (fields: string[], labels: string[], field_input: string, max: number, options: string[] = []): IComponent[] => {
    const cbs: IComponent[] = []
    fields.forEach((f, ind) => {

        cbs.push({
            type: 'checkbox',
            field: f,
            label: labels[ind]
        })
    })
    const custom_cb = cbs[cbs.length - 1]
    cbs.push(
        {
            type: 'input',
            hidden(sm) {
                const hidden: boolean = !sm.Values[custom_cb.field]
                if (hidden) sm.Values[field_input] = ''
                return hidden
            },
            max,
            field: field_input,
            options,
        },

    )
    return [inputGroup(cbs)]
}

export const textZusammensetzen = (txt: string, suffix: string, subtext: string) => {
    var ret = '';
    if(txt && subtext)
    {
        ret = txt + suffix + subtext;
    }
    else if(txt)
    {
        ret = txt;
    }
    else if(subtext)
    {
        ret = subtext;
    }
    return ret;
}

export const ScrollIntoView = (el: string) => {
    const q =  document.querySelector(el)
    if (q) q.scrollIntoView();
}

export const hasAllRequired = (sm: SchemaManager): boolean => {
    const mf = { anzahl: 0, filled: 0 }
    sm.GetFormularMussfelder(mf);
    return mf.anzahl == mf.filled;
 }
