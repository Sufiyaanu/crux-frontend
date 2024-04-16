export enum CONSTANTS {
  SUCCESS = 'success',
  FAILED = 'failed',
  ERROR = 'Error',
  WARNING = 'Warning',
  DATA_NOT_FOUND = 'Data not found!',
  CANNOT_EDIT_RULESET_MSG = 'Ruleset cannot be edited as it is active',
  SCHEMA_DETAILS_DATA_NOT_FOUND = 'Details for the selected schema not found.',
  WORKFLOW_LIST_DATA_NOT_FOUND = 'No Workflow list present.',
  PLEASE_WAIT_PROCESSING_YOUR_DATA = 'Please wait, processing your data',
  BRESchema_LIST_API = '/wfschemaList',
  BRESchema_GET_API = '/wfschemaget',
  BRERulesets_LIST_API = '/workflowlist',
  BRERulesets_GET_API = '/workflowget',
  BRERulesets_UPDATE_API = '/workflowUpdate',
  BRE_NEW_WORKFLOW = '/workflowNew', 
  Realm_Slice_New_API = '/realmslicenew',
  Realm_Slice_LIST_API = '/realmslicelist',
  Realm_Slice_Apps_API = '/realmsliceapps',
  Realm_Slice_Activate_API = '/realmsliceactivate',
  Realm_Slice_Deactivate_API = '/realmslicedeactivate'
}

export const OperatorsUnicode = {
  ge : '&#8805;',
  gt : '&#62;',
  le : '&#8804;',
  lt : '&#60;',
  eq : '&#61;',
  ne : '&#8800;',
}

export enum AttrDataTypes {
  typeBool = 'bool',
  typeEnum = 'enum',
  typeStr = 'str',
  typeFloat = 'float',
  typeInt = 'int',
  typeTs = 'ts'
}