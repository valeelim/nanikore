const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

const partialStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Nanikore/partial',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Nanikore/image',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    partialStorage,
    imageStorage
}