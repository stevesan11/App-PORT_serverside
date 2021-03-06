import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import bcrypt from "bcrypt";
import "dotenv/config";

import User from "../model/userModel";
import HttpError from "../model/http-error";

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			session: false,
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async (email: string, password: string, done: any) => {
			let existinguser;
			try {
				existinguser = await User.findOne({ email });
			} catch (error) {
				return done(null, false, {
					message: "Something went wrong, please try again later",
					errCode: 500,
				});
			}
			if (!existinguser) {
				return done(null, false, {
					message: "Could not find a user for the provided email",
					errCode: 401,
				});
			}

			let passwordIsValid;
			try {
				passwordIsValid = await bcrypt.compare(password, existinguser.password);
			} catch (error) {
				return done(null, false, {
					message: "Password hashing failed, please try again later",
					errCode: 401,
				});
			}
			if (!passwordIsValid) {
				return done(null, false, {
					message: "Could not log you in, please check your credintials and try again",
					errCode: 401,
				});
			}
			return done(null, existinguser);
		}
	)
);

passport.use(
	new JwtStrategy(
		{
			secretOrKey: process.env.JWT_PASS,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async (jwt_payload: any, done: VerifiedCallback) => {
			const user = await User.findById(jwt_payload.userId);
			if (!user) {
				return done(null, false, { message: "Cannot find user by payload date", errCode: 401 });
			}
			return done(null, user);
		}
	)
);

export const checkLocalAuth = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err) {
			return next(new HttpError("Something went wrong, please try again later", 500));
		}
		if (!user) {
			return next(new HttpError(info.message, info.errCode));
		}
		req.user = user;
		next();
	})(req, res, next);
};

export const checkJwtAuth = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) {
			return next(new HttpError("Something went wrong, please try again later", 500));
		}
		if (!user) {
			return next(new HttpError(info.message, info.errCode));
		}
		req.user = user;
		next();
	})(req, res, next);
};
export default passport;
