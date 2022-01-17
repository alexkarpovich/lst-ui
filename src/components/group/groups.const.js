export const ROLE_ADMIN = 0;
export const ROLE_READER = 1;
export const ROLE_EDITOR = 2;

export const ROLE_MAP = {
    [ROLE_ADMIN]: 'admin',
    [ROLE_READER]: 'reader',
    [ROLE_EDITOR]: 'editor'
}

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_DELETED = 2;

export const STATUS_MAP = {
    [STATUS_PENDING]: 'pending',
    [STATUS_ACTIVE]: 'active',
    [STATUS_DELETED]: 'deleted'
};

export const SET_CREATING_MODE = 'SET_CREATING_MODE';
export const SET_FETCHING = 'SET_FETCHING';
export const SET_GROUPS = 'LOAD_GROUPS';
export const SET_LANGS = 'LOAD_LANGS';
export const SET_GROUPS_LANGS = 'SET_GROUPS_LANGS';
export const DELETE_GROUP = 'DELETE_GROUP';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_MEMBER = 'ADD_MEMBER';