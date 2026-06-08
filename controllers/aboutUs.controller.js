import mongoose from 'mongoose';
import AboutUs from '../models/aboutUs.model.js';

export const createAboutUs = async (req, res, next) => {
  try {
    const { title, description, mission, vision, values } = req.body;

    if (!title || !description || title.trim() === '' || description.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required and cannot be empty.' 
      });
    }

    const aboutUs = await AboutUs.create({
      title,
      description,
      mission,
      vision,
      values: Array.isArray(values) ? values : []
    });

    res.status(201).json({ success: true, data: aboutUs });
  } catch (error) {
    next(error);
  }
};

export const getAllAboutUs = async (req, res, next) => {
  try {
    const aboutItems = await AboutUs.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: aboutItems });
  } catch (error) {
    next(error);
  }
};

export const updateAboutUs = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { title, description, mission, vision, values } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title cannot be empty string' });
    }
    if (description !== undefined && description.trim() === '') {
      return res.status(400).json({ success: false, message: 'Description cannot be empty string' });
    }

    const aboutUs = await AboutUs.findByIdAndUpdate(
      id, 
      { title, description, mission, vision, values },
      { new: true, runValidators: true }
    );
    
    if (!aboutUs) {
      return res.status(404).json({ success: false, message: 'About Us entry not found' });
    }
    res.status(200).json({ success: true, data: aboutUs });
  } catch (error) {
    next(error);
  }
};