import React, { useState } from "react";
import PropTypes from "prop-types";
import EditableLabel from "react-inline-editing";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useAuthContext } from "../../providers/auth.provider";
import { getAdminIds } from "./groups.service";
import { useGroupsContext } from "./groups.page";
import { DELETE_GROUP, ADD_GROUP, ROLE_ADMIN, STATUS_ACTIVE } from "./groups.const";
import api from "../../utils/api";
import GroupMember from "./group-member";
import { DropdownButton } from "../shared/dropdown-button";
import InvitationInput from "./invitation-input";


export const MODE_DEFAULT = 0;
export const MODE_EDITING = 1;

const StyledGroupItem = styled.div`
display: flex;
background-color: #fdfdfd;
padding: 10px;
margin: 7px 0;
border-radius: 5px;
border-bottom: 1px solid #dfdfdf;
box-shadow: 0 0 3px #dbdbdb;
box-sizing: content-box;

& > .side-section {
    width: 32px;

    .toggle-btn {
        --color: #b5b5b5;
        position: relative;
        cursor: pointer;
        color: var(--color);
        border: 1px solid var(--color);
        width: 16px;
        height: 16px;

        &:hover {
            --color: #818181;  
        }

        &::after {
            content: "+";
            position: absolute;
            left: 3px;
            top: -2px;
        }
    }
}

& > .content {
    width: 100%;

    & > .info {
        display: flex;

        .name {
            width: 30%;
        }

        .dir {
            display: flex;
            background-color: #ddd;
            padding: 2px 5px;
            border-radius: 3px;

            & > .divider {
                margin: 0 5px;
                color: #979797;
            }
        }

        .slices-link {
            margin: 0 auto;

            a {
                color: #000;
                text-decoration: none;
            }
        }

        .controls {
            margin-left: auto;
    
            & > * {
                cursor: pointer;
                color: #bbb;

                &:not(:first-child) {
                    margin-left: 5px;
                }
    
                &:hover {
                    color: rgb(224, 37, 37);
                }
            }
        }
    }

    & > .members {
        display: none;
    }
}

&:not(.open) {
    align-items: center;
    height: 25px;
}

&.open {
    height: none;

    .side-section {
        .toggle-btn {    
            &::after {
                content: "–";
            }
        }
    }
    .content {
        .members {
            display: inherit;
            margin-top: 10px;
            border-top: 1px dashed #ededed;
            padding-top: 5px;
        }
    }
}
`;

const GroupItem = ({obj, defaultMode}) => {
    const {user} = useAuthContext();
    const {langs, dispatch} = useGroupsContext();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState(defaultMode);
    const [adminIds] = useState(getAdminIds(obj.members));
    const [name, setName] = useState(obj.name || 'Undefined');
    const [targetLangCode, setTargetLangCode] = useState(obj.targetLangCode);
    const [nativeLangCode, setNativeLangCode] = useState(obj.nativeLangCode);

    async function update() {
        if (obj.name === name && obj.targetLangCode === targetLangCode && obj.nativeLangCode === nativeLangCode) {
            setMode(MODE_DEFAULT);
            return
        }

        try {
            const {data:res} = await api.post(`/me/groups${obj.id ? '/'+obj.id : ''}`, {
                name,
                targetLangCode,
                nativeLangCode,
            });
            console.log(res);
            setMode(MODE_DEFAULT);
            dispatch({type: ADD_GROUP, payload: {
                group: {
                    ...res.data,
                    members: [{
                        id: user.id,
                        username: user.username,
                        role: ROLE_ADMIN,
                        status: STATUS_ACTIVE,
                    }]
                }
            }});
        } catch(err) {
            console.error(err);
        }
    }

    async function detachGroup() {
        const userAsMember = obj.members.find(member => member.id === user.id);

        try {
            if (userAsMember.role === ROLE_ADMIN) {
                const {data:res} = await api.delete(`/me/groups/${obj.id}`);
                console.log(res);
            } else {
                const {data:res} = await api.post(`/me/groups/${obj.id}/detach-member/${user.id}`);
                console.log(res);
            }
            dispatch({ type: DELETE_GROUP, payload: {groupId: obj.id}});
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <StyledGroupItem open={isOpen}>
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
                    <div className="slices-link">
                        <Link to={`/me/slices?group=${obj.id}`}>slices</Link>
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
                                <GroupMember key={i} groupId={obj.id} adminIds={adminIds} obj={member} />
                            ))
                        }
                    </div>
                )}
            </div>
        </StyledGroupItem>
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
