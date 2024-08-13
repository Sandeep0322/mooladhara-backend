import { Response } from "express";
import { CustomRequest } from "../../middleware/auth";
import ChatHistory from "../models/ChatHistroy";
import axios from "axios";
import {
  compressEncrypt,
  decryptDecompress,
} from "../../services/convertionCode";
import dayjs from "dayjs";

// Create Users
export const createChat = async (req: CustomRequest, res: Response) => {
  const { question } = req.body;
  const user = req.user;
  try {
    const data = await axios.post(
      "https://rajendransp133-vedastro.hf.space/predict/",
      {
        data: {
          year: Number(dayjs(user.dateOfBirth).format("YYYY")),
          month: Number(dayjs(user.dateOfBirth).format("MM")),
          date: Number(dayjs(user.dateOfBirth).format("DD")),
          hours: Number(dayjs(user.dateOfBirth).format("HH")),
          minutes: Number(dayjs(user.dateOfBirth).format("mm")),
          seconds: 0,
          latitude: user.latitude,
          longitude: user.longitude,
          timezone: 5.5,
        },
        question: question,
      }
    );
    // const encrypt = compressEncrypt(data.data.response)
    const chatHistory = new ChatHistory({
      user: req.user._id,
      history: { question, answer: data.data.response },
    });
    const result = await chatHistory.save();
    res
      .status(201)
      .json({ question, answer: data.data.response, chatHistory: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Users
export const updateChat = async (req: CustomRequest, res: Response) => {
  const { question, perviousQuestion } = req.body;

  const { id } = req.params;
  const user = req.user;
  try {
    const data = await axios.post(
      "https://rajendransp133-vedastro.hf.space/predict/",
      {
        data: {
          year: Number(dayjs(user.dateOfBirth).format("YYYY")),
          month: Number(dayjs(user.dateOfBirth).format("MM")),
          date: Number(dayjs(user.dateOfBirth).format("DD")),
          hours: Number(dayjs(user.dateOfBirth).format("HH")),
          minutes: Number(dayjs(user.dateOfBirth).format("mm")),
          seconds: 0,
          latitude: user.latitude,
          longitude: user.longitude,
          timezone: 5.5,
        },
        question: question,
      }
    );
    const chatHistory = await ChatHistory.findById(id);
    if (!chatHistory) {
      return res.status(404).json({ message: "Chat history not found" });
    }
    // const encrypt = compressEncrypt(data.data.response)

    chatHistory.history = {
      ...chatHistory.history,
      history: {
        question,
        answer: data.data.response,
        history: chatHistory.history,
      },
    };
    const result = await chatHistory.save();
    res
      .status(200)
      .json({ question, answer: data.data.response, chatHistory: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Users Details
export const getHistories = async (req: CustomRequest, res: Response) => {
  try {
    console.log(req.user);
    const chatHistories = await ChatHistory.find({
      user: req.user._id,
    });
    console.log(chatHistories);
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
    // const historyData = decryptDecompress(chatHistory.history.answer)
    res.status(200).json({
      chatHistoryId: chatHistory._id,
      historyData: chatHistory.history.answer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
