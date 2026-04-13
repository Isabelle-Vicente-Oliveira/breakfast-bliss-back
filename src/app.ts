import express from "express"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./docs/swagger.json"
import cors from "cors"

import { errorHandling } from "./middlewares/error-handling"
import { routes } from "./routes"
import { UPLOAD_CONFIG } from "./configs/upload"

const app = express()

app.use(cors())
app.use(express.json())


app.use("/files", express.static(UPLOAD_CONFIG.directory))

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(routes)
app.use(errorHandling)

export { app }