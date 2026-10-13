import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
    userId: {type: "String"},
    meetingId: {type: "String", required: true},
    date: {type: Date, default: Date.now, required: true}
});

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;