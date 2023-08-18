import express from "express";
import StoreController from "../controllers/StoreController";
import Auth from "../middleware/Auth";

const router = express.Router();

router.post('/', Auth.validateToken, StoreController.create);
router.delete('/:id', Auth.validateToken, StoreController.delete);
router.put('/:id', Auth.validateToken, StoreController.update);
router.get('/:id', Auth.validateToken, StoreController.get);
router.get('/', Auth.validateToken, StoreController.getAll);

export default router;