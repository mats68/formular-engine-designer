import { SchemaBase, SchemaManager } from "src/app/components";
import { Guid } from "src/app/tools/Guid";
import { IFormular } from "./Formular";
import { FormulareService } from "./formulare-service.service";

export type FormularSchemaFactory = (schemaManager: SchemaManager, formulareService: FormulareService, formular: IFormular) => Promise<SchemaBase>;

export interface IFormularDefinition
{
	/**
	 * Diese Eigenschaft ruft den Identifikator des Formulars ab.
	 */
	readonly id: string;

	/**
	 * Diese Eigenschaft ruft die GUID des Formulartyps ab.
	 */
	readonly guid: Guid;

	/**
	 * Diese Eigenschaft ruft den Titel des Formulars ab.
	 */
	readonly title: string;

	/**
	 * Diese Eigenschaft ruft den Kurzcode des Formulars ab.
	 */
	readonly code: string;

	readonly factory: FormularSchemaFactory;

	readonly beilagen: IFormularBeilageDefinition[];
}

export interface IFormularBeilageDefinition
{
	/**
	 * Diese Eigenschaft ruft die GUID des Formularbeilagentyps ab.
	 */
	readonly guid: Guid;

	/**
	 * Diese Eigenschaft ruft den Titel dieser Formularbeilage ab.
	 */
	readonly title: string;

	/**
	 * Diese Eigenschaft ruft die maximale Anzahl der Formularbeilagen von diesem Typ ab.
	 */
	readonly maximum: number;
}
