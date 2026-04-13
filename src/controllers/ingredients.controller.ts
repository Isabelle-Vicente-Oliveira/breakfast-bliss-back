import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod"

class IngredientsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string().min(5)
        });

        const { name, description } = bodySchema.parse(request.body);

        const ingredient = await prisma.ingredient.findFirst({
            where: { name }
        });

        if (ingredient) throw new AppError("Ingrediente ja existente", 400);

        const newIngredient = await prisma.ingredient.create({
            data: { name, description }
        });

        return response.status(201).json(newIngredient);
    }

    async index(request: Request, response: Response) {
        const ingredients = await prisma.ingredient.findMany();
        return response.status(200).json(ingredients);
    }


    async update(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() });
        const bodySchema = z.object({
            name: z.string().min(3).optional(),
            description: z.string().min(5)
        });

        const { id } = paramsSchema.parse(request.params);
        const data = bodySchema.parse(request.body);

        const ingredient = await prisma.ingredient.findUnique({ where: { id } });
        if (!ingredient) throw new AppError("Ingrediente não encontrado", 404);

        const updatedIngredient = await prisma.ingredient.update({ where: { id }, data });
        return response.status(200).json(updatedIngredient);
    }
}

export { IngredientsController }