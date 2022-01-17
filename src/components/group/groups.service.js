import { ROLE_ADMIN } from "./groups.const";

export const getAdminIds = (members) => {
    const items = members || [];

    return items
        .filter(member => member.role === ROLE_ADMIN)
        .map(member => member.id);
};