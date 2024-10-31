export interface Product {
    id:                   number;
    code:                 string;
    name:                 string;
    increaseFactor:    number;
    description:          string;
    cost:                 number;
    price:                number;
    brandId:              number;
    brand:                Brand;
    subSubCategoryId:     number;
    subSubCategory:       SubSubCategory;
    unitId:               number;
    unit:                 Unit;
    currencieId:          number;
    currencie:            Currencie;
    purchaseOrderDetails: any[];
    inventories:          any[];
    createdAt:            null;
    updatedAt:            null;
    deletedAt:            null;
}

export interface Brand {
    id:                     number;
    name:                   string;
    subSubCategories:       any[];
    drawerSlidesComponents: any[];
    drawerSlides:           any[];
    hinges:                 any[];
    hingeComponents:        any[];
    colors:                 any[];
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
}

export interface Currencie {
    id:                     number;
    name:                   string;
    iso:                    string;
    currentValue:           number;
    symbol:                 string;
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
    drawerSlidesComponents: any[];
}

export interface SubSubCategory {
    id:            number;
    name:          string;
    subCategory:   null;
    subCategoryId: number;
    createdAt:     null;
    updatedAt:     null;
    deletedAt:     null;
}

export interface Unit {
    id:                     number;
    name:                   string;
    abbreviation:           string;
    unitType:               number;
    createdAt:              null;
    updateAt:               null;
    deletedAt:              null;
    drawerSlidesComponents: any[];
}
