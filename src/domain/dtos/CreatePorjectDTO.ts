export interface CreateProjectDTO {
    name: string;
    owner: string;
    members: {
        identifier: string;
        pending: boolean;
        scope: string;
    }[];
}