# Label

Die Komponente zur Anzeige eines einfachen Textes. Es kann auch das `field`-Property
verwendet werden. um den Text aus der Datenquelle anzuzeigen.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| label | Der Label-Text zur Beschriftung. Es kann auch eine Funktion verwendet werden, die den Text dynamisch zurückgibt. |
| field | Falls der Text aus einem Feld abgefüllt werden soll. |

Beispiel:
```
{ 
    type: 'label', 
    label: 'Meldungs-Nr. VNB', 
    classLayout: 'col-start-1 text-xs mt-2', 
},
```
