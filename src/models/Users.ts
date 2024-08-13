import mongoose, { Schema, Types } from "mongoose";

export interface UsersDocument {
  _id: Types.ObjectId;
  name: string;
  profilePicture: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  authTokens: string[];
  googleId: string;
  facebookId: string;
  gender: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  birthPlace: string;
  birthChart: string;
  image: string;
  isLogin: boolean;
  latitude: number;
  longitude: number;
  encryptedSVG: string;
}

const userSchema = new Schema<UsersDocument>(
  {
    name: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    email: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    profilePicture: { type: String, trim: true },
    phone: { type: String, maxlength: 20, trim: true },
    countryCode: { type: String, trim: true },
    authTokens: [String],
    googleId: { type: String },
    facebookId: { type: String },
    gender: { type: String, trim: true },
    dateOfBirth: { type: Date },
    birthPlace: { type: String, maxlength: 20, trim: true },
    timeOfBirth: { type: String, trim: true },
    birthChart: { type: String, trim: true },
    image: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    encryptedSVG: { type: String, trim: true },
    isLogin: { type: Boolean },
  },
  { timestamps: true }
);

const Users = mongoose.model<UsersDocument>("useres", userSchema);

export default Users;
