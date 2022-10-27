import { Router } from "../core/router/";
import { AuthController } from "../controllers/auth";
import { Method } from "../interfaces/router";

const authRouter = new Router();

authRouter.addRoute("/auth", AuthController.auth, Method.GET);

export { authRouter };
