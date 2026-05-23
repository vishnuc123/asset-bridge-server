export const Tokens = {
    authRoutes:Symbol.for("authRoutes"),
    authController:Symbol.for("authController"),
    authRepository:Symbol.for("authRepository"),
    redisService:Symbol.for("redisService"),
    mailService:Symbol.for("mailService"),
    authService:Symbol.for("authService"),
    
    registerUseCase:Symbol.for("registerUseCase"),
    verifyOtpUseCase:Symbol.for("verifyOtpUseCase"),
    confirmRegisterUseCase:Symbol.for("confirmRegisterUseCase"),
    loginUseCase:Symbol.for("loginUseCase")

}