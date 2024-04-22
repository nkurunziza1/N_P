import axios from 'axios';

import Swal from 'sweetalert2';
import { VehicleType } from '../utility/types/types';

export const handleGetVehicle = async (setLoadingData: React.Dispatch<React.SetStateAction<boolean>>) => {
    const token = localStorage.getItem('token');

    setLoadingData(true);
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/getAll`, {
            headers: {
                'x-auth': `${token}`,
            },
        });

        setLoadingData(false);
        console.log('vehicle', response.data.data);
        return response.data.data.content;
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            title: 'failed to Vehicles ! ',
            text: error.response?.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
        setLoadingData(false);
    }
};

export const handleCreatVehicle = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: VehicleType) => {
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/create`, data, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        console.log('data', data);
        Swal.fire({
            icon: 'success',
            title: 'successfully',
            text: response?.data,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
        setLoading(false);
        handleGetVehicle(setLoading);
    } catch (error: any) {
        console.log('error', error);
        Swal.fire({
            icon: 'error',
            title: 'Form submission failed',
            text: error.response.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });

        setLoading(false);
    }
};

export const handleDeleteVehicle = async (id: any) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/delete/${id}`, {
            headers: {
                'x-auth': `${token}`,
            },
        });

        Swal.fire({
            icon: 'success',
            title: '  delete  successfully',
            text: response.data.message,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
        return response.data;
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            title: 'failed to delete user ! ',
            text: error.response.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
    }
};

export const handleUpdateVehicle = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: VehicleType, id: any) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/update/${id}`, data, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        setLoading(false);
        Swal.fire({
            icon: 'success',
            title: 'Form submit  successfully',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
        console.log('data', response.data);
        return response.data;
    } catch (error: any) {
        console.log('error', error);

        setLoading(false);

        Swal.fire({
            icon: 'error',
            title: 'Form submission failed',
            text: error.response.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });

        return error.response.data.message;
    }
};

export const handleView = async (id: any) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/getOne/${id}`, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        Swal.fire({
            icon: 'success',
            title: '  delete user  successfully',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
        return response.data;
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            title: 'failed to delete user ! ',
            text: error.response.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
    }
};
