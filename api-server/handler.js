const { MongoClient } = require('mongodb')
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require('jquery')(window)
const url = 'mongodb+srv://coffins:inmrfnMHRpE5uK1U@cluster0.vcb4tbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(url)

client.connect()

const insertApiSearch = async (data, res) => {
    const { keyword, type, videoType } = data
    const currentPage = Number(data.currentPage) || 1
    const db = await client.db('youtube_api')
    const collection = await db.collection('videos')
    console.log('Done')

    const del = await collection.deleteMany({
        kind: "youtube#searchListResponse"
    })
    console.log(del)

    const query = {
        'key': 'AIzaSyDQNgtvgsWjBb4U9nI0V2EooVy24IXQe80',
        'part': 'snippet',
        'maxResults': '120',
        'q': keyword,
    }

    console.log(keyword)
    if (type !== '' && type) {
        query['type'] = type
    }

    if (videoType !== '' && videoType) {
        query['videoType'] = videoType
    }

    $.ajax({
        url: 'https://youtube.googleapis.com/youtube/v3/search',
        type: 'get',
        dataType: 'json',
        data: query,
        error: function () {
            console.log('Error')
        },

        success: async function (result) {
            const skipPage = (currentPage - 1) * 12
            const limitPage = (currentPage * 12) - 1
            const insert = await collection.insertOne(result)
            console.log(insert)
            const maxPagination = Math.ceil(result.items.length / 12)
            const filteredCollection = result.items.filter((arr, index) => {
                if (index >= skipPage && index <= limitPage) {
                    return true
                }
            })
            res.jsonp({
                filteredCollection,
                maxPagination,
            })
        }
    })
}

const nextPagination = async (nextPage, res) => {
    const db = await client.db('youtube_api')
    const collection = await db.collection('videos')
    const skipPage = (nextPage - 1) * 12
    const limitPage = (nextPage * 12) - 1

    const findCollection = await collection.findOne({
        kind: "youtube#searchListResponse"
    })
    const filteredCollection = findCollection.items.filter((arr, index) => {
        if (index >= skipPage && index <= limitPage) {
            return true
        }
    })
    res.jsonp({
        filteredCollection
    })
}

module.exports = { insertApiSearch, nextPagination }

