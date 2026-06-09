import path from 'path';

const generateFileName = (originalName, prefix = 'file') => {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
};

export default generateFileName;
