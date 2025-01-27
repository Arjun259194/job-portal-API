import express from "express";

const authRouter = express.Router();

authRouter.get("/v1/api/auth/register", (req, res) => {});
authRouter.get("/v1/api/auth/verify-email", (req, res) => {});
authRouter.get("/v1/api/auth/resend-verification", (req, res) => {});
authRouter.get("/v1/api/auth/forgot-password", (req, res) => {});
authRouter.get("/v1/api/auth/reset-password", (req, res) => {});
authRouter.get("/v1/api/auth/me", (req, res) => {});
