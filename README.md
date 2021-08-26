# Formular Engine Designer

Dieses Angular Projekt dient dazu Typescript Schemas der Formular-Engine zu testen.

## Programm installieren und kompilieren (Kommandozeile)

### npm i 
- Einmalig ausführen um packages zu installieren.

### npm start 
- Nach `http://localhost:4299/` navigieren. Die App lädt automatisch neu, wenn Source Files geändert werden.

## Neue Schemas erstellen und testen
- Unter src\app\schemas\ können neue Typescript-Schemas erstellt werden.
- Siehe Demo-Schema `demo1.ts`.
- Für jedes Schema muss ein eindeutiger export name (`export const xxx: ISchema`) und
  ein `label: 'xxx'` vergeben werden.
- das Schema muss in index.ts eingetragen werden.
- Danach kann in der laufenden App das Schema in der Combobox ausgewählt werden:
![alt text](src/assets/schema1.png) 

