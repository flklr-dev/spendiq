const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `transactions/${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

const deleteFromS3 = async (url) => {
  const key = url.split('/').slice(-2).join('/');
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  };

  await s3.deleteObject(params).promise();
};

module.exports = {
  uploadToS3,
  deleteFromS3
}; 