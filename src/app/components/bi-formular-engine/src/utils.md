# Schema-Utils
Häufig verwendete Komponenten und Funktionalitäten innerhalb der Anwendung wurden zu wiederverwenbaren Funktionen zusammengefasst.

### Konstanten
| Name | Beschreibung  | 
| ----------- | ----------- |
| schemaClassLayout | Die Standard CSS-Grid Definition in BI-Formularen, verwendet in Panels. | 

### Funktionen

| Name | Parameter | Beschreibung  | 
| ----------- | ----------- | ----------- |
| card_panel | `label`: Die Überschrift der Card. Kann ein Translation-Objekt sein. <br/>  `name`: Der Name der Komponente. <br/>  `hidden`: Funktion zur Anzeige. <br/>  `children`: Die im Card enthaltenen Komponenten. | Häufig verwendetes Card-Panel in den BI-Formularen. |
| card_edit_panel | `label`: Die Überschrift der Card. Kann ein Translation-Objekt sein. <br/>  `name`: Der Name der Komponente. <br/>  `hidden`: Funktion zur Anzeige. <br/>  `editProjektAbschnitt`: Projekt-Bearbeitungs-Abschnitt. Eines von: 'auftrag' , 'gebaude' , 'empfaenger' , 'adressen' , 'anlage' , 'geraete'. <br/>  `children`: Die im Card enthaltenen Komponenten.  | Card-Panel in den BI-Formularen mit der Möglichkeit, einen Projekt-Abschnitt zu bearbeiten. |
| card_expansionspanel | `label`: Die Überschrift des Panels. Kann ein Translation-Objekt sein. <br/>  `name`: Der Name der Komponente. <br/>  `children`: Die im Panel enthaltenen Komponenten. | Häufig verwendetes Expansionspanel in den BI-Formularen. |
| label | `text`: Der Text des Labels. Kann ein Translation-Objekt sein. <br/> `full`: Falls true, erstreckt sich über die ganze Zeile. <br/> | Erstellt eine Standard Label-Komponente. | 
| label_tr | wie oben  | Erstellt eine Standard Label-Komponente, wobei ein Translation-String übergeben werwden kann.  | 
| label_Input |  `label`: Die Beschriftung <br/> `field`: Der Feldname. <br/> `max`: Die Feldlänge. <br/> `props`: Weitere Komponenten-Propertys können hier als Objekt angegeben werden. <br/> | Erstelle ein Input mit Label in 2-Spalten-Design. |
| label_cb | `label`: Die Beschriftung <br/> `field`: Der Feldname. <br/>`props`: Weitere Komponenten-Propertys können hier als Objekt angegeben werden. <br/>   | Checkbox mit Label. | 
<!---
| label_tr | `text`:  <br/>  |  | 
-->

| label |  | | 


label


`text`:  <br/>