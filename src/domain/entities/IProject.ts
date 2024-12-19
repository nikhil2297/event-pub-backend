export interface IProject {
    _id: string;
    name: string;
    owner: string;
    type: 'PERSONAL'| 'TEAM';
    members: {
        identifier: string;
        pending: boolean;
        scope: string;
    }[];
    active: boolean;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}