import { DokumentStatus } from "../api"
import { IComponent, IComponentProps, SchemaManager } from "../components/bi-formular-engine/src/public-api"
import { card_panel, getBeilage, inputGroup, label, label_cb, label_Input, schemaClassLayout } from "./schema-utils"

const _common_readonly: IComponentProps = { disabled: true, unbound: true }
export const rueckmeldung_vnb = (formularTypGuid: string): IComponent => {
    return card_panel('Rückmeldung', 'rueckmeldung_vnb', [
        schnipsel_bewilligung('Wärmepumpe', 'GERAET_WWP', ['EW_WPBEWILLIGT', 'EW_WPBEWILLIGM', 'EW_WPBEMERK']),
        schnipsel_bewilligung('Energieerzeugungsanlagen', 'GERAET_EEA', ['EW_EEABEWILLIGT', 'EW_EEABEWILLIGTM', 'EW_EEABEMERK']),
        schnipsel_eea('GERAET_EEA'),
        schnipsel_bewilligung('Netzrückwirkung', 'GERAET_NETZR', ['EW_NETZBEWILLIGT', 'EW_NETZBEWILLIGTM', 'EW_NETZBEMERK']),
        schnipsel_bewilligung('Energiespeicher', 'GERAET_BATTERIE', ['EW_ENSPBEWILLIGT', 'EW_ENSPBEWILLIGTM', 'EW_ENSPBEMERK']),
        schnipsel_ensp('GERAET_BATTERIE'),
        schnipsel_bewilligung('Elektrofahrzeuge', 'GERAET_LADEST', ['EW_ELFABEWILLIGT', 'EW_ELFABEWILLIGTM', 'EW_ELFABEMERK']),
        ...schnipsel_unterschrift(),
        ...schnipsel_fileviewer(formularTypGuid),
    ])
}

export const init_rueckmeldung_vnb = (sm: SchemaManager, formularTypGuid: string): void => {
    const comp = sm.getCompByName('rueckmeldung_vnb')

    comp.hidden = sm.formular.status < DokumentStatus.Gesendet
    if (comp.hidden) return

    const beilage = getBeilage(sm, formularTypGuid)
    if (beilage && beilage.dso && beilage.dso.data && beilage.dso.data.length > 0 && beilage.dso.data[0].daten) {
        const werte = JSON.parse(beilage.dso.data[0].daten)

        const schnipsel = sm.getCompByName('rueckmeldung_vnb')
        sm.traverseSchema(comp => {
            if (comp.field && comp.unbound) {
                sm.MemValues[comp.field] = werte[comp.field]
            }

        }, null, schnipsel)
    }
}

const schnipsel_Hidden = (field: string) => (sm: SchemaManager) => {
    const c = sm.getCompByField(field)
    if (c) {
        return !sm.getValue(c)
    } else {
        return true
    }
}

const schnipsel_bewilligung = (titel: string, switchfield: string, felder: string[]): IComponent => {
    return {
        type: 'panel',
        class: 'w-full col-start-1 col-span-2',
        classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
        hidden: schnipsel_Hidden(switchfield),
        children: [
            label(titel, true, 'font-bold'),
            ...label_cb('bewilligt', felder[0], { ..._common_readonly,  }),
            ...label_cb('bewilligt mit Massnahmen', felder[1], { ..._common_readonly }),
            ...label_Input('Bemerkungen', felder[2], 100, { ..._common_readonly, hidden: schnipsel_Hidden(felder[1]), multiline: true, rows: 2 }),
        ]
    }
}

const schnipsel_eea = (switchfield: string): IComponent => {
    return {
        type: 'panel',
        class: 'w-full col-start-1 col-span-2',
        classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
        hidden: schnipsel_Hidden(switchfield),
        children: [
            ...label_Input('cos', 'EW_EEACOS', 10, { ..._common_readonly }),
            ...label_Input('Andere', 'EW_EEAANDERE', 25, { ..._common_readonly }),
        ]
    }
}


const schnipsel_ensp = (switchfield: string): IComponent => {
    return {
        type: 'panel',
        class: 'w-full col-start-1 col-span-2',
        classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
        hidden: schnipsel_Hidden(switchfield),
        children: [
            ...label_Input('Rundsteuerfrequenz VNB', 'EW_RUNDSTEUERFREQ', 10, { ..._common_readonly }),
            ...label_Input('Kurzschlussleistung am Verknüpfungspunkt SkV', 'EW_KURZSCHLLEIST', 10, { ..._common_readonly }),
            ...label_Input('Anlagenleistiung SA', 'EW_ANLEIST', 10, { ..._common_readonly }),
            ...label_Input('Bemerkungen', 'EW_BEM', 100, { ..._common_readonly, multiline: true, rows: 2 }),
        ]
    }
}



const schnipsel_fileviewer = (formularTypGuid: string): IComponent[] => {
    return [
        {
            type: 'fileuploader', label: 'Rückmeldung von VNB hochladen',
            classLayout: 'col-start-1 col-span-2',
            fileUploaderProps: {
                documentTypes: ['pdf'],
                dokumentDefGuid: formularTypGuid,
                uploadType: 'Beilage',
            }
        },
        {
            type: 'fileviewer',
            classLayout: 'col-start-1 col-span-2',
            style: 'height: 1050px; width: 95%',
            fileViewerProps: {
                dokumentDefGuid: formularTypGuid,
                uploadType: 'Beilage',
            },
        }
    ]
}

const schnipsel_unterschrift = (): IComponent[] => {
    return [
        label('Unterschrift VNB', true, 'font-bold'),
        inputGroup([
            { type: 'date', hint: 'Datum', field: 'EW_SIGNDAT', ..._common_readonly },
            { type: 'input', hint: 'Unterschrift', field: 'EW_SIGN', max: 30, ..._common_readonly },
        ])
    ]
}
