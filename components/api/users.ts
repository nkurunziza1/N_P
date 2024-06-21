import axios from 'axios';
import Swal from 'sweetalert2';
import { RoleType } from '../utility/types/types';

export const handlegetAllUsers = async (setLoadingData: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoadingData(true);
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('response', response.data);
        setLoadingData(false);
        return response.data;
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

export const handleAssignRole = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: RoleType, id: string) => {
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/assign/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
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
