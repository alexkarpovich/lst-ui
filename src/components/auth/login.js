import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styled from "styled-components";

import api from "../../utils/api";
import { setToken } from "../../utils/session";
import { useAuthContext } from "../../providers/auth.provider";
import Input from "../shared/input";
import Button from "../shared/button";


const CustomInput = ({field, form, ...props}) => (
    <Input type="text" {...field} {...props} />
);

const StyledLogin = styled.div`
h3 {
    margin: 10px;
    text-align: center;
    text-transform: uppercase;
}

width: 250px;
height: 300px;
`;

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
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

                navigate(searchParams.get('next') || '/me');
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
        <StyledLogin>
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
                            component={CustomInput}
                        />
                        <ErrorMessage name="email" component="div" />
                        <Field 
                            type="password" 
                            name="password"
                            placeholder="Enter password"
                            component={CustomInput}
                        />
                        <ErrorMessage name="password" component="div" />
                        <Button type="submit" className="button" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </StyledLogin>
    );
};

export default Login;