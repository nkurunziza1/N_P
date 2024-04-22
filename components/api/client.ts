import axios from 'axios';
import { UsersType } from '../utility/types/types';
import Swal from 'sweetalert2';

export const handlegetAllUsers = async (setLoadingData: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoadingData(true);
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/getAll`, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        setLoadingData(false);
        return response.data.data;
    } catch (error: any) {
        setLoadingData(false);
        Swal.fire({
            icon: 'error',
            title: 'failed to get users ! ',
            text: error.response?.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
    }
};

export const handleCreation = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: UsersType) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/create`, data, {
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

export const handleUpdateUser = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: UsersType, id: any) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/update/${id}`, data, {
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/profile/${id}`, {
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

export const handleDelete = async (id: any) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/client/delete/${id}`, {
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
