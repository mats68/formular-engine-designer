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


    
### CSS Styles verwenden
Es können CSS Styles zur Verwendung im Schema im `class`-property eingefügt werden. Z.B.:
```
	{
		type: 'label',
		label: 'Ubicazione dell\'impianto',
		class: 'col-span-2',
		style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.5rem;',
  }
```


- Es können alle Styles, die unter https://tailwindcss.com/docs dokumentiert sind, verwendet werden.
- Es können auch eigene styles in `tailwind.css` eingetragen werden.
- **Danach muss in beiden Fällen `npm run twp` ausgefürt werden.**
- Inline-Styles können im `style:`-property angegeben werden

