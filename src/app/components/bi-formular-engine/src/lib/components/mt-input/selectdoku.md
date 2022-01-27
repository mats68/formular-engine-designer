# Select
Das Select ist das Standard-Select-Eingabefeld. 

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| options | Definition der Nachschlageliste. <br> Array mit Strings oder Objekte in der Form `{value: string | number, text: string}`. Im Falle von Objekten wird der `value`  gespeichert und der `text` dient der Anzeige. |
| multiselect | Falls True, können mehrere Werte eingetragen werden und als Array gespeichert werden. |
| suffix | Suffix-Text, der nach dem Input erscheint. |
| prefix | Prefix-Text, der vor dem Input erscheint. |



Beispiel:
```
{
    type: 'select',
    field: 'sprache',
    options: ['deutsch', 'français', 'italiano']
},
```
