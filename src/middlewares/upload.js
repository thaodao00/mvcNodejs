require('dotenv').config()

const { nanoid } = require('nanoid')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const util = require('util')

const unlinkFile = util.promisify(fs.unlink)

async function uploader(file, folder) {
    if(!file){
        return 'Please choose file'
    }
    if(!fs.existsSync(`src/public/uploads/${folder}`)){
        fs.mkdirSync(`src/public/uploads/${folder}`,{recursive: true})
    }

    let filename = nanoid()
    let currentFile = `src/public/uploads/${file.filename}`
    let newFile = `src/public/uploads/${folder}/${filename}.webp`

    await sharp(currentFile)
    .toFile(newFile)
    .then(() => {
        unlinkFile(currentFile)
    })
    return `${folder}/${filename}.webp`
}
async function viewImage(path) {
    if(!path){
        return `${process.env.APP_DOMAIN}/client/img/notes/note_default.svg`
    }
    if(!fs.existsSync(`src/public/uploads/${path}`)){
        return `${process.env.APP_DOMAIN}/client/img/notes/note_default.svg`
    }
    return `${process.env.APP_DOMAIN}/uploads/${path}`
}

module.exports = {
    uploader,
    viewImage   
}