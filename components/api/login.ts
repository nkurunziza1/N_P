import axios from 'axios';
import Swal from 'sweetalert2';

export const handleLogin = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: any) => {
    setLoading(true);

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, data);
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userdata', JSON.stringify(response.data.user));

        if (response.data.user.role === 'admin') {
            window.location.href = '/admin';
        } else if (response.data.user.role === 'householder') {
            window.location.href = '/schedule';
        } else if (response.data.user.role === 'collector') {
            window.location.href = '/garbage';
        }

        setLoading(false);
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
        setLoading(false);
    }
};

export const handleSignup = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: any) => {
    setLoading(true);

    try {
        console.log('data', data);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, data);
        Swal.fire({
            icon: 'success',
            text: response?.data.message,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            padding: '10px 20px',
        });
        setLoading(false);
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
        setLoading(false);
    }
};
