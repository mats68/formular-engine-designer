import { Router } from '@angular/router';
// import { EAktionDTO, EFormularDTO, EProjektDTO } from 'src/app/api';
// import { FormularTyp, LayoutService } from 'src/app/services';
import { SchemaManager } from './schemaManager';
import { DomSanitizer } from '@angular/platform-browser';

export interface IComponentString {
   function?: IComponentStringFunction;
   translation?: ITranslatableString;
   value?: string;
}

export interface ITranslatableString {
   key: string;
   options?: any;
   values?: { [key: string]: any };
}

export type IFileUploaderType = 'Formular' | 'Beilage'
export type IFileUploaderDocumentType = 'pdf' | 'png' | 'jpg' | 'jpeg' | 'svg' | 'doc' | 'docx'


export interface IStepperProps {
   selectedIndex?: number
   completed?: boolean
   selectionChange?: IComponentStepperSelectionChangeFunction
}


export type IComponentStringFunction = (sm: SchemaManager, comp: IComponent, value?: any) => string;
export type IComponentBoolFunction = (sm: SchemaManager, comp: IComponent, value?: any) => boolean;
export type IComponentComponentFunction = (sm: SchemaManager, comp: IComponent, value?: any) => IComponent;
export type IComponentAnyFunction = (sm: SchemaManager, comp: IComponent, value?: any) => any;
export type IComponentLookUpCbFunction = (sm: SchemaManager, comp: IComponent, suchtext: string, old_suchtext: string, items: any[]) => any;
export type IComponentVoidFunction = (sm: SchemaManager, comp: IComponent, value?: any) => void;
export type IComponentUploadFunction = (sm: SchemaManager, comp: IComponent, file: File) => void;
export type IValidateFunction = (sm: SchemaManager, comp: IComponent, value?: any) => string | string[] | undefined;
export type ISchemaVoidFunction = (sm: SchemaManager) => void;
// export type ISchemaAfterSavefFunction = (sm: SchemaManager, formular: EFormularDTO) => void;
export type ISchemaStatusFunction = (sm: SchemaManager, status: any) => void;
export type ISchemaFormularStatusFunction = (status: number, text: string, translate: boolean) => void;
export type ISelectOptionItemsFunction = (sm: SchemaManager, comp: IComponent, value?: any) => ISelectOptionItems | string[];
export type IComponentStepperSelectionChangeFunction = (sm: SchemaManager, comp: IComponent, index: number) => void;
export type IComponentOnGetClassFunction = (sm: SchemaManager, comp: IComponent, defaultClass?: string, className?: string) => string;

export type ISummaryFunction = (sm: SchemaManager, comp: IComponent, value?: any, arrayInd?: number) => any;

export type IScreenSize = 'xs' | 'sm' | 'md' | 'lg';
export type IAppearance = 'legacy' | 'standard' | 'fill' | 'outline';

export interface ISelectOptionItem {
   value: string | number,
   text: string,
}

export interface ISelectOptionItems extends Array<ISelectOptionItem> { }

export interface ISchema extends ISchemaProps, IComponent {
   // [key: string]: any,
}

export interface ISchemaPartial extends ISchemaProps, IComponentPartial {
   [key: string]: any,
}

export interface ISchemaProps {
   guid?: string,
   attribut?: string,
   iconText?: string,
   title?: string,
   pdfTemplate?: string,
   pdfFileName?: any,
   steps?: any[]
   empfaengerKategorien?: string[]
   // beilagen?: FormularTyp[];
   initFormular?: ISchemaVoidFunction;
   UninitFormular?: ISchemaVoidFunction;
   // onAfterSave?: ISchemaAfterSavefFunction;
   // onAfterReload?: ISchemaAfterSavefFunction;
   setStatus?: ISchemaStatusFunction;
   SetFormularStatus?: ISchemaFormularStatusFunction
   onSubmit?: ISchemaVoidFunction;
   onInitSchema?: ISchemaVoidFunction;
   onInitValues?: ISchemaVoidFunction;
   onResize?: ISchemaVoidFunction;
   onMakeVisible?: IComponentVoidFunction;
   inheritFrom?: ISchema;
   whiteBackground?: boolean;
   noValidateOnBlur?: boolean;
   getStepLinkData?: any;
   scrollToStep?: any;
   SendFormular?: any;
   PrintFormular?: any;
}

export const SchemaKeys: KeysEnum<ISchemaProps> = {
   guid: true,
   attribut: true,
   iconText: true,
   title: true,
   pdfTemplate: true,
   pdfFileName: true,
   steps: true,
   empfaengerKategorien: true,
   // beilagen: true,
   initFormular: true,
   UninitFormular: true,
   // onAfterSave: true,
   // onAfterReload: true,
   setStatus: true,
   SetFormularStatus: true,
   onSubmit: true,
   onInitSchema: true,
   onInitValues: true,
   onResize: true,
   onMakeVisible: true,
   inheritFrom: true,
   whiteBackground: true,
   noValidateOnBlur: true,
   getStepLinkData: true,
   scrollToStep: true,
   SendFormular: true,
   PrintFormular: true,
}


export interface IComponent extends IComponentProps {
   type: keyof typeof ComponentType;
   children?: Array<IComponent>;
}

export interface IComponentPartial extends IComponentProps {
   type?: keyof typeof ComponentType;
   children?: Array<IComponentPartial>;
}

export interface IComponentProps {
   dataType?: keyof typeof DataType;
   label?: string | IComponentStringFunction | IComponentString,
   floatLabel?: string | IComponentStringFunction | IComponentString,
   name?: string,
   field?: string,
   unbound?: boolean,
   style?: string | IComponentStringFunction,
   styleLabel?: string | IComponentStringFunction,
   styles?: any,
   class?: string | IComponentStringFunction,
   classLayout?: string,
   hidden?: boolean | IComponentBoolFunction,
   tooltip?: string | IComponentStringFunction | IComponentString,
   hint?: string | IComponentStringFunction | IComponentString,
   placeholder?: string | IComponentStringFunction | IComponentString,
   default?: any,
   inputType?: string,
   width?: string,
   suffix?: string,
   prefix?: string,
   mask?: string | IComponentStringFunction,
   maskOptions?: IMaskOptions,
   rows?: number,
   multiline?: boolean,
   required?: boolean | IComponentBoolFunction,
   min?: number,
   max?: number,
   step?: number,
   thumbLabel?: boolean,
   color?: Color,
   autofocus?: boolean,
   multiselect?: boolean,
   validate?: IValidateFunction,
   onInit?: IComponentVoidFunction,
   onChange?: IComponentVoidFunction,
   summaryCellTitle?: ISummaryFunction,
   summaryCellValue?: ISummaryFunction,
   dragdrop?: boolean,
   detailComponent?: IComponent
   colDefs?: ColDef[]
   hideAddBtn?: boolean,
   onClick?: IComponentVoidFunction,
   disabled?: boolean | IComponentBoolFunction,
   options?: ISelectOptionItems | ISelectOptionItemsFunction | string[],
   appearance?: IAppearance,
   cols?: string | IComponentStringFunction,
   datacols?: string | IComponentStringFunction,
   curRowInd?: number,
   kind?: keyof typeof ButtonKind,
   icon?: string,
   expanded?: boolean,
   toolbarColor?: Color,
   menuView?: boolean,
   noLayout?: boolean,
   selectedTabIndex?: number,
   html?: string | IComponentStringFunction | IComponentString,
   href?: string | IComponentStringFunction,
   openInNewTab?: boolean,
   menu?: Array<IComponent>;
   navpos?: 'left' | 'right',
   id?: string,
   parentComp?: IComponent,
   loading?: boolean | IComponentBoolFunction,
   diameter?: number,
   dateParseFormat?: string,
   tag?: number,
   listitems?: any[]
   listitems_expression?: (item: any) => string;
   listitems_pagecount?: number;
   listitems_emptytext?: string,
   listitem_click?: (sm: SchemaManager, comp: IComponent, item: any) => void;
   lookup_fn?: (sm: SchemaManager, comp: IComponent, text: string) => Promise<any>;
   lookup_cb?: IComponentLookUpCbFunction;
   lookup_expression?: (item: any) => string;
   lookup_ItemSelected?: IComponentVoidFunction;
   lookup_waittime?: number,
   lookup_minlength?: number,
   singleselect?: boolean,
   stepperProps?: IStepperProps,
   onGetClass?: IComponentOnGetClassFunction,
}

type KeysEnum<T> = { [P in keyof Required<T>]: true };
export const ComponentKeys: KeysEnum<IComponent> = {
   type: true,
   dataType: true,
   label: true,
   floatLabel: true,
   name: true,
   field: true,
   unbound: true,
   class: true,
   classLayout: true,
   style: true,
   styleLabel: true,
   styles: true,
   hidden: true,
   tooltip: true,
   hint: true,
   placeholder: true,
   children: true,
   default: true,
   inputType: true,
   width: true,
   suffix: true,
   prefix: true,
   mask: true,
   maskOptions: true,
   rows: true,
   multiline: true,
   multiselect: true,
   required: true,
   min: true,
   max: true,
   step: true,
   thumbLabel: true,
   autofocus: true,
   color: true,
   validate: true,
   onInit: true,
   onChange: true,
   summaryCellTitle: true,
   summaryCellValue: true,
   dragdrop: true,
   detailComponent: true,
   colDefs: true,
   hideAddBtn: true,
   onClick: true,
   disabled: true,
   options: true,
   appearance: true,
   cols: true,
   datacols: true,
   curRowInd: true,
   kind: true,
   icon: true,
   expanded: true,
   toolbarColor: true,
   menuView: true,
   noLayout: true,
   selectedTabIndex: true,
   html: true,
   href: true,
   openInNewTab: true,
   menu: true,
   navpos: true,
   id: true,
   parentComp: true,
   loading: true,
   diameter: true,
   dateParseFormat: true,
   tag: true,
   listitems: true,
   listitems_expression: true,
   listitems_pagecount: true,
   listitems_emptytext: true,
   listitem_click: true,
   lookup_fn: true,
   lookup_cb: true,
   lookup_expression: true,
   lookup_ItemSelected: true,
   lookup_waittime: true,
   lookup_minlength: true,
   singleselect: true,
   // fileUploaderProps: true,
   // fileViewerProps: true,
   stepperProps: true,
   onGetClass: true,
};



export interface IMaskOptions {
   thousandSeparator?: string,
   dropSpecialCharacters?: boolean,
   showMaskTyped?: boolean,
}

export interface IToolbarItem {
   label: string,
   icon: string,
   color?: Color,
   disabled?: boolean | IComponentBoolFunction,
   onClick?: IComponentVoidFunction,
}


export enum ComponentType {
   // containers
   form = 'form',
   panel = 'panel',
   card = 'card',
   expansionspanel = 'expansionspanel',
   tabs = 'tabs',
   tab = 'tab',
   switchpanel = 'switchpanel',
   datatable = 'datatable',
   sidenav = 'sidenav',
   //fields
   input = 'input',
   inputraw = 'inputraw',
   selectraw = 'selectraw',
   select = 'select',
   date = 'date',
   radiogroup = 'radiogroup',
   slider = 'slider',
   checkbox = 'checkbox',
   switch = 'switch',
   // static
   label = 'label',
   html = 'html',
   button = 'button',
   link = 'link',
   toolbar = 'toolbar',
   divider = 'divider',
   spinner = 'spinner',
   icon = 'icon',
   errorpanel = 'errorpanel',
   listpanel = 'listpanel',
   lookup = 'lookup',
   checklistbox = 'checklistbox',
   fileuploader = 'fileuploader',
   fileviewer = 'fileviewer',
   stepper = 'stepper'
}

export enum DataType {
   string = 'string',
   float = 'float',
   int = 'int',
   bool = 'bool',
   date = 'date',
}

export enum ButtonKind {
   standard = 'standard',
   raised = 'raised',
   stroked = 'stroked',
   flat = 'flat',
   icon = 'icon',
   fab = 'fab',
   minifab = 'minifab'
}

export type Color = '' | "primary" | "secondary" | "secondary-2" | "accent" | "warn" | "ok";

export enum SortSeq {
   none,
   asc,
   desc
}

export interface ColDef {
   field: string
   title: string | IComponentString
   expression?: (data: any) => string
   styleExpression?: (data: any) => string
   class?: string
   sortSeq?: SortSeq
   isStatus?: boolean,
   isPhasen?: boolean,
   statusExpression?: (data: any) => number[]
}

export interface IMussfelder {
   anzahl: number
   filled: number
}
