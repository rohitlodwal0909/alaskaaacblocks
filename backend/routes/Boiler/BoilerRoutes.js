
const express = require("express");
const router = express.Router();
const BoilerController = require("../../controllers/Boiler/BoilerController");

router.post("/api/store-boiler", BoilerController.createBoiler);
router.get("/api/get-boiler", BoilerController.getAllBoiler);
router.get("/api/boiler-signle/:id", BoilerController.getBoilerById);
router.put("/api/update-boiler/:id", BoilerController.updateBoiler);
router.delete("/api/delete-boiler/:id", BoilerController.deleteBoiler);


module.exports = router;