import mongoose from 'mongoose';
import Concern from '../models/concern.model.js';
import { saveOptimizedImage } from '../services/image.service.js';

// 1. Create a new concern
export const createConcern = async (req, res, next) => {
  try {
    const { name, slug, description, isActive } = req.body;

    // Validate required text fields
    if (!name || !slug || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, and description are required.',
      });
    }

    // Check slug uniqueness
    const existingConcern = await Concern.findOne({ slug: slug.trim() });
    if (existingConcern) {
      return res.status(400).json({
        success: false,
        message: `Slug '${slug}' is already in use. Please provide a unique slug.`,
      });
    }

    // Logo image is required on creation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Logo image file is required.',
      });
    }

    // Optimize and save the logo image to disk
    const imageResult = await saveOptimizedImage({
      file: req.file,
      folder: 'concerns',
      width: 600, // Logos can be optimized to a smaller max-width (e.g., 600px)
      quality: 80,
      prefix: 'concern-logo',
    });

    const concernData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      logo: imageResult.path, // Save the path: e.g. '/uploads/concerns/concern-logo-...'
      isActive: isActive === 'false' || isActive === false ? false : true,
    };

    const concern = await Concern.create(concernData);

    res.status(201).json({
      success: true,
      data: concern,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Update an existing concern
export const updateConcern = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid concern ID format.',
      });
    }

    const concern = await Concern.findById(id);
    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Concern not found.',
      });
    }

    const { name, slug, description, isActive } = req.body;

    // If updating slug, verify it's unique
    if (slug && slug.trim() !== concern.slug) {
      const existingConcern = await Concern.findOne({
        slug: slug.trim(),
        _id: { $ne: id },
      });
      if (existingConcern) {
        return res.status(400).json({
          success: false,
          message: `Slug '${slug}' is already in use. Please provide a unique slug.`,
        });
      }
      concern.slug = slug.trim();
    }

    // If a new logo is uploaded, optimize and replace the path
    if (req.file) {
      const imageResult = await saveOptimizedImage({
        file: req.file,
        folder: 'concerns',
        width: 600,
        quality: 80,
        prefix: 'concern-logo',
      });
      concern.logo = imageResult.path;
    }

    // Update other fields if supplied
    concern.name = name ? name.trim() : concern.name;
    concern.description = description ? description.trim() : concern.description;

    if (isActive !== undefined) {
      concern.isActive = isActive === 'true' || isActive === true;
    }

    const updatedConcern = await concern.save();

    res.status(200).json({
      success: true,
      data: updatedConcern,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Delete a concern
export const deleteConcern = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format.',
      });
    }

    const concern = await Concern.findByIdAndDelete(id);
    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Concern not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Concern deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// 4. Toggle the active status
export const toggleConcernStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format.',
      });
    }

    const concern = await Concern.findById(id);
    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Concern not found.',
      });
    }

    // Toggle boolean value
    concern.isActive = !concern.isActive;
    await concern.save();

    res.status(200).json({
      success: true,
      data: concern,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get all concerns (supporting optional filters and search)
export const getAllConcerns = async (req, res, next) => {
  try {
    const { isActive, search, page, limit } = req.query;

    const query = {};

    // Filter by active status if requested
    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Pagination
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const [total, concerns] = await Promise.all([
      Concern.countDocuments(query),
      Concern.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
    ]);

    res.status(200).json({
      success: true,
      count: concerns.length,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit),
      },
      data: concerns,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get single concern by ID
export const getConcernById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format.',
      });
    }

    const concern = await Concern.findById(id);
    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Concern not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: concern,
    });
  } catch (error) {
    next(error);
  }
};
