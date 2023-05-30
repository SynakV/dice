import connectMongo from "@utils/api/mongodb/mongodb";
import { DEFAULT_DESK } from "@utils/common/constants";
import Desk from "@utils/api/mongodb/models/desk.model";
import { NOT_FOUND } from "@utils/api/mongodb/constants";

export default async (req: any, res: any) => {
  await connectMongo();

  if (req.query.id) {
    try {
      const desk = await Desk.findById(req.query.id);

      if (desk) {
        return res.json(desk);
      } else {
        return res.json(NOT_FOUND);
      }
    } catch (e) {
      return res.json(NOT_FOUND);
    }
  }

  if (req.method === "GET") {
    try {
      const desks = await Desk.find();

      return res.json(desks);
    } catch (e) {
      return res.json(NOT_FOUND);
    }
  }

  if (req.method === "POST") {
    const { name, wins, players, stages } = req.body;

    const existedDesk = await Desk.findOne({ name });

    if (existedDesk) {
      return res.json({
        status: 409,
        message: "Desk with such name already exists",
      });
    } else {
      const createDesk = new Desk({
        ...DEFAULT_DESK,
        name,
        gameplay: {
          ...DEFAULT_DESK.gameplay,
          max: {
            wins,
            stages,
            players,
          },
        },
      });

      createDesk.save();

      return res.json(createDesk);
    }
  }
};
