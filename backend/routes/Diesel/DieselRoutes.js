
const express = require("express");
const router = express.Router();
const DieselController = require("../../controllers/Diesel/DieselController");

router.post("/api/store-diesel", DieselController.createDiesel);
router.get("/api/get-diesel", DieselController.getAllDiesel);
router.get("/api/diesel-signle/:id", DieselController.getDieselById);
router.put("/api/update-diesel/:id", DieselController.updateDiesel);
router.delete("/api/delete-diesel/:id", DieselController.deleteDiesel);


module.exports = router;