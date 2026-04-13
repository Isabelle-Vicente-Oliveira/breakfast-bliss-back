import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { sessionsRoutes } from "./sessions.routes";
import { ingredientsRoutes } from "./ingredients.routes";
import { cartRoutes } from "./cart-item.routes";
import { menuRoutes } from "./menu-items.routes";

const routes = Router();
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/menu-items", menuRoutes)
routes.use("/ingredients", ingredientsRoutes)
routes.use("/cart-item", cartRoutes)



export { routes }