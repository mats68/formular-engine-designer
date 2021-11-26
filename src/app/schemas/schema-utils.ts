import { IComponent, IComponentBoolFunction, IComponentProps, IComponentString, IComponentStringFunction, ISelectOptionItemsFunction, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
// import { adress_suche_fn, adress_suche_panel } from './panel-adress-suche';
import { FormularStatusText, IProjektAbschnitt, SignaturDef } from '../services';
import { Router } from '@angular/router';
import { EAktionDTO, DokumentBeilageLinkDTO, DokumentDTO, DokumentStatus, EProjektDTO, IdentityContextDTO, DokumentTransferHistoryDTO, DokumentTransferKanal, TransferTyp, ApiModule, SignaturDTO, EmpfaengerDTO, TransferKanal, EGeraetDTO } from '../api';
import { DomSanitizer } from '@angular/platform-browser';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { asGuid, Guid } from '../tools/Guid';
// import { timeStamp } from 'console';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import * as moment from 'moment';
import { SignatureRole } from '../services/projekt/signatureRole';
import { BehaviorSubject } from 'rxjs';
// import { Rollen } from '@next-gen/berechtigungen';
import { Component } from '@angular/core';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { S } from '@angular/cdk/keycodes';
// import { Schema } from 'inspector';
import { setMaxListeners } from 'process';

export const w_full = '100%'
const date_width = '20ch'

export const validateEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export const initLabels = (sm: SchemaManager) => {
	sm.traverseSchema(comp => {
		if (typeof comp?.label === 'undefined') {
			comp.label = ''
		}
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
	} else if (comp.type === 'input' || comp.type === 'select' || comp.type === 'lookup') {
		if(comp.dataType === 'int')
		{
			// Wenn noch kein max oder width gesetzt wird, dann bei INT-Feldern immer 6-Zeichen verwenden
			if(!comp.width && !comp.max)
			{
				comp.max = 6;
			}
		}
		else if(comp.dataType === 'float')
		{
			// Wenn noch kein max oder width gesetzt wird, dann bei Float-Feldern immer 8-Zeichen verwenden
			if(!comp.width && !comp.max)
			{
				comp.max = 8;
			}
		}

		if (!comp.width && comp.max) {
			let max = comp.max
			if (max > 20) {
				comp.width = w_full
			} else {
				if (comp.prefix) max = max + comp.prefix.length
				if (comp.suffix) max = max + 3
				// TODO: temporär
				max = max + 3
				// TODO: temporär
				max = max + 4
				if (comp.type === 'input' && typeof comp.options !== 'undefined') max = max + 3
				comp.width = `${max}ch`
			}
		}
	}
}

export const initFileUploader = (sm: SchemaManager, router: Router, sanitizer: DomSanitizer) => {
	sm.traverseSchema(comp => {
		if (comp.type === 'fileuploader') {
			comp.fileUploaderProps.router = router
		} else if (comp.type === 'fileviewer') {
			comp.fileViewerProps.sanitizer = sanitizer
		}

	})
}


export const cb_single = (label: string, field: string, defaultValue?: boolean): IComponent => ({
	type: 'checkbox',
	default: defaultValue,
	classLayout: 'col-start-2',
	field,
	label,
})

export const cb_single_tr = (key_tr: string, field: string, defaultValue?: boolean): IComponent => ({
	type: 'checkbox',
	default: defaultValue,
	classLayout: 'col-start-2',
	field,
	label: { translation: { key: marker(key_tr) } },
})


export const label_tr = (key_tr: string, full?: boolean, zus_class?: string, noMargin?: boolean, props?: IComponentProps): IComponent => {
	const p: IComponentProps = props || {}
	return {
		type: 'label',
		classLayout: 'col-start-1 col-label-class-layout' + (full ? ' col-span-2 ' : ''),
		class: 'whitespace-pre-line ' + zus_class,
		label: { translation: { key: marker(key_tr) } },
		...p,
	}
}


export const label = (text: string | IComponentString, full?: boolean, zus_class?: string, noMargin?: boolean, props?: IComponentProps): IComponent => {
	const p: IComponentProps = props || {}
	return {
		type: 'label',
		//   classLayout: 'col-start-1 ' + (!noMargin ? 'mt-4 ' : '') + (full ? 'col-span-2 ' : ''),
		classLayout: 'col-start-1 col-label-class-layout' + (full ? ' col-span-2 ' : ''),
		class: 'whitespace-pre-line ' + zus_class,
		label: text,
		...p,
	}
}

export const label_Input = (label: string | IComponentString, field: string, max: number, props?: IComponentProps): IComponent[] => {
	const p: IComponentProps = props || {}
	return [
		{
			type: 'label',
			name: `lb_${field}`,
			classLayout: 'col-start-1 col-label-class-layout',
			label,
			hidden: p.hidden
		},
		{
			type: 'input',
			field,
			classLayout: 'col-start-2',
			class: 'max-w-full',
			label: '',
			max,
			...p,
		},

	]
}

export const label_Input_Date = (label: string | IComponentString, field: string, required?: boolean): IComponent[] => {
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
			required,
			label: ''
		},
	]
}

export const label_cb = (label: string, field: string, props?: IComponentProps): IComponent[] => {
	const p: IComponentProps = props || {}
	return [
		{
			type: 'label',
			classLayout: 'col-start-1 mb-8',
			label,
			hidden: p.hidden
		},
		{
			type: 'checkbox',
			classLayout: 'col-start-2 col-span-2',
			field,
			...p
		}
	]
}

export const label_cb_tr = (key_tr: string, field: string, props?: IComponentProps): IComponent[] => {
	const res = label_cb('', field, props)
	res[0].label = { translation: { key: marker(key_tr) } }
	return res
}


export const labelhtml = (text: string, full: boolean = false): IComponent => {
	return {
		type: 'html',
		classLayout: 'col-start-1 mt-2' + (full ? ' col-span-2 ' : ''),
		html: text,
	}
}

export const options_tr = (keys: string[], values?: number[]): ISelectOptionItemsFunction => {
	if (values) {
		return (sm) => {
			return keys.map((key, ind) => {
				return { value: values[ind], text: tr_string(sm, key) }
			})
		}
	} else {
		return (sm) => {
			return keys.map(key => {
				if (key) {
					return tr_string(sm, key)
				} else {
					return ''
				}
			})
		}

	}
}


export const schemaClassLayout = 'grid grid-cols-form'

export const card_panel = (label: string | IComponentStringFunction | IComponentString, name, children: IComponent[], hidden?): IComponent => {
	return card_hint_edit_panel(label, name, '', null, children, hidden);
}

export const card_hint_panel = (label: string | IComponentStringFunction | IComponentString, name, hint, children: IComponent[], hidden?): IComponent => {
	return card_hint_edit_panel(label, name, hint, null, children, hidden);
}

export const card_edit_panel = (label: string | IComponentStringFunction | IComponentString, name, editProjektAbschnitt: IProjektAbschnitt, children: IComponent[], hidden?): IComponent => {
	return card_hint_edit_panel(label, name, '', editProjektAbschnitt, children, hidden);
}

export const card_hint_edit_panel = (label: string | IComponentStringFunction | IComponentString, name, hint, editProjektAbschnitt: IProjektAbschnitt|null, children: IComponent[], hidden?): IComponent => {
	const card: IComponent = {
		type: 'card',
		name,
		label,
		hint,
		classLayout: "w-full mt-5",
		istAbschnitt: true,
        hidden,
		children: [
			{
				type: 'panel',
				classLayout: schemaClassLayout,
				class: 'col-span-2',
				children
			}
		]
	};
	if(editProjektAbschnitt){
		card.icon = 'edit';
		card.color = 'primary';
		card.onClick = (sm) => {
			if(editProjektAbschnitt === 'adressen'){
				sm.service.editDialogAdressen(() => sm.Schema.initFormular(sm));
			}
			else if(editProjektAbschnitt === 'auftrag'){
				sm.service.editDialogAuftrag(() => sm.Schema.initFormular(sm));
			}
			else if(editProjektAbschnitt === 'gebaude'){
				sm.service.editDialogGebaeude(() => sm.Schema.initFormular(sm));
			}
			else if(editProjektAbschnitt === 'empfaenger'){
				sm.service.editDialogEmpfaenger(() => sm.Schema.initFormular(sm));
			}
			else if(editProjektAbschnitt === 'anlage'){
				const anlage = sm.service.GetAnlage(sm.projekt, sm.dokumentDTO?.guid);
				// sm.service.editDialogAnlage(() => sm.Schema.initFormular(sm), anlage);
			}
		};
	}

	return card;
}

export const card_expansionspanel = (label: string | IComponentStringFunction |IComponentString, name, expanded, children: IComponent[]): IComponent => {
	return card_hint_expansionspanel(label, name, '', expanded, children);
}

export const card_hint_expansionspanel = (label: string | IComponentStringFunction | IComponentString, name, hint, expanded, children: IComponent[]): IComponent => {
	return {
		type: 'expansionspanel',
		name,
		label,
		hint,
		expanded,
		istAbschnitt: true,
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
		istAbschnitt: true,
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



// Korrektes Senden-Panel verwenden
export const erstelleSendenPanel = async (sm: SchemaManager, name): Promise<IComponent> => {
	let transferKanal = TransferKanal.Undefiniert as TransferKanal;
	let empf = sm.Schema.empfaenger;
	if(empf) {
		transferKanal = empf.transferKanal;
	}

	switch (transferKanal) {
		case TransferKanal.M20: {
			return senden_panel_m2(sm, name);
			break;
		}
		case TransferKanal.EMail:
		case TransferKanal.Papier:
		default: {
			return senden_panel(sm, name, empf);
			break;
		}
	}
}

// Panel für den Sendeabschnitt eines Papierformulars
export const senden_panel = (sm: SchemaManager, name, empfaenger:EmpfaengerDTO): IComponent => {
	let components: IComponent[] = [
		{ type: 'label', label: sm.translate(marker('panel_senden.text_formular_drucken')), classLayout: 'col-span-2' },
		{
			type: 'panel',
			children: [
				{
					type: 'button', kind: 'raised', label: 'Download', icon: 'file_download',
					disabled(sm) { return false },
					onGetClass(sm, comp, def, name) {
						if (sm.formularStatus === DokumentStatus.SigniertGesperrt && !istNachUnterschriftGedruckt(sm)) {
							comp.color = 'primary';
							return def;
						}
						comp.color = '';
						if (name === 'icon' || name === 'text') {
							return `${def} primary-color2`;
						}
						return def;
					},
					async onClick(sm, comp) {
						try {
							sm.getCompByName('formular_download').loading = true;
							const pdfFileName = sm.service.getProjektTitel(sm.projekt).trim() + ', ' + sm.Schema.iconText;
							await sm.Schema.PrintFormular(true);
							// sm.service.DownloadFormular(sm.dokumentDTO, pdfFileName);
							const th: DokumentTransferHistoryDTO = {
								mandant: sm.dokumentDTO.mandant,
								dokument: sm.dokumentDTO.guid,
								typ: TransferTyp.Druck,
								kanal: sm.dokumentDTO.antwortKanal,
								absender: sm.service.CurIdentity.holding,
								empfaenger: null,
								timestamp: moment.utc().toISOString(),
							}
							sm.formular.addTransferHistory(th);
						} catch (error) {
							console.error(error);
						}
						finally {
							sm.getCompByName('formular_download').loading = false;
						}
					}
				},
				{ type: 'spinner', name: 'formular_download', diameter: 20 },
			]
		},
		{ type: 'label', label: sm.translate(marker('panel_senden.text_formular_senden')), classLayout: 'col-span-2 mt-4' },
		{ type: 'label', label: empfaenger ? textZusammensetzen(empfaenger.firma1, " ", empfaenger.firma2) : '', classLayout: 'col-span-2 mt-4 font-bold' },
		// {
		// 	type: 'panel',
		// 	hidden: !empfaenger /*|| istStringLeer(empfaenger.email)*/,
		// 	// hidden: !empfaenger || istStringLeer(empfaenger.email),
		// 	children: [
		// 		{ type: 'label', label: sm.translate(marker('panel_senden.text_formular_senden_mail')), classLayout: 'col-span-2' },
		// 		{ type: 'label', label: empfaenger && !istStringLeer(empfaenger.email) ? empfaenger.email : '-', classLayout: 'col-span-2 mt-2' },
		// 	]
		// },
		{
			type: 'panel',
			hidden: !empfaenger || istStringLeer(textZusammensetzen(empfaenger.adresse, " ", empfaenger.adrzusatz)),
			children: [
				// { type: 'label', label: sm.translate(marker('panel_senden.text_formular_senden_post')), classLayout: 'col-span-2' },
				{ type: 'label', label: empfaenger ? textZusammensetzen(empfaenger.adresse, " ", empfaenger.adrzusatz) : '', classLayout: 'col-span-2' },
				{ type: 'label', label: empfaenger ? textZusammensetzen(empfaenger.plz, " ", empfaenger.ort) : '', classLayout: 'col-span-2' },
			]
		},
		{ type: 'label', label: sm.translate(marker('panel_senden.text_formular_gesendet2')), classLayout: 'col-span-2 mt-4' },
		{
			type: 'button', kind: 'raised', label: sm.translate(marker('panel_senden.btn_formular_gesendet')), icon: 'send',
			onGetClass(sm, comp, def, name) {
				if (sm.formularStatus === DokumentStatus.SigniertGesperrt && istNachUnterschriftGedruckt(sm)) {
					comp.color = 'primary';
					return def;
				}
				comp.color = '';
				if (name === 'icon' || name === 'text') {
					return `${def} primary-color2`;
				}
				return def;
			},
			onClick(sm, comp) {
				// Bei Versand (Papier) wird ein "Versand"-Eintrag gesetzt jedoch kein Empfänger geschrieben
				const th: DokumentTransferHistoryDTO = {
					mandant: sm.dokumentDTO.mandant,
					dokument: sm.dokumentDTO.guid,
					typ: TransferTyp.Versand,
					kanal: sm.dokumentDTO.antwortKanal,
					absender: sm.service.CurIdentity.holding,
					empfaenger: null,
					timestamp: moment.utc().toISOString(),
				}
				sm.formular.addTransferHistory(th);
				sm.saveStatus(DokumentStatus.Gesendet);
				gesendetLabelErstellen(sm);
			},
			onChange(sm, comp) {
				if (istSigniert(sm) && !istGesendet(sm))
					comp.color = 'primary';
				else
					comp.color = '';
			},
			disabled(sm) { return !istSigniert(sm) || istGesendet(sm) },
		},
	];

	let gesendet = gesendetLabelErstellen(sm);

	if(gesendet) components.push(gesendet);

	return card_panel(sm.translate(marker('panel_senden.titel')), name, components, (sm: SchemaManager) => (!istSigniert(sm)));
}

// Panel für den Sendeabschnitt eines M2-Formulars
export const senden_panel_m2 = (sm: SchemaManager, name): IComponent => {
	let components: IComponent[] = [
		{ type: 'label', label: sm.translate(marker('panel_senden_m2.text_formular_senden')), classLayout: 'col-span-2 mt-4' },
		{
			type: 'panel',
			classLayout: `w-full flex flex-wrap items-center content-center`,
			children: [
				{
					type: 'button', kind: 'raised', label: sm.translate(marker('panel_senden.titel')), icon: 'send',
					onGetClass(sm, comp, def, name) {
						if (sm.formularStatus === DokumentStatus.SigniertGesperrt) {
							comp.color = 'primary';
							return def;
						}
						comp.color = '';
						if (name === 'icon' || name === 'text') {
							return `${def} primary-color2`;
						}
						return def;
					},
					async onClick(sm, comp) {
						try {
							sm.getCompByName('senden_spinner').loading = true;
							let phase = sm.projekt.auftrag.phasen.find(ph => ph.leistungen.find(l => l.aktionen.find(a => Guid.equals(a.dokument?.guid, sm.dokumentDTO.guid))))
							let leistung = phase?.leistungen.find(l => l.aktionen.find(a => Guid.equals(a.dokument?.guid, sm.dokumentDTO.guid)));

							await sm.service.SendFormular(leistung.empfaenger, sm.dokumentDTO);
							await sm.saveStatus(DokumentStatus.Gesendet);
							gesendetLabelErstellen(sm);
						}
						catch (e) {
							alert(JSON.stringify(e));
						}
						finally {
							sm.getCompByName('senden_spinner').loading = false;
						}
					},
					onChange(sm, comp) {
						if (istSigniert(sm) && !istGesendet(sm))
							comp.color = 'primary';
						else
							comp.color = '';
					},
					disabled(sm) { return !istSigniert(sm) || istGesendet(sm) },
				},
				{ type: 'spinner', name: 'senden_spinner', diameter: 20 },
			],
		},
	];

	let gesendet = gesendetLabelErstellen(sm);

	if(gesendet) components.push(gesendet);

	return card_panel(sm.translate(marker('panel_senden.titel')), name, components, (sm: SchemaManager) => (!istSigniert(sm)));
}

// Label für gesendetes Formular erstellen (Es wird der letzte Zeitpunkt des Sendens angezeigt)
export const gesendetLabelErstellen = (sm: SchemaManager): IComponent => {
	let letztesSenden = null;
	if(sm.dokumentDTO.transferHistory)
	{
		for(let tf of sm.dokumentDTO.transferHistory)
		{
			if(tf.typ !== TransferTyp.Versand) continue;

			let timestamp = moment.parseZone(tf.timestamp, moment.ISO_8601, true).unix();
			if(letztesSenden < timestamp) letztesSenden = timestamp;
		}
	}

	if(letztesSenden)
	{
		let letztesSendenMoment: moment.Moment = moment.unix(letztesSenden);
		let lblText = sm.translate(marker('panel_senden.text_formular_gesendet')) + letztesSendenMoment.format('DD.MM.YYYY') + ')';

		let labelGesendet = sm.getCompByName('LbGesendet');
		if(labelGesendet)
		{
			labelGesendet.label = lblText;	// Nur Text setzen wenn Label schon vorhanden
			return null;
		}
		else
			return { type: 'label', label: lblText, name: 'LbGesendet',  classLayout: 'col-span-2 mt-4'};
	}
	else
	{
		return { type: 'label', label: '', name: 'LbGesendet', classLayout: 'col-span-2 mt-4'};
	}
}

// Panel für Antwort bei Meldeformularen
export const antwort_meldefomrulare_panel = (sm: SchemaManager, name, form_guid: string): IComponent => {
	return card_panel(sm.translate(marker('panel_antwort.titel_papier')), name, [
		{ type: 'label', label: sm.translate(marker('panel_antwort.text_formularantwort_upload')), classLayout: 'col-span-2' },
		{
			type: 'fileuploader', label: sm.translate(marker('panel_antwort.text_formularantwort_upload_pdf')), classLayout: 'mt-4 col-span-2',
			disabled(sm: SchemaManager) { return false },
			field: 'MELDEFORMULAR_ANTWORT_HOCHGELADEN',
			fileUploaderProps: {
				documentTypes: ['pdf'],
				dokumentDefGuid: form_guid,
				uploadType: 'Antwort',
			},
		},
		{ type: 'label', label: sm.translate(marker('panel_antwort.text_formularantwort')), classLayout: 'col-span-2', hidden(sm) { return !hasBeilage(sm, form_guid) }, },
		{
			type: 'radiogroup',
			options: [sm.translate(marker('panel_antwort.antwort_status_ok')), sm.translate(marker('panel_antwort.antwort_status_nok'))],
			required: false,
			disabled(sm) {
				const res = !hasBeilage(sm, form_guid);
				return res;
			},
			classLayout: 'w-max mb-6',
			field: 'MELDEFORMULAR_ANTWORT',
			onChange(sm, c, v) {
				sm.setValues([
					'MELDEFORMULAR_BEWILLIGT',
					'MELDEFORMULAR_ABGELEHNT'
				], [
					v === sm.translate(marker('panel_antwort.antwort_status_ok')),
					v === sm.translate(marker('panel_antwort.antwort_status_nok')),
				]);
				if (v === sm.translate(marker('panel_antwort.antwort_status_ok')))
					sm.saveStatus(DokumentStatus.Bewilligt);
				else if (v === sm.translate(marker('panel_antwort.antwort_status_nok')))
					sm.saveStatus(DokumentStatus.Abgelehnt);
			},
		},
		{ type: 'label', field: 'MELDEFORMULAR_BEWILLIGT', hidden: true },
		{ type: 'label', field: 'MELDEFORMULAR_ABGELEHNT', hidden: true },
	],
    (sm: SchemaManager) => (!istGesendet(sm))
    );
}

// Panel mit den Unterschriftsfeldern
export const unterschrifts_panel_klein = async (sm: SchemaManager, name: string, signaturDef: SignaturDef, mitOrt: boolean, anz: number, addClassLayout?: string): Promise<IComponent> => {
	let darfSignieren = await kannSignieren(sm, signaturDef);
	let classSignColStart = 'col-start-' + anz + ' mr-2';

	return {
		type: 'panel',
		name: name,
		class: classSignColStart + ' col-span-1',
		classLayout: classSignColStart + ' col-span-1 ' + (addClassLayout ? ` ${addClassLayout}` : ''),
		//hidden: false,
		children: [
			label(signaturDef.titel, true, 'font-bold'),
			{
				type: 'panel',
				class: 'col-start-1',
				classLayout: 'col-start-1',
				// classLayout: 'flex flex-wrap items-center',
				children: [
					{
						type: 'label',
						label: sm.translate(marker('panel_signaturen.text_ort')),
						hidden: !mitOrt,
					},
					{
						type: 'input',
						name: 'Ort-' + signaturDef.signaturKey,
						dataType: 'string',
						field: signaturDef.ortFeld,
						max: 30,
						hidden: !mitOrt,
						width: w_full,
					},
					{
						type: 'button', kind: 'raised', color: 'primary', label: sm.translate(marker('panel_signaturen.titel')),
						async onClick(sm) {
							try {
								const service = sm.service;
								sm.validateAll();
								if (sm.Errors.length === 0) {
									// Unterschrift auf GUI setzen
									const nameComp = sm.getCompByName('Name-' + signaturDef.signaturKey);
									if (nameComp) {
										let cic: IdentityContextDTO = service.CurIdentity;
										nameComp.label = `${cic.mitarbeiterVorname} ${cic.mitarbeiterNachname}`;
									}

									let ort: string = '';
									if (mitOrt) {
										const ortComp = sm.getCompByName('Ort-' + signaturDef.signaturKey);
										if(ortComp){
											const ortComp1 = sm.getCompByField(signaturDef.ortFeld);
											if(ortComp1 && sm.Values[signaturDef.ortFeld])
												ort = sm.Values[signaturDef.ortFeld];
											else{
												const gs = await sm.service.CurGeschStelle()
												ort = gs.ort;
											}
											sm.setValue(signaturDef.ortFeld, ort);
										}
									}

									const dateComp = sm.getCompByName('Date-' + signaturDef.signaturKey);
									if(dateComp){
										dateComp.label = formatiereDatum(moment().toISOString());
									}

									let cic: IdentityContextDTO = service.CurIdentity;
									const sg: SignaturDTO = {
										mandant: sm.dokumentDTO.mandant,
										dokument: sm.dokumentDTO.guid,
										mitarbeiter: cic.mitarbeiter,
										geschStelle: cic.geschaeftsstelle,
										timestamp: moment.utc().toISOString(),
										signaturKey: signaturDef.signaturKey,
										ort: ort,
									}
									sm.formular.addSignature(sg);

									sm.saveStatus(DokumentStatus.SigniertGesperrt);
									// sm.DisableAll();
								}

							} catch (error) {
								console.error(error);
							}
						},
						disabled(sm) {
							return !darfSignieren;
                        },
						hidden(sm) { return istSigniert(sm, signaturDef) || istGesendet(sm) },
					},
				]
			},
			await unterschrift_status(sm, signaturDef), // Ist nur sichtbar nach dem Unterschreiben
		]
	}
}

// Sämtliche Unterschriftspanels eines Formulars erstellen
export const erstelleUnterschriftspanel = async (sm: SchemaManager, signaturDefs: SignaturDef[], mitOrt: boolean, transferKanal: TransferKanal): Promise<IComponent> => {
	let ret = { type:'div', children: [], classLayout: 'col-span-3',  style: 'display: grid; grid-template-columns: 25% 25% 25% 25%;' } as IComponent;
	let anz = 1;
	for(let sign of signaturDefs)
	{
		let name = 'unterschrift_' + sign.titel;
		let panel: IComponent;

		panel = await unterschrifts_panel_klein(sm ,name, sign, mitOrt, anz);

		// switch(transferKanal)
		// {
		// 	// Hier sind noch die komischen Werte welche noch korrigiert werden
		// 	case TransferKanal.M20: {
		// 		panel = await unterschrifts_panel_klein(sm ,name, sign, mitOrt, anz);
		// 		break;
		// 	}
		// 	case TransferKanal.EMail:
		// 	case TransferKanal.Papier:
		// 	default:
		// 	{
		// 		panel = await unterschrifts_panel_gross(sm ,name, sign, mitOrt);	// Aktuell immer Papier verwenden, wenn nicht mit M2-GUID
		// 		break;
		// 	}
		// }

		ret.children.push(panel);
		anz++;
	}
	return ret;
}

export const unterschrift_status = async (sm: SchemaManager, signaturDef: SignaturDef) => {

	const maGuid = sm.dokumentDTO.signaturen?.find(sig => sig.signaturKey === signaturDef.signaturKey)?.mitarbeiter;
	const curma = await sm.service.CurMitarbeiter()
	const ma = maGuid ? (maGuid === curma?.guid ? curma : await sm.service.GetMitarbeiter(maGuid)) : undefined;

	return <IComponent>{
		type: 'panel',
		children: [
			flexGroup('', [
				{
					type: 'html',
					html: '<img src=\"/assets/icons/signatur_done.svg\"/>'
				},
				{
					type: 'label',
					label: sm.translate(marker('panel_signaturen.text_signature_done')),
					class: 'ml-1',
				},
			]),
			{
				type: 'label',
				label: sm.translate(marker('panel_signaturen.text_signature_ok')),
			},
			inputGroupCL('', [
				{ type: 'label', name: 'Name-' + signaturDef.signaturKey, classLayout: '', label: `${ma?.vorname} ${ma?.name}`},
				{ type: 'label', label: ','},
				{ type: 'label', name: 'Date-' + signaturDef.signaturKey, dataType: 'date', classLayout: 'ml-2', label(sm){
					return moment(sm.dokumentDTO.signaturen.find(sig => sig.signaturKey === signaturDef.signaturKey).timestamp).format('DD.MM.YYYY');
				}},
			 ]),
		],
		hidden(sm) { return !istSigniert(sm, signaturDef)},
	};
}

// Panel für sämtliche unterschriften eines Formulars
export const unterschriften_panel = async (sm:SchemaManager, name: string, hint: string, signaturen: SignaturDef[], mitOrt: boolean = true): Promise<IComponent> => {
	let transferKanal = TransferKanal.Undefiniert as TransferKanal;
	let empf = await sm.Schema.empfaenger;
	if(empf)
		transferKanal = empf.transferKanal;

	let kannMin1Signieren = false;
	for(let signDef of sm.Schema.signaturen)
	{
		if(await kannSignieren(sm, signDef))
		{
			kannMin1Signieren = true;
			break;
		}
	}

	return card_hint_panel(sm.translate(marker('panel_signaturen.titel')), name, hint, [
		{	// verschachtelte Panels, weil sonst aufgrund des Paddings ein grauer Streifen im Hidden Zustand entsteht
			type: 'panel',
			classLayout: 'col-span-3',
			//classLayout: 'flex flex-wrap items-center col-span-3',
			hidden(sm) { return sm.formularStatus >= DokumentStatus.SigniertGesperrt || kannMin1Signieren },
			children: [
				{
					type: 'panel', classLayout: 'bg-layout-color-2 pl-2 pt-2 pr-2 pb-1.5 flex',
					// type: 'panel', classLayout: 'bg-layout-color-2 pl-2 pt-2 pr-2 pb-1.5 flex flex-wrap items-center content-center',
					children: [
						{ type: 'icon', icon: 'error_outline', classLayout: 'm-0 p-0 ', },//primary-color-6
						{
							type: 'label',
							classLayout: 'ml-2 mb-1.5',
							label: sm.translate(marker('panel_signaturen.signature_auth_nok')),
						},
					],
				},
			],
		},
		{
			type: 'errorpanel', classLayout: 'col-start-1 col-span-3',
			hidden(sm) { return sm.formularStatus >= DokumentStatus.SigniertGesperrt || !kannMin1Signieren}
		},
		await erstelleUnterschriftspanel(sm, signaturen, mitOrt, transferKanal),
		{
			type: 'label',
			label: sm.translate(marker('panel_signaturen.text_remove_signatures')),
			classLayout: 'mt-2 col-span-3',
			hidden(sm) { return !hatSignatur(sm) || istGesendet(sm) || nimmAnzahlUnterschriften(sm) === 1},
		},
		{
			type: 'label',
			label: sm.translate(marker('panel_signaturen.text_remove_signature')),
			classLayout: 'mt-2 col-span-3',
			hidden(sm) { return !hatSignatur(sm) || istGesendet(sm) || nimmAnzahlUnterschriften(sm) > 1},
		},
		{
			type: 'button', kind: 'raised', color: '', label: sm.translate(marker('panel_signaturen.bn_remove_signature')),
			hidden(sm) { return !hatSignatur(sm) || istGesendet(sm) },
			disabled(sm) { return istGesendet(sm)},
			onGetClass(sm, comp, def, name) {
				if (name === 'icon' || name === 'text') {
					return `${def} primary-color2`;
				}
				return def;
			},
			onClick(sm) {
				// Unterschriftsfelder löschen
				for(let sign of sm.Schema.signaturen)
				{
					sm.setValue(sign.datumFeld, null);
				}

				// Alle Signaturen löschen
				sm.dokumentDTO.signaturen.forEach(s => {
						sm.formular.removeSignature(s);
				});
				// sm.formular.removeSignature()
				sm.DisableAll(false);
				sm.saveStatus(DokumentStatus.InArbeit);
				sm.service.emitReloadFormular();
			},
		},
	])
}

// Kann der aktuelle Anwender die Signatur setzen?
const kannSignieren =
    /**
     * Diese Funktion prüft ob der aktuelle Anwender die entsprechende signatur setzen kann
     *
     * @param sm
     * @param signDef
     * @returns Ein Promise, welches anzeigt ob der aktuelle Anwender zum Signieren berechtigt ist oder nicht.
     */
    async (sm: SchemaManager, signDef: SignaturDef): Promise<boolean> => {
        for(let role of signDef.rolle)
        {
            switch(role)
            {
				// TODO: Sobald echte Rollen übers GUI gesetzt werden können hier die Rollenprüfung wieder integrieren
				// Aktuell nur auf I-Nummer oder spezbewilligung prüfen
                case SignatureRole.FachkundigerElektroInstallateur:
				case SignatureRole.BewilligungsElektroinhaberInstallateur: {
					// Wenn Geschäftsstelle eine I-Nummer hat dann kann unterschrieben werden
					const gs = await sm.service.CurGeschStelle()
					if(gs && gs.iNummer)
						return true;
					break;
					// return sm.autorisierungsService.isFachkundigerElektroInstallateur();
				}
				case SignatureRole.BesondereAnlagen:
				case SignatureRole.BetriebseigenenInstallationen:
				case SignatureRole.FachkundigeInEigenheim:
				case SignatureRole.Anschlussbewilligung: {
					// Wenn Mitarbeiter eine ESTI-Nummer hat dann kann unterschrieben werden
					const ma = await sm.service.CurMitarbeiter();
					if(ma && ma.estiNummer)
						return true;
					break;
				}
                case SignatureRole.BasisAnwender:
                    return true;

                default:
                    return false;
            }
        }
    }

// Prüfen ob mindestens eine Signatur vorhanden ist
const hatSignatur = (sm: SchemaManager): boolean => {
	let ret = false;
	if (sm.Schema.signaturen) {
		for(let sign of sm.Schema.signaturen)
		{
			if (hatKeyUnterschrift(sm, sign.signaturKey)) {
				// Eine passende Signatur für diesen Signatur-Abschnitt gefunden, desshalb hier abbrechen
				ret = true;
				break;
			}
		}
	}

	return ret;
}

/**
 * Signaturen eines Formulars überprüfen
 * - Wenn nur 1 Signatur geprüft wird, dann wird die Signatur geprüft auch wenn sie 'fakultativ' ist.
 * - Wenn alle Signaturen geprüft werden, dann werden nur die Signaturen geprüft die nicht 'fakultativ' sind.
 * @param sm: 		SchemaManager
 * @param signDef: 	SignaturDef die überprüft werden soll. Wenn keine Angegben, werden alle überprüft
 * @returns 		true = Signatur(en) ist/sind vorhanden
 */
const istSigniert = (sm: SchemaManager, signDef: SignaturDef = null): boolean => {
	let ret = true;
	if (sm.Schema.signaturen) {
		if (!signDef) {
			// Alle Signaturen überprüfen wenn keine Definition mitgegeben wird
			for (let i = 0; i < sm.Schema.signaturen.length; i++) {
				// Sämtliche Signatur-Abschnitte durchgehen und prüfen ob die Signatur vorhanden ist

				// Wenn auf alle Signaturen geprüft wird, dann die fakultativen Signaturen nicht mitzählen
				if(sm.Schema.signaturen[i].fakultativ)
					continue;

				if (!hatKeyUnterschrift(sm, sm.Schema.signaturen[i].signaturKey)) {
					ret = false;	// Keine passende Signatur für diesen Signatur-Abschnitt gefunden, desshalb hier abbrechen
					break;
				}
			}
		}
		else {
			ret = hatKeyUnterschrift(sm, signDef.signaturKey) // Nur prüfen ob die ausgeählte Signatur vorhanden ist.
		}
	}
	else {
		ret = false; // Wenn signaturen noch null ist, dann ist es niemals signiert
	}

	return ret;
}

const hatKeyUnterschrift = (sm: SchemaManager, key: string): boolean => {
	let unterschriftVorhanden = false;
	if (sm.dokumentDTO.signaturen) {
		for (let i = 0; i < sm.dokumentDTO.signaturen.length; i++) {
			if (sm.dokumentDTO.signaturen[i].signaturKey === key) {   // Passende Unterschrift gefunden
				unterschriftVorhanden = true;
				break;
			}
		}
	}
	return unterschriftVorhanden;
}

// Gibt die Anzahl an möglichen Unterschrifen auf diesem Formular zurück
const nimmAnzahlUnterschriften = (sm: SchemaManager): number => {
	let anz = 0;
	if(sm.Schema.signaturen)
	{
		anz = sm.Schema.signaturen.length;
	}
	return anz;
}

const istGesendet = (sm: SchemaManager, nurDrucken: boolean = false): boolean => {
	let ret = false;
	if (sm.dokumentDTO.transferHistory) {
		for(let ts of sm.dokumentDTO.transferHistory) {
			// Aktuell die Antwort-Kanäle nicht untrerscheiden und immer nur auf einen TransferHistory-Eintrag
            // vom Typ Versand prüfen.
            if (ts.typ === TransferTyp.Versand) {                               // Wenn ein Dokument gesendet wurde dann gilt es ab jetzt als gesendet und kann auch nicht mehr entsperrt werden
                return ret = true;
            }
		}
	}
	return ret;
}

// Wurde nach setzen der Unterschrift gedruckt
const istNachUnterschriftGedruckt = (sm: SchemaManager): boolean => {
    let ret = false;
    if (sm.dokumentDTO.signaturen && istSigniert(sm))
    {
        let letzteUnterschrift = null;
        for(let sig of sm.dokumentDTO.signaturen)
        {
            if(letzteUnterschrift < moment.parseZone(sig.timestamp, moment.ISO_8601, true).valueOf())
            {
                letzteUnterschrift = moment.parseZone(sig.timestamp, moment.ISO_8601, true).valueOf();
            }
        }
        // Prüfen ob nach der letzten Unterschrift gedruckt wurde
        if(letzteUnterschrift !== null && sm.dokumentDTO.transferHistory)
        {
            let letzterDruck = null;
            for(let trf of sm.dokumentDTO.transferHistory)
            {
                if(letzterDruck < moment.parseZone(trf.timestamp, moment.ISO_8601, true).valueOf())
                {
                    letzterDruck = moment.parseZone(trf.timestamp, moment.ISO_8601, true).valueOf();
                }
            }

            ret = letzterDruck !== null &&  letzterDruck > letzteUnterschrift;
        }
    }

    return ret;
}

// Antwort Schnipsel erstellen
export const erstelleAntwortSchnipsel = async (sm:SchemaManager, antwortSpez:IComponent, name, form_guid:string): Promise<IComponent> => {
	let transferKanal = TransferKanal.Undefiniert as TransferKanal;
	let empf = sm.Schema.empfaenger;
	if(empf)
		transferKanal = empf.transferKanal;

	switch (transferKanal) {
		case TransferKanal.M20: {
			if (sm.formularStatus >= DokumentStatus.Bewilligt && antwortSpez) {
				return antwortSpez;
			}
			else {
				return card_panel(antwortSpez ? antwortSpez.label.toString() : 'Netzbetreiberin', antwortSpez ? antwortSpez.name : 'PlaceholderId', [], true);
			}
		}
		case TransferKanal.EMail:
		case TransferKanal.Papier:
		default:
			{
				return antwort_meldefomrulare_panel(sm, name, form_guid);
		}
	}
}

// Hier kann dann erweitert werden um das Datum für den Anwender anzuzeigen
enum DatumRueckgabeArt {
    DB = 0,
    //Anwender = 1,
}

// Datum/Zeit formatieren je nachdem wie es zurückgegben werden soll
export function formatiereDatum(datetime: string, rueckgabeArt: DatumRueckgabeArt = 0) {
	let momentDT = moment.parseZone(datetime, moment.ISO_8601, true);
	switch(rueckgabeArt)
	{
		case DatumRueckgabeArt.DB:{
			return momentDT.format('DD.MM.YYYY');
		}
		default: {
			return momentDT.format('DD.MM.YYYY');
		}
	}
}

// Aufzählung der verscheidenen Kontaktarten die im NextGen verfügbar sind
export enum KontaktArt {
	Solateur = 0,
	Eigentuemer = 1,
	Verwaltung = 2,
	Auftraggeber = 3,
}

// Allgemeine Struktur für Adressen auf den Schemas
export interface adresseDef {
	konzess: string,
	name1: string,
	name2: string,
	adresse1: string,
	adresse2: string,
	plz: string,
	ort: string,
	telnr_d: string,
	telnr_g: string,
	telnr_p: string,
	telnr_m: string,
	email: string,
	name_sachb:string,
	telnr_sachb: string,
	email_sachb: string,
}

/**
 * Kontakte eines Formulars befüllen
 * Es muss angegeben werden, welcher Kontakt befüllt werden soll. Diese Daten werden in eine immer gleiche Struktur abgefüllt.
 * @param sm: 			SchemaManager
 * @param kontaktArt: 	Art des Kontakts welche abgerufen werden soll
 * @returns 			adresseDef = Struktur mit Adressedaten
 */
export const abrufeKontaktstruktur = async (sm:SchemaManager, kontaktArt:KontaktArt): Promise<adresseDef> => {
	let adressenDefinition:adresseDef = {
		konzess: '',
		name1: '',
		name2: '',
		adresse1: '',
		adresse2: '',
		plz: '',
		ort: '',
		telnr_d: '',
		telnr_g: '',
		telnr_p: '',
		telnr_m: '',
		email: '',
		name_sachb: '',
		telnr_sachb: '',
		email_sachb: '',
	}
	switch (kontaktArt)
	{
		case KontaktArt.Solateur : {
			const gs = await sm.service.CurGeschStelle()
			adressenDefinition.konzess = gs.iNummer;
			adressenDefinition.name1 = gs.firma1;
			adressenDefinition.name2 = gs.firma2;
			adressenDefinition.adresse1 = gs.adresse;
			adressenDefinition.adresse2 = gs.adrzusatz;
			adressenDefinition.plz = gs.plz;
			adressenDefinition.ort = gs.ort;
			adressenDefinition.telnr_g = gs.telefonG;
			const ma = await sm.service.CurMitarbeiter() ;
			adressenDefinition.telnr_sachb = ma.telefonD;
			adressenDefinition.name_sachb = `${ma.vorname} ${ma.name}`;
			adressenDefinition.email_sachb = ma.eMailD;
			break;
		}
		case KontaktArt.Eigentuemer : {
			if (sm.projekt.gebaeude?.guid_Inhaber) {
				const e = await sm.service.GetAdressse(sm.projekt.gebaeude.guid_Inhaber);
				let titelVornameName = textZusammensetzen(textZusammensetzen(e.titel, " ", e.vorname), " ", e.name);

				adressenDefinition.name1 = !istStringLeer(e.firma1) ? e.firma1 : titelVornameName;
				adressenDefinition.name2 = !istStringLeer(e.firma1) ? (!istStringLeer(titelVornameName) ? titelVornameName : e.firma2) : e.namezusatz;
				adressenDefinition.adresse1 = e.adresse1;
				adressenDefinition.adresse2 = e.adresse2;
				adressenDefinition.plz = e.plz;
				adressenDefinition.ort = e.ort;
				adressenDefinition.telnr_d = e.telefonD; !istStringLeer(e.telefonD) ? e.telefonD : (!istStringLeer(e.telefonG) ? e.telefonG : e.telefonP);
				adressenDefinition.telnr_g = e.telefonG;
				adressenDefinition.telnr_p = e.telefonP;
				adressenDefinition.telnr_m = e.telefonM;
				adressenDefinition.email = e.eMailD;
			}
			break;
		}
		case KontaktArt.Verwaltung : {
			if (sm.projekt.gebaeude?.guid_Verwaltung) {
				const v = await sm.service.GetAdressse(sm.projekt.gebaeude?.guid_Verwaltung);
				let titelVornameName = textZusammensetzen(textZusammensetzen(v.titel, " ", v.vorname), " ", v.name);

				adressenDefinition.name1 = !istStringLeer(v.firma1) ? v.firma1 : titelVornameName;
				adressenDefinition.name2 = !istStringLeer(v.firma1) ? (!istStringLeer(titelVornameName) ? titelVornameName : v.firma2) : v.namezusatz;
				adressenDefinition.adresse1 = v.adresse1;
				adressenDefinition.adresse2 = v.adresse2;
				adressenDefinition.plz = v.plz;
				adressenDefinition.ort = v.ort;
				adressenDefinition.telnr_d = v.telefonD;
				adressenDefinition.telnr_g = v.telefonG;
				adressenDefinition.telnr_p = v.telefonP;
				adressenDefinition.telnr_m = v.telefonM;
				adressenDefinition.email = v.eMailD;
			}
			break;
		}
		case KontaktArt.Auftraggeber : {
			if (sm.projekt.auftrag?.guidAuftraggeber) {
				const a = await sm.service.GetAdressse(sm.projekt.auftrag.guidAuftraggeber)
				let titelVornameName = textZusammensetzen(textZusammensetzen(a.titel, " ", a.vorname), " ", a.name);

				adressenDefinition.name1 = !istStringLeer(a.firma1) ? a.firma1 : titelVornameName;
				adressenDefinition.name2 = !istStringLeer(a.firma1) ? (!istStringLeer(titelVornameName) ? titelVornameName : a.firma2) : a.namezusatz;
				adressenDefinition.adresse1 = a.adresse1;
				adressenDefinition.adresse2 = a.adresse2;
				adressenDefinition.plz = a.plz;
				adressenDefinition.ort = a.ort;
				adressenDefinition.telnr_d = a.telefonD;
				adressenDefinition.telnr_g = a.telefonG;
				adressenDefinition.telnr_p = a.telefonP;
				adressenDefinition.telnr_m = a.telefonM;
				adressenDefinition.email = a.eMailD;
			 }
		}
	}
	return adressenDefinition;
}

/**
 * Kontaktefelder eines Formulars anhand der übergebenen Kontaktstruktur befüllen
 * Es muss angegeben werden, welche Felder befüllt werden sollen zB: "I_"
 * @param sm: 				SchemaManager
 * @param adressStruktur: 	Adressstruktur welche vorher mit den Daten befüllt wurde
 * @param feldPraefix: 		Feldpräfix der Felder die gefüllt werden sollen
 * @param mitSachbFelder: 	Falls die I-Felder gefüllt werden können mit "true" auch die Sachbearbeiter-Felder gefüllt werden (I_SACHB, I_EMAIL, I_TELNR)
 * @param telnrSachb: 		Falls die I-Felder gefüllt werden kann mit "true" die Telefonnummer des Sachbearbeiters verwendet werden.
 * @param GES_AdresseKurz: 	Auf einigen Formularen heissen die "GES_"-Adressfelder GES_ADR1 oder GES_ADRESSE1. 'true' bedeutet es wird das 'GES_ADRX' befüllt ansonsten 'GES_ADRESSEX'.
 */
export const abfuelleKontaktFelder = (sm:SchemaManager, adressStruktur: adresseDef, feldPraefix:string, mitSachbFelder: boolean = false, telnrSachb: boolean = false, GES_AdresseKurz: boolean = true) => {
	if(feldPraefix === 'I_')
	{
		sm.setValues(
			[
				feldPraefix + 'KONZESS',
				feldPraefix + 'NAME1',
				feldPraefix + 'NAME2',
				feldPraefix + 'ADRESSE1',
				feldPraefix + 'ADRESSE2',
				feldPraefix + 'PLZ',
				feldPraefix + 'ORT',
			],
			[
				adressStruktur.konzess,
				adressStruktur.name1,
				adressStruktur.name2,
				adressStruktur.adresse1,
				adressStruktur.adresse2,
				adressStruktur.plz,
				adressStruktur.ort,
			]
		)
		if(mitSachbFelder)
		{
			sm.setValues(
				[
					'I_SACHB',
					'I_EMAIL',
					'I_TELNR',
				 ]
				 ,
				 [
					adressStruktur.name_sachb,
					adressStruktur.email_sachb,
					telnrSachb && !istStringLeer(adressStruktur.telnr_sachb) ? adressStruktur.telnr_sachb : adressStruktur.telnr_g,
				]
			)
		}
	}
	else
	{
		sm.setValues(
			[
			   feldPraefix + 'NAME1',
			   feldPraefix + 'NAME2',
			   feldPraefix === 'GES_' && GES_AdresseKurz ? feldPraefix + 'ADR1' : feldPraefix + 'ADRESSE1',
			   feldPraefix === 'GES_' && GES_AdresseKurz ? feldPraefix + 'ADR2' : feldPraefix + 'ADRESSE2',
			   feldPraefix + 'PLZ',
			   feldPraefix + 'ORT',
			   feldPraefix + 'TELNR',
			   feldPraefix + 'EMAIL',
			],
			[
			   adressStruktur.name1,
			   adressStruktur.name2,
			   adressStruktur.adresse1,
			   adressStruktur.adresse2,
			   adressStruktur.plz,
			   adressStruktur.ort,
			   nimmTelefon(adressStruktur, [TelefonArt.telD, TelefonArt.telM, TelefonArt.telG, TelefonArt.telP]),
			   adressStruktur.email,
			]
		 )

		 if(!istStringLeer(adressStruktur.konzess))
			sm.setValue(feldPraefix + 'KONZESS', adressStruktur.konzess);
	}
}

// Aufzählung für die verschiedenen Arten der telefonnummern
export enum TelefonArt {
	kein = 0,
	telD = 1,
	telG = 2,
	telP = 3,
	telM = 4,
}

/**
 * Telefonnummer eines Kontakts nach bestimmten Prioritäten zurückgeben.
 * Es können 3 Prioritäten angeben werden.
 * Wenn die Nummer bei "prio1" gefüllt ist, wird diese verwendet ansonsten wird der Reihe nach weiterversucht.
 * Falls alle leer sind wird ein leerer String zurückgegeben.
 * @param adressStruktur: 	Adressstruktur in der die Adressdaten vorhanden sein müssen
 * @param prio1: 			Erste Priorität zB. TelefonArt.telD
 * @param prio2: 			Zwite Priorität zB. TelefonArt.telG
 * @param prio3: 			Dritte Priorität zB. TelefonArt.telP
 * @returns 				Telefonnummer als String
 */
export const nimmTelefon = (adressStruktur: adresseDef, telArten: TelefonArt[]): string => {
	let telNr = '';
	let telPrio1 = nimmTelefonArtWert(adressStruktur, TelefonArt.telD);
	let telPrio2 = nimmTelefonArtWert(adressStruktur, TelefonArt.telM);
	let telPrio3 = nimmTelefonArtWert(adressStruktur, TelefonArt.telG);
	let telPrio4 = nimmTelefonArtWert(adressStruktur, TelefonArt.telP);
	if(telArten.includes(TelefonArt.telD) && !istStringLeer(telPrio1))
		telNr = telPrio1;
	else if(telArten.includes(TelefonArt.telM) && !istStringLeer(telPrio2))
		telNr = telPrio2;
	else if(telArten.includes(TelefonArt.telG) && !istStringLeer(telPrio3))
		telNr = telPrio3;
	else if(telArten.includes(TelefonArt.telP) && !istStringLeer(telPrio4))
		telNr = telPrio4;

	return telNr;
}

/**
 * Eine bestimmte Telefonnummer eines Kontakts zurückgeben.
 * Als Parameter muss die Art der gewünschten Telefonnummer übergeben werden zB. TelefonArt.telD
 * @param adressStruktur: 	Adressstruktur in der die Adressdaten vorhanden sein müssen
 * @param telArt: 			Art der Telefonnummer zB. TelefonArt.telD
 * @returns 				Telefonnummer als String
 */
export const nimmTelefonArtWert = (adressStruktur: adresseDef, telArt:TelefonArt): string => {
	switch(telArt)
	{
		case TelefonArt.telD : 	return adressStruktur.telnr_d;
		case TelefonArt.telG : 	return adressStruktur.telnr_g;
		case TelefonArt.telP : 	return adressStruktur.telnr_p;
		case TelefonArt.telM : 	return adressStruktur.telnr_m;
		default : 				return '';
	}
}

/**
 * Die Felder des Formulars mit den PV Gerätedaten befüllen
 * @param sm: 				SchemaManager
 * @param feldNameFlaeche:	Feldname für das Feld in dem die Fläche der PV-Anlage gespeichert wird
 * @param feldNameLeistung:	Feldname für das Feld in dem die Leistung der PV-Anlage gespeichert wird (Leistung in KW)
 * @param feldNameFabTyp:	Feldname für das Feld in dem Fabrikat/Typ der PV-Anlage gespeichert wird
 * @param feldNamePvAnlage:	Feldname für das Feld in gespeichert wird, ob ein PV-Gerät angegeben wurde
 */
export const SetzePvDaten = (sm: SchemaManager, feldNameFlaeche: string, feldNameLeistung: string, feldNameFabTyp: string, feldNamePvAnlage: string ): void => {
	let flaeche = 0;
	let leistung = 0;
	let fabrikatTyp = '';
	let pvJa = false;
	sm.projekt.gebaeude?.geraete?.filter(g => g.typ === 'pv_panel').forEach(g => {
		let data = JSON.parse(g.daten);
		if (g.anzahl && data.area_m2)
		   flaeche += g.anzahl * data.area_m2;
		if (g.anzahl && data.peak_power_w)
		   leistung += g.anzahl * data.peak_power_w;
		if (g.hersteller || g.bezeichnung) {
		   if (g.hersteller && g.bezeichnung)
			  fabrikatTyp = textZusammensetzen(g.hersteller, " / ", g.bezeichnung);
		   else if (g.hersteller)
			  fabrikatTyp = g.hersteller;
		   else if (g.bezeichnung)
			  fabrikatTyp = g.bezeichnung;
		}
		pvJa = true;
	});

	if (flaeche && !istStringLeer(feldNameFlaeche))
		sm.setValue(feldNameFlaeche, withPrecision(flaeche));
 	if (leistung && !istStringLeer(feldNameLeistung))
		sm.setValue(feldNameLeistung, withPrecision(leistung / 1000));
 	if (fabrikatTyp !== '' && !istStringLeer(feldNameFabTyp))
		sm.setValue(feldNameFabTyp, fabrikatTyp);
 	if (pvJa && !istStringLeer(feldNamePvAnlage))
		sm.setValue(feldNamePvAnlage, true);
}


// Hilfsmethoden zum übernehmen von Stockwerk und Raum -----------------
export const nimmNaechstesWort = (satz: string) =>
{
   var wort = ''
   for (var i = 0; i < satz.length; i++) {
	   var char = satz[i];
	   wort += char;

	   var punctuations = [".",",",":",";"];//add all the punctuation marks you want.
	   if(char === ' ' || enthaeltString(char, punctuations))
		   break;
   }

   return wort;
}

export const kuerzeStockwerk = (stockwerk: string) =>
{
   if (stockwerk == null)
	   return stockwerk;

   var ret = '';
   if(enthaeltString(stockwerk, ['Obergeschoss', 'Og']))
	   ret = "OG";
   else if(enthaeltString(stockwerk, ['Untergeschoss', 'Ug']))
	   ret = "UG";
   else if(enthaeltString(stockwerk, ['Erdgeschoss', 'Eg']))
	   ret = "EG";
   else if(enthaeltString(stockwerk, ['Dachgeschoss', 'Dg']))
	   ret = "DG";
   else if(enthaeltString(stockwerk, ['rez']))
	   ret = "rez";

   return ret;
}

export const enthaeltString = (source: string, list: string[]) =>
{
   if(!source)
	   return false;
   // Damit Gross- und Kleinschreibung erkannt wird alles klein vergleichen
   source = source.trim().toLowerCase();
   for(var i = 0; i < list.length; ++i)
   {
	   list[i] = list[i].toLowerCase();
   }
   return (list.indexOf(source) > -1);
}

export const isNumber = (n) =>
{
   return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}
// Ende Hilfsmethoden ---------------------------------------------------

export const inputGroup = (children: IComponent[]): IComponent => {
	return inputGroupCL('mr-6', children);
}

export const inputGroupCL = (classLayout: string, children: IComponent[]): IComponent => {
	children.forEach(c => c.classLayout = `${c.classLayout} ${classLayout}`);
	return {
		type: 'panel',
		classLayout: 'col-start-2 col-span-1 flex flex-wrap items-center',
		children
	}
}

export const flexGroup = (classLayout: string, children: IComponent[]): IComponent => {
	children.forEach(c => c.classLayout = `${c.classLayout} ${classLayout}`);
	return {
		type: 'panel',
		classLayout: 'flex flex-wrap items-center',
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

export const checkBoxGroup = (checkBoxDefs: CheckBoxDef[], opt?: CheckBoxDefOptions): IComponent => {
	const labels: string[] = checkBoxDefs.map(d => d.label)
	const fields: string[] = checkBoxDefs.map(d => d.field)
	const required: boolean = (opt?.required as boolean) ?? false;
	const multipleSelection: boolean = (opt?.multipleSelection as boolean) ?? false;
	let parentField = checkBoxDefs.map(cbd => cbd.field).join('_');

	return multiple_checkboxes_with_cust(fields, labels, `${fields[0]}_`, 0, undefined, required, false, !multipleSelection, parentField)
}

const validate_checkBoxGroup = (sm: SchemaManager, comp: IComponent): boolean => {
	let oneIsSet = false
	let last_cb_value = false
	let input_vorhanden = false
	let input_value = undefined
	if (comp.required) {
		sm.traverseSchema(f => {
			if (f.type === 'checkbox') {
				if (sm.getValue(sm.getCompByField(f.field))) {
					oneIsSet = true
				}
			}
			if (f.field && f.tag === 1) {
				last_cb_value = sm.getValue(sm.getCompByField(f.field))
			}
			if (f.type === 'input') {
				input_vorhanden = true
				input_value = sm.getValue(sm.getCompByField(f.field))
			}

		}, undefined, comp)

		if (input_vorhanden && last_cb_value && SchemaManager.hasNoValue(input_value)) {
			oneIsSet = false
		}
		return oneIsSet;
	} else {
		return true
	}

}

// Checkbox verrutscht nicht auch wenn das Edit nicht sichtbar ist (edit ist optional)
export const multiple_checkboxes_with_cust = (fields: string[], labels: string[], field_input: string, max: number, options?: string[], required?: boolean, showEdit?: boolean, radioStyle?: boolean, panelField?: string, wfull: boolean = false, defString: string = ''): IComponent => {
	// panel_field soll nie leer sein, denn sonst funktioniert die Optione radioStyle nicht mehr
	let panel_field = panelField ? panelField : field_input ? `panel_${field_input}` : '';
	if(panel_field === '')
	{
		panel_field = fields.join('_');
	}

	const cb = (label: string, field: string): IComponent => ({
		type: 'checkbox',
		classLayout: `mr-6 ${showEdit ? 'mb-4' : 'mt-2 mb-4'}`,
		field,
		label,
		diff: {
			diff_comp_field: panel_field
		},
		onChange(sm, comp, value) {
			const pn = sm.getCompByField(panel_field)
			const first_cb = sm.getCompByField(fields[0])
			if (value && radioStyle) {
				sm.traverseSchema(f => {
					if (f !== comp && f.type === 'checkbox' && sm.getValue(f)) {
						sm.updateValue(f, false)
					}
				}, undefined, pn)
			}
			sm.validate(first_cb, value)
		},
		validate(sm, comp) {
			if (comp.field === fields[0]) {
				const pn = sm.getCompByField(panel_field)
				const ok = validate_checkBoxGroup(sm, pn)
				if (!ok) {
					return sm.translate(marker('page_project_wizard.error_input_required'))
				}
			}

			return ''
		}
	})
	const cbs: IComponent[] = []
	const len = fields.length - 1
	const last_cb = cb(labels[labels.length - 1], fields[len])
	for (let ind = 0; ind < len; ind++) {
		const _cb = cb(labels[ind], fields[ind])
		if (ind === 0 && required) {
			// Für Hint 'Pflichtfeld Anzeige
			_cb.tag = 99
		}
		cbs.push(_cb)
	}
	if (showEdit) {
		last_cb.tag = 1
		last_cb.class = 'mt-2 mb-4 mr-2'
		cbs.push(
			{
				type: 'div',
				class: 'flex flex-nowrap items-center',
				children: [
					last_cb,
					{
						type: 'input',
						onGetClass(sm, comp) {
							if (!sm.Values[last_cb.field] && !istStringLeer(labels[labels.length-1])  ) {
								// sm.Values[field_input] = ''
								return 'invisible'
							}
						},
						max,
						width: wfull ? w_full : undefined,
						field: field_input,
						options,
						default: defString,
						disabled(sm, comp) {
							if(istStringLeer(labels[labels.length-1]) && !sm.Values[last_cb.field])
							{
								return true;
							}
							else
							{
								return false;
							}
						},
						validate(sm, comp, value) {
							if (required && sm.Values[last_cb.field] && SchemaManager.hasNoValue(value)) {
								return sm.translate(marker('page_project_wizard.error_input_required'))
							}
							return ''
						},
						diff: {
							diff_comp_field: panel_field,
						}
					}
				]
			},
		)
	} else {
		cbs.push(last_cb)
	}
	return {
		type: 'panel',
		classLayout: 'col-start-2 col-span-1 flex flex-wrap items-center',
		field: panel_field,
		required,
		children: cbs
	}

}

// Bei dieser Variante rutscht die Checkbox leicht nach unten, falls das edit sichtbar ist
export const single_checkbox_with_cust = (field: string, label: string, field_input: string, max: number, options?: string[]): IComponent[] => {
	return [
		{
			type: 'checkbox',
			classLayout: 'col-start-2 col-span-1',
			field,
			label,
			hidden(sm) {
				return sm.Values[field]
			}
		},
		{
			type: 'panel',
			classLayout: 'col-start-2 col-span-1 flex flex-wrap items-center',
			hidden(sm) {
				return !sm.Values[field]
			},
			children: [
				{
					type: 'checkbox',
					classLayout: 'mr-6 mb-4',
					field,
					label,
				},
				{
					type: 'input',
					classLayout: 'mr-6',
					max,
					field: field_input,
					options,
				},
			]
		}

	]
}

export const textZusammensetzen = (txt: string, suffix: string, subtext: string) => {
	var ret = '';
	if (txt && subtext) {
		ret = txt + suffix + subtext;
	}
	else if (txt) {
		ret = txt;
	}
	else if (subtext) {
		ret = subtext;
	}
	return ret;
}

export const istStringLeer = (text: string): boolean => {
	return (text === '' || text === null || text === undefined);
}

export const ScrollIntoView = (el: string) => {
	const q = document.querySelector(el)
	if (q) q.scrollIntoView();
}

export const getStepLinkDataStandard = (sm: SchemaManager, step: any): any => {
	if (step.status === sm.formularStatus) {
		if (step.step == 1) { // Ausfüllen
			if (hasAllRequired(sm))
				return { icon: '/assets/icons/link_phase_done.svg', class: 'fill-done' };
			else
				return { icon: '/assets/icons/link_phase_in_progress.svg', class: 'fill-in-progress' };
		}
		else if (step.step == 2) { // Signieren
			if (hasAllRequired(sm))
				return { icon: '/assets/icons/link_phase_in_progress.svg', class: 'fill-in-progress' };
			else
				return { icon: '/assets/icons/link_phase_empty.svg', class: 'fill-empty' };
		}
		else
			return { icon: '/assets/icons/link_phase_in_progress.svg', class: 'fill-in-progress' };
	}

	if (step.status < sm.formularStatus) {
		return { icon: '/assets/icons/link_phase_done.svg', class: 'fill-done' };
	}

	if(typeof(step.status) === 'object'){
		const stati: DokumentStatus[] = step.status as DokumentStatus[];
		if(stati){
			if (stati.indexOf(sm.formularStatus) > -1)
				return { icon: '/assets/icons/link_phase_in_progress.svg', class: 'fill-in-progress' };

			const max = Math.max(...stati);
			if (max < sm.formularStatus)
				return { icon: '/assets/icons/link_phase_done.svg', class: 'fill-done' };
		}
	}

	return { icon: '/assets/icons/link_phase_empty.svg', class: 'fill-empty' };
}

export const hasAllRequired = (sm: SchemaManager): boolean => {
	for(let i in sm.Schema.beilagen){
		const beilage = sm.Schema.beilagen[i];
		if(beilage.reqiered && !hasBeilage(sm, beilage.guid))
			return false;
	}

	const mf = { anzahl: 0, filled: 0 }
	sm.GetFormularMussfelder(mf);
	return mf.anzahl == mf.filled;
}

export const getBeilage = (sm: SchemaManager, dokumentDef: string): DokumentDTO => {
	let beilage = sm.dokumentDTO?.beilagen?.find(b => Guid.equals(b.dokumentDef?.guid,dokumentDef));
	return beilage;
}

export const hasBeilage = (sm: SchemaManager, dokumentDef: string): boolean => {
	let beilage = getBeilage(sm, dokumentDef);
	return beilage !== undefined;
}

export const findeAktion = (sm: SchemaManager, formTyp: string): EAktionDTO => {
	if (!Guid.isGuid(formTyp))
		throw new Error('formTyp ist keine gültige Guid');

	let phaseX
	let leistungX
	let aktionX

	phaseX = sm.projekt.auftrag.phasen.find(
		(ph) =>
		{
			leistungX = ph.leistungen.find(
				(l) =>
				{
					aktionX = l.aktionen.find(
						(a) => Guid.equals(a.dokument?.dokumentDef?.guid, formTyp)
					)

					return aktionX != undefined
				}
			)

			return leistungX != undefined
		}
	);

	let phase = sm.projekt.auftrag.phasen.find(ph => ph.leistungen.find(l => l.aktionen.find(a => Guid.equals(a.dokument?.dokumentDef?.guid, formTyp))))
	let leistung = phase?.leistungen.find(l => l.aktionen.find(a => Guid.equals(a.dokument?.dokumentDef?.guid, formTyp)));
	let aktion = leistung?.aktionen.find(a => Guid.equals(a.dokument?.dokumentDef?.guid, formTyp));

	return aktion;
}

export const formular_status_test = (): IComponent => {
	const fst = FormularStatusText()
	const btns: IComponent[] = Object.keys(fst).map(key => {
		return {
			type: 'button',
			label: fst[key],
			disabled() { return false },
			tag: parseInt(key),
			onClick(sm, comp) {
				sm.saveStatus(comp.tag as DokumentStatus)
			}
		}
	})
	return card_panel('Status setzen', 'st', btns)
}

export const tr_string = (sm: SchemaManager, key: string): string => {
	return sm.translate(marker(key))
}

export const tr_prop = (key_tr: string): IComponentString => {
	return { translation: { key: marker(key_tr) } }
}

export function withPrecision(value: number, precision: number = 3): string {
	// let faktor = Math.pow(10, precision);
	// return Math.round((value + Number.EPSILON) * faktor) / faktor;
	return Math.trunc(value) + (value % 1).toFixed(3).replace(/0(?:(\.[^0]+)|\.)0*$/, '$1')
}

export function istLocalhost() : boolean{
	return window.location.hostname.toLowerCase() == 'localhost';
}

export const tableHeaderTextRotate = (text: string) :string => {
	return `<div class="text-xs transform -rotate-90 mt-2">${text}</div>`
}

export const tableHeaderText = (text: string, cl?: string) :string => {
	return `<div class="text-xs ${cl}">${text}</div>`
}

export const checkBoxTextHTML = (checked: boolean) :string => {
	const cb = (checked === true) ? '2611' : '2610'
	return `&#x${cb}`

}
