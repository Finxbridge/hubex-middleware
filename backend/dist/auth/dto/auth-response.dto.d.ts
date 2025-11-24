export declare class AuthResponseDto {
    access_token: string;
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
}
export declare class UserProfileResponseDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    updatedAt: Date;
}
