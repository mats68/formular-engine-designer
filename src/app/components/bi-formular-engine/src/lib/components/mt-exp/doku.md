# Expansionspanel

Das Expansionspanel stellt ein auf-/zuklappbares Panel dar. Das `field`-Property kann dazu benützt werden, um den auf-/zugeklappten Zustand zu speichern.

[Allgemeine Properties und Events](../../../common.md)

Beispiel:
```
{
    type: 'expansionspanel',
    label: tr_prop(marker('comp_formular.prn_ges.sicherheitsnachweis')),
    styles: { label: "font-size: 1rem;font-weight: 600;" },
    expanded: false,
    disabled() { return false },
    classLayout: 'mb-2',
    icon: 'picture_as_pdf',
    onGetClass(sm, comp, def, name) {
        if (name === 'icon')
            return `${def} tertiary-color${hasBeilage(sm, SINA18_DE_form) ? '2' : '3'}`;
        return def;
    },
    children: [
        { type: 'label', field: 'ULQK_upload_sina_mpk1', hidden: true },
        {
            type: 'fileuploader',
            label: tr_prop(marker('comp_formular.prn_ges.sicherheitsnachweis_hochladen')),
            classLayout: 'col-start-1 col-span-1',
            fileUploaderProps: {
                documentTypes: ['pdf'],
                dokumentDefGuid: SINA18_DE_form,
                uploadType: 'Beilage',
            },
        },
    ]
},
```
