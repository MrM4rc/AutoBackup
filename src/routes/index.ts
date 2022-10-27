import { Router } from "../core/router";
import { authRouter } from "./auth";

const router = new Router();

router.addRoute(authRouter);

export { router };
