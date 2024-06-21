// Frontend component: Users.tsx

import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Button } from '@mantine/core';
import Modal from '@/components/model/Model';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { handleAssignRole } from '@/components/api/users';
import { GarbageType, ScheduleType } from '@/components/utility/types/types';
import { handlegetAllUsers } from '@/components/api/users';
import { handlegetsAssignedWasteCollection } from '@/components/api/schedule';

const Garbage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Clients'));
    }, []);

    const [modal, setModal] = useState(false);
    const [data, setData] = useState<GarbageType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const garbage = await handlegetsAssignedWasteCollection(setLoading);
            console.log('garbage', garbage);
            setData(garbage);
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <p>Check The assigned Garbage</p>
            <div className="panel mt-6">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">telephone</th>
                            <th className="px-4 py-2">LoadType</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((garbage, index) => (
                            <tr key={index} className="border-b border-gray-200 bg-white">
                                <td className="px-4 py-2">{garbage?.schedule.date}</td>
                                <td className="px-4 py-2">{garbage?.schedule.location}</td>
                                <td className="px-4 py-2">{garbage?.schedule.telephone}</td>
                                <td className="px-4 py-2">{garbage?.schedule.loadType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Garbage;
