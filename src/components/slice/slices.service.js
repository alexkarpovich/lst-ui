export const getNestedNodeIds = (node) => {
    let ids = [node.id];

    if (node.children) {
        node.children.forEach(child => {
            ids = ids.concat(getNestedNodeIds(child));
        });
    }

    return ids;
};

export const prepareQueryParams = (searchParams) => {
    let qp = Object.fromEntries(searchParams);
    qp.ids = JSON.parse(qp.ids || '[]');

    return qp;
}

export const prepareNodePath = (node) => {
    if (!node) {
        return ""
    }

    return node.path === '' ? ''+node.id : `${node.path}.${node.id}`
}