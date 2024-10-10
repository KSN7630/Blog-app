import express from  'express';
import { delete_user_delete, test_get ,update_user_put,get_users_get,get_user_get} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

// Test
router.get("/test",test_get);


router.put('/update/:id',verifyToken,update_user_put);
router.delete('/delete/:userId',verifyToken,delete_user_delete);
router.get(`/getusers`,verifyToken,get_users_get);
router.get(`/:userId`,get_user_get);

 export default router;