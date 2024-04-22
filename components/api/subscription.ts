import axios from 'axios';
import { SubscriptionType } from '../utility/types/types';
import Swal from 'sweetalert2';

export const handlegetAllSubscription = async (setLoadingData: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoadingData(true);
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription/getAll`, {
            headers: {
                'x-auth': `${token}`,
            },
        });
        setLoadingData(false);
        console.log('data', response.data.data.content);
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

export const handleCreationSubscription = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: SubscriptionType) => {
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription/create`, data, {
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

export const handleDeleteSubscription = async (id: any) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/subscription/delete/${id}`, {
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
    } catch (error: any) {
        console.log('error', error);
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

export const handleUpdateSubscription = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, id: any, data: SubscriptionType) => {
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subscription/update/${id}`, data, {
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
