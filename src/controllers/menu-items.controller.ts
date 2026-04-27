import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class MenuItemsController {
    async create(request: Request, response: Response) {
        const { ingredients: rawIngredients } = request.body

        let processedIngredients: string[] = []
        if (rawIngredients) {
            if (typeof rawIngredients === "string") {
                if (rawIngredients.startsWith("[")) {
                    processedIngredients = JSON.parse(rawIngredients)
                } else {
                    processedIngredients = rawIngredients.split(",").map((id) => id.trim())
                }
            } else if (Array.isArray(rawIngredients)) {
                processedIngredients = rawIngredients
            }
        }

        const dataToValidate = {
            ...request.body,
            price: request.body.price ? Number(request.body.price) : undefined,
            ingredients: processedIngredients,
        }

        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string().min(5),
            price: z.number().positive(),
            category: z.string().min(3),
            ingredients: z.array(z.string().uuid()).optional(),
        })

        const { name, description, price, category, ingredients } = bodySchema.parse(dataToValidate)
        const filename = request.file?.filename

        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price,
                imageUrl: filename,
                category,
                ingredients: {
                    create: ingredients?.map((ingredientId) => ({
                        ingredientId,
                    })),
                },
            },
            include: {
                ingredients: {
                    include: { ingredient: true },
                },
            },
        })

        return response.status(201).json(menuItem)
    }
    async index(request: Request, response: Response) {
        const querySchema = z.object({
            name: z.string().optional(),
            ingredient: z.string().optional(),
        })

        const { name, ingredient } = querySchema.parse(request.query)

        const menuItems = await prisma.menuItem.findMany({
            where: {
                name: name ? { contains: name, mode: "insensitive" } : undefined,
                ingredients: ingredient ? {
                    some: {
                        ingredient: {
                            name: { contains: ingredient, mode: "insensitive" }
                        }
                    }
                } : undefined,
                available: true,
            },
            include: {
                ingredients: {
                    select: {
                        ingredient: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { name: "asc" }
        })

        return response.json(menuItems)
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const { id } = paramsSchema.parse(request.params)

        const menuItem = await prisma.menuItem.findUnique({
            where: { id },
            include: {
                ingredients: {
                    select: {
                        ingredient: true
                    }
                }
            }
        })

        if (!menuItem) {
            throw new AppError("Item não encontrado", 404)
        }

        return response.json(menuItem)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const { id } = paramsSchema.parse(request.params)

        // 1. Verificar se o item existe
        const item = await prisma.menuItem.findUnique({ where: { id } })
        if (!item) {
            throw new AppError("Item não encontrado", 404)
        }

        // 2. Processar Ingredientes (Reaproveitando sua lógica do create)
        const { ingredients: rawIngredients } = request.body
        let processedIngredients: string[] | undefined = undefined

        if (rawIngredients) {
            if (typeof rawIngredients === "string") {
                if (rawIngredients.startsWith("[")) {
                    processedIngredients = JSON.parse(rawIngredients)
                } else {
                    processedIngredients = rawIngredients.split(",").map((id) => id.trim())
                }
            } else if (Array.isArray(rawIngredients)) {
                processedIngredients = rawIngredients
            }
        }

        // 3. Validação com Zod (Campos opcionais no update)
        const bodySchema = z.object({
            name: z.string().min(3).optional(),
            description: z.string().min(5).optional(),
            price: z.number().positive().optional(),
            category: z.string().min(3).optional(),
            ingredients: z.array(z.string().uuid()).optional(),
            available: z.boolean().optional(),
        })

        const dataToValidate = {
            ...request.body,
            price: request.body.price ? Number(request.body.price) : undefined,
            ingredients: processedIngredients,
        }

        const { name, description, price, category, ingredients, available } = bodySchema.parse(dataToValidate)
        const filename = request.file?.filename

        // 4. Update no Banco de Dados
        const updatedMenuItem = await prisma.menuItem.update({
            where: { id },
            data: {
                name,
                description,
                price,
                category,
                available,
                imageUrl: filename ?? item.imageUrl, // Mantém a antiga se não vier nova
                ingredients: ingredients ? {
                    // Estratégia: Remove todas as relações antigas e cria as novas
                    deleteMany: {},
                    create: ingredients.map((ingredientId) => ({
                        ingredientId,
                    })),
                } : undefined,
            },
            include: {
                ingredients: {
                    include: { ingredient: true },
                },
            },
        })

        return response.json(updatedMenuItem)
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const { id } = paramsSchema.parse(request.params)

        const item = await prisma.menuItem.findUnique({ where: { id } })
        if (!item) throw new AppError("Item não encontrado", 404)

        await prisma.menuItem.delete({ where: { id } })

        return response.status(204).json()
    }
}

export { MenuItemsController }