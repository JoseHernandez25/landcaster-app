// Generated by https://quicktype.io

export interface SubSubCategory {
    id:            number;
    name:          string;
    subCategory:   null;
    subCategoryId: number;
    createdAt:     null;
    updatedAt:     null;
    deletedAt:     null;
}

export interface SubCategory {
    id:               number;
    name:             string;
    category:         null;
    categoryId:       number;
    subSubCategories: any[];
    createdAt:        null;
    updatedAt:        null;
    deletedAt:        null;
}
