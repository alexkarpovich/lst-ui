import React, { useEffect, useState } from "react";

import api from "../../utils/api";
import GroupItem from "./group-item";

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        async function loadGroups() {
            const {data:res} = await api.get('/me/group');

            console.log(res);
            setGroups(res.data);
        }

        loadGroups();
    }, [])

    return (
        <div className="groups-page">
            <h3>Group list</h3>
            {
                groups.map((group, i) => (
                    <GroupItem key={i} obj={group} />
                ))
            }
            
        </div>
    );
};

export default GroupsPage;
