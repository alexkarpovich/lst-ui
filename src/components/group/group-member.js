import React from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";

import "./group-member.scss";
import api from "../../utils/api";

const ROLE_MAP = {
    0: 'admin',
    1: 'reader',
    2: 'editor'
}

const STATUS_MAP = {
    0: 'pending',
    1: 'active',
    2: 'deleted'
};

const GroupMember = ({groupId, obj}) => {
    async function detachMember() {
        try {
            const {data:res} = await api.post(`/me/group/${groupId}/detach-member/${obj.id}`);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="group-member">
            <Link className="username" to={`/users/${obj.id}`}>{`@${obj.username}`}</Link>
            <span className="role">{ROLE_MAP[obj.role]}</span>
            <span className="status">{STATUS_MAP[obj.status]}</span>
            <div className="controls">
                <span onClick={detachMember}>✕</span>
            </div>
        </div>
    );
};

GroupMember.propType = {
    groupId: PropTypes.number.isRequired,
    obj: PropTypes.object.isRequired,
};

export default GroupMember;
