// src/controllers/hall.controller.js
import { HallModel } from "../models/hallModel.js";

export const getHalls = async (req, res) => {
  const data = await HallModel.getAll();
   res.status(200).json(data);
};

export const addHall = async (req, res) => {
  const { hall_name } = req.body;
  await HallModel.create(hall_name);
  res.json({ message: "Hall added successfully" });
};

export const updateHall = async (req, res) => {
  const { id } = req.params;
  const { hall_name } = req.body;
  await HallModel.update(id, hall_name);
  res.json({ message: "Hall updated successfully" });
};

export const deleteHall = async (req, res) => {
  const { id } = req.params;
  await HallModel.remove(id);
  res.json({ message: "Hall deleted successfully" });
};
