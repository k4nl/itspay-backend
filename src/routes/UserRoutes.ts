import express from "express";
import UserController from "../controllers/UserController";
import UserMiddleware from "../middleware/UserMiddleware";
import Auth from "../middleware/Auth";

const router = express.Router();

router.post(
  '/login',
  UserMiddleware.login,
  UserController.login,
);

router.post(
  '/',
  UserMiddleware.create,
  UserController.create
);

router.delete(
  '/:id',
  Auth.validateToken,
  UserMiddleware.delete,
  UserController.delete
);

router.put(
  '/:id',
  Auth.validateToken,
  UserMiddleware.update,
  UserController.update
);

router.get(
  '/:id',
  Auth.validateToken,
  UserMiddleware.findByUniqueKey,
  UserController.get
);

router.get(
  '/',
  Auth.validateToken,
  UserController.getAll
);

export default router;