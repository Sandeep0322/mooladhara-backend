import { Response } from "express";
import { CustomRequest } from "../../middleware/auth";
import ChatHistory from "../models/ChatHistroy";
import axios from "axios";
import {
  compressEncrypt,
  decryptQuestionAnswer,
} from "../../services/convertionCode";

// Create Users
export const createChat = async (req: CustomRequest, res: Response) => {
  const { question } = req.body;
  try {
    const data = await axios.post(
      "https://rajendransp133-vedastro.hf.space/predict/",
      {
        data: {
          year: 2002,
          month: 6,
          date: 19,
          hours: 15,
          minutes: 59,
          seconds: 0,
          latitude: 13.05,
          longitude: 80.17,
          timezone: 5.5,
        },
        question: question,
      }
    );
    const encrypt = compressEncrypt(data.data.response);
    const chatHistory = new ChatHistory({
      user: req.user._id,
      history: { question, answer: encrypt.encryptedData },
    });
    const result = await chatHistory.save();
    res
      .status(201)
      .json({ question, answer: encrypt.encryptedData, chatHistory: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Users
export const updateChat = async (req: CustomRequest, res: Response) => {
  const { question, perviousQuestion } = req.body;

  const { id } = req.params;
  try {
    const data = await axios.post(
      "https://rajendransp133-vedastro.hf.space/predict/",
      {
        data: {
          year: 2002,
          month: 6,
          date: 19,
          hours: 15,
          minutes: 59,
          seconds: 0,
          latitude: 13.05,
          longitude: 80.17,
          timezone: 5.5,
        },
        question: question,
      }
    );
    const chatHistory = await ChatHistory.findById(id);
    if (!chatHistory) {
      return res.status(404).json({ message: "Chat history not found" });
    }
    const encrypt = compressEncrypt(data.data.response);

    chatHistory.history = {
      ...chatHistory.history,
      history: {
        question,
        answer: encrypt.encryptedData,
        history: chatHistory.history,
      },
    };
    const result = await chatHistory.save();
    res
      .status(200)
      .json({ question, answer: encrypt.encryptedData, chatHistory: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Users Details
export const getHistories = async (req: CustomRequest, res: Response) => {
  try {
    const chatHistories = await ChatHistory.find({
      user: req.user._id,
    }).populate("user");
    res.status(200).json(chatHistories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Users Details
export const getHistory = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const chatHistory = await ChatHistory.findById(id);
    if (!chatHistory) {
      return res.status(404).json({ message: "Chat history not found" });
    }
    const historyData = decryptQuestionAnswer(chatHistory.history);
    res.status(200).json({ chatHistoryId: chatHistory._id, historyData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
