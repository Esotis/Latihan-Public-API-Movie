const { MongoClient } = require('mongodb')
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require('jquery')(window)
const url = 'mongodb+srv://Jovan:jovan123@clustertesting.5iaxchf.mongodb.net/?retryWrites=true&w=majority'
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
        'maxResults': '25',
        'q': keyword,
    }

    console.log(keyword)
    if (type !== '' && type) {
        query['type'] = type
        console.log(type)
    }

    if (videoType !== '' && videoType) {
        query['videoType'] = videoType
        console.log(videoType)
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
            const findCollection = await collection.findOne({
                kind: "youtube#searchListResponse"
            })
            const maxPagination = Math.ceil(findCollection.items.length / 12)
            const filteredCollection = findCollection.items.filter((arr, index) => {
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

const nextPagination = () => {

}

module.exports = { insertApiSearch, nextPagination }

