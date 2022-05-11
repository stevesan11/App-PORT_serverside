import { model, Schema } from "mongoose";

export interface UserData {
	image: string;
	username: string;
	email: string;
	password: string;
	apps: object[];
}

const userSchema: Schema = new Schema<UserData>({
	image: { type: String, required: true },
	username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
	email: { type: String, required: true, unique: true, minlength: 6, maxlength: 320 },
	password: { type: String, required: true, minlength: 8, maxlength: 20 },
	apps: [{ type: Schema.Types.ObjectId, required: true, ref: "Place" }],
});

const User = model<UserData>("User", userSchema);

export default User;
