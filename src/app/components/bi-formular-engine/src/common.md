# Allgemeine Properties und Events
Allgemein verwendete Eigenschaften der Komponenten


### Allgemeine Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| label | Der Label-Text zur Beschriftung des Eingabefeldes. Es kann auch eine Funktion verwendet werden, die den Text dynamisch zurückgibt. Für Inputs wird normalerweise ein separates Label verwendet und diese Eigenschaft leer gelassen. |
| name | Der Name der Komponente. Dieser wird verwendet, um die Komponente eindeutig zu identifizieren. Der SchemaManager kann die Komponente finden mittels getCompByName(name), um die Eigenschaften zu modifizieren. |
| classLayout | classLayout enthält die CSS-Klassen für das Layout der Container und dessen children-Komponenten für das Grid-Layout. Beispielsweise enthält ein Panel für ein 2-Spalten Layout 'grid grid-cols-2'. Das Label enthält 'cols-start-1'. Das Input enthält 'cols-start-2'. |
| class | Die CSS-Klassen für die Komponente. z.B. 'font-bold ml-4' für fette Schrift und linken Rand von 1rem. |
| style | Die Inline-Styles der Komponente. z.B. 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.5rem;' |
| hidden | Bestimmt, ob die Komponente angezeigt oder unsichtbar ist. Es kann auch eine Funktion verwendet werden, die die Komponente dynamisch anzeigt/versteckt. |
| disabled | Bestimmt, ob die Komponente aktiviert oder deaktiviert ist. Es kann auch eine Funktion verwendet werden, die die Komponente dynamisch aktiviert/deaktiviert. |
| color | Bestimmt die Theme-Color der Komponente. Mögliche Werte sind: 'primary' , 'secondary' , 'secondary-2' , 'accent' , 'warn' , 'ok'  |
| width | Die Breite der Komponente als Inline-Style. z.b: '100%' oder '12ch'. |
| autofocus | Falls true, wird das Eingabefeld beim Start fokussiert. |
| id | Id der Komponente. Wird für Links verwendet. |
| tag | Für benutzerspezifische Daten. |

### Allgemeine Events

| Name | Parameter | Beschreibung  | 
| ----------- | ----------- | ----------- |
| onClick | `sm`: Die Instanz des SchemaManagers für dieses Formular. <br/>  `comp`: Die Komponente, die das Event ausgelöst hat. | Wird beim Klick auf die Komponente ausgelöst. |


### Allgemeine Properties für Daten-Komponenten

| Name | Beschreibung  | 
| ----------- | ----------- |
| field | Der eindeutige Feldname bei Daten-Komponenten. Der Wert wird bei Änderung in das Values-Object des Schemamanagers geschrieben. Der Feldname kein ein Punkt (".")  enthalten, um das Feld in einem Sub-Objekt zu speichern. Auch ein Label kann ein field enthalten, um den Wert des label aus dem Feld anzuzeigen. Bei Expanlsionspanel und SwitchPanel wird das Feld verwendet, um den aufgeklappten Zustand zui speichern. |
| default | Standardwert bei Daten-Komponenten. |
| required | Wird gesetzt für Muss-Felder. |


### Allgemeine Events für Daten-Komponenten

| Name | Parameter | Beschreibung  | 
| ----------- | ----------- | ----------- |
| onChange | `sm`: Die Instanz des SchemaManagers für dieses Formular. <br/>  `comp`: Die Komponente, die das Event ausgelöst hat. <br/>  `value`: Der aktuelle Wert des Inputs. <br/>  `arrayInd`: Bei Datentabellen der aktuelle Index des Arrays | Wird beim Ändern der Daten ausgelöst. Werden die Values direkt geändert, wird das Event nicht ausgelöst. Deshalb sollte die Methide updateValue() verwendet werden. |
| validate | `sm`: Die Instanz des SchemaManagers für dieses Formular. <br/>  `comp`: Die Komponente, die das Event ausgelöst hat. <br/>  `value`: Der aktuelle Wert des Inputs. <br/>  `arrayInd`: Bei Datentabellen der aktuelle Index des Arrays| Wird ausgelöst, nachdem die Methode validateAll() aufgerufen wurde. Der Rückgabewert entspricht der Fehlermeldung. Für eine erfolgreiche Validierung soll ein Leer-String zurückgegeben werden. |

### Allgemeine Properties für Container-Komponenten

| Name | Beschreibung  | 
| ----------- | ----------- |
| children | Array, das die Komponenten des Containers enthält |


