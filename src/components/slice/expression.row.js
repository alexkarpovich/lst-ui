import React, { useState } from "react";
import PropTypes from "prop-types";
import TranslationInput from "./translation.input";
import TranslationRow from "./translation.row";

import api from "../../utils/api";
import { useSlicesViewContext } from "./slices.view";
import { DETACH_EXPRESSION } from "./slices.const";


const ExpressionRow = ({obj, nodeId, isEditable}) => {
    const {dispatch} = useSlicesViewContext();

    async function detach() {
        try {
            const {data:res} = await api.post(`/me/nodes/${nodeId}/detach-expression/${obj.id}`);
            console.log(res);
            dispatch({type: DETACH_EXPRESSION, payload: {
                expressionId: obj.id,
            }});
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="expression-row">
            <i className="detach-btn icon-bin" onClick={detach} />
            <div className="target-value">{obj.value}</div>
            <div className="translations">
                {
                    obj.translations && obj.translations.map(trans => (
                        <TranslationRow 
                            key={trans.id} 
                            obj={trans}
                            nodeId={nodeId}
                            expressionId={obj.id}
                            isEditable={isEditable} 
                        />
                    ))
                }
                {isEditable && (
                    <TranslationInput 
                        expressionId={obj.id} 
                        nodeId={nodeId}
                    />
                )}
            </div>
        </div>
    );
};

ExpressionRow.propTypes = {
    obj: PropTypes.object.isRequired,
    nodeId: PropTypes.number.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default ExpressionRow;
