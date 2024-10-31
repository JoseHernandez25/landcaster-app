export interface Joinery {
    id:            number;
    name:          string;
    createdAt:     null;
    updatedAt:     null;
    deletedAt:     null;
    joineryTypes: any[];
}

export interface JoinerieType {
    id:         number;
    name:       string;
    createdAt:  null;
    updatedAt:  null;
    deletedAt:  null;
    joineries:   any[];
}
