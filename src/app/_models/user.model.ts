export interface User {
    id: string;
    email: string;
    userName: string;
    firstName:string;
    lastName:string;
    fullName: string;
    userRoles: string[];
    jwtToken: string;
    refreshToken?: string;
}
