export type UsersType = {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    NID: string;
};

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    NID: string;
    createdAt: string | Date;
}

export type VehicleType = {
    id?: string;
    VehicleType: string;
    PlateNumber: string;
    VehicleModel: string;
    ChasisNumber: string;
    ManufactureYear: string;
    client: number | UsersType;
};

export interface VehicleInterface {
    id?: string;
    VehicleType: string;
    PlateNumber: string;
    VehicleModel: string;
    ChasisNumber: string;
    ManufactureYear: string;
    client: UsersType;
}
