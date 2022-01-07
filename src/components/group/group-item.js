import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import EditableLabel from "react-inline-editing";

import "./group-item.scss";
import { useAuthContext } from "../../providers/auth.provider";
import { useGroupsContext, DELETE_GROUP, SET_CREATING_MODE, ADD_GROUP } from "./groups.page";
import api from "../../utils/api";
import GroupMember from "./group-member";
import DropdownButton from "../shared/dropdown-button";
import InvitationInput from "./invitation-input";


export const MODE_DEFAULT = 0;
export const MODE_EDITING = 1;

const GroupItem = ({obj, defaultMode}) => {
    const {user} = useAuthContext();
    const {dispatch} = useGroupsContext();
    const [isOpen, setIsOpen] = useState(false);
    const [langs, setLangs] = useState([]);
    const [mode, setMode] = useState(defaultMode);
    const [name, setName] = useState(obj.name || 'Undefined');
    const [targetLangCode, setTargetLangCode] = useState(obj.targetLangCode);
    const [nativeLangCode, setNativeLangCode] = useState(obj.nativeLangCode);

    useEffect(() => {
        let isMounted = true;

        async function fetchLangs() {
            try {
                const {data:res} = await api.get('/langs');
                isMounted && setLangs(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchLangs();

        return () => (isMounted = false);
    }, []);

    async function update() {
        if (obj.name === name && obj.targetLangCode === targetLangCode && obj.nativeLangCode === nativeLangCode) {
            setMode(MODE_DEFAULT);
            return
        }

        try {
            const {data:res} = await api.post(`/me/group${obj.id ? '/'+obj.id : ''}`, {
                name,
                targetLangCode,
                nativeLangCode,
            });
            console.log(res);
            setMode(MODE_DEFAULT);
            dispatch({type: ADD_GROUP, payload: {
                group: res.data
            }});
        } catch(err) {
            console.error(err);
        }
    }

    async function detachGroup() {
        const userAsMember = obj.members.find(member => member.id === user.id);
        console.log(userAsMember);

        try {
            if (userAsMember.role === 0) {
                const {data:res} = await api.delete(`/me/group/${obj.id}`);
                console.log(res);
            } else {
                const {data:res} = await api.post(`/me/group/${obj.id}/detach-member/${user.id}`);
                console.log(res);
            }
            dispatch({ type: DELETE_GROUP, payload: {groupId: obj.id}});
        } catch (err) {
            console.log(err)
        }
    }

    console.log(name, targetLangCode, nativeLangCode, mode);

    return (
        <div className={`group-item ${isOpen ? 'open' : ''}`}>
            <div className="side-section">
                <div className="toggle-btn" onClick={() => setIsOpen(prev => !prev)} />
            </div>
            <div className="content">
                <div className="info">
                    <div className="name">
                        { mode === MODE_DEFAULT ? (
                            <span>{name}</span>
                        ) : (
                            <EditableLabel 
                                text={name}
                                labelClassName='myLabelClass'
                                inputClassName='myInputClass'
                                inputHeight='25px'
                                onFocusOut={newName => setName(newName)}
                            />
                        )}                    
                    </div>
                    <div className="dir">
                        <span className="target-lang">
                            { !obj.isUntouched || mode === MODE_DEFAULT ? targetLangCode : (
                                <DropdownButton
                                    value={targetLangCode}
                                    options={langs}
                                    trigger={<span>{targetLangCode || "target lang"}</span>}
                                    getOptionLabel={option => option.isoName}
                                    getOptionValue={option => option.code}
                                    onChange={code => setTargetLangCode(code)}
                                />
                            )}
                        </span>
                        <span className="divider">→</span>
                        <span className="native-lang">
                            { !obj.isUntouched || mode === MODE_DEFAULT ? nativeLangCode : (
                                <DropdownButton 
                                    value={nativeLangCode}
                                    options={langs}
                                    trigger={<span>{nativeLangCode || "native lang"}</span>}
                                    getOptionLabel={option => option.isoName}
                                    getOptionValue={option => option.code}
                                    onChange={code => setNativeLangCode(code)}
                                />
                            )}                            
                        </span>
                    </div>
                    <div className="controls">
                        {mode === MODE_DEFAULT ? (
                            <span className="icon-edit-box" onClick={() => setMode(MODE_EDITING)} />
                        ) : (
                            <span className="icon-floppy-disk" onClick={update} />
                        )}
                        <span className="icon-bin" onClick={detachGroup} />
                    </div>
                </div>
                {obj.id && (
                    <div className="members">
                        <InvitationInput groupId={obj.id} />
                        {
                            obj.members && obj.members.map((member, i) => (
                                <GroupMember key={i} groupId={obj.id} obj={member} />
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

GroupItem.defaultProps = {
    obj: { isUntouched: true },
    defaultMode: MODE_DEFAULT,
};

GroupItem.propTypes = {
    obj: PropTypes.object.isRequired,
    defaultMode: PropTypes.number.isRequired,
}

export default GroupItem;
