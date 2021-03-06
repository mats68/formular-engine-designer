import { EAktionDTO, EAnlageDTO, EAuftragPhaseDTO, DokumentStatus, ELeistungDTO, EProjektDTO, AktionsDefDTO, DokumentDefDTO, EmpfaengerKatDTO } from "../api"
import { BeilageWrapper } from "./Beilage";

export const CAnlageColTitelWidth = 300
export const CAnlageColWidth = 250

export class ProjektPhaseWrapper {
    public titel: string;
    public phase: EAuftragPhaseDTO;
    public projekt: EProjektDTO;
    public empfaenger?: EmpfaengerWrapper[];
    public anlagen?: AnlageWrapper[];
    public expanded?: boolean;
    constructor() {
    }
}

export class EmpfaengerWrapper {
    public empfaengerKat: EmpfaengerKatDTO
    public aktionen: AktionsWrapper[] = []
}

export class AnlageWrapper {
    public titel: string
    public anlage: EAnlageDTO
    public aktionen: AktionsWrapper[] = []
}

export interface IUploadFile {
    aktionsWrapper: AktionsWrapper
    file: File
}

export class AktionsWrapper {
    // public aktion_guid: string
    public anlage_guid: string
    public projekt: EProjektDTO
    public leistung: ELeistungDTO
    public aktion: EAktionDTO
    public aktionDef: AktionsDefDTO
    public dateititel: string
    public dateiname: string
    public typ: AktionsTyp
    public aktionsDefGuid: string
    public status: DokumentStatus
    public sendeDatum?: Date
    public beilageDefs: BeilageWrapper[] = []
}

export enum AktionsTyp {
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
    //         return 'Erhalt best??tigt'
    //     } else if (status === FormularStatus.Bewilligt) {
    //         return 'Bewilligt'
    //     } else if (status === FormularStatus.BewilligtMitMassnahmen) {
    //         return 'Bewilligt mit Massnahmen'
    //     } else if (status === FormularStatus.Abgelehnt) {
    //         return 'Abgelehnt'
    //     }
    //     return ''
    // },
    EmptyStatus(status: DokumentStatus): boolean {
        return status === DokumentStatus.Undefiniert
    },
    gridStyleAnlage(anlage: AnlageWrapper): string {
        const arr: string[] = anlage.aktionen.map(_ => CAnlageColWidth.toString() + 'px')
        arr.unshift(CAnlageColTitelWidth.toString() + 'px')
        return 'grid-template-columns: ' + arr.join(' ')
    },
    widthStyleAnlage(anlage: AnlageWrapper): string {
        const w = (anlage.aktionen.length * CAnlageColWidth) + CAnlageColTitelWidth + 30
        return `width: ${w}px`
    }



}


export enum Key { Enter = 0x0D, Ctrl = 0x11, Shift = 0x10 }
export class KeyPressing {
	static _keyPresseds = [];
	static _init() {
		document.addEventListener('keydown', (e) => {
			const keyCode = e.keyCode;
			if (KeyPressing._keyPresseds.includes(keyCode) == false) {
				KeyPressing._keyPresseds.push(keyCode)
			}
		})
		document.addEventListener('keyup', (e) => {
			const keyCode = e.keyCode;
			if (KeyPressing._keyPresseds.includes(keyCode) == true) {
				const index = KeyPressing._keyPresseds.indexOf(keyCode);
				if (index !== -1) {
					KeyPressing._keyPresseds.splice(index, 1);
				}
			}
		})
	}
	static isKeyPressed(keyCode): boolean {
		return KeyPressing._keyPresseds.includes(keyCode)
	}

	static areSpecialKeysPressed(): boolean {
		return KeyPressing.isKeyPressed(Key.Shift) && KeyPressing.isKeyPressed(Key.Ctrl);
	}
}
KeyPressing._init();
