import mongoose from 'mongoose';
import Blog from '../models/blog.model.js';
import { saveOptimizedImage } from '../services/image.service.js';

export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      content,
      category,
      tags,
      author,
      isPublished,
    } = req.body;

    if (!title || !slug || !shortDescription || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, short description, and content are required.',
      });
    }

    const existingBlog = await Blog.findOne({ slug: slug.trim() });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: `Slug '${slug}' is already in use. Please provide a unique slug.`,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail image is required.',
      });
    }

    const imageResult = await saveOptimizedImage({
      file: req.file,
      folder: 'blogs',
      width: 1200,
      quality: 75,
      prefix: 'blog',
    });

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map((t) => t.trim());
      }
    }

    const blogData = {
      title: title.trim(),
      slug: slug.trim(),
      shortDescription: shortDescription.trim(),
      content: content.trim(),
      thumbnail: imageResult.path,
      tags: parsedTags,
      category: category ? category.trim() : undefined,
      author: author ? author.trim() : 'Admin',
      isPublished: isPublished === 'true' || isPublished === true,
      publishedAt: (isPublished === 'true' || isPublished === true) ? new Date() : undefined,
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format.',
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    const {
      title,
      slug,
      shortDescription,
      content,
      category,
      tags,
      author,
      isPublished,
    } = req.body;

    if (slug && slug.trim() !== blog.slug) {
      const existingBlog = await Blog.findOne({
        slug: slug.trim(),
        _id: { $ne: id },
      });
      if (existingBlog) {
        return res.status(400).json({
          success: false,
          message: `Slug '${slug}' is already in use. Please provide a unique slug.`,
        });
      }
      blog.slug = slug.trim();
    }

    if (req.file) {
      const imageResult = await saveOptimizedImage({
        file: req.file,
        folder: 'blogs',
        width: 1200,
        quality: 75,
        prefix: 'blog',
      });
      blog.thumbnail = imageResult.path;
    }

    if (tags !== undefined) {
      try {
        blog.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch (e) {
        blog.tags = tags.split(',').map((t) => t.trim());
      }
    }

    if (isPublished !== undefined) {
      const parsedIsPublished = isPublished === 'true' || isPublished === true;
      if (parsedIsPublished && !blog.isPublished) {
        blog.publishedAt = new Date();
      }
      blog.isPublished = parsedIsPublished;
    }

    blog.title = title ? title.trim() : blog.title;
    blog.shortDescription = shortDescription ? shortDescription.trim() : blog.shortDescription;
    blog.content = content ? content.trim() : blog.content;
    blog.category = category ? category.trim() : blog.category;
    blog.author = author ? author.trim() : blog.author;

    const updatedBlog = await blog.save();

    res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a blog
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format.',
      });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
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

// Publish a blog
export const publishBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format.',
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// Unpublish a blog
export const unpublishBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format.',
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        isPublished: false,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// Get all blogs (filtered, searchable)
export const getAllBlogs = async (req, res, next) => {
  try {
    const { isPublished, category, search, page, limit } = req.query;

    const query = {};

    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true' || isPublished === true;
    }

    if (category) {
      query.category = { $regex: category.trim(), $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Pagination
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const [total, blogs] = await Promise.all([
      Blog.countDocuments(query),
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit),
      },
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by slug for users
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { slug: slug.trim() },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by ID (for admin editing)
export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format.',
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};
