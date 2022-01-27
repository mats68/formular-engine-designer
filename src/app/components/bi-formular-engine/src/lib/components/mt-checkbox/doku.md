# Checkbox

Die Standard Checkbox zur Anzeige von Boolean-Werten.

[Allgemeine Properties und Events](../../../common.md)


Beispiel:
```
{
    type: 'checkbox',
    label: { translation: { key: marker('page_projekt_wizard.label_auftraggeber_ist_eigentuemer') } },
    hidden(sm) {
        return !(sm.Values[cb_field] && field_prefix === 'eigentuemer' && sm.Values.auftraggeber_check)
    },
    field: 'auftrag.auftraggeberIstGebEigentuemer',
},
```
