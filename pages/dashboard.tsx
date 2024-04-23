import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import { handlegetAllUsers } from '@/components/api/client';
import { handlegetAllSubscription } from '@/components/api/subscription';
import { handlegetAllGps } from '@/components/api/gps';

const Dashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
    const [loading, setLoading] = useState(true);
    const [ActiveGps, setActiveGps] = useState<any>();
    const [InActiveGps, setInActiveGps] = useState<any>();
    const [client, setClient] = useState<any>();
    const [subscriptions, setSubscription] = useState<any>();

    const getGps = async () => {
        const data = await handlegetAllGps(setLoading);
        setActiveGps(data?.filter((gps: any) => gps.gpsStatus === 1).length);
        setInActiveGps(data?.filter((gps: any) => gps.gpsStatus === 0).length);
        if (ActiveGps?.length === 0) {
            setActiveGps(0);
        }
        if (InActiveGps?.length === 0) {
            setInActiveGps(0);
        }
    };

    const getClient = async () => {
        const data = await handlegetAllUsers(setLoading);
        setClient(data?.length);
        if (client?.length === 0) {
            setClient(0);
        }
    };

    const getSubscriptions = async () => {
        const data = await handlegetAllSubscription(setLoading);

        setSubscription(data?.length);
        if (subscriptions?.length === 0) {
            setSubscription(0);
        }
    };

    useEffect(() => {
        getGps();
        getClient();
        getSubscriptions();
    }, []);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Dashbaord</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                    <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Active GPS</div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold transition-all duration-300 ltr:mr-3 rtl:ml-3"> {loading ? <div>loading...</div> : ActiveGps}</div>
                        </div>
                    </div>

                    {/* Sessions */}
                    <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Inactive GPS</div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold transition-all duration-300 ltr:mr-3 rtl:ml-3"> {loading ? <div>loading...</div> : InActiveGps}</div>
                        </div>
                    </div>

                    {/*  Time On-Site */}
                    <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Client</div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {loading ? <div>loading...</div> : client}</div>
                        </div>
                    </div>

                    {/* Bounce Rate */}
                    <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">subscriptions</div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {loading ? <div>loading...</div> : subscriptions} </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
