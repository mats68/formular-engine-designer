# Card

Stellt eine Karte dar mit einer optionalen Überschrift (label).

[Allgemeine Properties und Events](../../../common.md)


Beispiel:
```
{
	type: 'card',
	name: 'FrAllgemeineAngabenVSE_TAG',
	label: 'Weitere allgemeine Angaben',
	classLayout: 'w_full mt-5',
	children: [
		{
			type: 'panel',
			class: 'col-span-2',
			classLayout: schemaClassLayout,
			children: [
				label('Bemerkungen des einreichenden Unternehmens'),
				{
					type: 'input',
					field: 'BEMERKUNGEN',
					multiline: true,
					width: w_full,
					rows: 7,
					dataType: 'string'
				},

			],
		}
	]
}
```
