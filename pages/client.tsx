'use client';
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
import { clientSchema } from '@/components/utility/validation/Validaation';
import { handleCreation, handleDelete, handleUpdateUser, handlegetAllUsers } from '@/components/api/client';
import { User, UsersType } from '@/components/utility/types/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Modal from '@/components/model/Model';
import { downloadExcel } from 'react-export-table-to-excel';

import IconBell from '@/components/Icon/IconBell';
import IconFile from '@/components/Icon/IconFile';
import IconPrinter from '@/components/Icon/IconPrinter';

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
    const [data, setData] = useState<User[]>([]);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(data, 'firstName'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [loadingData, setLoadingData] = useState(true);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const getUser = async () => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const response = await handlegetAllUsers(setLoadingData);
        setData(response);
        const sortedData = sortBy(response, 'firstName');
        setInitialRecords(sortedData);
        setRecordsData([...sortedData.slice(from, to)]);
        setLoading(false);
    };
    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        getUser();
    }, [page, pageSize]);

    useEffect(() => {
        setInitialRecords(() => {
            return data?.filter((item) => {
                return (
                    item.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    item.lastName.toLowerCase().includes(search.toLowerCase()) ||
                    item.email.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.NID.toLowerCase().includes(search.toLowerCase()) ||
                    item.phoneNumber.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);
    const col = ['id', 'firstName', 'lastName', 'NID', 'email', 'phoneNumber', 'createdAt'];
    const header = ['id', 'names', 'Email', 'National ID', 'Phone No', 'CreatedAt'];
    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    function handleDownloadExcel() {
        downloadExcel({
            fileName: 'Users Data',
            sheet: 'react-export-table-to-excel',
            tablePayload: {
                header,
                //@ts-ignore
                body: data.map((client) => ({
                    id: client.id,
                    names: client.firstName + ' ' + client.lastName,
                    email: client.email,
                    'National ID': client.NID,
                    'Phone No': client.phoneNumber,
                    createdAt: client.createdAt,
                })),
            },
        });
    }
    const UserData = data;
    const exportTable = (type: any) => {
        let columns: any = col;
        let records = UserData;
        let filename = 'Data';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';
            records.map((item: any) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link1 = document.createElement('a');
                link1.setAttribute('href', data1);
                link1.setAttribute('download', filename + '.txt');
                link1.click();
            } else {
                var blob1 = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob1, filename + '.txt');
                }
            }
        }
    };

    const capitalize = (text: any) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModel = () => {
        setModal(true);
    };

    const [editUserData, setEditUserData] = useState<UsersType>();
    const [editModal, setIsEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [user, setUser] = useState<User>();

    const showEditModal = (id: any) => {
        const user = data.find((user) => user.id === id);
        if (user) {
            setEditUserData(user);
        }
        setIsEditModal(true);
    };

    const showUser = (id: any) => {
        const user = data.find((user) => user.id === id);
        if (user) {
            setUser(user);
        }
        setViewModal(true);
    };

    const deleteUser = (id: any) => {
        handleDelete(id);
        getUser();
    };

    return (
        <div>
            <Modal title="Create Client" modal={modal} setModal={setModal}>
                <div className="panel" id="custom_styles">
                    <div className="mb-5">
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
                                phoneNumber: '',
                                NID: '',
                            }}
                            validationSchema={clientSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const response = await handleCreation(setLoading, values);
                                    setModal(false);
                                    getUser();
                                } catch (error) {
                                } finally {
                                    setSubmitting(false);
                                    setModal(false);
                                }
                            }}
                        >
                            {({ errors, submitCount, touched, values }) => (
                                <Form className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                        <div className={submitCount ? (errors.firstName ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="firstName">First Name </label>
                                            <Field name="firstName" type="text" id="firstName" placeholder="Enter First Name" className="form-input" />

                                            {submitCount ? errors.firstName ? <div className="mt-1 text-danger">{errors.firstName}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>

                                        <div className={submitCount ? (errors.lastName ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="lastName">Last Name </label>
                                            <Field name="lastName" type="text" id="lastName" placeholder="Enter Last Name" className="form-input" />

                                            {submitCount ? errors.lastName ? <div className="mt-1 text-danger">{errors.lastName}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>

                                        <div className={submitCount ? (errors.email ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="email">Email</label>
                                            <div className="flex">
                                                <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    @
                                                </div>
                                                <Field name="email" type="text" id="email" placeholder="Enter email" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                            </div>
                                            {submitCount ? errors.email ? <div className="mt-1 text-danger">{errors.email}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                        <div className={`md:col-span-2 ${submitCount ? (errors.phoneNumber ? 'has-error' : 'has-success') : ''}`}>
                                            <label htmlFor="phoneNumber">Telephone</label>
                                            <Field name="phoneNumber" type="text" id="phoneNumber" placeholder="Enter phone number" className="form-input" />

                                            {submitCount ? (
                                                errors.phoneNumber ? (
                                                    <div className="mt-1 text-danger">{errors.phoneNumber}</div>
                                                ) : (
                                                    <div className="mt-1 text-success">Looks Good!</div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </div>

                                        <div className={`md:col-span-2 ${submitCount ? (errors.NID ? 'has-error' : 'has-success') : ''}`}>
                                            <label htmlFor="NID">National ID</label>
                                            <Field name="NID" type="text" id="NID" placeholder="Enter national ID" className="form-input" />
                                            {submitCount ? errors.NID ? <div className="mt-1 text-danger">{errors.NID}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
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
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">List of Clients</div>
                <Button className="bg-primary" onClick={showModel}>
                    Register Client +
                </Button>
            </div>
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold uppercase dark:text-white-light"> List of Clients</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center">
                        <button type="button" className="btn btn-primary btn-sm m-1" onClick={handleDownloadExcel}>
                            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                            EXCEL
                        </button>
                        <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            PRINT
                        </button>
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
                                        accessor: 'firstName',
                                        title: 'Firstname',
                                        sortable: true,
                                        render: ({ firstName, lastName, id }) => (
                                            <div className="flex w-max items-center">
                                                <div>{firstName}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'lastName',
                                        title: 'Lastname',
                                        sortable: true,
                                    },
                                    { accessor: 'NID', title: 'National ID', sortable: true },
                                    { accessor: 'email', title: 'Email', sortable: true },
                                    { accessor: 'phoneNumber', title: 'Phone No.', sortable: true },
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
                                                    <div className="cursor-pointer" onClick={() => showUser(id)}>
                                                        <IconEye />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Delete">
                                                    <div className="cursor-pointer" onClick={() => deleteUser(id)}>
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
                                    firstName: editUserData?.firstName || '',
                                    lastName: editUserData?.lastName || '',
                                    email: editUserData?.email || '',
                                    phoneNumber: editUserData?.phoneNumber || '',
                                    NID: editUserData?.NID || '',
                                }}
                                validationSchema={clientSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        console.log('editUserData', values);
                                        const response = await handleUpdateUser(setLoading, values, editUserData?.id);
                                        setIsEditModal(false);
                                        getUser();
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
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                            <div className={submitCount ? (errors.firstName ? 'has-error' : 'has-success') : ''}>
                                                <label htmlFor="firstName">First Name </label>
                                                <Field name="firstName" type="text" id="firstName" placeholder="Enter First Name" className="form-input" />

                                                {submitCount ? (
                                                    errors.firstName ? (
                                                        <div className="mt-1 text-danger">{errors.firstName}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>

                                            <div className={submitCount ? (errors.lastName ? 'has-error' : 'has-success') : ''}>
                                                <label htmlFor="lastName">Last Name </label>
                                                <Field name="lastName" type="text" id="lastName" placeholder="Enter Last Name" className="form-input" />

                                                {submitCount ? errors.lastName ? <div className="mt-1 text-danger">{errors.lastName}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                            </div>

                                            <div className={submitCount ? (errors.email ? 'has-error' : 'has-success') : ''}>
                                                <label htmlFor="email">Email</label>
                                                <div className="flex">
                                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        @
                                                    </div>
                                                    <Field name="email" type="text" id="email" placeholder="Enter email" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                                </div>
                                                {submitCount ? errors.email ? <div className="mt-1 text-danger">{errors.email}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                            <div className={`md:col-span-2 ${submitCount ? (errors.phoneNumber ? 'has-error' : 'has-success') : ''}`}>
                                                <label htmlFor="phoneNumber">Telephone</label>
                                                <Field name="phoneNumber" type="text" id="phoneNumber" placeholder="Enter phone number" className="form-input" />

                                                {submitCount ? (
                                                    errors.phoneNumber ? (
                                                        <div className="mt-1 text-danger">{errors.phoneNumber}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>

                                            <div className={`md:col-span-2 ${submitCount ? (errors.NID ? 'has-error' : 'has-success') : ''}`}>
                                                <label htmlFor="NID">National ID</label>
                                                <Field name="NID" type="text" id="NID" placeholder="Enter national ID" className="form-input" />
                                                {submitCount ? errors.NID ? <div className="mt-1 text-danger">{errors.NID}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
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
                <Modal title={`${user?.firstName} ${user?.lastName}`} modal={viewModal} setModal={setViewModal}>
                    <div className="panel" id="custom_styles">
                        <div className="mb-5 grid grid-cols-3 gap-4">
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Email:</span>

                                {user?.email}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">National ID:</span>

                                {user?.NID}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">Telephone:</span>

                                {user?.phoneNumber}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className=" font-bold dark:text-white">CreatedA:</span>
                                {/*/@ts-ignore*/}
                                {format(new Date(user?.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Client;
