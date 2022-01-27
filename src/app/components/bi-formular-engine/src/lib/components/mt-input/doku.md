# Input
Das Input ist das Standard-Text-Eingabefeld. Es umfasst auch mehrzeilige Eingaben, numerische Felder und Autocomplete-Listen.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| dataType | Datentyp des Feldes. Mögliche Werte: 'string',  'float' , 'int'. Standard ist  'string' |
| options | Array mit Strings. Falls vorhanden, wird dazu benützt um eine Nachschlageliste anzuzeigen.  |
| filterOptions | falls true, werden die Werte der Nachschlageliste gefiltert anhand der Eingabe des Benutzers.  |
| multiline | Falls true, wird eine mehrzeilige Textarea statt eines Inputs angezeigt.  |
| rows | Falls multiline = true, die Anzahl angezeigter Zeilen.   |
| min | Falls dataType = 'string', die erlaubte minimale Länge der Eingabe. Falls dataType = 'int', der erlaubte minimale Zahlenwert.  |
| max | Falls dataType = 'string', die erlaubte maximale Länge der Eingabe. Falls dataType = 'int', der erlaubte maximale Zahlenwert. <br>Die Länge des Eingabefeldes wird dabei berechnet, falls beim `width`-Property keine andere Eingabe gemacht wird.  |
| suffix | Suffix-Text, der nach dem Input erscheint. |
| prefix | Prefix-Text, der vor dem Input erscheint. |



Beispiel:
```
{
    type: 'input',
    field: 'HERSTELLER',
    max: 40,
    options: [
        'SMA',
        'Fronius',
        'SolarEdge',
        'ABB',
        'Kostal',
        'E3/DC',
        'E3/DC',
        'Varta',
        'Solarwatt',
        'BYD',
        'sonnenBatterie ',
    ],
    width: w_full,
},

```
