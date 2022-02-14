import {matchPath} from "react-router";

export const matchPaths = (pathname, to, paths=null) => {
    if (!to) {
        return false;
    }

    let pathList = [to];

    if (paths) {
        pathList = pathList.concat(paths);
    }

    return pathList.some(path => matchPath({
        path,
        exact: true,
        strict: true
    }, pathname) !== null)
};