
export interface DrawerSlideComponent {
    id:             number;
    supplierCode:   string;
    name:           string;
    cost:           number;
    createdAt:      null;
    updateAt:       null;
    deletedAt:      null;
    increaseFactor: number;
    currencieId:    number;
    currencie:      Currencie;
    brandId:        null;
    brand:          null;
    unitId:         number;
    unit:           Unit;
    drawerSlides:   DrawerSlide[];
}

export interface Currencie {
    id:                     number;
    name:                   CurrencieName;
    iso:                    ISO;
    currentValue:           number;
    symbol:                 Symbol;
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
    drawerSlidesComponents: null[];
    hingeComponents:        any[];
}

export enum ISO {
    MN = "M.N",
    Usd = "USD",
}

export enum CurrencieName {
    Dólar = "DÓLAR",
    Peso = "PESO",
}

export enum Symbol {
    Empty = "$",
}

export interface DrawerSlide {
    id:                number;
    code:              string;
    name:              string;
    price:             number;
    cost:              number;
    description:       string;
    increaseFactor:    number;
    createdAt:         null;
    updateAt:          null;
    deletedAt:         null;
    brandId:           null;
    brand:             null;
    drawerSlideTypeId: number;
    drawerSlideType:   null;
    components:        null[];
}

export interface Unit {
    id:                     number;
    name:                   UnitName;
    abbreviation:           Abbreviation;
    unitType:               number;
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
    drawerSlidesComponents: null[];
}

export enum Abbreviation {
    Juego = "JUEGO",
    Pza = "PZA",
}

export enum UnitName {
    Juego = "JUEGO",
    Pieza = "PIEZA",
}
