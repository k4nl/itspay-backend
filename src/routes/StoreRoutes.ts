import express from "express";
import StoreController from "../controllers/StoreController";
import StoreMiddleware from "../middleware/StoreMiddleware";
import Auth from "../middleware/Auth";

const router = express.Router();

router.post(
  '/',
  Auth.validateToken,
  StoreMiddleware.create,
  StoreController.create
);
router.delete(
  '/:id',
  Auth.validateToken,
  StoreMiddleware.delete,
  StoreController.delete
);

router.delete(
  '/',
  Auth.validateToken,
  StoreMiddleware.deleteMany,
  StoreController.deleteMany
);


router.put(
  '/:id',
  Auth.validateToken,
  StoreMiddleware.update,
  StoreController.update
);
router.get(
  '/:id',
  Auth.validateToken,
  StoreMiddleware.findStoreById,
  StoreController.get
);
router.get(
  '/',
  Auth.validateToken,
  StoreController.getAll
);

export default router;