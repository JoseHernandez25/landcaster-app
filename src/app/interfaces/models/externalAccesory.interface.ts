export interface ExternalAccesories {
    id:                   number;
    code:                 string;
    name:                 string;
    cost:                 number;
    increaseFactor:       number;
    createdAt:            null;
    updateAt:             null;
    deletedAt:            null;
    currencieId:          number;
    currencie:            Currencie;
    brandId:              null;
    brand:                Brand;
    accesorieTypeId:      number;
    accesorieType:        AccesorieType;
    financingParameterId: null;
    financingParameter:   null;
}

export interface AccesorieType {
    id:                 number;
    name:               AccesorieTypeName;
    description:        null;
    createdAt:          null;
    updateAt:           null;
    deletedAt:          null;
    externalAccesories: null[];
}

export enum AccesorieTypeName {
    Basureros = "BASUREROS",
    BrazosYMecanismosDeApertura = "BRAZOS Y MECANISMOS DE APERTURA",
    Extraibles = "EXTRAIBLES",
    Iluminacion = "ILUMINACION",
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
    drawerSlidesComponents: any[];
    hingeComponents:        any[];
    externalAccesory:       null[];
}

export interface Brand {
    id:                     number;
    name:                   string;
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
    drawerSlidesComponents: any[];
    drawerSlides:           any[];
    hinges:                 any[];
    hingeComponents:        any[];    
    colors:        any[];
    externalAccesory:                 null[];
}

export enum ISO {
    Eur = "EUR",
    MN = "M.N",
    Usd = "USD",
}

export enum CurrencieName {
    Dólar = "DÓLAR",
    Euro = "EURO",
    Peso = "PESO",
}

export enum Symbol {
    Empty = "$",
    Symbol = "€",
}
