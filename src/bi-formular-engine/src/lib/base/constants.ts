export const err_schema = 'schema must be an object with a type property';
export const err_notype = 'type Property is missing';
export const err_typewrong = 'type Property is wrong';
export const err_noChild = 'children Property is missing';
export const err_zeroChild = 'children Property has no entry';
export const err_noField = 'field Property is missing';
export const err_doubleField = 'field Property is more than once used!';
export const err_doubleName = 'name Property is more than once used!';
export const err_noOptions = 'options Property is necessary';
export const err_OptionsArray = 'options Property must be an array';
export const err_zeroOptions = 'options Property is empty';
export const err_wrongOptions = 'options Property is in the wrong format (either array of strings or array of {value, text} objects)';
export const err_OptionsDoubleValues = 'options Property has duplicate values';
export const err_noDataTableInDataTable = 'Nested Data-Table in Data-Table is not supported';
export const err_noDataTableNoField = 'Data-Table must have fields';

export const err_noIcon = 'icon Property is necessary';
export const err_unn = prop => `Unnecessary Property "${prop}"`;
