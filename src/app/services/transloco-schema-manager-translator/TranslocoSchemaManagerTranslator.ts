import { TranslocoService } from "@ngneat/transloco";
import { ISchemaManagerTranslator } from "src/components/bi-formular-engine/src/public-api";

export class TranslocoSchemaManagerTranslator
	implements ISchemaManagerTranslator
{
	private readonly _transloco: TranslocoService;

	constructor(transloco: TranslocoService)
	{
		this._transloco = transloco;

		return;
	}

	public translate(
		language: string,
		key: string,
		values: { [key: string]: any; },
		options: any,
		system: boolean
	): string
	{
		return this._transloco.translate(key, values);
	}
}
