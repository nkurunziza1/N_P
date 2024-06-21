import axios from 'axios';
import { ScheduleType, assignType } from '../utility/types/types';
import Swal from 'sweetalert2';

export const handlegetscheduledWasteCollection = async (setLoadingData: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoadingData(true);
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schedule`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        setLoadingData(false);
        return response.data.collections;
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

export const handlescheduleWasteCollection = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: ScheduleType) => {
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/schedule`, data, {
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

export const handleAssignSubmit = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: assignType) => {
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/collector/assign`, data, {
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

export const handlegetsAssignedWasteCollection = async (setLoadingData: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoadingData(true);
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collector/assign`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        setLoadingData(false);
        return response.data.assignments;
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
