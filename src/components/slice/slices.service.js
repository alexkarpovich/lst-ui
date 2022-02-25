import { NODE_FOLDER } from "./slices.const";

export const getNestedNodeIds = (ids, allNodes) => {
    const parentNodes = allNodes.filter(node => ids.indexOf(node.id) !== -1);
    const parentPaths = parentNodes.map(node => prepareNodePath(node));

    return parentNodes.concat(allNodes.filter(node => parentPaths.some(path => node.path.startsWith(path))))
        .map(node => node.id);
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

export const getDirectParentId = (node) => {
    if (node.path === '') {
        return null
    }

    const ids = node.path.split('.');

    return +ids[0];
};

export const prepareTreeData = (nodes) => {
    return nodes.map(item => {
        const parentId = getDirectParentId(item);
        const node = {
            id: item.id,
            parent: parentId,
            droppable: item.type === NODE_FOLDER,
            text: item.name,
            data: item
        };
        
        return node;
    });
};