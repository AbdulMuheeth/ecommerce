import express from "express";
import { deleteUser, getAllUsers, getUser, newUser, } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// route - /api/v1/user/new
app.post("/new", newUser);
// route - /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);
// route - /api/v1/user/DynamicID // make sure to add it at the last because all routes added above like (new,all) will considered id route if its added above // similarly for the "/" route in app.ts (home route)
app.route("/:id").get(adminOnly, getUser).delete(adminOnly, deleteUser);
export default app;
