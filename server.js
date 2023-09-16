if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const { imageStorage, partialStorage, cloudinary } = require('./cloudinary/index')
const uploadImage = multer({ storage: imageStorage })
const uploadPartial = multer({ storage: partialStorage })
const mongoose = require('mongoose')

const Image = require('./models/image')
const Partial = require('./models/partial')

mongoose.connect('mongodb://localhost:27017/nanikore')
    .then(() => console.log('Connected to database'))
    .catch(err => console.log(err))

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.get('/', async (req, res) => {
    const images = await Image.find({})
    res.render('home', { images, image_id: undefined })
})

app.get('/pics/:id', async (req, res) => {
    const images = await Image.find({})
    res.render('home', { images, image_id: req.params.id })
})

app.post('/upload-image', uploadImage.array('image'), async (req, res) => {
    const newImages = req.files.map(file => {
        return {
            filename: file.filename,
            url: file.path
        }
    })
    await Image.insertMany(newImages)
    res.redirect('/')
})

app.post('/upload-partial', uploadPartial.single('partial'), async (req, res) => {
    await Partial.create({
        filename: req.file.filename,
        url: req.file.path,
        name: req.file.originalname
    })
    res.redirect('/')
})

app.post('/delete-image/:id', async (req, res) => {
    console.log('You got here')
    const image = await Image.findById(req.params.id)
    await Image.findByIdAndRemove(req.params.id)
    cloudinary.uploader.destroy(image.filename)
    res.redirect('/')
})

app.get('/gallery', async (req, res) => {
    const partialImages = await Partial.find({})
    res.render('gallery', { partialImages })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})