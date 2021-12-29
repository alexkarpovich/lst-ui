import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

import './signup.scss';
import api from '../../utils/api';

const Signup = () => {
    const navigate = useNavigate();

    async function onSubmit(values, {setSubmitting, setFieldError}) {
        const {repeatPassword, ...reqData} = values;
        
        try {
            setSubmitting(true);
            const {data} = await api.post('/signup', reqData);
            setSubmitting(false);
            console.log(data);
            navigate('/');
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

        if (!values.username) {
            errors.username = 'Required';
        }

        if (!values.password) {
            errors.password = 'Required'
        }

        if (values.password !== values.repeatPassword) {
            errors.repeatPassword = 'Passwords do not match';
        }

        return errors;
    }

    return (
        <div className="signup">
            <h3>Sign up</h3>
            <Formik
                initialValues={{email: '', username: '', password: '', repeatPassword: '' }} 
                validate={validateForm}
                onSubmit={onSubmit}>
                {({isSubmitting}) => (
                    <Form className="signup-form">
                        <Field 
                            type="email"
                            name="email"
                            placeholder="Enter email address" 
                        />
                        <ErrorMessage name="email" component="div" />
                        <Field 
                            type="text" 
                            name="username"
                            placeholder="Enter username" 
                        />
                        <ErrorMessage name="username" component="div" />
                        <Field 
                            type="password" 
                            name="password"
                            placeholder="Enter password" 
                        />
                        <ErrorMessage name="password" component="div" />
                        <Field 
                            type="password" 
                            name="repeatPassword"
                            placeholder="Repeat password" 
                        />
                        <ErrorMessage name="repeatPassword" component="div" />
                        <button type="submit" className="button" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Signup;