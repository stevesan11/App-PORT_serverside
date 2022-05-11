import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
	console.log("appdata");
});
router.get("/:appId", (req: Request, res: Response, next: NextFunction) => {
	console.log("appdata");
});
router.get("/user/:userId", (req: Request, res: Response, next: NextFunction) => {
	console.log("userappdata");
});
router.post("/", (req: Request, res: Response, next: NextFunction) => {
	const { title, description, image, url, author } = req.body;
});
router.patch("/:appId", (req: Request, res: Response, next: NextFunction) => {
	console.log("appdata");
});
router.delete("/:appId", (req: Request, res: Response, next: NextFunction) => {
	console.log("appdata");
});

export default router;
