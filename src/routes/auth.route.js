import express from "express";
import { signUp, login, logout, checkAuth, findUser, getUser, updateUser, deleteUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../midleware/auth.middleware.js";
import { addCard, checkAndUpdateStatusCard, getCard, searchCard } from "../controllers/card.controller.js";
import { checkAndUpdateStatus, creatDocket, deleteDocket, getBorrowedBooks, getDocket, searchDocket, upadateTraSach } from "../controllers/docket.controller.js";
import { addBook, bookById, deleteBook, getBook, getPDF, searchBook, updateBook } from "../controllers/book.controller.js";

const router = express.Router()

router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logout)

router.post("/findUser", findUser)
router.get("/getUser", getUser)
router.post("/updateUser", updateUser)
router.delete("/deleteUser/:_id", deleteUser)


router.get("/check", protectRoute, checkAuth)

router.post("/addBook", addBook)
router.get("/getBook", getBook)
router.post("/searchBook", searchBook)
router.post("/updateBook/:_id", updateBook)
router.delete("/deleteBook/:_id", deleteBook)
router.get("/getBookId/:IdBook", bookById)
router.get("/getPDF/:filename", getPDF)

router.post("/addCard", addCard)
router.get("/getCard",getCard)
router.post("/searchCard", searchCard)
router.post("/checkStatusCard",checkAndUpdateStatusCard)

router.post("/createDocket", creatDocket)
router.get("/getDocket", getDocket)
router.delete("/deleteDocket/:_id", deleteDocket)
router.post("/checkAndUpdateStatus", checkAndUpdateStatus)
router.put("/updateTraSach/:_id", upadateTraSach)
router.get("/getBorrowedBooks", getBorrowedBooks)
router.post("/searchDocket", searchDocket)
export default router
