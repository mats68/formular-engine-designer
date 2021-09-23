import { SchemaBase } from "./SchemaBase";
import { ISchemaField, SchemaField, SchemaFieldValue } from "./SchemaField";
import * as Utilities from "./Utilities";

const TRACE_SCHEMA_DATA_PROVIDER_BASE: boolean = true;
const DEBUG_SCHEMA_DATA_PROVIDER_BASE: boolean = true;

function log_trace(identifier: string, mode?: boolean, ...optionalParams: any[])
{
	Utilities.log_trace(TRACE_SCHEMA_DATA_PROVIDER_BASE, identifier, mode, ...optionalParams);
}

function log_debug(message: any, ...optionalParams: any[])
{
	Utilities.log_debug(DEBUG_SCHEMA_DATA_PROVIDER_BASE, message,...optionalParams);
}

/**
 * Diese Klasse stellt die Basisfunktionalität des Datenprovider bereit, welcher das Bindeglied zwischen der
 * Datenschnittstelle und der Formular Engine bzw. dem Schema darstellt.
 */
export abstract class SchemaDataProviderBase
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert die `SchemaBase` Instanz, an welcher dieser Datenprovider gebunden ist oder `null` wenn
	 * dieser Datenprovider an keine Schema Instanz gebunden ist.
	 */
	private _schema: SchemaBase|null = null;

	//#endregion

	//#region Geschütze Methoden.

	/**
	 * Diese Methode muss von der implementierenden Klasse aufgerufen werden, wenn ein neuer Datensatz geladen wurde
	 * oder dessen wert sich verändert hat.
	 *
	 * @param fields
	 * 	Ein Objekt welches die Feldnamen den entsprechenden Werten zuordnet.
	 */
	protected updateFields(values: { [key: string]: string }): void
	{
		const __METHOD_NAME__: string = 'SchemaDataProviderBase::updateFields';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { instance: this, values: values });

		try
		{
			// Sofern ein Schema gebunden ist, rufe die Methode zum aktualisieren der Werte auf.
			this._schema?.updateValues(values);
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace(__METHOD_NAME__, false);
		}

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode wird aufgerufen, wenn eine neue Schema Instanz an diesen Datenprovider gebunden wurde.
	 *
	 * @param schema
	 * 	Die `SchemaBase` Instanz, welche an diesen Datenprovider gebunden wurde.
	 */
	protected abstract onSchemaBound(schema: SchemaBase): void;

	/**
	 * Diese Methode wird aufgerufen, wenn sich der Wert der spezifizierten `ISchemaField` Instanz verändert hat.
	 *
	 * @param field
	 * 	Die `ISchemaField` Instanz dessen Wert sich verändert hat.
	 */
	protected abstract onFieldChanged(field: ISchemaField): void;

	/**
	 * Diese Methode wird aufgerufen, wenn die spezifizierte `ISchemaField` Instanz zu den bestehenden Werten
	 * hinzugefügt wurde.
	 *
	 * @param field
	 * 	Die `ISchemaField` Instanz, welche hinzugefügt wurde.
	 */
	protected abstract onFieldAdded(field: ISchemaField): void;

	/**
	 * Diese Methode wird aufgerufen, wenn die spezifizierte `ISchemaField` Instanz von den bestehenden Werten entfernt
	 * wurde.
	 *
	 * @param field
	 * 	Die `ISchemaField` Instanz, welche entfernt wurde.
	 */
	protected abstract onFieldRemoved(field: ISchemaField): void;

	//#endregion

	//#region Öffentliche Methoden.

	/**
	 * Diese Methode bindet die spezifizierte Schema Instanz an diesen Datenprovider.
	 *
	 * @param schema
	 * 	Die Schema Instanz, welche an diesen Datenprovider gebunden werden soll.
	 */
	public bindSchema(schema: SchemaBase): void
	{
		// TODO: Add comments!
		this._schema = schema;

		if(this._schema)
		{
			try
			{
				this.onSchemaBound(this._schema);
			}
			catch(error)
			{
				console.error(
					'Uncaught error in overridden \'SchemaDataProvider::onSchemaBound\' method!',
					{
						instance: this,
						error: error,
						schema: schema
					}
				);

				throw error;
			}
		}

		return;
	}

	/**
	 * Diese Methode wird von der `SchemaBase` Klasse aufgerufen, wenn sich der Wert der spezifizierten `ISchemaField`
	 * Instanz verändert hat.
	 *
	 * @param field
	 * 	Die `ISchemaField` Instanz dessen Wert sich verändert hat.
	 *
	 * @throws
	 * 	TypeError: Es wurde eine ungültige ISchemaField Instanz spezifiziert!
	 */
	public fieldChanged(field: ISchemaField): void
	{
		const __METHOD_NAME__: string = 'SchemaDataProviderBase::fieldChanged';

		// Stelle sicher, dass eine gültige `ISchemaField` Instanz spezifiziert wurde. Ansonsten wirf eine Ausnahme!
		if(!(field instanceof SchemaField))
			throw new TypeError('An invalid \'ISchemaField\' instance has been specified!');

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, this);

		try
		{
			// Versuche nun die in der ableitenden Klasse definierte Methode aufzurufen.
			this.onFieldAdded(field);
		}
		catch(error)
		{
			// Es ist ein Fehler in der Implementierung der ableitenden Klasse aufgetreten! Protokolliere diesen Fehler
			// nun in der Browser Konsole.
			console.error(
				'Uncaught error in overridden \'SchemaDataProvider::fieldChanged\' method!',
				{
					instance: this,
					error: error,
					field: field
				}
			);

			// Wirf die gefangene Ausnahme trotzdem erneut!
			throw error;
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace(__METHOD_NAME__, false);
		}

		// Alles erledigt, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode wird von der `SchemaBase` Klasse aufgerufen, wenn die spezifizierte `ISchemaField` Instanz zu den
	 * bestehenden Werten hinzugefügt wurde.
	 *
	 * @param field
	 * 	Die `ISchemaField` Instanz, welche hinzugefügt wurde.
	 *
	 * @throws
	 * 	TypeError: Es wurde eine ungültige ISchemaField Instanz spezifiziert!
	 */
	public fieldAdded(field: ISchemaField): void
	{
		const __METHOD_NAME__: string = 'SchemaDataProviderBase::fieldAdded';

		// Stelle sicher, dass eine gültige `ISchemaField` Instanz spezifiziert wurde. Ansonsten wirf eine Ausnahme!
		if(!(field instanceof SchemaField))
			throw new TypeError('An invalid \'ISchemaField\' instance has been specified!');

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, this);

		try
		{
			// Versuche nun die in der ableitenden Klasse definierte Methode aufzurufen.
			this.onFieldAdded(field);
		}
		catch(error)
		{
			// Es ist ein Fehler in der Implementierung der ableitenden Klasse aufgetreten! Protokolliere diesen Fehler
			// nun in der Browser Konsole.
			console.error(
				'Uncaught error in overridden \'SchemaDataProvider::onFieldAdded\' method!',
				{
					instance: this,
					error: error,
					field: field
				}
			);

			// Wirf die gefangene Ausnahme trotzdem erneut!
			throw error;
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace(__METHOD_NAME__, false);
		}

		// Alles erledigt, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode wird von der `SchemaBase` Klasse aufgerufen, wenn die spezifizierte `ISchemaField` Instanz von den
	 * bestehenden Werten entfernt wurde.
	 *
	 * @param field
	 * 	Die `ISchemaField` Instanz, welche entfernt wurde.
	 *
	 * @throws
	 * 	TypeError: Es wurde eine ungültige ISchemaField Instanz spezifiziert!
	 */
	public fieldRemoved(field: ISchemaField): void
	{
		const __METHOD_NAME__: string = 'SchemaDataProviderBase::fieldRemoved';

		// Stelle sicher, dass eine gültige `ISchemaField` Instanz spezifiziert wurde. Ansonsten wirf eine Ausnahme!
		if(!(field instanceof SchemaField))
			throw new TypeError('An invalid \'ISchemaField\' instance has been specified!');

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, this);

		try
		{
			// Versuche nun die in der ableitenden Klasse definierte Methode aufzurufen.
			this.onFieldRemoved(field);
		}
		catch(error)
		{
			// Es ist ein Fehler in der Implementierung der ableitenden Klasse aufgetreten! Protokolliere diesen Fehler
			// nun in der Browser Konsole.
			console.error(
				'Uncaught error in overridden \'SchemaDataProvider::onFieldRemoved\' method!',
				{
					instance: this,
					error: error,
					field: field
				}
			);

			// Wirf die gefangene Ausnahme trotzdem erneut!
			throw error;
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace(__METHOD_NAME__, false);
		}

		// Alles erledigt, kehre nun zurück.
		return;
	}

	//#endregion
}
