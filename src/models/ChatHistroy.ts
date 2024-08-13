import mongoose, { Schema } from "mongoose";
import { UsersDocument } from "./Users";

export interface QuestionAnswerInterface {
  question: string;
  answer: string;
  history?: QuestionAnswerInterface;
}

export interface ChatHistoryDocument {
  user: UsersDocument;
  history: QuestionAnswerInterface;
}

const questionAnswerSchema = new Schema<QuestionAnswerInterface>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  history: { type: Schema.Types.Mixed, default: null }, // Allows for nested history
});

const chatHistorySchema = new Schema<ChatHistoryDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    history: {
      type: questionAnswerSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model<ChatHistoryDocument>(
  "chat_histories",
  chatHistorySchema
);

export default ChatHistory;
