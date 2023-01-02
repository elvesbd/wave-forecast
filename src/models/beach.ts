import mongoose, { Document, Model } from 'mongoose';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  _id?: string;
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
}

const schema = new mongoose.Schema<Beach>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
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

interface BeachModel extends Omit<Beach, '_id'>, Document {}
//export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);
export const Beach = mongoose.model<BeachModel>('Beach', schema);

