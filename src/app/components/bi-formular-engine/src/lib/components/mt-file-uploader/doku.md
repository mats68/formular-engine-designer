# File-Uploader

Diese Komponente dient zum Upload von Formular-Beilagen.

[Allgemeine Properties und Events](../../../common.md)

### fileUploaderProps Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| dokumentDefGuid | Der Guid des Typs der Beilage (z.B. Situationsplan). Falls leer, kann der Benutzer beim Uplaod einen Typ selbst angeben.  |
| uploadType | Einen der Werte: 'Formular', 'Beilage' oder 'Antwort'. <br> Formular: das Formular selbst ist ein pdf. <br> Beilage: Das pdf ist eine Beilage zum Formular. <br> Anwort: Eine Beilage, die nicht in der Liste der Beilagen erscheint. <br> Standard ist 'Beilage' |
|uploadOnly | Falls true, wird die Upload-Area immer angezeigt. Falls false, wird nach dem Upload eine Card mit den Daten des Uploads angezeigt. |
| documentTypes | Array mit möglichen Dokument-Typ Werten: 'pdf' , 'png' , 'jpg' , 'jpeg' , 'svg' , 'doc' , 'docx' |

### fileUploaderProps Events

| Name | Parameter | Beschreibung  | 
| ----------- | ----------- | ----------- |
| onBeforeLinkBeilage | `sm`: Die Instanz des SchemaManagers für dieses Formular. <br/>  `dokument`: Das Beilage-Dokument. | Hier kann manuell entschieden werden, ob die Beilage zum Formular gelinkt werden soll. |


Beispiel:
```
{
    type: 'fileuploader', 
    label: sm.translate(marker('panel_antwort.text_formularantwort_upload_pdf')), classLayout: 'mt-4 col-span-2',
    disabled(sm: SchemaManager) { return false },
    field: 'MELDEFORMULAR_ANTWORT_HOCHGELADEN',
    fileUploaderProps: {
        documentTypes: ['pdf'],
        dokumentDefGuid: form_guid,
        uploadType: 'Antwort',
        async onBeforeLinkBeilage(sm, beilage) {
            sm.service.emitFormularLoadingSpinner();
            const bw = new BeilageWrapper(beilage);
            const bf = new BeilageFormular(bw, sm.dokumentDTO);
            bw.beilageFormulare = [bf];
            await bw.updateAttached(bf, true, bd);
            await sm.service.LoadProjekt(sm.service.CurProjekt.auftrag.guid);
            await ProjektBeilagen.instance.Init();
            sm.Schema.defaultAbschnitt = 'BEILAGEN'
            sm.service.emitReloadFormular();
        }

    },
},

```
