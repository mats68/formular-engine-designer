import { Guid } from "src/app/tools/Guid";
import { environment } from "src/environments/environment";

/**
 * Diese Methode gib eine Ablaufverfolgungsmeldung in der Browser Konsole aus, sofern die Anwendung nicht in einer
 * Produktiven Umgebung ausgeführt wird.
 *
 * @param identifier
 * 	Der Name/Identifikator des Ablaufs.
 *
 * @param mode
 * 	Der Modus der Ablaufverfolgungsmeldung:
 * 		`true` => Der Ablauf hat begonnen.
 * 		`false` => Der Ablauf ist abgeschlossen.
 * 		Alle anderen Werte => Allgemeine Ablaufverfolgungsmeldung.
 *
 * @param optionalParams
 * 	Zusätzliche Werte die Protokolliert werden sollen.
 */
export function log_trace(identifier: string, mode: boolean = null, ...optionalParams: any[]): void
{
	// Wird die aktuelle Anwendung in der Produktiven Umgebung ausgeführt?
	if(environment.production === false)
	{
		// Nein, also geben wir die Ablaufverfolgungsmeldung aus. Prüfe den `mode` Parameter und passe die Meldung
		// dementsprechend an.
		if(mode === true)
		{
			// Wir beginnen einen Ablauf. Formatiere die entsprechende Meldung und speichere diese dann in der
			// `identifier` Parameter Variable.
			identifier = `TRACE: Entering ${identifier}`;
		}
		else if(mode === false)
		{
			// Wir beenden einen Ablauf. Formatiere die entsprechende Meldung und speichere diese dann in der
			// `identifier` Parameter Variable.
			identifier = `TRACE: Leaving ${identifier}`;
		}
		else
		{
			// Wir geben eine allgemeine Ablaufverfolgungsmeldung aus. Formatiere die entsprechende Meldung und speichere
			// diese dann in der `identifier` Parameter Variable.
			identifier = `TRACE: ${identifier}`;
		}

		// Gib nun die Ablaufverfolgungsmeldung als 'DEBUG' Meldung in der Browser Konsole aus.
		console.debug(identifier, ...optionalParams);
	}

	// Wir sind fertig, verlasse nun diese Funktion.
	return;
}

/**
 * Diese Methode gib eine 'DEBUG'-Meldung in der Browser Konsole aus, sofern die Anwendung nicht in einer Produktiven
 * Umgebung ausgeführt wird.
 *
 * @param message
 * 	Die auszugebende Meldung.
 *
 * @param optionalParams
 * 	Zusätzliche Werte die Protokolliert werden sollen.
 */
export function log_debug(message: any, ...optionalParams: any[]): void
{
	// Wird die aktuelle Anwendung in der Produktiven Umgebung ausgeführt?
	if(environment.production === false)
	{
		// Nein, also geben wir die spezifizierte Meldung formatiert als 'DEBUG' Meldung in der Browser Konsole aus.
		console.debug(`DEBUG: ${message}`, ...optionalParams);
	}

	// Wir sind fertig, verlasse nun diese Funktion.
	return;
}

/**
 * Diese Methode prüft ob die spezifizierte GUID eine `Guid` Instanz repräsentiert oder konvertiert ansonsten den
 * GUID-String allenfalls in eine `Guid` Instanz.
 *
 * @param guid
 * 	Eine `Guid`-Instanz oder ein GUID-String, welcher in eine `Guid` Instanz konvertiert werden soll.
 *
 * @returns
 * 	Die spezifizierte oder konvertierte `Guid` Instanz.
 *
 * @throws
 * 	TypeError => Die spezifizierte Zeichenkette repräsentiert keine GUID!
 */
export function asGuid(guid: string | Guid): Guid
{
	// Wurde eine `Guid` Instanz spezifiziert? Falls ja, gib diese unverändert zurück.
	if(guid instanceof Guid) return <Guid>guid;

	// Nein, also versuche eine neue `Guid` Instanz anhand der spezifizierten Zeichenkette zu konstruieren. Speichere
	// diese Instanz dann in einer lokalen Variable.
	let g: Guid = Guid.parse(guid);

	// Prüfe nun ob die konstruierte `Guid` Instanz eine leere GUID repräsentiert. Falls ja, prüfe explizit eine gültige
	// GUID spezifiziert wurde.
	if(true == g.isEmpty() && false == Guid.isGuid(guid))
	{
		// Es wurde keine gültige GUID spezifiziert, wirf nun eine Ausnahme!
		throw new TypeError('An invalid GUID string has been specified!');
	}

	// Die GUID ist gültig, gib nun die `Guid` Instanz zurück.
	return g;
}
