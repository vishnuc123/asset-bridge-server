import { ContainerModule } from "inversify";
import { Authcontroller } from "../../../../presentation/controllers/auth-controller";
import { Tokens } from "../../../../shared/constants/Tokens";
import { AuthRoutes } from "../../../../presentation/routes/auth-routes";
import { AuthService } from "../../../services/auth-service";
import { MailService } from "../../../services/mail-service";
import { RedisService } from "../../../services/redis-service";
import { RegisterUseCase } from "../../../../application/useCases/auth/register-usecase";
import { VerifyOtpUseCase } from "../../../../application/useCases/auth/verifyotp-usecase";
import { AuthRepository } from "../../../database/repositories/auth-repository";
import { ConfirmRegisterUseCase } from "../../../../application/useCases/auth/confirmregister-usecase";
import { LoginUseCase } from "../../../../application/useCases/auth/login-usecase";
import { GetAuthenticateUseCase } from "../../../../application/useCases/auth/getAuthenticate-usecase";
import { RefreashUseCase } from "../../../../application/useCases/auth/refreash-usecase";
import { ForgetPasswordUseCase } from "../../../../application/useCases/auth/forget-password-usecase";
import { ResetPassUseCase } from "../../../../application/useCases/auth/reset-password-usecase";
import { GoogleLoginUseCase } from "../../../../application/useCases/auth/GoogleLoginUseCase";
import { switchRoleUseCase } from "../../../../application/useCases/auth/switch-role-usecase";

export const authModule = new ContainerModule(({ bind }) => {
    bind(Tokens.authController).to(Authcontroller)
    bind(Tokens.authRoutes).to(AuthRoutes)
    bind(Tokens.authRepository).to(AuthRepository)
    bind(Tokens.authService).to(AuthService)
    bind(Tokens.mailService).to(MailService)
    bind(Tokens.redisService).to(RedisService)
    bind(Tokens.registerUseCase).to(RegisterUseCase)
    bind(Tokens.verifyOtpUseCase).to(VerifyOtpUseCase)
    bind(Tokens.confirmRegisterUseCase).to(ConfirmRegisterUseCase)
    bind(Tokens.loginUseCase).to(LoginUseCase)
    bind(Tokens.getAuthenticateUseCase).to(GetAuthenticateUseCase)
    bind(Tokens.refreashUseCase).to(RefreashUseCase)
    bind(Tokens.forgetPasswordUseCase).to(ForgetPasswordUseCase)
    bind(Tokens.resetPasswordUseCase).to(ResetPassUseCase)
    bind(Tokens.googleLoginUseCase).to(GoogleLoginUseCase)
    bind(Tokens.switchRoleUseCase).to(switchRoleUseCase)
})