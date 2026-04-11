import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { hash } from "bcrypt"
import { email, z } from "zod"


class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(6),

        })
        const { name, email, password } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

        if (userWithSameEmail) {
            throw new AppError('O usuário já existe com esse email')
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const { password: _, ...userWithoutPassword } = user


        return response.status(201).json(userWithoutPassword)
    }

    async index(request: Request, response: Response) {
        const { name } = request.query;

        const allUsers = await prisma.user.findMany({
            where: {
                name: name ? {
                    contains: String(name),
                    mode: 'insensitive',
                } : undefined,
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true, games: true },
            orderBy: { name: 'asc' }
        })

        return response.status(200).json(allUsers)

    }

}

export { UsersController }