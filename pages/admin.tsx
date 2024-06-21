import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Button } from '@mantine/core';
import Modal from '@/components/model/Model';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { handleAssignSubmit, handlegetscheduledWasteCollection, handlescheduleWasteCollection } from '@/components/api/schedule';
import { SechaduleSchema } from '@/components/utility/validation/Validation';
import { ScheduleType } from '@/components/utility/types/types';
import { handlegetAllUsers } from '@/components/api/users';

const Users = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Garbages'));
    }, []);
    const Role = ['admin', 'collector', 'householder'];
    const [modal, setModal] = useState(false);
    const [assignModal, setAssignModal] = useState(false);
    const [data, setData] = useState<ScheduleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [selectedId, setSelectedId] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userdata') || '{}');
        if (user.role === 'admin') {
            setIsAdmin(true);
        }
        const getScheduled = async () => {
            const data = await handlegetscheduledWasteCollection(setLoading);
            setData(data);
        };

        const fetchUsers = async () => {
            const users = await handlegetAllUsers(setLoading);
            const filteredData = users?.filter((user: any) => user.role === 'collector');
            const options: [] = filteredData?.map((user: any) => ({ value: user._id, label: user.fullname }));
            setUserOptions(options);
            console.log('options', options);
        };

        getScheduled();
        fetchUsers();
    }, []);

    const showModel = () => {
        setModal(true);
    };

    const showAssignModel = (scheduleId: any) => {
        setSelectedId(scheduleId);
        setAssignModal(true);
    };

    return (
        <div>
            <Modal title="Assign Garbage" modal={assignModal} setModal={setAssignModal}>
                <div className="panel" id="custom_styles">
                    <div className="mb-5">
                        <Formik
                            initialValues={{
                                collector: '',
                                schedule: selectedId,
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    console.log('values', values);

                                    const response = await handleAssignSubmit(setLoading, values);
                                    window.location.reload();
                                    setAssignModal(false);
                                } catch (error) {
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ errors, submitCount, setFieldValue, values }) => (
                                <Form className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className={`${submitCount ? (errors.collector ? 'has-error' : 'has-success') : ''}`}>
                                            <label htmlFor="userSelect" className="">
                                                Assign Garbage to the collectors
                                            </label>
                                            <Select
                                                id="userSelect"
                                                options={userOptions}
                                                onChange={(option: any) => setFieldValue('collector', option ? option.value : '')}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                            {submitCount && errors.collector ? <div className="mt-1 text-danger">{errors.collector}</div> : null}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary !mt-6" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Form'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>

            <div className={`panel flex items-center justify-between overflow-x-auto whitespace-nowrap p-3 text-primary`}>
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">Garbage List</div>
                {!isAdmin && (
                    <Button className="bg-primary" onClick={showModel}>
                        Schedule Garbage +
                    </Button>
                )}
            </div>

            <div className="panel mt-6">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Telephone</th>
                            <th className="px-4 py-2">Load Type</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 bg-white">
                                <td className="px-4 py-2">{item?.date}</td>
                                <td className="px-4 py-2">{item?.location}</td>
                                <td className="px-4 py-2">{item?.telephone}</td>
                                <td className=" px-4 py-2">{item?.loadType}</td>
                                <td className={`${item.status === 'pending' ? 'text-red-600' : 'text-green-800'}  px-4 py-2`}>{item?.status}</td>
                                {isAdmin && item.status === 'pending' && (
                                    <td className="cursor-pointer px-4 py-2 text-blue-500 underline" onClick={() => showAssignModel(item._id)}>
                                        Assign garbage
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
