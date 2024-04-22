import axios from 'axios';

import Swal from 'sweetalert2';
import { GPSType } from '../utility/types/types';

export const handlegetAllGps = async (setLoadingData: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoadingData(true);
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gps/getAll`, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        setLoadingData(false);
        return response.data.data.content;
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            text: error.response?.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
        setLoadingData(false);
    }
};

export const handleCreationGps = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: GPSType) => {
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/gps/create`, data, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        Swal.fire({
            icon: 'success',
            text: response?.data.message,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });

        setLoading(false);
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            text: error.response?.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });

        setLoading(false);
    }
};

export const handleDeleteGps = async (id: any) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/gps/delete/${id}`, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        Swal.fire({
            icon: 'success',
            text: response.data.message,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            text: error.response?.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
    }
};

export const handleUpdateGps = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: GPSType, id: any) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/gps/update/${id}`, data, {
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
