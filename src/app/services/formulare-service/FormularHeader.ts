/**
 * Diese Schnittstelle stellt die Informationen für den Formular-Header bereit.
 */
export interface IFormularHeaderData {
	/**
	 * Der Titel des Formulars.
	 */
	title: string;

	/**
	 * Das Kürzel des Formulars.
	 *
	 * z.B.: TAG, IA, usw...
	 */
	code: string;

	/**
	 * Der Fortschritt des Formulars in Prozent (0..100) oder ein Array der Fortschritte in Prozent (0..100) einzelner
	 * Schritte. Die Darstellung kann über die `continuousProgress` und die `statusProgress` Eigenschaften gesteuert
	 * werden.
	 */
	progress: number | number[];

	/**
	 * Diese Eigenschaft steuert die Art der Fortschrittsanzeige, sollten mehrere Fortschritte sprich ein Array
	 * spezifiziert worden sein.
	 *
	 * `true` um die einzelnen Fortschritte als eine Serie fortlaufender Segmente anzuzeigen, `false` um die
	 * Fortschrittsanzeige in Segmente einzuteilen und den jeweiligen Fortschritt anzuzeigen.
	 */
	continuousProgress: boolean;

	/**
	 * Diese Eigenschaft steuert die Art der Fortschrittsanzeige.
	 *
	 * `true` um die Segmente jeweils zu 100% auszufüllen und nur deren Status visuell darzustellen, `false` um den
	 * Fortschritt in Prozent der einzelnen Segmente nebst deren Status visuell darzustellen.
	 */
	statusProgress: boolean;

	/**
	 * Diese Eigenschaft ruft den anzuzeigenden Statustext ab oder setzt diesen.
	 */
	statusText: string;

	/**
	 * Ein Indikator der anzeigt, ob das Formular aktuell gespeichert werden kann.
	 *
	 * `true` wenn das Formular gespeichert werden kann, ansonsten `false`.
	 */
	canSave: boolean;

	/**
	 * Ein Indikator der anzeigt, ob das Formular aktuell gespeichert wird.
	 *
	 * `true` wenn das Formular gerade gespeichert wird, ansonsten `false`.
	 */
	isSaving: boolean;

	/**
	 * Ein Indikator der anzeigt, ob das Formular aktuell versendet werden kann.
	 *
	 * `true` wenn das Formular versendet werden kann, ansonsten `false`.
	 */
	canSend: boolean;

	/**
	 * Ein Indikator der anzeigt, ob das Formular aktuell gesendet wird.
	 *
	 * `true` wenn das Formular gerade gesendet wird, ansonsten `false`.
	 */
	isSending: boolean;

	/**
	 * Ein Indikator der anzeigt, ob das Formular aktuell heruntergeladen werden kann.
	 *
	 * `true` wenn das Formular heruntergeladen werden kann, ansonsten `false`.
	 */
	canDownload: boolean;

	/**
	 * Ein Indikator der anzeigt, ob das Formular aktuell gedruckt/heruntergeladen wird.
	 *
	 * `true` wenn das Formular gerade gedruckt/heruntergeladen wird, ansonsten `false`.
	 */
	isDownloading: boolean;
}
