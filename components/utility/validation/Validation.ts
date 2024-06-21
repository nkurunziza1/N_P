import * as Yup from 'yup';

export const clientSchema = Yup.object().shape({
    firstName: Yup.string().required('Please fill the first name').min(2, 'Too Short!').max(25, 'Too Long!'),
    lastName: Yup.string().required('Please fill the last name').min(2, 'Too Short!').max(25, 'Too Long!'),
    email: Yup.string().email().required('please enter an email'),
    phoneNumber: Yup.string().required('Please provide telephone number'),
    NID: Yup.string().required('Please provide National ID').min(16, 'NID supposed to be 16 characters').max(50, 'NID supposed to be 16 characters'),
});

export const vehicleSchema = Yup.object().shape({
    VehicleType: Yup.string().required('Please fill the Vehicle Type').min(2, 'Too Short!').max(25, 'Too Long!'),
    PlateNumber: Yup.string().required('Please fill plate number').min(7, 'Plate number should be 7 characters').max(25, 'Too Long!'),
    VehicleModel: Yup.string().required('Please fill the vehicle model').min(2, 'Too Short!').max(25, 'Too Long!'),
    ChasisNumber: Yup.string().required('Please provide telephone number').min(2, 'Too Short!').max(25, 'Too Long!'),
    ManufactureYear: Yup.string().required('Please provide manufacture ID').min(4, 'Too Short!').max(25, 'Too Long!'),
    // client: Yup.string().required('Please provide client'),
});

export const gpsSchema = Yup.object().shape({
    serialNumber: Yup.string().required('Please fill the gps serial number'),
    simcardNumber: Yup.string().required('Please fill the  Gps simcard number'),
});

export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export const signupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    fullname: Yup.string().required('Full name is required'),
    telephone: Yup.string().required('Telephone is required'),
});

export const SechaduleSchema = Yup.object().shape({
    date: Yup.string().required('date is required'),
    loadType: Yup.string().required('Password is required'),
    location: Yup.string().required('Full name is required'),
    telephone: Yup.string().required('Telephone is required'),
});



