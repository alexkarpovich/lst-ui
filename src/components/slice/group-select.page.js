import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

import api from "../../utils/api";

const StyledGroupSelectPage = styled.div`
width: 100%;
height: 100%;
padding: 0;
margin: 0;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;  

& > .groups-select {
    width: 50%;
    padding: 20px;
    border: 1px solid #c3c3c3;
    border-radius: 7px;
}
`;

const GroupSelectPage = () => {
    const [allGroups, setAllGroups] = useState([]);

    useEffect(() => {
        async function loadInitialData() {
            const {data:res} = await api.get('/me/groups');
            setAllGroups(res.data);
        }

        loadInitialData();
    }, [])
    
    return (
        <StyledGroupSelectPage>
            <h3>Select group</h3>

            <div className="groups-select">
                {allGroups.map(group => (
                    <div key={group.id}>
                        <Link to={`/me/groups/${group.id}/slices`}>{group.name}</Link>
                    </div>
                ))}
            </div>
        </StyledGroupSelectPage>
    );
};

export default GroupSelectPage;
