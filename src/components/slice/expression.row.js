import React, { useState } from "react";
import PropTypes from "prop-types";
import TranslationInput from "./translation.input";


const ExpressionRow = ({obj, nodeId, isEditable}) => {
    return (
        <div className="expression-row">
            <div className="target-value">{obj.value}</div>
            <div className="translations">
                {
                    obj.translations && obj.translations.map(trans => (
                        <div className="translation">
                            <span>{trans.value}</span>
                            <div className="controls">
                                <span>✕</span>
                            </div>   
                        </div>
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
