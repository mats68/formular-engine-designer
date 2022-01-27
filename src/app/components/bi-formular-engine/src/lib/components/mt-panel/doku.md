# Panel
Das Panel ist die Standard Container-Komponente ohne zusätzliche Überschriften oder styles.
Das `classLayout`-Property enthält die CSS-Klassen für das Layout der Container und dessen children-Komponenten für das Grid-Layout. Beispielsweise enthält ein Panel für ein 2-Spalten Layout 'grid grid-cols-2'. Das Label enthält 'cols-start-1'. Das Input enthält 'cols-start-2'.

[Allgemeine Properties und Events](../../../common.md)

Beispiel:
```
	{
		type: 'panel',
		name: 'formular_header',
		classLayout: 'grid grid-3-cols-auto col-span-3 mb-4',
		class: 'col-span-3',
		style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
		children: [
			{
				type: 'panel',
				name: 'nummern_panel',
				classLayout: ` col-start-1 col-span-1`,
				children: [
					{ type: 'label', label: 'VNB Objekt-Nr.', classLayout: 'col-start-1 text-xs mt-2', },
					{ type: 'label', field: 'ABONR', classLayout: '', },
					{ type: 'label', label: 'Meldungs-Nr. VNB', classLayout: 'col-start-1 text-xs mt-2', },
					{ type: 'label', field: 'EVUAUFTJAHR', classLayout: '', },
				]
			},
		],
	},

```
