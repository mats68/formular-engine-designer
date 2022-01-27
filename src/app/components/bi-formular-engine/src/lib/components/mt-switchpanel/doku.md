# Switchpanel

Das Switchpanel stellt ein auf-/zuklappbares Panel dar. Das `field`-Property kann dazu benützt werden, um den auf-/zugeklappten Zustand zu speichern.

[Allgemeine Properties und Events](../../../common.md)

Beispiel:
```
	{
		type: 'switchpanel',
		name: 'FrEmpExpl',
		label: 'Emplacements explosibles',
		field: 'EXPL_AREA',
		class: 'col-span-2',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		children: [
			label('Zone(s)'),
			{
				type: 'input',
				field: 'EXPL_ZONE',
				dataType: 'string',
				max: 16,
			},
			label('attestation du'),
			inputGroup([
				{
					type: 'date',
					field: 'ACK_DATUM2',
				},
				{
					type: 'input',
					field: 'BL_ACK2',
					dataType: 'string',
					max: 12,
					options: [
						'remises',
						'annexées',
						'à suivre',
					]
				},
			]),
		]
	},

```
