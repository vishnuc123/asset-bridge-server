import { inject, injectable } from "inversify";
import type { IUser } from "../../../core/models/user-models";
import type { IUpdateProfileUseCase } from "../../interfaces/IAccountUseCase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import { AppError } from "../../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";

@injectable()
export class updateProfileUseCase implements IUpdateProfileUseCase {
    constructor(@inject(Tokens.authRepository) private authRepository: IAuthRepository) { }
    async execute(userId: string, data: Partial<IUser> & { fullName?: string }): Promise<IUser | null> {
        const user = await this.authRepository.findById(userId);

        if (!user) {
            throw new AppError(
                AUTH_ERROR_MESSAGES.userNotFound,
                HttpStatusCode.NOT_FOUND
            );
        }

        const updateData: Record<string, unknown> = { ...data };

        if (updateData.fullName && typeof updateData.fullName === "string") {
            const names = updateData.fullName.trim().split(/\s+/);

            updateData.firstName = names[0];
            updateData.lastName = names.slice(1).join(" ");

            delete updateData.fullName;
        }

        const result = await this.authRepository.update(userId, updateData);
        return result
    }
}