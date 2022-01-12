import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AsyncSelect from "react-select/async";
import CreatableSelect from 'react-select/creatable';
import { createSearchParams } from "react-router-dom";

import "./slices.view.scss";
import api from "../../utils/api";
import { setIn } from "formik";
import SearchBar from "./search-bar";

const SlicesView = ({activeIds}) => {
    const [data, setData] = useState({});
    
    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const {data:res} = await api.get(`/me/nodes?${createSearchParams({ids: activeIds})}`);
                
                isMounted && setData(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        if (activeIds.length) {
            loadData();
        }

        return () => (isMounted = false);
    }, [activeIds])

    return (
        <div className="slices-view">
            {activeIds.length === 1 && (
                <SearchBar nodeId={activeIds[0]} />
            )}

            <div className="expressions">
                {data.expressions && data.expressions.map(expr => (
                    <div key={expr.id}>{expr.value}</div>
                ))}
            </div>
        </div>
    );
};

SlicesView.propTypes = {
    activeIds: PropTypes.array.isRequired,
};

export default SlicesView;
