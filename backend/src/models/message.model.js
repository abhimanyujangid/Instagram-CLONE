import mongoose,{Schema} from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
}, { timestamps: true });
const Message = mongoose.model("Message", messageSchema);
export default Message