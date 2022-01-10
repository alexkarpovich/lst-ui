import { ROLE_ADMIN } from "./groups.const";

export const getAdminIds = (members) => {
    return members
        .filter(member => member.role === ROLE_ADMIN)
        .map(member => member.id);
};