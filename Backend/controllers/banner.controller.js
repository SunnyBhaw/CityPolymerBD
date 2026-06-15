import mongoose from 'mongoose';
import Banner from '../models/banner.model.js';
import { saveOptimizedImage } from '../services/image.service.js';

export const createBanner = async (req, res, next) => {
  try {
    const { title, link, order, isActive } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required.',
      });
    }

    const imageResult = await saveOptimizedImage({
      file: req.file,
      folder: 'banners',
      width: 1920,
      quality: 80,
      prefix: 'banner',
    });

    const bannerData = {
      title: title.trim(),
      image: imageResult.path,
      link: link ? link.trim() : undefined,
      order: order ? parseInt(order, 10) : 0,
      isActive: isActive === undefined ? true : (isActive === 'true' || isActive === true),
    };

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner ID format.',
      });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.',
      });
    }

    const { title, link, order, isActive } = req.body;

    if (req.file) {
      const imageResult = await saveOptimizedImage({
        file: req.file,
        folder: 'banners',
        width: 1920,
        quality: 80,
        prefix: 'banner',
      });
      banner.image = imageResult.path;
    }

    if (title) banner.title = title.trim();
    if (link !== undefined) banner.link = link.trim();
    if (order !== undefined) banner.order = parseInt(order, 10);
    if (isActive !== undefined) banner.isActive = isActive === 'true' || isActive === true;

    const updatedBanner = await banner.save();

    res.status(200).json({
      success: true,
      data: updatedBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner ID format.',
      });
    }

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBanners = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner ID format.',
      });
    }

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};
