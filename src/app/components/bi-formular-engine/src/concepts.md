# Konzepte

## Minimal-Beispiel

Ein Schema ist ein Typescript Objekt, welches die Komponenten auf einem Formular definiert.
Dies ist ein Minimal Schema mit nur einer Button-Komponente:

```
export const Button_1: ISchema = {
    type: 'button',
    label: 'Simple Button',
    onClick() {
        alert('Hello World!')
    }    
}
```

## Einfaches Formular

Dieses einfache Beispiel mit nur einem Button war zugegebenermassen wenig hilfreich.
<br>
Im nächsten Beispiel (Code siehe unten) werden die verschiedenen Konzepte eines Formulars anschaulich dargestellt:

### **Properties**

- Jede Komponente hat ein `type`-Property, welches die Art der Komponente definiert.
- In diesem Beispiel benutzen wird ein `panel` als Top-Komponente.
- Alle anderen Komponenten sind in dem `children`-Property enthalten.
- Für Positionierung benützen wir `classLayout`.
- Für css und inline-styles kann `style` und `class` benützt werden.
- `field` definiert das Feld für Daten-Komponenten.
- `hidden` um Komponenten ein- und auszublenden (kann als Boolean oder als Funktion definiert werden).

### **Events**
Neben normalen Properties hat jede Komponente eine Anzahl von Events:
(wie onClick, onChange etc.)

Jedes Event enhält eine Anzahl von Standard-**Parametern**:
| Name | Beschreibung  | 
| ----------- | ----------- |
| **sm** | Der SchemaManager (siehe Beschribung unten).|
| **comp** | Die Komponente, welche das Event augelöst hat.|
| **value** | Der aktuelle Wert, falls die Komponente ein field hat.|
| **arrayInd** | Falls die Komponente in einer Datatable ist, der aktuelle Index des Arrays.|
    
Es können auch noch andere Parameter bei spezifischen Events vorhanden sein.

In diesem Beispiel verwenden wir folgende **Events**:
| Name | Beschreibung  | 
| ----------- | ----------- |
| **initFormular** | Wird beim Initialisieren des Formulars aufgerufen. Wird hier verwendet, um die Feld-Werte zu initialisieren. |
| **onChange** | Auf der Schema-Ebene wird dies jedemal aufgerufen, wenn ein beliebiges Feld ändert. Wird hier verwendet, um den OK-Button anzuzeigen, falls keine Fehler vorhanden sind. |
| **onClick** | Beim Klick auf die Komponente. Wird hier verwendet, um die Valdierung aufzurufen, und das "gesendet"-Label anzuzeigen. |
| **validate** | Benutzerdefinierte Validierung. Zur Validierung der Hobbies (mindestens 3 Einträge müssen vorhanden sein). |

### **SchemaManager**
Jedes Event erhält als ersten Paramter die Instanz des SchemaManagers für dieses Formular.
Mit diesem können Eigenschaften des Formulars abgefragt werden (z.B. Felderwerte, vorhandene Fehler usw.), 
sowie Methoden aufgerufen werden (Eigenschaften der Komponenten manipulieren, auf Änderungen reagieren,  valideren, Inputs fokussieren, usw.).

| Name | Beschreibung  | 
| ----------- | ----------- |
| **Values** | Die aktuellen Werte des Formulars als Javascript-Object. |
| **Schema** | Das definierte Schema. |
| **getCompByName(name: string)** | Die Komponente nach name ermitteln, um dessen Properties zu ändern. |
| **getCompByField(field: string)** | Die Komponente nach field ermitteln, um dessen Properties zu ändern. |
| **getValue(field: IComponent)** | Den Wert einer Daten-Komponente ermitteln. |
| **updateValue(field: IComponent)** | Den Wert einer Daten-Komponente setzen. |
| **validateAll()** | Das Formular validieren. Fehler werden in das Errors-Array geschrieben. |
| **Errors** | Enthalt die Validierungs-Fehler. |
| **DoFocus(comp: IComponent)** | Fokussiert eine Komponente. |
| **DisableAll(disabled: boolean)** | Alle Komponenten disablen. |
| **traverseSchema(fn: ITraverseCallback)** | Durchläuft das Schema und ruft den Callback  für jede Komponente auf. |

### **Validierung**
Mussfelder werden mit dem `required`-Property versehen. <br>

Für speziellere Validierungen kann das `validate`-Event verwendet werden. Dieses wird ausgewert, nachdem validateAll() aufgerufen wurde.<br>
Es kann für jede Komponente, oder auch für das Schema selbst definiert werden.
Der Rückgabewert entspricht der Fehlermeldung. Für eine erfolgreiche Validierung soll ein Leer-String zurückgegeben werden.


Code des Schemas "Einfaches Formular":
```
//Nachschlageliste der Hobbies
const hobbies = [
    'Lesen', 'Brettspiele', 'Bücher', 'Programmieren', 'Kochen', 'Tanzen', 'Zeichnen', 'Electronik', 'Mode'];

//Label-Komponente als Funktion
const label = (text: string): IComponent => {
	return {
		type: 'label',
		classLayout: 'col-start-1 col-label-class-layout',
		label: text,
	}
}


let formular_ok = false

export const Basic_Form: ISchema = {
    type: 'panel',
    label: 'Einfaches Formular',
    classLayout: 'grid grid-cols-form',
    onChange() {
        //Wird jedesmal aufgerufen, wenn irgendein Feld auf dem Formular geändert wird
        formular_ok = false
    },
    initFormular(sm) {
        sm.Values = values
    },
    children: [
        label('Name'),
        {
            type: 'input',
            field: 'name',
            label: '',
            required: true,
            classLayout: 'col-start-2'
        },
        label('Geschlecht'),
        {
            type: 'radiogroup',
            field: 'geschlecht',
            class: 'mt-2',
            classLayout: 'col-start-2',
            options: ['Frau', 'Mann'],
        },
        {
            type: 'input',
            hint: 'Adresse eingeben',
            multiline: true,
            field: 'adresse',
            max: 300,
            label: '',
            classLayout: 'col-start-1 col-span-2',
            class: 'w-full',
        },
        {
            type: 'select',
            hint: 'Hobbies eingeben',
            field: 'hobbies',
            multiselect: true,
            options: hobbies,
            classLayout: 'col-start-1 col-span-2',
            label: '',
            class: 'w-full',
            validate(sm, comp, value) {
                //benutzerdefinierte Validierung, wenn 'required' nicht genügend ist
                if (value.length < 3) {
                    return 'Bitte mindestens 3 Hobbies eingeben'
                }
                return ''
            },
        },
        {
            type: 'checkbox',
            label: 'Bedingungen akzeptieren',
            field: 'terms',
            classLayout: 'col-start-1 col-span-2',
            onChange(sm, comp, value) {
                //Wird aufgerufen, wenn dieses Feld geändert wird
                const btn = sm.getCompByName('btnOk')
                btn.hidden = !value
            }
        },
        {
            type: 'button',
            name: 'btnOk',
            color: 'primary',
            class: 'mt-10',
            hidden: true,
            label: 'Ok',
            onClick(sm) {
                //Valideren des Formulars -> ändert das Errors-Array des Schemamanagers
                sm.validateAll()
                if (sm.Errors.length === 0) {
                    formular_ok = true
                }
            },
            classLayout: 'mt-10 col-start-1',
        },
        {
            type: 'label', 
            label: 'Daten wurden gesendet.',
            classLayout: 'col-start-1',
            hidden() {
                //Das Label wird nicht angezeigt, wenn das Formular Fehler enthält
                return !formular_ok
            }
        }
    ]

}

//Initialwerte
const values = {
    name: 'Fritz',
    adresse: 'Worblaufenstrasse 163\n 3048 Ittigen',
    geschlecht: 'Mann',
    hobbies: ['Lesen', 'Brettspiele'],
}

```