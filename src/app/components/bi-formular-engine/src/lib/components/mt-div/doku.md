# Div

Ein blankes div, bei dem keine zusätzlichen Styles angewendet werden. 
Das `classLayout`-Property wird dabei nicht angewendet.

[Allgemeine Properties und Events](../../../common.md)

Beispiel:
```
{	
    type: 'div', 
    class: 'flex flex-col', 
    name: 'error-panel-1', 
    hidden: true,
    children: [
        {
            type: 'div', class: 'bg-tertiary-color-6 pl-2 pt-2 pr-2 pb-1.5 flex flex-row',
            children: [
                { type: 'icon', icon: 'error', classLayout: 'm-0 p-0 mr-4', },//primary-color-6
                {
                    type: 'label',
                    classLayout: 'ml-2 mb-1.5',
                    label: tr_prop(marker('comp_formular.prn_vm.der_pronovo_rest_key_ist_ungueltig')),
                },
                {
                    type: 'button', kind: 'raised', color: 'primary', label: tr_prop(marker('comp_formular.prn_vm.jetzt_konfigurieren')), icon: 'add_business',
                    async onClick(sm) {
                        const ma = await sm.service.CurMitarbeiter();
                        sm.service.Show_Anbieter_Dialog().then(s => {
                            ma.pronovoRestKey = s as string;
                            pronovoRestKey = ma.pronovoRestKey;
                            sm.service.SaveProfil(ma);
                        });
                    }
                },
            ],
        },
    ]
},

```
