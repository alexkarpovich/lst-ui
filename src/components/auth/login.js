import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

import "./login.scss";
import api from "../../utils/api";
import { setToken } from "../../utils/session";
import { useAuthContext } from "../../providers/auth.provider";

const Login = () => {
    const navigate = useNavigate();
    const auth = useAuthContext();

    console.log(auth);

    async function onSubmit(values, {setSubmitting, setFieldError}) {        
        try {
            setSubmitting(true);
            const {data:res} = await api.post('/login', values);
            setSubmitting(false);
            console.log('login', res);

            if (res.data.token) {
                setToken(res.data.token);
                auth.reloadUser();

                navigate('/me');
            }
        } catch (err) {
            console.log(err);
        }
    }

    function validateForm(values) {
        const errors = {};

        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address';
        }

        if (!values.password) {
            errors.password = 'Required'
        }

        return errors;
    }

    return (
        <div className="login">
            <h3>Log in</h3>
            <Formik
                initialValues={{ email: '', password: '' }} 
                validate={validateForm}
                onSubmit={onSubmit}>
                {({isSubmitting}) => (
                    <Form className="login-form">
                        <Field 
                            type="email"
                            name="email"
                            placeholder="Enter email address" 
                        />
                        <ErrorMessage name="email" component="div" />
                        <Field 
                            type="password" 
                            name="password"
                            placeholder="Enter password" 
                        />
                        <ErrorMessage name="password" component="div" />
                        <button type="submit" className="button" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;