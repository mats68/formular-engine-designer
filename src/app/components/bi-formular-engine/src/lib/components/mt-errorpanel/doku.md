# Errorpanel

Das Errorpanel zeigt die vorhanden Validier-Fehler mit den enthaltenen Abschnitten an.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| label | Der Label-Text zur Beschriftung des Panels. Es kann auch eine Funktion verwendet werden, die den Text dynamisch zurückgibt. |


Beispiel:
```
{
    type: 'errorpanel',
    hidden(sm){
        return sm.formularStatus > DokumentStatus.InArbeit;
    },
    label(sm) {
        if(sm.hasError){
            if(!sm.projekt?.gebaeude?.guid_Inhaber)
                return sm.translate(marker('comp_formular.prn_vm.ohne_anlagenbetreiber_kann_keine_vollmacht'));
            return sm.translate(marker('comp_formular.prn_vm.nicht_alle_mussfelder'));
        }
        return sm.translate(marker('comp_formular.prn_vm.beschreibung'));
    }
},
```
