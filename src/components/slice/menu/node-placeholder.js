import React from "react";

export const NodePlaceholder = (props) => {
  const left = props.depth * 12;

  return (
    <div style={{left}}></div>
  )
};
