import axios from 'axios';
import Swal from 'sweetalert2';

export const handleLogin = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, data: any) => {
    setLoading(true);

    try {
        console.log('data', data);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/operator/login`, data);

        const { token } = response.data.data;
        localStorage.setItem('token', token);
        if (response.data.data.role === 'SU') {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/';
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
