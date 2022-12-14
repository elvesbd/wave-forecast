import mongoose, { Document } from "mongoose";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema<UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret): void {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
)

export const User = mongoose.model<UserModel>('User', schema);
