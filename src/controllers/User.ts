import { Response } from "express";
import Users from "../models/Users";
import firebaseAdmin from "firebase-admin";
import { CustomRequest } from "../../middleware/auth";
import axios from "axios";
import { astroOutput } from "../../utils/astro-output";
import dayjs from "dayjs";
import {
  compressEncrypt,
  decryptDecompress,
} from "../../services/convertionCode";

// Create Users
export const createUsers = async (req: CustomRequest, res: Response) => {
  const { name, email, profilePicture, authToken } = req.body;

  try {
    // Verify Firebase ID Token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(authToken);
    const uid = decodedToken.uid;

    // Check if user already exists
    let user = await Users.findOne({ email });
    if (!user) {
      user = new Users({ name, email, profilePicture, authTokens: [uid] });
      await user.save();
    } else {
      // Add authToken to existing user's authTokens if not already present
      if (!user.authTokens.includes(uid)) {
        user.authTokens.push(uid);
        await user.save();
      }
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Users
export const updateUsers = async (req: CustomRequest, res: Response) => {
  const { lat, lon, hour, min, day, month, year, gender, birthPlace, svg } =
    req.body;
  const user = Users.hydrate(req.user);

  const encryptedSVG = compressEncrypt(svg);
  try {
    if (!user) {
      return res.status(404).json({ message: "Users not found" });
    }

    user.gender = gender;
    user.dateOfBirth = new Date(`${month}/${day}/${year}`);
    user.timeOfBirth = `${hour}:${min}`;
    user.birthPlace = birthPlace;
    user.latitude = lat;
    user.longitude = lon;
    user.encryptedSVG = encryptedSVG;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Users Details
export const getUsers = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  try {
    const data = await axios.post(
      "https://rajendransp133-vedastro.hf.space/predict2/",
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
      }
    );
    console.log(data.data);
    let responseArray = JSON.parse(data.data.response.replace(/'/g, '"'));
    const astroData: any = [];
    responseArray.map((obj: any) => {
      const data = astroOutput.filter((out) => out.attribute === obj);
      astroData.push(data[0]);
    });
    const svg = decryptDecompress(user.encryptedSVG);
    res.status(200).json({ user, astroData, svg });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
