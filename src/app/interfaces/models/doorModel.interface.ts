import { MaterialType } from "./color.interface";
import { JoinerieType, Joinery } from "./joinery.interface";
import { Material } from "./material.interface";
import { Model } from "./model.interface";

export interface DoorModel {
    id:             number;
    molding:        string;
    edging:         string;
    privateCatalog: string;
    publicCatalog:  string;
    modelId:        number;
    joineryId:      number;
    joineryTypeId:  number;
    lineId:         number;
    routeId:        number;
    materialTypeId: number;
    joinery:        Joinery;
    joineryType:    JoinerieType;
    materialType:   MaterialType;
    route:          Route;
    line:           Line;
    model:          Model;
    createdAt:      Date;
    updatedAt:      Date;
    deletedAt:      Date;
    typesBoxJournies: any[];
}

export interface Route {
    id:          number;
    code:        string;
    description: string;
    type:        number;
    createdAt:   Date;
    updateAt:    Date;
    deletedAt:   Date;
}
export interface Line {
    id:          number;
    name:        string;
    description: string;
    createdAt:   Date;
    updatedAt:   Date;
    deletedAt:   Date;
}


