
const express = require("express");
const router = express.Router();
const AutoclaveController = require("../../controllers/autoclave/AutoclaveController");

router.post("/api/store-autoclave", AutoclaveController.createAutoclave);
router.get("/api/get-autoclave", AutoclaveController.getAllAutoclave);
router.get("/api/autoclave-signle/:id", AutoclaveController.getAutoclaveById);
router.put("/api/update-autoclave/:id", AutoclaveController.updateAutoclave);
router.delete("/api/delete-autoclave/:id", AutoclaveController.deleteAutoclave);


module.exports = router;