import React from "react";
import PropTypes from "prop-types";


const ExpressionRow = ({obj, isEditable}) => {
    return (
        <div className="expression-row">
            <div className="target-value">{obj.value}</div>
            <div className="translations">
                {
                    obj.translations && obj.translations.map(trans => (
                        <div className="translation">{JSON.stringify(trans)}</div>
                    ))
                }
                {isEditable && (
                    <button className="link add-translation-btn">+ add translation</button>
                )}
            </div>
        </div>
    );
};

ExpressionRow.propTypes = {
    obj: PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default ExpressionRow;
