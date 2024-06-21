import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import Dropdown from '@/components/Dropdown';
import { useTranslation } from 'react-i18next';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import { IRootState } from '@/store';
import { setPageTitle, toggleLocale, toggleRTL } from '@/store/themeConfigSlice';
import { loginSchema, signupSchema } from '@/components/utility/validation/Validation';
import { handleLogin, handleSignup } from '@/components/api/login';
import Image from 'next/image';
import Link from 'next/link';

export const Signup = () => {
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });
    const router = useRouter();

    const submitForm = (e: any) => {
        e.preventDefault();

        router.push('/dashboard');
    };

    const [loading, setLoading] = useState(false);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState('');
    useEffect(() => {
        setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
    }, []);

    const { t, i18n } = useTranslation();

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="absolute end-6 top-6"></div>
                        <div className="mx-auto w-full max-w-[440px]">
                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                    fullname: '',
                                    telephone: '',
                                }}
                                validationSchema={signupSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        const response = await handleSignup(setLoading, values);
                                        setIsSignup(false);
                                    } catch (error) {
                                        console.log('error', error);
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ errors, submitCount, touched, values }) => (
                                    <Form className="space-y-5 dark:text-white">
                                        <div>
                                            <label htmlFor="email">Email</label>
                                            <div className={` ${submitCount ? (errors.email ? 'has-error' : 'has-success') : ''} relative text-white-dark`}>
                                                <Field name="email" type="email" id="email" placeholder="Enter Email" className="form-input" />
                                                {submitCount ? errors.email ? <div className="mt-1 text-danger">{errors.email}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="password">Password</label>
                                            <div className={` ${submitCount ? (errors.password ? 'has-error' : 'has-success') : ''}relative text-white-dark`}>
                                                <Field name="password" type="password" id="password" placeholder="Enter Password" className="form-input" />{' '}
                                                {submitCount ? errors.password ? <div className="mt-1 text-danger">{errors.password}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="fullname">Full name</label>
                                            <div className={` ${submitCount ? (errors.fullname ? 'has-error' : 'has-success') : ''}relative text-white-dark`}>
                                                <Field name="fullname" type="text" id="fullname" placeholder="Enter Full name" className="form-input" />{' '}
                                                {submitCount ? errors.fullname ? <div className="mt-1 text-danger">{errors.fullname}</div> : <div className="mt-1 text-success">Looks Good!</div> : ''}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="telephone">Telephone</label>
                                            <div className={` ${submitCount ? (errors.telephone ? 'has-error' : 'has-success') : ''}relative text-white-dark`}>
                                                <Field name="telephone" type="text" id="telephone" placeholder="Enter Telephone" className="form-input" />{' '}
                                                {submitCount ? (
                                                    errors.telephone ? (
                                                        <div className="mt-1 text-danger">{errors.telephone}</div>
                                                    ) : (
                                                        <div className="mt-1 text-success">Looks Good!</div>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            {loading ? 'Logging in...' : '  Signup'}
                                        </button>
                                        <Link className="cursor-pointer text-blue-500" href="/">
                                            Back to login
                                        </Link>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Signup

Signup.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
