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
    client: number | UsersType | string;
};

export interface VehicleInterface {
    id?: string;
    VehicleType: string;
    PlateNumber: string;
    VehicleModel: string;
    ChasisNumber: string;
    ManufactureYear: string;
    client: UsersType;
    createdAt: string;
}

export type GPSType = {
    id?: string;
    serialNumber: string;
    simcardNumber: string;
    gpsStatus?: number;
    createdAt?: string;
};

export interface GPS {
    id: string;
    serialNumber: string;
    simcardNumber: string;
    gpsStatus: number;
    createdAt: string;
}

export type SubscriptionType = {
    id?: string;
    createdAt: string;
    expiredAt: string;
    vehicle: VehicleInterface;
    gps: GPSType;
};

export interface SubscriptionEnterface {
    id?: string;
    expiredAt: string;
    createdAt: string;
    vehicle?: VehicleInterface;
    gps: GPSType;
}

export type loginFormData = {
    email: string;
    password: string;
};
