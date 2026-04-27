import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class CartItemsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            menuItemId: z.string().uuid(),
            quantity: z.number().int().positive().default(1),
        })

        const { menuItemId, quantity } = bodySchema.parse(request.body)
        const userId = request.user.id
        const menuItem = await prisma.menuItem.findUnique({
            where: { id: menuItemId }
        })

        if (!menuItem) {
            throw new AppError("Item do cardápio não encontrado", 404)
        }

        if (!menuItem.available) {
            throw new AppError("Este item não está disponível no momento", 400)
        }

        const existingCartItem = await prisma.cartItem.findFirst({
            where: { userId, menuItemId }
        })

        if (existingCartItem) {
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity }
            })
            return response.status(200).json(updatedItem)
        }

        const cartItem = await prisma.cartItem.create({
            data: {
                userId,
                menuItemId,
                quantity
            }
        })

        return response.status(201).json(cartItem)
    }

    async index(request: Request, response: Response) {
        const userId = request.user.id

        const cart = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                menuItem: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        imageUrl: true,
                        category: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        const totalPrice = cart.reduce((acc, item) => {
            return acc + (Number(item.menuItem.price) * item.quantity)
        }, 0)

        const totalItem = cart.reduce((acc, item) => {
            return acc + (item.quantity)
        }, 0)

        return response.json({ items: cart, totalPrice, totalItem })
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const bodySchema = z.object({ quantity: z.number().int().positive() })

        const { id } = paramsSchema.parse(request.params)
        const { quantity } = bodySchema.parse(request.body)
        const userId = request.user.id

        const cartItem = await prisma.cartItem.findUnique({ where: { id } })

        if (!cartItem || cartItem.userId !== userId) {
            throw new AppError("Item do carrinho não encontrado", 404)
        }

        const updated = await prisma.cartItem.update({
            where: { id },
            data: { quantity }
        })

        return response.json(updated)
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const { id } = paramsSchema.parse(request.params)
        const userId = request.user.id

        const cartItem = await prisma.cartItem.findUnique({ where: { id } })

        if (!cartItem || cartItem.userId !== userId) {
            throw new AppError("Item do carrinho não encontrado", 404)
        }

        await prisma.cartItem.delete({ where: { id } })

        return response.status(204).json()
    }
}

export { CartItemsController }