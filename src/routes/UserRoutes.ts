import express from "express";
import UserController from "../controllers/UserController";
import Auth from "../middleware/Auth";

const router = express.Router();

router.post('/login', UserController.login);
router.post('/', UserController.create);
router.delete('/:id', Auth.validateToken, UserController.delete);
router.put('/:id', Auth.validateToken, UserController.update);
router.get('/:id', Auth.validateToken, UserController.get);
router.get('/', Auth.validateToken, UserController.getAll);

export default router;