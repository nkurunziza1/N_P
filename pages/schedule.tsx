import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Button } from '@mantine/core';
import Modal from '@/components/model/Model';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { handlegetscheduledWasteCollection, handlescheduleWasteCollection } from '@/components/api/schedule';
import { SechaduleSchema } from '@/components/utility/validation/Validation';
import { ScheduleType } from '@/components/utility/types/types';

const Schedule = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Clients'));
    }, []);

    const [modal, setModal] = useState(false);
    const [data, setData] = useState<ScheduleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userdata') || '{}');
        if (user.role === 'admin') {
            setIsAdmin(true);
        }
        const getScheduled = async () => {
            const data = await handlegetscheduledWasteCollection(setLoading);
            setData(data);
        };
        getScheduled();
    }, []);

    const showModel = () => {
        setModal(true);
    };

    return (
        <div>
            <Modal title="Create Subscription" modal={modal} setModal={setModal}>
                <div className="panel" id="custom_styles">
                    <div className="mb-5">
                        <Formik
                            initialValues={{
                                date: '',
                                location: '',
                                telephone: '',
                                loadType: '',
                            }}
                            validationSchema={SechaduleSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    console.log('values', values);
                                    const response = await handlescheduleWasteCollection(setLoading, values);
                                    window.location.reload();
                                    setModal(false);
                                } catch (error) {
                                } finally {
                                    setSubmitting(false);
                                    setModal(false);
                                }
                            }}
                        >
                            {({ errors, submitCount, touched, values }) => (
                                <Form className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                        <div className={`${submitCount ? (errors.date ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                            <label htmlFor="date">Date</label>
                                            <Field name="date" type="date" id="date" placeholder="Enter Date" className="form-input" />
                                            {submitCount ? errors.date ? <div className="mt-1 text-danger">{errors.date}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>
                                        <div>
                                            <label htmlFor="telephone">Telephone</label>
                                            <Field name="telephone" type="text" id="telephone" placeholder="Enter Telephone" className="form-input" />
                                            {submitCount ? errors.telephone ? <div className="mt-1 text-danger">{errors.telephone}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>
                                        <div>
                                            <label htmlFor="location">Location</label>
                                            <Field name="location" type="text" id="location" placeholder="Enter Location" className="form-input" />
                                            {submitCount ? errors.location ? <div className="mt-1 text-danger">{errors.location}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>
                                        <div>
                                            <label htmlFor="loadType">Load Type</label>
                                            <Field name="loadType" type="text" id="loadType" placeholder="Enter Load Type" className="form-input" />
                                            {submitCount ? errors.loadType ? <div className="mt-1 text-danger">{errors.loadType}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
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
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">Your Garbage List</div>
                <Button className="bg-primary" onClick={showModel}>
                    Schedule Garbage +
                </Button>
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
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 bg-white">
                                <td className="px-4 py-2">{item?.date}</td>
                                <td className="px-4 py-2">{item?.location}</td>
                                <td className="px-4 py-2">{item?.telephone}</td>
                                <td className={`$ px-4 py-2`}>{item?.loadType}</td>
                                <td className={`${item.status === 'pending' ? 'text-red-600' : 'text-green-800'}  px-4 py-2`}>{item?.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Schedule;
