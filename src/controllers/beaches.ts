import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { Beach } from "@src/models/beach";
import mongoose from "mongoose";

@Controller('beaches')
export class BeachesController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body)
      // console.log('BEACH', beach.toJSON())
      const result = await beach.save()
      // console.log('RESULT', result)
      res.status(201).send(result.toJSON())
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message })
      } else {
        res.status(500).send({ error: 'Internal Server Error' })
      }
    }
  }
}
