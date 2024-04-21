import * as Yup from 'yup';

export const clientSchema = Yup.object().shape({
    firstName: Yup.string().required('Please fill the first name'),
    lastName: Yup.string().required('Please fill the last name'),
    email: Yup.string().email().required('please enter an email'),
    phoneNumber: Yup.string().required('Please provide telephone number'),
    NID: Yup.string().required('Please provide National ID'),

});