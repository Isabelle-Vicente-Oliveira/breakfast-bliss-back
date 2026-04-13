import { Router } from "express"
import { CartItemsController } from "@/controllers/cart-items.controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"

const cartRoutes = Router()
const cartItemsController = new CartItemsController()

cartRoutes.use(ensureAuthenticated)

cartRoutes.get("/", cartItemsController.index)
cartRoutes.post("/", cartItemsController.create)
cartRoutes.patch("/:id", cartItemsController.update)
cartRoutes.delete("/:id", cartItemsController.delete)

export { cartRoutes }