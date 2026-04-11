import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("JWT Token não informado", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
        const { sub: user_id, role } = verify(token, authConfig.jwt.secret) as any;

        request.user = {
            id: user_id,
            role: role,
        };

        return next();
    } catch (error) {
        console.log("ERRO NO JWT:", error);
        throw new AppError("Token JWT inválido", 401);
    }
}