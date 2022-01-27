# Lookup

Das Lookup erlaubt es, eine Nachschlageliste anhand der Eingabe des Benutzers aus einer Datenquelle asynchron anzuzeigen,
beipielsweise um eine Adresse aus einem API-Aufruf zu suchen.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| lookup_waittime | Die Zeit in ms, die gewartet wird, bevor der Aufruf an die API gemacht wird. Standard ist 300. |
| lookup_minlength | Die minimale Länge, der Aufruf an die API gemacht wird. Standard ist 3. |
| lookup_canClear | Zeigt ein Löschen-Knopf an, um die Eingabe zu entfernen. |


### Events

| Name | Parameter | Beschreibung  | 
| ----------- | ----------- | ----------- |
| lookup_fn | `sm`: Die Instanz des SchemaManagers <br/>  `comp`: Die Komponente, die das Event ausgelöst hat. <br/>  `text`: Der aktuelle Wert im Eingabefeld. | Hier kann der API-Aufruf gemacht und ein Promise der gefundenen Werte als Array von Objekten zurückgegeben  werden.  |
| lookup_cb | `sm`: Die Instanz des SchemaManagers <br/>  `comp`: Die Komponente, die das Event ausgelöst hat. <br/>  `suchtext`: Der aktuelle Wert im Lookup. <br/>  `old_suchtext`: Der vorherige Wert im Lookup. <br/>  `items`: Die in lookup_fn gefundenen Werte.  | Diese Funktion kann verwendet werden, um z.B. die in lookup_fn gefundenen Werte zu filtern.<br/> Es kann auch anstelle der lookup_fn benützt werden, wenn kein API-Aufruf gemacht werden soll und die Werte von vornherein feststehen. <br/> Es muss auch ein Array mit Objekten zurückgegeben werden.  |
| lookup_ItemSelected | `sm`: Die Instanz des SchemaManagers <br/>  `comp`: Die Komponente, die das Event ausgelöst hat. <br/> `item`: Das vom Benutzer ausgewählte Item | Nachdem der Benutzer ein Item aus der Auswahlliste gewählt hat, kann eine Verarbeitung erfolgen, z.B. Felder updaten gemäss dem Item. <br/> `item` ist normalerweise ein Objekt aus dem API-Aufruf. |
| lookup_expression | `item`: Das vom Benutzer ausgewählte Item  | Diese Funktion definiert den Text, der im Input angezeigt wird, nachdem der Benutzer ein Item aus der Auswahlliste gewählt hat. |

Beispiel:
```
{
    type: 'lookup',
    field: 'hersteller',
    classLayout: 'col-start-2',
    max: 40,
    width: w_full,
    required: true,
    lookup_fn(sm, comp) {
        const row = sm.datatable_getCurRow(comp)
        if (row && row.typ) {
            const apiType = typToComponentsApiType(row.typ)
            if (apiType) {
                return sm.service.kompoDBApi_Brands(apiType)
            }
        }
        return new Promise((resolve) => resolve([]))
    },
    lookup_cb(sm, comp, suchtext: string, old_suchtext, items) {
        if (items) {
            const st = suchtext.toLowerCase()
            const filtered = items.filter(item => (item.name.toLowerCase().indexOf(st) > -1))
            return filtered
        }
        return null
    },
    lookup_minlength: 1,
    lookup_expression(item: any) {
        if (!item) return ''
        return `${item.name}`
    },
    lookup_ItemSelected(sm, comp, item) {
        if (!item) return
        const row = sm.datatable_getCurRow(comp)
        if (row) {
            row.hersteller = item.name
        }
    },

}

```
