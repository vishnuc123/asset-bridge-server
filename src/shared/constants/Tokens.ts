export const Tokens = {
    authRoutes:Symbol.for("authRoutes"),
    authController:Symbol.for("authController"),
    authRepository:Symbol.for("authRepository"),
    redisService:Symbol.for("redisService"),
    mailService:Symbol.for("mailService"),
    authService:Symbol.for("authService"),
    registerUseCase:Symbol.for("registerUseCase"),

} as const