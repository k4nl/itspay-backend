import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

router.post('/', UserController.create);
router.delete('/:id', UserController.delete);
router.put('/:id', UserController.update);
router.get('/:id', UserController.get);
router.get('/', UserController.getAll);

export default router;