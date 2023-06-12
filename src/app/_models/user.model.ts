export interface User {
    id: string;
    email: string;
    username: string;
    firstName:string;
    lastName:string;
    fullName: string;
    userRoles: string[];
    jwtToken: string;
    refreshToken?: string;
}
