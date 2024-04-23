import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Button } from '@mantine/core';
import IconEye from '@/components/Icon/IconEye';
import { Field, Form, Formik } from 'formik';
import { subscriptionSchema } from '@/components/utility/validation/Validation';
import { GPSType, SubscriptionEnterface, SubscriptionType, VehicleType } from '@/components/utility/types/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Modal from '@/components/model/Model';
import { handleCreatVehicle, handleDeleteVehicle, handleGetVehicle, handleUpdateVehicle } from '@/components/api/vehicle';
import Select from 'react-select';
import { handlegetAllUsers } from '@/components/api/client';
import { handleCreationSubscription, handleDeleteSubscription, handleUpdateSubscription, handlegetAllSubscription } from '@/components/api/subscription';
import { handlegetAllGps } from '@/components/api/gps';

const Subscription = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Clients'));
    });

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [data, setData] = useState<SubscriptionEnterface[]>([]);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(data, ''));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [loadingData, setLoadingData] = useState(true);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const getSubscription = async () => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const response = await handlegetAllSubscription(setLoadingData);
        setData(response);

        const sortedData = sortBy(response, 'plateNumber');
        setInitialRecords(sortedData);
        setRecordsData([...sortedData.slice(from, to)]);
        setLoading(false);
    };
    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        getSubscription();
        console.log('data', data);
    }, [page, pageSize]);

    useEffect(() => {
        setInitialRecords(() => {
            return data?.filter((item) => {
                return (
                    item.createdAt.toLowerCase().includes(search.toLowerCase()) ||
                    item.expiredAt.toLowerCase().includes(search.toLowerCase()) ||
                    item.gps.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.vehicle?.client.firstName.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModel = () => {
        setModal(true);
    };

    const [editSubscriptionData, setEditSubscriptionData] = useState<SubscriptionType>();
    const [editModal, setIsEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [subscriptions, setSubscriptions] = useState<SubscriptionEnterface>();

    const showEditModal = (id: any) => {
        const subscriptions = data.find((subscription) => subscription.id === id);
        if (subscriptions) {
            //@ts-ignore
            setEditSubscriptionData(subscriptions);
        }
        setIsEditModal(true);
    };

    const showSubscription = (id: any) => {
        const subscriptions = data.find((vehicle) => vehicle.id === id);
        if (subscriptions) {
            setSubscriptions(subscriptions);
        }
        setViewModal(true);
    };

    const deleteSubscription = async (id: any) => {
        await handleDeleteSubscription(id);
        getSubscription();
    };

    const [gpsData, setGps] = useState<GPSType[]>();
    const [vehicleData, setVehicle] = useState<VehicleType[]>();
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [selectedGps, setSelectedGps] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const currentDate = new Date();
    const getGps = async () => {
        const response = await handlegetAllGps(setLoadingData);
        setGps(response?.filter((items: any) => items.gpsStatus === 0));
    };

    const getVehicle = async () => {
        const response = await handleGetVehicle(setLoadingUsers);
        setVehicle(response);
    };

    useEffect(() => {
        getVehicle();
        getGps();
    }, []);

    const gpsOptions =
        gpsData?.map((gps) => ({
            value: gps.id,
            label: `${gps.serialNumber}`,
        })) || [];

    const VehicleOptions =
        vehicleData?.map((vehicle) => ({
            value: vehicle.id,
            label: `${vehicle.VehicleType} (${vehicle.PlateNumber})`,
        })) || [];

    return (
        <div>
            <Modal title="Create Subscription" modal={modal} setModal={setModal}>
                <div className="panel" id="custom_styles">
                    <div className="mb-5">
                        <Formik
                            initialValues={{
                                createdAt: '',
                                expiredAt: '',
                                vehicle: '',
                                gps: '',
                            }}
                            validationSchema={subscriptionSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    values.vehicle = selectedVehicle;
                                    values.gps = selectedGps;
                                    console.log('values', values);
                                    const response = await handleCreationSubscription(setLoading, values);
                                    setModal(false);
                                    getSubscription();
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
                                        <div className={`${submitCount ? (errors.createdAt ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                            <label htmlFor="createdAt">Starting Date </label>
                                            <Field name="createdAt" type="date" id="createdAt" placeholder="Enter plate number" className="form-input" />

                                            {submitCount ? errors.createdAt ? <div className="mt-1 text-danger">{errors.createdAt}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>
                                        <div className={`${submitCount ? (errors.expiredAt ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                            <label htmlFor="expiredAt">Expired Date </label>
                                            <Field name="expiredAt" type="date" id="expiredAt" placeholder="Enter vehicle type" className="form-input" />

                                            {submitCount ? errors.expiredAt ? <div className="mt-1 text-danger">{errors.expiredAt}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>
                                    </div>

                                    <div className={` custom-select grid grid-cols-1 gap-5 md:grid-cols-4`}>
                                        <div className="z-50 md:col-span-2">
                                            <label htmlFor="vehicleSelect" className="">
                                                Select Vehicle
                                            </label>

                                            <Select
                                                key="vehicleSelect"
                                                id="vehicleSelect"
                                                options={VehicleOptions}
                                                value={selectedVehicle ? { value: selectedVehicle, label: VehicleOptions.find((option) => option.value === selectedVehicle)?.label || '' } : null}
                                                onChange={(selectedOption) => {
                                                    console.log(selectedOption?.value);
                                                    setSelectedVehicle(selectedOption?.value ?? '');
                                                }}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                                placeholder="Select Vehicle"
                                            />
                                            {submitCount ? errors.vehicle ? <div className="mt-1 text-danger">{errors.vehicle}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>
                                        <div className="z-50 md:col-span-2">
                                            <label htmlFor="gpsSelect" className="">
                                                Select GPS
                                            </label>

                                            <Select
                                                key="gpsSelect"
                                                id="gpsSelect"
                                                options={gpsOptions}
                                                value={selectedGps ? { value: selectedGps, label: gpsOptions.find((option) => option.value === selectedGps)?.label || '' } : null}
                                                onChange={(selectedOption) => setSelectedGps(selectedOption?.value ?? '')}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                                placeholder="Select Gps"
                                            />
                                            {submitCount ? errors.gps ? <div className="mt-1 text-danger">{errors.gps}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
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
            <div className="panel flex items-center justify-between overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">Subscriptions List</div>
                <Button className="bg-primary" onClick={showModel}>
                    create subscription +
                </Button>
            </div>
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold uppercase dark:text-white-light">Subscription List</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    {loadingData ? (
                        <div>Loading...</div>
                    ) : (
                        isMounted && (
                            <DataTable
                                className="table-hover whitespace-nowrap"
                                records={recordsData}
                                columns={[
                                    {
                                        accessor: 'vehicle',
                                        title: 'Client',
                                        sortable: true,
                                        render: ({ vehicle }) => (
                                            <div className="flex w-max items-center">
                                                {' '}
                                                <div>{vehicle?.client.firstName}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'telephone',
                                        title: 'Telephone',
                                        sortable: true,
                                        render: ({ vehicle }) => (
                                            <div className="flex w-max items-center">
                                                <div>{vehicle?.client.phoneNumber}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'gps',
                                        title: 'Status',
                                        sortable: true,
                                        render: ({ gps }) => (
                                            <div className={` ${gps.gpsStatus === 1 ? 'text-success' : 'text-danger'} flex w-max items-center`}>
                                                <div>{gps.gpsStatus === 1 ? 'Active' : 'InActive'}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'plate number',
                                        title: 'Plate Number',
                                        sortable: true,
                                        render: ({ vehicle }) => (
                                            <div className="flex w-max items-center">
                                                <div>{vehicle?.PlateNumber}</div>
                                            </div>
                                        ),
                                    },

                                    {
                                        accessor: 'action',
                                        title: 'Action',
                                        titleClassName: '!text-center',
                                        render: ({ id }) => (
                                            <div className="mx-auto flex w-max items-center gap-2">
                                                <Tippy content="Edit">
                                                    <div className="cursor-pointer" onClick={() => showEditModal(id)}>
                                                        <IconPencil />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="View">
                                                    <div className="cursor-pointer" onClick={() => showSubscription(id)}>
                                                        <IconEye />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Delete">
                                                    <div className="cursor-pointer" onClick={() => deleteSubscription(id)}>
                                                        <IconTrashLines />
                                                    </div>
                                                </Tippy>
                                            </div>
                                        ),
                                    },
                                ]}
                                totalRecords={initialRecords.length}
                                recordsPerPage={pageSize}
                                page={page}
                                onPageChange={(p) => setPage(p)}
                                recordsPerPageOptions={PAGE_SIZES}
                                onRecordsPerPageChange={setPageSize}
                                sortStatus={sortStatus}
                                onSortStatusChange={setSortStatus}
                                minHeight={200}
                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                            />
                        )
                    )}
                </div>
            </div>

            {editModal && (
                <Modal title="Edit Vehicle" modal={editModal} setModal={setIsEditModal}>
                    <div className="panel" id="custom_styles">
                        <div className="mb-5">
                            <Formik
                                initialValues={{
                                    createdAt: editSubscriptionData?.createdAt || currentDate.toISOString().slice(0, 10),
                                    expiredAt: editSubscriptionData?.expiredAt || currentDate.toISOString().slice(0, 10),
                                    vehicle: editSubscriptionData?.vehicle.PlateNumber || '',
                                    gps: editSubscriptionData?.gps.serialNumber || '',
                                }}
                                validationSchema={subscriptionSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        const response = await handleUpdateSubscription(setLoading, editSubscriptionData?.id, values);
                                        setIsEditModal(false);
                                        getSubscription();
                                    } catch (error) {
                                        console.log('error', error);
                                    } finally {
                                        setSubmitting(false);
                                        setIsEditModal(false);
                                    }
                                }}
                            >
                                {({ errors, submitCount, touched, values }) => (
                                    <Form className="space-y-5">
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                            <div className={`${submitCount ? (errors.createdAt ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                                <label htmlFor="createdAt">Starting Date </label>
                                                <Field name="createdAt" type="date" id="createdAt" placeholder="Enter plate number" className="form-input" />

                                                {submitCount ? (
                                                    errors.createdAt ? (
                                                        <div className="mt-1 text-danger">{errors.createdAt}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className={`${submitCount ? (errors.expiredAt ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                                <label htmlFor="expiredAt">Expired Date </label>
                                                <Field name="expiredAt" type="date" id="expiredAt" placeholder="Enter vehicle type" className="form-input" />

                                                {submitCount ? (
                                                    errors.expiredAt ? (
                                                        <div className="mt-1 text-danger">{errors.expiredAt}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>

                                        <div className={` custom-select grid grid-cols-1 gap-5 md:grid-cols-4`}>
                                            <div className="z-50 md:col-span-2">
                                                <label htmlFor="vehicleSelect" className="">
                                                    Select Vehicle
                                                </label>

                                                <Select
                                                    key="vehicleSelect"
                                                    id="vehicleSelect"
                                                    options={VehicleOptions}
                                                    value={selectedVehicle ? { value: selectedVehicle, label: VehicleOptions.find((option) => option.value === selectedVehicle)?.label || '' } : null}
                                                    onChange={(selectedOption) => {
                                                        console.log(selectedOption?.value);
                                                        setSelectedVehicle(selectedOption?.value ?? '');
                                                    }}
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                        }),
                                                    }}
                                                    placeholder="Select Vehicle"
                                                />
                                                {submitCount ? errors.vehicle ? <div className="mt-1 text-danger">{errors.vehicle}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                            </div>
                                            <div className="z-50 md:col-span-2">
                                                <label htmlFor="gpsSelect" className="">
                                                    Select Gps
                                                </label>

                                                <Select
                                                    key="gpsSelect"
                                                    id="gpsSelect"
                                                    options={gpsOptions}
                                                    value={selectedGps ? { value: selectedGps, label: gpsOptions.find((option) => option.value === selectedGps)?.label || '' } : null}
                                                    onChange={(selectedOption) => setSelectedGps(selectedOption?.value ?? '')}
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                        }),
                                                    }}
                                                    placeholder="Select Gps"
                                                />
                                                {submitCount ? errors.gps ? <div className="mt-1 text-danger">{errors.gps}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
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
            )}

            {viewModal && (
                <Modal title={`Subscription: ${subscriptions?.vehicle?.client.firstName}`} modal={viewModal} setModal={setViewModal}>
                    <div className="panel" id="custom_styles">
                        <div className="mb-5 grid  grid-cols-3 gap-4 md:w-full">
                            <p className="flex items-center gap-2">
                                <span className=" font-bold  dark:text-white">Starting Date:</span>
                                {/*/@ts-ignore*/}
                                {format(new Date(subscriptions?.createdAt), 'dd/MM/yyyy')}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold  dark:text-white">Ending Date:</span>
                                {/*/@ts-ignore*/}
                                {format(new Date(subscriptions?.expiredAt), 'dd/MM/yyyy')}
                            </p>
                        </div>
                        <div className=" flex flex-col justify-between md:flex-row">
                            <div>
                                <h1 className=" text-3xl font-extrabold">GPS Info</h1>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">Serial Number:</span>

                                    {subscriptions?.gps?.serialNumber}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">Simcard Number:</span>

                                    {subscriptions?.gps?.simcardNumber}
                                </p>
                                <p className={`${subscriptions?.gps.gpsStatus === 1 ? 'text-success' : 'text-danger'} flex items-center gap-2 `}>
                                    <span className=" font-bold text-black dark:text-white">GPS Status:</span>
                                    {subscriptions?.gps.gpsStatus === 0 ? 'InActive' : 'Active'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold  dark:text-white">CreatedAt:</span>
                                    {/*/@ts-ignore*/}
                                    {format(new Date(subscriptions?.gps.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">ExpiredAt:</span>
                                    {subscriptions?.gps.createdAt}
                                </p>
                            </div>
                            <div>
                                <h1 className=" text-3xl font-extrabold">Client Info</h1>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">Firstname:</span>
                                    {subscriptions?.vehicle?.client.firstName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">Lastname:</span>
                                    {subscriptions?.vehicle?.client.lastName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">Email:</span>
                                    {subscriptions?.vehicle?.client.email}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">Telephone:</span>
                                    {subscriptions?.vehicle?.client.phoneNumber}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className=" font-bold dark:text-white">National ID:</span>
                                    {subscriptions?.vehicle?.client.NID}
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Subscription;
