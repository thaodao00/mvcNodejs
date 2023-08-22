const multer = require('multer')

//upload image
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public/uploads')
    },
    filename: (req, file, cb) => {
        // const ext = file.mimetype.split('/')[1]
        cb(null, encodeURI(file.originalname))
    }
})
const imgFiler = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true)
    } else {
        cb(new Error('Not an image! Please upload only images'), false)
    }
}

const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 50, },
    fileFilter: imgFiler
})


module.exports = {
    upload
}