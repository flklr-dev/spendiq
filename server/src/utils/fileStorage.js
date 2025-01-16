const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const saveFile = async (file) => {
  try {
    const filename = `${uuidv4()}-${file.originalname}`;
    const filepath = path.join(uploadsDir, filename);
    
    // Save file to disk
    await fs.promises.writeFile(filepath, file.buffer);
    
    // Return the relative path
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('File upload failed');
  }
};

const deleteFile = async (filepath) => {
  try {
    if (!filepath) return;
    
    const fullPath = path.join(__dirname, '../..', filepath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

module.exports = {
  saveFile,
  deleteFile
}; 