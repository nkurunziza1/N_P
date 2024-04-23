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
import { vehicleSchema } from '@/components/utility/validation/Validaation';
import { UsersType, VehicleInterface, VehicleType } from '@/components/utility/types/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Modal from '@/components/model/Model';
import { handleCreatVehicle, handleDeleteVehicle, handleGetVehicle, handleUpdateVehicle } from '@/components/api/vehicle';
import Select from 'react-select';
import { handlegetAllUsers } from '@/components/api/client';
import { number } from 'yup';
const Client = () => {
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
    const [data, setData] = useState<VehicleInterface[]>([]);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(data, 'firstName'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [loadingData, setLoadingData] = useState(true);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const getVehicle = async () => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const response = await handleGetVehicle(setLoadingData);
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
        getVehicle();
    }, [page, pageSize]);

    useEffect(() => {
        setInitialRecords(() => {
            return data?.filter((item) => {
                return (
                    item.VehicleType.toLowerCase().includes(search.toLowerCase()) ||
                    item.PlateNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.VehicleModel.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.ChasisNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.client.firstName.toLowerCase().includes(search.toLowerCase())
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

    const [editVehicleData, setEditVehicleData] = useState<VehicleType>();
    const [editModal, setIsEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [vehicle, setVehicle] = useState<VehicleInterface>();

    const showEditModal = (id: any) => {
        const vehicle = data.find((vehicle) => vehicle.id === id);
        if (vehicle) {
            setEditVehicleData(vehicle);
        }
        setIsEditModal(true);
    };

    const showVehicle = (id: any) => {
        const vehicle = data.find((vehicle) => vehicle.id === id);
        if (vehicle) {
            setVehicle(vehicle);
        }
        setViewModal(true);
    };

    const deleteVehicle = async (id: any) => {
        await handleDeleteVehicle(id);
        getVehicle();
    };

    const [selectedUser, setSelectedUser] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [users, setUsers] = useState<UsersType[]>();
    const [loadingUsers, setLoadingUsers] = useState(true);

    const getUser = async () => {
        const response = await handlegetAllUsers(setLoadingUsers);
        setUsers(response);
    };

    useEffect(() => {
        getUser();
    }, []);

    const options =
        users
            ?.filter((user) => user.id !== undefined)
            .map((user) => ({
                value: user.id!,
                label: `${user.firstName} ${user.lastName}`,
            })) || [];

    return (
        <div>
            <Modal title="Create Vehicle" modal={modal} setModal={setModal}>
                <div className="panel" id="custom_styles">
                    <div className="mb-5">
                        <Formik
                            initialValues={{
                                VehicleType: '',
                                PlateNumber: '',
                                VehicleModel: '',
                                ChasisNumber: '',
                                ManufactureYear: '',
                                client: '',
                            }}
                            validationSchema={vehicleSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    values.ManufactureYear = selectedYear;
                                    values.client = selectedUser;
                                    console.log('values', values);
                                    const response = await handleCreatVehicle(setLoading, values);
                                    setModal(false);
                                    getVehicle();
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
                                        <div className={`${submitCount ? (errors.VehicleType ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                            <label htmlFor="VehicleType">Vehicle Type </label>
                                            <Field name="VehicleType" type="text" id="VehicleType" placeholder="Enter vehicle type" className="form-input" />

                                            {submitCount ? (
                                                errors.VehicleType ? (
                                                    <div className="mt-1 text-danger">{errors.VehicleType}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </div>

                                        <div className={`${submitCount ? (errors.PlateNumber ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                            <label htmlFor="PlateNumber">Plate Number </label>
                                            <Field name="PlateNumber" type="text" id="PlateNumber" placeholder="Enter plate number" className="form-input" />

                                            {submitCount ? (
                                                errors.PlateNumber ? (
                                                    <div className="mt-1 text-danger">{errors.PlateNumber}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                        <div className={`md:col-span-2 ${submitCount ? (errors.ChasisNumber ? 'has-error' : 'has-success') : ''}`}>
                                            <label htmlFor="ChasisNumber">Chasis Number</label>
                                            <Field name="ChasisNumber" type="text" id="ChasisNumber" placeholder="Enter chasis number" className="form-input" />

                                            {submitCount ? (
                                                errors.ChasisNumber ? (
                                                    <div className="mt-1 text-danger">{errors.ChasisNumber}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className={` ${submitCount ? (errors.VehicleModel ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                            <label htmlFor="VehicleModel">Vehicle Model </label>
                                            <Field name="VehicleModel" type="text" id="VehicleModel" placeholder="Enter vehicle model" className="form-input" />

                                            {submitCount ? (
                                                errors.VehicleModel ? (
                                                    <div className="mt-1 text-danger">{errors.VehicleModel}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                    <div className={` custom-select grid grid-cols-1 gap-5 md:grid-cols-4`}>
                                        <div className="md:col-span-2">
                                            <label htmlFor="manufactureYear" className="">
                                                Select Year
                                            </label>

                                            <Select
                                                id="manufactureYear"
                                                options={Array.from({ length: 70 }, (_, index) => {
                                                    const year = new Date().getFullYear() - index;
                                                    return { value: year, label: year.toString() };
                                                })}
                                                value={selectedYear ? { value: selectedYear, label: selectedYear.toString() } : null}
                                                onChange={(selectedOption) => setSelectedYear(selectedOption?.value ?? '')}
                                                placeholder="Select Year"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                            {submitCount ? (
                                                errors.ManufactureYear ? (
                                                    <div className="mt-1 text-danger">{errors.ManufactureYear}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className="z-50 md:col-span-2">
                                            <label htmlFor="userSelect" className="">
                                                Select Client
                                            </label>

                                            <Select
                                                id="userSelect"
                                                options={options}
                                                value={selectedUser ? { value: selectedUser, label: options.find((option) => option.value === selectedUser)?.label || '' } : null}
                                                onChange={(selectedOption) => setSelectedUser(selectedOption?.value ?? '')}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                            {submitCount ? errors.client ? <div className="mt-1 text-danger">{errors.client}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
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
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">List of Vehicles</div>
                <Button className="bg-primary" onClick={showModel}>
                    Create Vehicle +
                </Button>
            </div>
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold uppercase dark:text-white-light">List of Vehicles</h5>
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
                                        accessor: 'VehicleType',
                                        title: 'Vehicle Type',
                                        sortable: true,
                                    },
                                    {
                                        accessor: 'PlateNumber',
                                        title: 'Plate Number',
                                        sortable: true,
                                    },
                                    { accessor: 'ChasisNumber', title: 'Chasis Number ', sortable: true },
                                    { accessor: 'ManufactureYear', title: 'Manufacture Year', sortable: true },
                                    {
                                        accessor: 'client',
                                        title: 'Client.',
                                        sortable: true,
                                        render: ({ client }) => (
                                            <div className="flex w-max items-center">
                                                {/*/@ts-ignore*/}
                                                <div>{client.firstName}</div>
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
                                                    <div className="cursor-pointer" onClick={() => showVehicle(id)}>
                                                        <IconEye />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Delete">
                                                    <div className="cursor-pointer" onClick={() => deleteVehicle(id)}>
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
                                    VehicleType: editVehicleData?.VehicleType || '',
                                    PlateNumber: editVehicleData?.PlateNumber || '',
                                    VehicleModel: editVehicleData?.VehicleModel || '',
                                    ChasisNumber: editVehicleData?.ChasisNumber || '',
                                    ManufactureYear: editVehicleData?.ManufactureYear || '',
                                    client: editVehicleData?.client || '',
                                }}
                                validationSchema={vehicleSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        console.log('editUserData', values);
                                        const response = await handleUpdateVehicle(setLoading, values, editVehicleData?.id);
                                        setIsEditModal(false);
                                        getVehicle();
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
                                            <div className={`${submitCount ? (errors.VehicleType ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                                <label htmlFor="VehicleType">Vehicle Type </label>
                                                <Field name="VehicleType" type="text" id="VehicleType" placeholder="Enter vehicle type" className="form-input" />

                                                {submitCount ? (
                                                    errors.VehicleType ? (
                                                        <div className="mt-1 text-danger">{errors.VehicleType}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>

                                            <div className={`${submitCount ? (errors.PlateNumber ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                                <label htmlFor="PlateNumber">Plate Number </label>
                                                <Field name="PlateNumber" type="text" id="PlateNumber" placeholder="Enter plate number" className="form-input" />

                                                {submitCount ? (
                                                    errors.PlateNumber ? (
                                                        <div className="mt-1 text-danger">{errors.PlateNumber}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                            <div className={`md:col-span-2 ${submitCount ? (errors.ChasisNumber ? 'has-error' : 'has-success') : ''}`}>
                                                <label htmlFor="ChasisNumber">Chasis Number</label>
                                                <Field name="ChasisNumber" type="text" id="ChasisNumber" placeholder="Enter chasis number" className="form-input" />

                                                {submitCount ? (
                                                    errors.ChasisNumber ? (
                                                        <div className="mt-1 text-danger">{errors.ChasisNumber}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className={` ${submitCount ? (errors.VehicleModel ? 'has-error' : 'has-success') : ''} md:col-span-2`}>
                                                <label htmlFor="VehicleModel">Vehicle Model</label>
                                                <Field name="VehicleModel" type="text" id="VehicleModel" placeholder="Enter vehicle model" className="form-input" />

                                                {submitCount ? (
                                                    errors.VehicleModel ? (
                                                        <div className="mt-1 text-danger">{errors.VehicleModel}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>
                                        <div className={` custom-select grid grid-cols-1 gap-5 md:grid-cols-4`}>
                                            <div className="md:col-span-2">
                                                <label htmlFor="manufactureYear" className="">
                                                    Manufacture Year
                                                </label>

                                                <Select
                                                    id="manufactureYear"
                                                    options={Array.from({ length: 70 }, (_, index) => {
                                                        const year = new Date().getFullYear() - index;
                                                        return { value: year, label: year.toString() };
                                                    })}
                                                    value={selectedYear ? { value: selectedYear, label: selectedYear.toString() } : null}
                                                    onChange={(selectedOption) => setSelectedYear(selectedOption?.value ?? '')}
                                                    placeholder="Select Year"
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                        }),
                                                    }}
                                                />
                                                {submitCount ? (
                                                    errors.ManufactureYear ? (
                                                        <div className="mt-1 text-danger">{errors.ManufactureYear}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className="z-50 md:col-span-2">
                                                <label htmlFor="userSelect" className="">
                                                    Select User
                                                </label>

                                                <Select
                                                    id="userSelect"
                                                    options={options}
                                                    value={selectedUser ? { value: selectedUser, label: options.find((option) => option.value === selectedUser)?.label || '' } : null}
                                                    onChange={(selectedOption) => setSelectedUser(selectedOption?.value ?? '')}
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                        }),
                                                    }}
                                                />
                                                {submitCount ? errors.client ? <div className="mt-1 text-danger">{errors.client}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
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
                <Modal title={`${vehicle?.VehicleType}`} modal={viewModal} setModal={setViewModal}>
                    <div className="panel" id="custom_styles">
                        <div className="mb-5 grid grid-cols-3 gap-4">
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">ChasisNumber:</span>

                                {vehicle?.ChasisNumber}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Plate Number:</span>

                                {vehicle?.PlateNumber}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Manufacturer Year:</span>

                                {vehicle?.ManufactureYear}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Vehicle Modal:</span>

                                {vehicle?.VehicleModel}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">CreatedA:</span>
                                {/*/@ts-ignore*/}
                                {format(new Date(vehicle?.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                            </p>
                        </div>
                        <div>
                            <h1 className=" text-3xl font-extrabold">Client Info</h1>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Firstname:</span>

                                {vehicle?.client.firstName}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Lastname:</span>

                                {vehicle?.client.lastName}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Email:</span>

                                {vehicle?.client.email}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Telephone:</span>

                                {vehicle?.client.phoneNumber}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">National ID:</span>

                                {vehicle?.client.NID}
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Client;
