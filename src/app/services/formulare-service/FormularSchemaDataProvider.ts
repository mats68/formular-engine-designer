import { SchemaBase } from "src/app/components/bi-formular-engine/src/lib/base/SchemaBase";
import { SchemaDataProviderBase } from "src/app/components/bi-formular-engine/src/lib/base/SchemaDataProvider";
import { ISchemaField } from "src/app/components/bi-formular-engine/src/lib/base/SchemaField";
import { FormularFieldSet, FormularFieldSetState, IFormularFieldSet, IFormularFieldSetChangedEventData } from "./FormularFieldSet";

export class SchemaDataProviderFormular extends SchemaDataProviderBase
{
	public constructor(
		private readonly _formularValue: IFormularFieldSet
	)
	{
		super();

		let data: string = JSON.stringify(JSON.parse(this._formularValue.data));
		(<FormularFieldSet>this._formularValue).loadValue(data, data, FormularFieldSetState.Unchanged, true);

		this._formularValue.changed.add(
			(eventData: IFormularFieldSetChangedEventData) => this.onValueUpdated()
		);

		return;
	}

	private onValueUpdated(): void
	{
		console.log(this._formularValue);

		this.updateFields(JSON.parse(this._formularValue.data));

		return;
	}

	private updateValue(name: string, value: any): void
	{
		let data: object = JSON.parse(this._formularValue.data);
		data[name] = value;
		this._formularValue.data = JSON.stringify(data);

		return;
	}

	protected onSchemaBound(schema: SchemaBase): void
	{
		this.onValueUpdated();

		return;
	}

	protected onFieldAdded(field: ISchemaField): void
	{
		this.updateValue(field.name, field.value);

		return;
	}

	protected onFieldChanged(field: ISchemaField): void
	{
		this.updateValue(field.name, field.value);

		return;
	}

	protected onFieldRemoved(field: ISchemaField): void
	{
		this.updateValue(field.name, field.value);

		return;
	}
}
