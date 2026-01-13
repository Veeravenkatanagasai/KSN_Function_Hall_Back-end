import { TimeSlotModel } from "../models/timeslotModel.js";

export const getTimeSlots = async (req, res) => {
  const data = await TimeSlotModel.getAll();
  res.status(200).json(data);
};


export const addTimeSlot = async (req, res) => {
  await TimeSlotModel.create(req.body.slot_name);
  res.json({ message: "Time Slot added" });
};

export const updateTimeSlot = async (req, res) => {
  await TimeSlotModel.update(req.params.id, req.body.slot_name);
  res.json({ message: "Time Slot updated" });
};

export const deleteTimeSlot = async (req, res) => {
  await TimeSlotModel.remove(req.params.id);
  res.json({ message: "Time Slot deleted" });
};
