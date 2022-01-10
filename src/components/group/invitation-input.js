import React, { useState } from "react";
import { PropTypes } from "prop-types";
import AsyncSelect from 'react-select/async';

import "./group-member.scss";
import api from "../../utils/api";
import { useGroupsContext } from "./groups.page";
import { ADD_MEMBER } from "./groups.const";


const InvitationInput = ({groupId}) => {
    const {dispatch} = useGroupsContext();
    const [inputValue, setInputValue] = useState('');

    async function loadOptions(inputValue, callback) {
        if (inputValue === '') {
            callback([])
        }

        try {
            const {data:res} = await api.get(`/users/${inputValue}`);

            callback(res.data ? [res.data] : []);
        } catch (err) {
            console.log(err)
        }
    };

    async function invitePerson(user) {
        try {
            const {data:res} = await api.post(`/me/group/${groupId}/invite-user/${user.id}`);
            console.log('invite persion', user);
            setInputValue('');
            dispatch({ type: ADD_MEMBER, payload: {
                groupId,
                member: {
                    id: user.id,
                    username: user.username,
                    role: 1,
                    status: 0,
                }
            }});
        } catch (err) {
            console.log(err);
        }
    }

    function handleSelectChange(userToInvite) {
        if (!userToInvite) {
            return
        }

        invitePerson(userToInvite);
    }

    return (
        <div className="invitation-input">
            <AsyncSelect
                isClearable
                cacheOptions
                components={{ DropdownIndicator: null }}
                loadOptions={loadOptions}                
                placeholder="Type username to find person to invite..."
                value={inputValue}
                onChange={handleSelectChange}
                onInputChange={value => setInputValue(value)}
                getOptionLabel={option => option.email}
                getOptionValue={option => option.id}
            />   
        </div>
    );
};

InvitationInput.propTypes = {
    groupId: PropTypes.number.isRequired,
};

export default InvitationInput;
