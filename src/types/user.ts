// src/types/user.ts
export interface CreateUserDto {
	name: string;
	email: string;
	phone?: string;
}

export interface UpdateUserDto {
	name?: string;
	email?: string;
	phone?: string;
}

export interface UserResponse {
	id: string;
	name: string;
	email: string;
	phone?: string;
	createdAt: Date;
	updatedAt: Date;
}
