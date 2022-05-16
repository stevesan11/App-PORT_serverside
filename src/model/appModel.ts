import { model, Schema, Types } from "mongoose";

export interface AppData {
	_id?: Types.ObjectId;
	title: string;
	description: string;
	image: string;
	url: string;
	author: Types.ObjectId;
}

const appSchema: Schema = new Schema<AppData>({
	title: { type: String, required: true, minlength: 3, maxlength: 30 },
	description: { type: String, required: true, minlength: 10, maxlength: 300 },
	image: { type: String, required: true },
	url: { type: String, required: true, minlength: 13, maxlength: 2083 },
	author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const App = model<AppData>("App", appSchema);

export default App;
