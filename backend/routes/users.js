const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/role", updateUserRole);

module.exports = router;
