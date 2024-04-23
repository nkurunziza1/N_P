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
import { clientSchema, gpsSchema } from '@/components/utility/validation/Validaation';

import { GPS, GPSType, User, UsersType } from '@/components/utility/types/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Modal from '@/components/model/Model';
import { handleCreationGps, handleDeleteGps, handleUpdateGps, handlegetAllGps } from '@/components/api/gps';

const Gps = () => {
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
    const [data, setData] = useState<GPS[]>([]);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(data, 'firstName'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [loadingData, setLoadingData] = useState(true);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const getGps = async () => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const response = await handlegetAllGps(setLoadingData);
        setData(response);
        const sortedData = sortBy(response, 'firstName');
        setInitialRecords(sortedData);
        setRecordsData([...sortedData.slice(from, to)]);
        setLoadingData(false);
    };
    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        getGps();
    }, [page, pageSize]);

    useEffect(() => {
        setInitialRecords(() => {
            return data?.filter((item) => {
                return (
                    item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.simcardNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.gpsStatus.toString().toLowerCase().includes(search.toLowerCase())
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

    const [editGpsData, setEditGpsData] = useState<GPSType>();
    const [editModal, setIsEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [GpsData, setGps] = useState<GPS>();

    const showEditModal = (id: any) => {
        const Gps = data.find((gps) => gps.id === id);
        if (Gps) {
            setEditGpsData(Gps);
        }
        setIsEditModal(true);
    };

    const showGps = (id: any) => {
        const Gps = data.find((gps) => gps.id === id);
        if (Gps) {
            setGps(Gps);
        }
        setViewModal(true);
    };

    const deleteGps = (id: any) => {
        handleDeleteGps(id);
        getGps();
    };

    return (
        <div>
            <Modal title="Create GPs" modal={modal} setModal={setModal}>
                <div className="panel" id="custom_styles">
                    <div className="mb-5">
                        <Formik
                            initialValues={{
                                serialNumber: '',
                                simcardNumber: '',
                            }}
                            validationSchema={gpsSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const response = await handleCreationGps(setLoading, values);
                                    setModal(false);
                                    getGps();
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
                                        <div className={`md:col-span-2 ${submitCount ? (errors.serialNumber ? 'has-error' : 'has-success') : ''}`}>
                                            <label htmlFor="serialNumber">GPS serial number</label>
                                            <Field name="serialNumber" type="text" id="serialNumber" placeholder="Enter serial number" className="form-input" />

                                            {submitCount ? (
                                                errors.serialNumber ? (
                                                    <div className="mt-1 text-danger">{errors.serialNumber}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className={` ${submitCount ? (errors.simcardNumber ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                            <label htmlFor="simcardNumber">GPS simcard number </label>
                                            <Field name="simcardNumber" type="text" id="simcardNumber" placeholder="Enter simcard number" className="form-input" />

                                            {submitCount ? (
                                                errors.simcardNumber ? (
                                                    <div className="mt-1 text-danger">{errors.simcardNumber}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
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
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">List of Gps</div>
                <Button className="bg-primary" onClick={showModel}>
                    Register GPS +
                </Button>
            </div>
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold uppercase dark:text-white-light"> List of GPS</h5>
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
                                        accessor: 'serialNumber',
                                        title: 'Serial Number',
                                        sortable: true,
                                    },
                                    { accessor: 'simcardNumber', title: 'Gps simcard No. ', sortable: true },

                                    {
                                        accessor: 'gpsStatus',
                                        title: 'Status',
                                        sortable: true,
                                        render: ({ gpsStatus }) => (
                                            <div className={` ${gpsStatus === 1 ? 'text-success' : 'text-danger'} flex w-max items-center`}>
                                                <div>{gpsStatus === 1 ? 'Active' : 'InActive'}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'createdAt',
                                        title: 'CreatedAt.',
                                        sortable: true,
                                        render: ({ createdAt }) => (
                                            <div className="flex w-max items-center">
                                                {/*/@ts-ignore*/}
                                                <div> {format(new Date(createdAt), 'dd/MM/yyyy HH:mm:ss')}</div>
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
                                                    <div className="cursor-pointer" onClick={() => showGps(id)}>
                                                        <IconEye />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Delete">
                                                    <div className="cursor-pointer" onClick={() => deleteGps(id)}>
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
                <Modal title="Edit User" modal={editModal} setModal={setIsEditModal}>
                    <div className="panel" id="custom_styles">
                        <div className="mb-5">
                            <Formik
                                initialValues={{
                                    serialNumber: editGpsData?.serialNumber || '',
                                    simcardNumber: editGpsData?.simcardNumber || '',
                                }}
                                validationSchema={gpsSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        const response = await handleUpdateGps(setLoading, values, editGpsData?.id);
                                        setIsEditModal(false);
                                        getGps();
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
                                            <div className={`md:col-span-2 ${submitCount ? (errors.serialNumber ? 'has-error' : 'has-success') : ''}`}>
                                                <label htmlFor="serialNumber">Gps serial number</label>
                                                <Field name="serialNumber" type="text" id="serialNumber" placeholder="Enter chasis number" className="form-input" />

                                                {submitCount ? (
                                                    errors.serialNumber ? (
                                                        <div className="mt-1 text-danger">{errors.serialNumber}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className={` ${submitCount ? (errors.simcardNumber ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                                <label htmlFor="simcardNumber">Gps simcard number </label>
                                                <Field name="simcardNumber" type="text" id="simcardNumber" placeholder="Enter vehicle model" className="form-input" />

                                                {submitCount ? (
                                                    errors.simcardNumber ? (
                                                        <div className="mt-1 text-danger">{errors.simcardNumber}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
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
                <Modal title={`${GpsData?.serialNumber}`} modal={viewModal} setModal={setViewModal}>
                    <div className="panel" id="custom_styles">
                        <div className="mb-5 grid grid-cols-3 gap-4">
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Serial Number:</span>
                                {GpsData?.serialNumber}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white"> Simcard Number</span>

                                {GpsData?.simcardNumber}
                            </p>
                            <p className={`${GpsData?.gpsStatus === 1 ? 'text-success' : 'text-danger'} flex items-center gap-2 `}>
                                <span className=" font-bold text-black dark:text-white">GPS Status:</span>

                                {GpsData?.gpsStatus === 0 ? 'InActive' : 'Active'}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold  dark:text-white">CreatedA:</span>
                                {/*/@ts-ignore*/}
                                {format(new Date(GpsData?.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Gps;
