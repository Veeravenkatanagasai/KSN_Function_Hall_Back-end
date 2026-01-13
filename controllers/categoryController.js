import CategoryModel from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  const data = await CategoryModel.getAll();
  res.status(200).json(data); 
};

export const addCategory = async (req, res) => {
  const { category_name } = req.body;
  await CategoryModel.create(category_name);
  res.json({ message: "Category added successfully" });
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;
  await CategoryModel.update(id, category_name);
  res.json({ message: "Category updated successfully" });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  await CategoryModel.remove(id);
  res.json({ message: "Category deleted successfully" });
};
