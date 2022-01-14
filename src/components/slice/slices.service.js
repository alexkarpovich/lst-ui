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
    qp.group = +qp.group;
    qp.ids = JSON.parse(qp.ids || '[]');

    return qp;
}