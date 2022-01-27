# File-Viewer

Diese Komponente dient zur Anzeige einer Beilage innerhalb eines Formulars.

[Allgemeine Properties und Events](../../../common.md)

### fileViewerProps Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| dokumentDefGuid | Der Guid des Typs der Beilage (z.B. Situationsplan). Falls leer, kann der Benutzer beim Uplaod einen Typ selbst angeben.  |
| uploadType | Einen der Werte: 'Formular', 'Beilage' oder 'Antwort'. <br> Formular: das Formular selbst ist ein pdf. <br> Beilage: Das pdf ist eine Beilage zum Formular. <br> Anwort: Eine Beilage, die nicht in der Liste der Beilagen erscheint. <br> Standard ist 'Beilage' |

Beispiel:
```
	{
		type: 'fileviewer',
		classLayout: 'col-start-1 col-span-2',
		style: 'height: 1050px; width: 95%',
		fileViewerProps: {
			dokumentDefGuid: PRONOVO_VOLLMACHT_form,
			uploadType: 'Formular',
		},
	},

```
