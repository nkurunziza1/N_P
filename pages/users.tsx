// Frontend component: Users.tsx

import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Button } from '@mantine/core';
import Modal from '@/components/model/Model';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { handleAssignRole } from '@/components/api/users';
import { ScheduleType, User } from '@/components/utility/types/types';
import { handlegetAllUsers } from '@/components/api/users';

const Users = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Clients'));
    }, []);

    const [modal, setModal] = useState(false);
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userdata') || '{}');
        if (user.role === 'admin') {
            setIsAdmin(true);
        }

        const fetchUsers = async () => {
            const users = await handlegetAllUsers(setLoading);
            const options = users.map((user: any) => ({ value: user._id, label: user.fullname }));
            setUserOptions(options);
            setData(users);
        };

        fetchUsers();
    }, []);

    const showRoleAssignmentModal = (userId: string) => {
        setSelectedUserId(userId);
        setModal(true);
    };

    return (
        <div>
            <Modal title="Assign Role" modal={modal} setModal={setModal}>
                <div className="panel" id="custom_styles">
                    <div className="mb-5">
                        <Formik
                            initialValues={{
                                role: '',
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const response = await handleAssignRole(setLoading, values, selectedUserId);
                                    console.log(response);
                                    window.location.reload();
                                    setModal(false);
                                } catch (error) {
                                    console.error(error);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ errors, submitCount, setFieldValue }) => (
                                <Form className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className={`${submitCount ? (errors.role ? 'has-error' : 'has-success') : ''}`}>
                                            <label htmlFor="roleSelect" className="">
                                                Select Role
                                            </label>
                                            <Select
                                                id="roleSelect"
                                                options={[
                                                    { value: 'admin', label: 'Admin' },
                                                    { value: 'collector', label: 'Collector' },
                                                    { value: 'householder', label: 'Householder' },
                                                ]}
                                                onChange={(option) => setFieldValue('role', option ? option.value : '')}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                            {submitCount && errors.role ? <div className="mt-1 text-danger">{errors.role}</div> : null}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary !mt-6" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Assign Role'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>

            <div className="panel mt-6">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Full Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((user, index) => (
                            <tr key={index} className="border-b border-gray-200 bg-white">
                                <td className="px-4 py-2">{user?.fullname}</td>
                                <td className="px-4 py-2">{user?.email}</td>
                                <td className="px-4 py-2">{user?.role}</td>
                                <td className="px-4 py-2">
                                    {isAdmin && (
                                        <Button className="bg-primary" onClick={() => showRoleAssignmentModal(user?._id)}>
                                            Assign Role
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
