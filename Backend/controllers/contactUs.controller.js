import mongoose from 'mongoose';
import ContactUs from '../models/contactUs.model.js';

export const createContactUs = async (req, res, next) => {
  try {
    const { address, number, email, website, mapLink } = req.body;

    if (!address || !number || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: address, number, and email.' 
      });
    }

    const emailRegex = /^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address.' 
      });
    }

    const contact = await ContactUs.create({
      address,
      number,
      email,
      website,
      mapLink
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

export const getAllContactUs = async (req, res, next) => {
  try {
    const contacts = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    next(error);
  }
};

export const updateContactUs = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'The provided ID format is invalid.' 
      });
    }

    const { address, number, email, website, mapLink } = req.body;

    if (email) {
      const emailRegex = /^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid email address.' 
        });
      }
    }

    const contact = await ContactUs.findByIdAndUpdate(
      id,
      { address, number, email, website, mapLink },
      {
        new: true,
        runValidators: true, // Crucial: forces Mongoose to check schema rules again
      }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact Us entry not found' });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};