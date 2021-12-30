import React, { useState } from "react";
import PropTypes from "prop-types";

import "./group-item.scss";
import GroupMember from "./group-member";

const GroupItem = ({obj}) => {
    const [isOpen, setIsOpen] = useState(false);

    function toggle() {
        setIsOpen(prev => !prev);
    }

    return (
        <div className={`group-item ${isOpen ? 'open' : ''}`}>
            <div className="side-section">
                <div className="toggle-btn" onClick={toggle} />
            </div>
            <div className="content">
                <div className="info">
                    <div className="name">{obj.name}</div>
                    <div className="dir">{`${obj.targetLangCode} > ${obj.nativeLangCode}`}</div>
                </div>
                <div className="members">
                    {
                        obj.members && obj.members.map((member, i) => (
                            <GroupMember key={i} groupId={obj.id} obj={member} />
                        ))
                    }                    
                </div>
            </div>
        </div>
    );
};

GroupItem.propTypes = {
    obj: PropTypes.object.isRequired,
}

export default GroupItem;
