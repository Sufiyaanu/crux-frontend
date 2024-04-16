export interface SchemaList {
    app: string,
    slice: number,
    class: string,
    longname: string,
    slicedesc: string,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface SchemaDetails {
    slice: number,
    app: string,
    class: string,
    patternschema: SchemaPatternAttr[],
    actionschema: SchemaAction,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface SchemaPattern{
    class: string,
    attr: SchemaPatternAttr[]
}

export interface SchemaPatternAttr{
    attr: string,
    shortdesc: string,
    longdesc: string,
    valtype: string,
    vals?: string[],
    valmin?: number
    valmax?: number
    lenmin?: number
    lenmax?: number
}

export interface SchemaAction{
    class: string,
    tasks: string[],
    properties: string[]
}

export interface AppInfo {
    discription: string;
    value: string;
}

export interface SliceInfo {
    discription: string;
    value: number;
}

export interface SelectedData{
    app: string | null,
    slice: number | null,
    class: string | null,
}

export interface RulesetsList {
    id: number,
    slice: number,
    app: string,
    class: string,
    name: string,
    longdesc: string,
    is_active: boolean,
    is_internal: boolean,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface RuleSet {
    id: number,
    slice: number,
    app: string,
    class: string,
    name: string,
    flowrules: Rule[],
    is_active: boolean,
    is_internal: boolean,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface UpdateRuleSet {
    id: number,
    slice: number,
    app: string,
    class: string,
    name: string,
    flowrules: Rule[],
    is_active: boolean,
    is_internal: boolean,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface Rule {
	rulepattern: RulePatternTerm[]
	ruleactions: RuleActions
}

export interface RTree {
    setname: string
	rulePattern: RulePatternTerm[]
	ruleActions: RuleActions
    thenRuleset?: RTree[]
    elseRuleset?: RTree[]
}

export interface RTreeRulesets {
    [setname: string]: RuleSet 
}

export interface RulePatternTerm {
	attr: string
	op:       string
	val:  any
}

export interface RuleActions {
	tasks:      string[]
	properties: Property
	thencall?:   string
	elsecall?:   string
	return?: boolean
	exit?:   boolean
}

export interface Property {
    [key:string]: string
  }

export interface App {
    name: string,
    code: string
}

export interface RealmSliceList {
    id: number,
    descr: string,
    active: boolean,
    deactivateat: string,
    createdat: string,
    createdby: string
}

export interface AppsList{
    shortname: string,
    longname: string
}