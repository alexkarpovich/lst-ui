import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../utils/api";

const ConfirmInvitationPage = () => {
    const {token} = useParams();
    const [isProcessing, setIsProcessing] = useState(true);

    console.log('confirm-invitation', token);

    useEffect(() => {
        let isMounted = true;

        async function confirmMember() {
            if (!isMounted) {
                return;
            }

            try {
                const {data:res} = await api.post(`/me/group/confirm-invitation/${token}`);
                console.log(res);
            } catch (err) {
                console.log(err)
            }
        }

        confirmMember();

        return () => (isMounted = false);
    });

    return (
        <div className="confirm-member-page">
            {isProcessing ? 'Confirming...' : 'Successfully confirmed.'}
        </div>
    );
};

export default ConfirmInvitationPage;
