import ColorsModel from "../models/ColorsModel.js";

export const getColors = async (req, res) => {
  try {
    const colors = await ColorsModel.findAll();

    if (!colors)
      return res.status(404).json({
        message: "Colors Mapping masih kosong, tolong isi terlebih dahulu!",
      });

    res.status(200).json({
      message: "Colors Berhasil ditemukan!",
      colors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAllColors = async (req, res) => {
  try {
    const colors = req.body;

    for (const c of colors) {
      const existingColors = await ColorsModel.findOne({
        where: { name: c.name },
      });

      if (existingColors) {
        await ColorsModel.update({ code: c.code }, { where: { name: c.name } });
      } else {
        await ColorsModel.create({
          name: c.name,
          code: c.code,
        });
      }
    }

    res.status(201).json({
      message: "Semua colors berhasil diproses",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
