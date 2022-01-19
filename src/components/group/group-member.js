import React from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";

import api from "../../utils/api";
import { useAuthContext } from "../../providers/auth.provider";
import { ROLE_MAP, STATUS_MAP } from "./groups.const";


const StyledGroupMember = styled.div`
display: flex;
padding: 5px 0;

& > .username {
    width: 30%;
}

& > .role {
    width: 20%;
}

& > .status {
    width: 20%;
} 

& > .controls {
    margin-left: auto;

    & > * {
        cursor: pointer;

        &:hover {
            color: rgb(224, 37, 37);
        }
    }
}
`;

const GroupMember = ({groupId, adminIds, obj}) => {
    const {user} = useAuthContext();

    async function detachMember() {
        try {
            const {data:res} = await api.post(`/me/groups/${groupId}/detach-member/${obj.id}`);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledGroupMember>
            <Link className="username" to={`/users/${obj.id}`}>{`@${obj.username}`}</Link>
            <span className="role">{ROLE_MAP[obj.role]}</span>
            <span className="status">{STATUS_MAP[obj.status]}</span>
            <div className="controls">
                {(user.id === obj.id || adminIds.indexOf(user.id) !== -1) && (
                    <span onClick={detachMember}>✕</span>  
                )}
            </div>
        </StyledGroupMember>
    );
};

GroupMember.propType = {
    groupId: PropTypes.number.isRequired,
    adminIds: PropTypes.array.isRequired,
    obj: PropTypes.object.isRequired,
};

export default GroupMember;
