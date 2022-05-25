import { model, Schema, Types } from "mongoose";

export interface UserData {
	_id: Types.ObjectId;
	image: string;
	username: string;
	email: string;
	password: string;
	apps: Types.ObjectId[];
}

const userSchema: Schema = new Schema<UserData>({
	image: { type: String, required: true },
	username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
	email: { type: String, required: true, unique: true, minlength: 6, maxlength: 320 },
	password: { type: String, required: true, minlength: 8, maxlength: 60 },
	apps: [{ type: Schema.Types.ObjectId, required: true, ref: "App" }],
});

const User = model<UserData>("User", userSchema);

export default User;
