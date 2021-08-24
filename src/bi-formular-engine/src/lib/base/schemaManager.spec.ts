import { IValueType, SchemaManager } from './schemaManager';
import { schemaErr } from './test/schemaErr'

import { err_schema, err_notype, err_typewrong, err_noChild, err_zeroChild, err_noField, err_doubleField, err_doubleName, 
     err_noOptions, err_zeroOptions, err_wrongOptions, err_OptionsDoubleValues, err_noIcon, err_noDataTableInDataTable, err_noDataTableNoField, err_unn } from './constants'

const hasError = (sm: SchemaManager, error: string, name?: string, field?: string ): boolean => {
    const f = sm.SchemaErrors.findIndex(e => {
        if (error === e.error) {
            if (name && e.comp.name !== name) return false
            if (field && e.comp.field !== field) return false
            return true
        }
        return false
    })
    return f > -1
}

describe('Schema is wrong', () => {
    const sm = new SchemaManager();

    it('schema error wrong type', () => {
        // @ts-ignore
        sm.InitSchema('ddd')
        expect(hasError(sm, err_schema)).toEqual(true);
    })

    it('schema error no type property', () => {
        // @ts-ignore
        sm.InitSchema({ label: 'dada'})
        expect(hasError(sm, err_schema)).toEqual(true);
    })

    it('schema ok', () => {
        sm.InitSchema({ type: 'label', label: 'dada'})
        expect(sm.SchemaErrors.length).toEqual(0);
    })
})

describe('Component has wrong properties', () => {
    const sm = new SchemaManager();
    sm.InitSchema(schemaErr)
    sm.CheckSchema()

    it('component no type', () => {
        expect(hasError(sm, err_notype, 'notype')).toEqual(true);
    })

    it('component wrong type', () => {
        expect(hasError(sm, err_typewrong, 'wrongtype')).toEqual(true);
    })

    it('container with no child', () => {
        expect(hasError(sm, err_noChild, 'noChild')).toEqual(true);
        expect(hasError(sm, err_noChild, 'noChild1')).toEqual(false);
        expect(hasError(sm, err_zeroChild, 'noChild1')).toEqual(true);
    })

    it('input has no field', () => {
        expect(hasError(sm, err_noField, 'nofield')).toEqual(true);
        expect(hasError(sm, err_noField, 'hasfield')).toEqual(false);
        expect(hasError(sm, err_noField, 'noLabelnoField')).toEqual(true);
    })

    // it('input has no label', () => {
    //     expect(hasError(sm, err_noLabel, 'noLabelnoField')).toEqual(true);
    // })

    it('input has no field', () => {
        // expect(hasError(sm, err_noLabel, 'noLabelnoField')).toEqual(true);
        expect(hasError(sm, err_noField, 'noLabelnoField')).toEqual(true);
    })

    it('double fields', () => {
        expect(hasError(sm, err_doubleField, '', 'doublefield')).toEqual(true);
        expect(hasError(sm, err_doubleField, 'hasfield')).toEqual(false);
    })
    
    it('double names', () => {
        expect(hasError(sm, err_doubleName, 'doublename')).toEqual(true);
        expect(hasError(sm, err_doubleField, 'hasfield')).toEqual(false);
    })


    it('select has no options', () => {
        expect(hasError(sm, err_noOptions, '', 'selectnoptions')).toEqual(true);
        expect(hasError(sm, err_noOptions, '', 'selecthasptions')).toEqual(false);
    })

    it('radiogroup has no options', () => {
        expect(hasError(sm, err_noOptions, '', 'radiogroupnooptions')).toEqual(true);
        expect(hasError(sm, err_noOptions, '', 'radiogrouphasptions')).toEqual(false);
    })

    it('select has zero options', () => {
        expect(hasError(sm, err_zeroOptions, '', 'selectzerooptions')).toEqual(true);
    })

    it('select has wrong options', () => {
        expect(hasError(sm, err_wrongOptions, '', 'selectwrongoptions')).toEqual(true);
        expect(hasError(sm, err_wrongOptions, '', 'selectwrongoptions2')).toEqual(true);
        expect(hasError(sm, err_wrongOptions, '', 'selectwrongoptions3')).toEqual(true);
        expect(hasError(sm, err_wrongOptions, '', 'selectwrongoptions4')).toEqual(true);
    })

    it('select has duplicate values in options', () => {
        expect(hasError(sm, err_OptionsDoubleValues, '', 'selectoptionsDouble1')).toEqual(true);
        expect(hasError(sm, err_OptionsDoubleValues, '', 'selectoptionsDouble2')).toEqual(true);

        expect(hasError(sm, err_OptionsDoubleValues, '', 'selectoptionsok1')).toEqual(false);
    })

    it('select has ok options', () => {
        expect(hasError(sm, err_wrongOptions, '', 'selectoptionsok1')).toEqual(false);
        expect(hasError(sm, err_wrongOptions, '', 'selectoptionsok2')).toEqual(false);
        expect(hasError(sm, err_wrongOptions, '', 'selectoptionsok3')).toEqual(false);
    })

    it('unnecessary option', () => {
        expect(hasError(sm, err_unn('label1'), 'btnunn')).toEqual(true);
        expect(hasError(sm, err_noIcon, 'iconmissing')).toEqual(true);
    })

    it('datatable in datatable not ok', () => {
        expect(hasError(sm, err_noDataTableInDataTable, 'datatableIndatatable')).toEqual(true);
        // expect(hasError(sm, err_noDataTableInDataTable, 'datatableNoFields')).toEqual(false);
    })

    it('datatable with no fields', () => {
        expect(hasError(sm, err_noDataTableNoField, 'datatable2')).toEqual(false);
    })
})


describe('SchemaManager Value Type', () => {
    const sm = new SchemaManager();

    it('test checkValueType', () => {
        let res;
        let x = undefined;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.undefined);
        x = null;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.null);
        x = 'aa';
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.string);
        x = 1;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.number);
        x = 1.5;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.number);
        x = true;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.boolean);
        x = y => y + 1;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.function);
        x = [];
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.array);
        x = { a: 1 };
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.object);
        x = { type: 'button' };
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.component);
    });
});


