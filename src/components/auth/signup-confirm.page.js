import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from '../../utils/api';

const SignupConfirmPage = () => {
    const {token} = useParams();
    const [isFetching, setIsFetching] = useState(true)
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const res = await api.post(`/signup/${token}`);
                setIsConfirmed(true);
                setIsFetching(false);
            } catch (err) {
                setIsConfirmed(false);
                setIsFetching(false);
                console.log(err);
            }
        }

        confirmEmail();
    }, [])

    return (
        <div className="signup-confirm-page">
            {isFetching ? 'Confirming registration...' : (
                isConfirmed ? (<div>Success</div>) : (<div>Failed</div>)
            )}
        </div>
    );
};

export default SignupConfirmPage;