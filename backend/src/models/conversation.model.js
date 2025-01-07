import mongoose,{Schema} from "mongoose";   

const conversationSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
}, { timestamps: true });
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation