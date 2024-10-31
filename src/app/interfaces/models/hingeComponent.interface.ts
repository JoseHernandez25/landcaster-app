import { Currency } from "./currency.interface";
import { Hinge } from "./hinge.interface";

export interface HIngeHingeComponent {
    id?:          number;
    hingeId?:     number;
    componentId?: number;
    quantity:    number;
    hinge?:       null;
    component:   HingeComponent;
}

export interface Brand {
    id:                     number;
    name:                   string;
    subSubCategories:       any[];
    drawerSlidesComponents: any[];
    drawerSlides:           any[];
    hinges:                 any[];
    hingeComponents:        null[];
    externalAccesory:       any[];
    colors:                 any[];
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
}


export interface HingeComponent {
    id:             number;
    code:           string;
    name:           string;
    price:          number;
    increaseFactor: number | null;
    createdAt:      null;
    updateAt:       null;
    deletedAt:      null;
    currencieId:    number;
    currency:       Currency;
    brandId:        number;
    brand:          Brand;
    hinges:         Hinge[];
}

export interface Brand {
    id:                     number;
    name:                   string;
    subSubCategories:       any[];
    drawerSlidesComponents: any[];
    drawerSlides:           any[];
    hinges:                 any[];
    hingeComponents:        null[];
    colors:                 any[];
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
}



export enum ISO {
    MN = "M.N",
    Usd = "USD",
}

export enum Name {
    Dólar = "DÓLAR",
    Peso = "PESO",
}

export enum Symbol {
    Empty = "$",
}

