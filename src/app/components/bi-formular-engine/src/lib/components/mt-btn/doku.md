# Button

Das Standard HTML Button Element.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| kind | Der Typ und die visuelle Darstellung des Buttons. Mögliche Werte: 'standard', 'raised', 'stroked', 'flat', 'icon', 'fab', 'minifab'   |
| tooltip | Der Tooltip-Text, der angezeigt wird, wenn die Maus über den Button fährt. |
| icon | Das Material Design Icon, das im Button angezeigt wird (als Text-Wert). Die möglichen Icons siehe https://fonts.google.com/icons?selected=Material+Icons  |


Beispiel:
```
{
    type: 'button',
    classLayout: 'col-start-1 col-span-2',
    label: tr_prop(marker('comp_data_list_lizenzen.button_demo_kaufen-20')),
    hidden() {
        return !isTestEnvironment
    },
    onClick() {
        cbDemoKaufen(20)
    }
},

```
