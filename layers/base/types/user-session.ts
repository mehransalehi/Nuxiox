export interface UserSession{
    id : number,
    email : string,
    role : 'admin' | 'user'
}