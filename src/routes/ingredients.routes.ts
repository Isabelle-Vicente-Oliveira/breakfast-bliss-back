import { Router } from "express"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"
import { IngredientsController } from "@/controllers/ingredients.controller"

const ingredientsRoutes = Router()
const ingredientsController = new IngredientsController()

ingredientsRoutes.get('/', ensureAuthenticated, ingredientsController.index)

ingredientsRoutes.post('/', ensureAuthenticated, verifyUserAuthorization(['admin']), ingredientsController.create)
ingredientsRoutes.patch('/:id', ensureAuthenticated, verifyUserAuthorization(['admin']), ingredientsController.update)

export { ingredientsRoutes }