const express = require('express')
const { insertApiSearch, nextPagination } = require('./handler')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/page/:destination', async (req, res) => {
    const nextPage = req.params.destination

})

app.get('/search', async (req, res) => {
    console.log(req.query)
    const videos = await insertApiSearch(req.query, res)
})

app.listen(port, () => {
    console.log(`Database Server | listening at http://localhost:${port}`)
})
