import SizeModel from "../models/SizeModel.js";

export const getSize = async (req, res) => {
  try {
    const size = await SizeModel.findAll({
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
    });

    if (size?.length === 0)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Size Not Found" });

    res
      .status(200)
      .json({ success: true, code: 200, message: "Size Found", size });
  } catch (error) {
    res.status(500).json({ error: true, code: 500, message: error.message });
  }
};

export const createAllSize = async (req, res) => {
  try {
    const size = req.body;

    for (const s of size) {
      const name = s.name;

      //   return res
      //     .status(200)
      //     .json({ success: true, code: 200, message: "Size Found", name });
      const size = await SizeModel.findOne({
        where: {
          name,
        },
      });

      if (size?.name === name) {
        return res
          .status(400)
          .json({ error: true, code: 400, message: "Size has been used" });
      }
      await SizeModel.create({
        name,
      });
    }
    res
      .status(201)
      .json({ success: true, code: 201, message: "Size create successfully" });
  } catch (error) {
    res.status(500).json({ error: true, code: 500, message: error.message });
  }
};
