# Spinner

Diese Komponente dient zur Anzeige einer Animation während eines Ladevorgangs.

[Allgemeine Properties und Events](../../../common.md)

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| loading | boolean oder Funktion die bestimmt, ob die Lade-Animation angezeigt wird.  |


Beispiel:
```
  { 
    type: 'spinner', 
    name: 'einreicher_spinner', 
    classLayout: 'mt-2', 
    loading(sm) {
        return sm.FormularInitialised === false
    }

  },
```

