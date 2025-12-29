import ActivityLogModel from "../models/ActivityLogsModel.js";

export const getActivity = async (req, res) => {
  const user = req.user;
  try {
    const logs = await ActivityLogModel.findAll();

    if (user.role !== "admin")
      return res
        .status(400)
        .json({ error: true, code: 400, message: "Bad Request" });

    res
      .status(200)
      .json({ error: true, code: 200, message: "Logs Activity", logs });
  } catch (error) {
    res.status(500).json({ error: true, code: 500, message: error.message });
  }
};
