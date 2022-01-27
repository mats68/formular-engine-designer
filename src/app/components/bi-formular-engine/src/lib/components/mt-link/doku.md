# Link

Diese Komponente verhält sich wie der Button, aber statt eine onClick-Aktkion kann ein Link angegeben werden.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| kind | Der Typ und die visuelle Darstellung des Buttons. Mögliche Werte: 'standard', 'raised', 'stroked', 'flat', 'icon', 'fab', 'minifab'   |
| tooltip | Der Tooltip-Text, der angezeigt wird, wenn die Maus über den Button fährt. |
| icon | Das Material Design Icon, das im Button angezeigt wird (als Text-Wert). Die möglichen Icons siehe https://fonts.google.com/icons?selected=Material+Icons  |
| href | Die Ziel-Adresse |
| openInNewTab | Falls der Link in einem neuen Brwoser-Tab geöffnet werden soll. |


Beispiel:
```
{
    type: 'link', 
    openInNewTab: true, 
    classLayout: 'text-xs',
    disabled(sm) { return false; },
    label(sm) {return sm.translate(marker('comp_formular.prn_vm.gesuch_case_nr'), case_nr: sm.Values.PRONOVO_CASE_NR})}, 
    href(sm){
        return `${pronovoUrl}my/register-case/gesuche-in-bearbeitung-1/${sm.Values.PRONOVO_CASE_NR}-${sm.Values.PRONOVO_CASE_ID}/form`
    },
    hidden(sm) { return !Boolean(sm.Values.PRONOVO_CASE_NR && sm.Values.PRONOVO_CASE_ID) || !istLocalhost(); },
},

```
