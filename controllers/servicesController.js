import {
  getAllServices,
  addService,
  updateService,
  deleteService
} from "../models/servicesModel.js";

/* LIST SERVICES */
export const listServices = async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

/* CREATE SERVICE */
export const createService = async (req, res) => {
  try {
    const { service_name, vendor_id } = req.body;

    if (!service_name || !vendor_id) {
      return res.status(400).json({
        message: "Service name and vendor are required"
      });
    }

    const id = await addService(req.body);

    res.status(201).json({
      message: "Service added successfully",
      service_id: id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add service" });
  }
};

/* UPDATE SERVICE */
export const editService = async (req, res) => {
  try {
    await updateService(req.params.id, req.body);
    res.json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update service" });
  }
};

/* DELETE SERVICE */
export const removeService = async (req, res) => {
  try {
    await deleteService(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }
};
