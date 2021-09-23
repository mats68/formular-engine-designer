import { SchemaBase } from "src/app/components/bi-formular-engine/src/lib/base/SchemaBase";
import { SchemaManager } from "src/app/components/bi-formular-engine/src/lib/base/schemaManager";
import { ISchema } from "src/app/components/bi-formular-engine/src/lib/base/types";
import { Guid } from "src/app/tools/Guid";
import { IFormular } from "./Formular";
import { FormulareService } from "./formulare-service.service";
import { SchemaDataProviderFormular } from "./FormularSchemaDataProvider";
import { IFormularFieldSet } from "./FormularFieldSet";

export class FormularSchemaBase extends SchemaBase
{
	private readonly _formulareService: FormulareService;

	public constructor(
		formulareService: FormulareService,
		schemaManager: SchemaManager,
		formular: IFormular,
		schema: ISchema,
		rootAttribute: Guid,
		rootIndex: number = 0
	)
	{
		const rootValue: IFormularFieldSet = formular.getFormularFieldSet(rootAttribute, rootIndex);
		const dataProvider: SchemaDataProviderFormular = new SchemaDataProviderFormular(rootValue);

		super(schemaManager, dataProvider, schema);

		this._formulareService = formulareService;
	}
}
