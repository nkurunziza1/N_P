export interface User {
    _id?: string;
    fullname: string;
    email: string;
    telephone: string;
    role: string;
}

export type ScheduleType = {
    _id?: string;
    date: string;
    location: string;
    telephone: string;
    loadType: string;
    status?: string;
};
export type Schedule = {
    _id?: string;
    date: string;
    location: string;
    telephone: string;
    loadType: string;
    status?: string;
};
export type GarbageType = {
    schedule: Schedule;
};

export type RoleType = {
    role: string;
};

export type assignType = {
    schedule: string;
    collector: string;
};

export type loginFormData = {
    email: string;
    password: string;
};
