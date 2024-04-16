import { AppsList, RealmSliceList, RuleSet, RulesetsList, SchemaDetails, SchemaList } from "./common-interfaces";

export interface SchemaListResp{
    data:SchemaList[],
    status: string,
    statusCode: number,
    message: string
}

export interface SchemaDetailResp{
    data: SchemaDetails,
    status: string,
    statusCode: number,
    message: string
}

export interface RuleSetListResp{
    data: {
        workflows: RulesetsList[]
    },
    status: string,
    statusCode: number,
    message: string
}

export interface RuleSetDetailResp{
    data: RuleSet,
    status: string,
    statusCode: number,
    message: string
}

export interface ReamlSliceListResp{
    data: {
        slices: RealmSliceList[]
    },
    status: string,
    statusCode: number,
    message: string
}

export interface AppListResp{
    data: AppsList[],
    status: string,
    statusCode: number,
    message: string
}

export interface ReplicateRealmResp{
    data: any,
    status: string,
    statusCode: number,
    message: string
}

export interface ActivateRealmSliceResp{
    data: {
        
    },
    status: string,
    statusCode: number,
    message: string
}

export interface DeactivateRealmSliceResp{
    data: {
        
    },
    status: string,
    statusCode: number,
    message: string
}

export interface RulesetUpdateResp{
    status: string,
    statusCode: number,
    message: string
}

