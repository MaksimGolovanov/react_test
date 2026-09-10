// routes/adRouter.js
const Router = require("express");
const router = new Router();
const adController = require("../controllers/adController");

router.post("/check-password", adController.checkPasswordExpiry);

module.exports = router;
