export type User = {
    id: string;
    email: string;
    password: string;
};
export declare const UserModel: {
    authenticate(email: string, password: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updatePassword(id: string, newPassword: string): Promise<void>;
};
