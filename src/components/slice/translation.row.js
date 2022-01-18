import React from "react";
import PropTypes from "prop-types";

import api from "../../utils/api";
import { useSlicesViewContext } from "./slices.view";
import { DETACH_TRANSLATION } from "./slices.const";

const TranslationRow = ({obj, nodeId, expressionId, isEditable}) => {
    const {dispatch} = useSlicesViewContext();

    async function detach() {
        console.log('detach translation', obj.id);
        try {
            const {data:res} = await api.post(`/me/nodes/${nodeId}/detach-translation/${obj.id}`);
            console.log('detach t', res);
            dispatch({type: DETACH_TRANSLATION, payload: {
                expressionId,
                translationId: obj.id,
            }})
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="translation">
            <span>{obj.value}</span>
            {isEditable && (
                <div className="controls">
                    <span onClick={detach}>✕</span>
                </div>
            )}
        </div>
    );
};

TranslationRow.propTypes = {
    isEditable: PropTypes.bool.isRequired,
    nodeId: PropTypes.number.isRequired,
    expressionId: PropTypes.number.isRequired,
    obj: PropTypes.object.isRequired,
};

export default TranslationRow;
