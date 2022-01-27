# Radiogroup

Die Standard Radiogroup um einen einzelnen Wert aus einer Liste einzugeben. 

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| options | Definition der Nachschlageliste. <br> Array mit Strings oder Objekte in der Form `{value: string | number, text: string}`. Im Falle von Objekten wird der `value`  gespeichert und der `text` dient der Anzeige.

Beispiel:
```
{
    type: 'radiogroup',
    options: [{ value: '', text: '-' }, 
              { value: 'N', text: 'Neuanlage' }, 
              { value: 'E', text: 'Erweiterung mit EEA' }, 
              { value: 'A', text: 'EEA Anlageersatz' }, 
              { value: 'T', text: 'EEA Teilersatz' }
             ],
    classLayout: 'mt-checkbox-group mb-6',
    field: 'EEA_TYP',
},

```
