import { Response } from "express";
import { CustomRequest } from "../../middleware/auth";
import ChatHistory from "../models/ChatHistroy";

// Create Users
export const createChat = async (req: CustomRequest, res: Response) => {
  const { question, answer } = req.body;
  try {
    const chatHistory = new ChatHistory({
      user: req.user._id,
      history: { question, answer },
    });
    await chatHistory.save();
    res
      .status(201)
      .json({ message: "Chat history created successfully", chatHistory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Users
export const updateChat = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const chatHistory = await ChatHistory.findById(id);
    if (!chatHistory) {
      return res.status(404).json({ message: "Chat history not found" });
    }
    chatHistory.history = { question, answer, history: chatHistory.history };
    await chatHistory.save();
    res
      .status(200)
      .json({ message: "Chat history updated successfully", chatHistory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Users Details
export const getHistory = async (req: CustomRequest, res: Response) => {
  try {
    const chatHistories = await ChatHistory.find({
      user: req.user._id,
    }).populate("user");
    res.status(200).json(chatHistories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
