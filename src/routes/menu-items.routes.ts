import { Router } from "express"
import { MenuItemsController } from "@/controllers/menu-items.controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"
import multer from "multer";
import { UPLOAD_CONFIG } from "@/configs/upload";


const menuRoutes = Router()
const menuItemsController = new MenuItemsController()
const upload = multer(UPLOAD_CONFIG);

menuRoutes.get("/", menuItemsController.index)

menuRoutes.post("/",
    ensureAuthenticated,
    verifyUserAuthorization(["admin"]),
    upload.single("image"),
    menuItemsController.create
); menuRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), menuItemsController.delete)
menuRoutes.get("/:id", menuItemsController.show)
export { menuRoutes }