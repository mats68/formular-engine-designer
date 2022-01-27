# Datatable

Die Datatable ist ein spezielle Komponente, die es erlaubt, ein Array von Komponenten anzuzeigen und zu bearbeiten.<br>
Es können automatisch Einträge hinzugefügt, geändert, gelöscht, sortiert, per Drag&Drop verschoben usw. werden.<br>
Die einzelnen Spalten müssen im `coldefs`-Property definiert werden. Hier können auch Funktionen definiert werden, die 
eine benutzerdefinierte Augabe der Spalten ermöglichen.<br>
Die Detailansicht, um einen Datensatz in der Datentabelle zu bearbeiten, können im `detailComponent`-Property definiert werden.<br>
Das `field` enthält das Feld als Array mit den Detaildatensätzen als Unterobjekte.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| colDefs | Die Spaltendefinitionen. Siehe unten. |
| dragdrop | Falls true, können die Zeilen per Drag&Drop verschoben werden. |
| detailComponent | Die Definition der Komponenten des Detail-Datensatzes  |
| addRowLabel | Der Text, der verwendet wird um einen Datensatz hinzuzufügen |

### Events
| Name | Beschreibung  | 
| ----------- | ----------- |
| onAfterCopyRow | Wird ausgelöst, nachdem ein Datensatz kopiert wurde.  |


### Properties ColDef
| Name | Beschreibung  | 
| ----------- | ----------- |
| field | Das Datenfeld für die Spalte |
| title | Die Überschrift für die Saplte |
| expression? | Eine Funktion, um einen benutzerdefinierten Inhalt der Zelle anzuzeigen. |
| styleExpression? | Um einen bestimmten style in einer Zelle anzuwenden |
| class? | CSS-Klasse der Tabelle |
| classTitle? |CSS-Klasse des Titels |
| classContent? |CSS-Klasse einer Zelle |
| htmlTitle? | Falls true, wird der titel als html interpretiert. |
| htmlContent? | Falls true, wird der Zelleninhalt als html interpretiert. |
| ausrichtungTitle? | 0 = linksbündig, 1 = zentriert, 2 = rechtsbündig |
| ausrichtungContent? | 0 = linksbündig, 1 = zentriert, 2 = rechtsbündig |


Beispiel für eine Datatable:
```
		{
			type: 'datatable',
			field: 'TAListe',
			classLayout: 'col-start-1 col-span-2',
			dragdrop: true,
			gridClass: 'grid-cols-ta-liste',
			colDefs: colDefsMessSteuer,
			detailComponent: {
				type: 'panel',
				classLayout: schemaClassLayout,
				children: [
					label('Client'),
					{
						type: 'input',
						field: 'BEZUEGER',
						max: 40,
						dataType: 'string',
					},
					label('Adresse de facturation'),
					{
						type: 'input',
						field: 'RECHADR',
						max: 100,
						dataType: 'string',
						width: w_full,
					},
					label('Partie de bâtiment'),
					{
						type: 'input',
						field: 'GEBTEIL',
						max: 40,
						dataType: 'string',
					},
					label('Utilisation'),
					{
						type: 'input',
						field: 'NUTZUNG',
						max: 40,
						dataType: 'string',
					},
					label('Point de cons. GRD'),
					{
						type: 'input',
						field: 'EVUANLNR',
						max: 20,
						dataType: 'string',
					},
					label('Etage'),
					{
						type: 'input',
						field: 'STOCKWERK',
						max: 6,
						dataType: 'string',
					},
					label('N° de la pièce'),
					{
						type: 'input',
						field: 'RAUM',
						max: 6,
						dataType: 'string',
					},
					label('Tarif GRD'),
					{
						type: 'input',
						field: 'TARIF',
						max: 30,
						dataType: 'string',
					},
					label('Fus.'),
					{
						type: 'input',
						field: 'SICH_IN',
						dataType: 'int',
						suffix: 'A'
					},
					label('Numéro du compteur GRD'),
					{
						type: 'input',
						field: 'WERKNR',
						max: 20,
						dataType: 'string',
					},
					label('Emplacement'),
					{
						type: 'input',
						field: 'MONT_ORT',
						max: 30,
						dataType: 'string',
					},
					label(''),
					cb_single('RCP', 'ZEV', false),
					label('Nbre de cond. de phases (1-3)'),
					{
						type: 'input',
						field: 'ANZ_AUSSENL',
						dataType: 'int',
						options: [
							'1',
							'2',
							'3',
						],
					},
					label(''),
					checkBoxGroup([
						{ label: 'nouveau', field: 'NEU' },
						{ label: 'existant', field: 'VORH' },
						{ label: 'remplacez', field: 'AUSW' },
						{ label: 'démonté', field: 'DEMONT' },
						{ label: 'déplacé', field: 'UMMONT' },
					], { required: false, multipleSelection: true }),
				],
			},
```


Beispiel für eine colDefs:
```

const kundeKomb_expr = (data: any) => {
	var ret = textZusammensetzen(data.BEZUEGER, ", ", data.RECHADR);
	ret = textZusammensetzen(ret, ", ", data.GEBTEIL);
	ret = textZusammensetzen(ret, ", ", data.NUTZUNG);
	return ret;
}

const stockwKomb_expr = (data: any) => {
	var ret = textZusammensetzen(data.STOCKWERK, ", ", data.EVUANLNR);
	return ret;
}

const colDefsMessSteuer: ColDef[] = []
colDefsMessSteuer.push({ field: 'kundeKomb', htmlTitle: true, title: tableHeaderText('Client et adresse<br>de facturation utilisation'), expression: kundeKomb_expr, class: 'col-start-1 col-span-1 truncate-text' })
colDefsMessSteuer.push({ field: 'stockwKomb', title: 'Etage/Pt. de consomm. GRD', expression: stockwKomb_expr, class: 'col-start-2 col-span-1 truncate-text' })
colDefsMessSteuer.push({ field: 'RAUM', title: 'N° de la pièce', class: 'col-start-3 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'TARIF', title: 'Tarif GRD', class: 'col-start-4 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'SICH_IN', title: 'Fus. [A]', class: 'col-start-5 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'WERKNR', title: 'Numéro du compteur GRD', class: 'col-start-6 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'MONT_ORT', title: 'Emplace- ment', class: 'col-start-7 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'ZEV', htmlTitle: true, title: tableHeaderTextRotate('RCP'), class: 'col-start-8 col-span-1  truncate-text', ausrichtungContent: 1 })
colDefsMessSteuer.push({ field: 'ANZ_AUSSENL', htmlTitle: true, title: tableHeaderText('Nbre de cond. de phases<br>(1-3)'), class: 'col-start-9 col-span-1  truncate-text', ausrichtungContent: 1 })
colDefsMessSteuer.push({ field: 'NEU', htmlTitle: true, title: tableHeaderTextRotate('nouv.'), class: 'col-start-10 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'VORH', htmlTitle: true, title: tableHeaderTextRotate('exist.'), class: 'col-start-11 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'AUSW', htmlTitle: true, title: tableHeaderTextRotate('éch.'), class: 'col-start-12 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'DEMONT', htmlTitle: true, title: tableHeaderTextRotate('dém.'), class: 'col-start-13 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'UMMONT', htmlTitle: true, title: tableHeaderTextRotate('dépl'), class: 'col-start-14 col-span-1  truncate-text', ausrichtungContent: 2 })

```
