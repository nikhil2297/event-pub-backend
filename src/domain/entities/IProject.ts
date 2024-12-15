export interface IProject {
    id: string;
    name: string;
    owner: string;
    members: {
        identifier: string;
        pending: boolean;
        scope: string;
    }[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}