import { EAktionDTO, EAnlageDTO, EAuftragPhaseDTO, EFormularStatus, ELeistungDTO, EProjektDTO } from "../api"
import { FormBeilageDef } from "../services"

export const CAnlageColTitelWidth = 300
export const CAnlageColWidth = 250

export class ProjektPhase {
    public titel: string
    public phase: EAuftragPhaseDTO
    public projekt: EProjektDTO
    public empfaenger?: ProjektPhaseEmpfaenger[]
    public anlagen?: ProjektPhaseAnlage[]
    public expanded?: boolean
    constructor() {
    }
}

export class ProjektPhaseEmpfaenger {
    public empfaenger: string
    public dateien: ProjektPhaseDatei[]
    constructor() {
        this.dateien = []
    }
}

export class ProjektPhaseAnlage {
    public titel: string
    public anlage: EAnlageDTO
    public dateien: ProjektPhaseDatei[]
    constructor() {
        this.dateien = []
    }
}

export interface IUploadFile {
    datei: ProjektPhaseDatei
    file: File
}

export class ProjektPhaseDatei {
    // public aktion_guid: string
    public anlage_guid: string
    public projekt: EProjektDTO
    public leistung: ELeistungDTO
    public aktion: EAktionDTO
    public dateititel: string
    public dateiname: string
    public typ: ProjektPhaseDateiTyp
    public formulartyp_guid: string
    public status: EFormularStatus
    public sendeDatum?: Date
    public beilagen: FormBeilageDef[]

    constructor() {
        this.beilagen = []
    }
}

export enum ProjektPhaseDateiTyp {
    Formular = 1,
    pdf = 2,
    Formular_oder_pdf = 3,
}

//Formular Status
//Icons https://xd.adobe.com/view/aa8a6fbd-65f3-4669-90a6-c00579a20238-ffd9/screen/a634f81b-a49b-4de3-a42c-b7c95df0c8dd/specs/

export const ProjektPhaseFn = {
    // ProjektPhaseDateiStatusToText(status: FormularStatus): string {
    //     if (status === FormularStatus.Leer) {
    //         return ''
    //     } else if (status === FormularStatus.InBearbeitung) {
    //         return 'In Bearbeitung'
    //     } else if (status === FormularStatus.Signiert) {
    //         return 'Signiert'
    //     } else if (status === FormularStatus.TeilSigniert) {
    //         return 'Teilsigniert'
    //     } else if (status === FormularStatus.Verschickt) {
    //         return 'Verschickt'
    //     } else if (status === FormularStatus.ErhaltBestaetigt) {
    //         return 'Erhalt bestätigt'
    //     } else if (status === FormularStatus.Bewilligt) {
    //         return 'Bewilligt'
    //     } else if (status === FormularStatus.BewilligtMitMassnahmen) {
    //         return 'Bewilligt mit Massnahmen'
    //     } else if (status === FormularStatus.Abgelehnt) {
    //         return 'Abgelehnt'
    //     }
    //     return ''
    // },
    EmptyStatus(status: EFormularStatus): boolean {
        return status === EFormularStatus.Undefiniert
    },
    gridStyleAnlage(anlage: ProjektPhaseAnlage): string {
        const arr: string[] = anlage.dateien.map(_ => CAnlageColWidth.toString() + 'px')
        arr.unshift(CAnlageColTitelWidth.toString() + 'px')
        return 'grid-template-columns: ' + arr.join(' ')
    },
    widthStyleAnlage(anlage: ProjektPhaseAnlage): string {
        const w = (anlage.dateien.length * CAnlageColWidth) + CAnlageColTitelWidth + 30
        return `width: ${w}px`
    }



}


