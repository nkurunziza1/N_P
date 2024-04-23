import * as Yup from 'yup';

export const clientSchema = Yup.object().shape({
    firstName: Yup.string().required('Please fill the first name'),
    lastName: Yup.string().required('Please fill the last name'),
    email: Yup.string().email().required('please enter an email'),
    phoneNumber: Yup.string().required('Please provide telephone number'),
    NID: Yup.string().required('Please provide National ID'),
});

export const vehicleSchema = Yup.object().shape({
    VehicleType: Yup.string().required('Please fill the Vehicle Type'),
    PlateNumber: Yup.string().required('Please fill plate number'),
    VehicleModel: Yup.string().required('Please fill the vehicle model'),
    ChasisNumber: Yup.string().required('Please provide telephone number'),
    // ManufactureYear: Yup.string().required('Please provide manufacture ID'),
    // client: Yup.string().required('Please provide client'),
});

export const gpsSchema = Yup.object().shape({
    serialNumber: Yup.string().required('Please fill the gps serial number'),
    simcardNumber: Yup.string().required('Please fill the  Gps simcard number'),
});
