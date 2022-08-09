const searchMovie = (keyword, type, videoType) => {
    $('#movie-list').empty()
    $('#pagination').empty()

    $.ajax({
        url: 'http://localhost:3000/search',
        type: 'get',
        dataType: 'jsonp',
        data: {
            'keyword': keyword,
            'type': type,
            'videoType': videoType,
        },
        crossDomain: true,
        error: function () {
            console.log('Error')
        },

        success: function (result) {
            console.log('Berhasil')
            const videos = result.filteredCollection
            let playButton = ''
            console.log(result)
            $.each(videos, (i, data) => {
                let id = ''
                if (data.id.videoId) {
                    id = data.id.videoId
                    playButton = `<a href="#" id="watch-button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id=${id}><i class="bi bi-play-circle-fill"></i> Play</a>`
                }
                else if (data.id.playlistId) {
                    id = data.id.playlistId
                }
                else if (data.id.channelId) {
                    id = data.id.channelId
                }
                $('#movie-list').append(`
                <div class="col-md-3">
                    <div class="card mb-3" style="width: 18rem;">
                     <img src=${data.snippet.thumbnails.high.url} class="card-img-top" alt="image movie">
                     <div class="card-body">
                     <h5 class="card-title" id="movie-title">${data.snippet.title}</h5>
                     <h6 class="card-subtitle mb-2 text-muted">${data.snippet.channelTitle}</h6>
                     <a href="#" id="see-detail" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id=${id} data-type=${data.id.kind}>See Detail</a>
                     ${playButton}
                     </div>
                    </div>
                </div>
                    `)
            })

            $('#search-input').val('')
            $('#inputType').val('any')
            $('#inputCategory').val('video')

            paginationFunction(1, result.maxPagination)

        }

    })
}

const searchDetail = (id, category) => {
    const videoId = id
    const type = category

    $('.modal-body').empty()
    $('#modal-header').empty()
    let apiLink = ''
    let parts = ''
    let additionalButtons = ''

    if (type === 'youtube#video') {
        apiLink = 'https://www.googleapis.com/youtube/v3/videos'
        parts = 'snippet,contentDetails,statistics'
        additionalButtons = `
        <a href="#" id="channel-button" class="btn btn-outline-danger" ><i class="bi bi-youtube"></i> Channel</a>
        <a href="#" id="play-button" class="btn btn-outline-primary" ><i class="bi bi-play-circle-fill"></i> Play</a>
        `
    }
    else if (type === 'youtube#playlist') {
        apiLink = 'https://www.googleapis.com/youtube/v3/playlists'
        parts = 'snippet,status,contentDetails'
        additionalButtons = `
        <a href="#" id="channel-button" class="btn btn-outline-danger" ><i class="bi bi-youtube"></i> Channel</a>
        `
    }
    else if (type === 'youtube#channel') {
        apiLink = 'https://www.googleapis.com/youtube/v3/channels'
        parts = 'brandingSettings,snippet,statistics'
    }

    $.ajax({
        url: apiLink,
        type: 'get',
        dataType: 'json',
        data: {
            'key': 'AIzaSyDQNgtvgsWjBb4U9nI0V2EooVy24IXQe80',
            'part': parts,
            'maxResults': '1',
            'id': videoId,
        },
        success: function (result) {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            const video = result.items[0]
            let modalLabel = ''

            console.log(video)


            let publish = new Date(video.snippet.publishedAt)
            let day = days[publish.getDay()]
            let date = publish.getDate().toString()
            let month = months[publish.getMonth()]
            let year = publish.getFullYear().toString()
            let fullDate = day + ', ' + date + ' ' + month + ' ' + year

            if (type === 'youtube#video' || type === 'youtube#playlist') {
                modalLabel = `<h5 class="modal-title" id="exampleModalLabel">${video.snippet.channelTitle}</h5>`
            }

            if (type === 'youtube#channel') {
                let source = ''
                if (video.brandingSettings.image) {
                    source = video.brandingSettings.image.bannerExternalUrl
                } else {
                    source = "img/no-image-found.png"
                }
                modalLabel = `<img src=${source} class="img-fluid mx-auto d-block">`
            }


            $('#modal-header').html(modalLabel)
            $('.modal-body').html(`
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-md-4">
                      <img src=${video.snippet.thumbnails.high.url} class="img-fluid">
                      <div class="col-md mt-3">
                      ${additionalButtons} 
                      </div>
                    </div>

                    <div class="col-md-8">
                        <ul class="list-group">
                            <li class="list-group-item"><h3><span id="span-modal-title">${video.snippet.title}</span> (${video.id})</h3></li>
                            <li class="list-group-item"><b>Published :</b> ${fullDate}</li>
                        ${listDetail(type, video)}
                        </ul>
                    </div>
                  </div>
                </div>
                `)
            $('#play-button').data("id", videoId)
            $('#channel-button').data("id", video.snippet.channelId)

        }
    })
}

const showDetailSearch = () => {
    $('#header').empty()
    $('#header').append(`
    <div class="col-md-7">
    <h1 class="text-center">Youtube Search</h1>
    <div class="row g-3">
        <div class="col">
            <label for="search-input" class="form-label">Youtube :</label>
            <input type="text" class="form-control" placeholder="..." aria-label="First name"
                id="search-input">
        </div>
        <div class="col mb-1">
            <label for="inputType" class="form-label">Video Type :</label>
            <select id="inputType" class="form-select">
                    <option value="any" selected>Any</option>
                    <option value="episode">Episode</option>
                    <option value="movie">Movie</option>
                </select>
            
        </div>
        
        <div class="row mb-3">
            <div class="col-md-4">
                <label for="inputCategory" class="form-label">Category :</label>
                <select id="inputCategory" class="form-select">
                    <option selected value="video">Video</option>
                    <option value="playlist">Playlist</option>
                    <option value="channel">Channel</option>
                </select>
            </div>
        </div>
    </div>

    <div class="col-md-4">
      
        <button type="button" class="btn btn-danger" id="detail2-button">
        <i class="bi bi-arrow-up-circle"></i> Detail
    </button>
    <button class="btn btn-dark" type="button" id="search-button"><i class="bi bi-search"></i>
        Search</button>
        </div>
</div>
    `)

}


$('#header').on('click', '#search-button', function () {
    const keyword = $('#search-input').val()
    const type = $('#inputCategory').val()
    const videoType = $('#inputType').val()

    searchMovie(keyword, type, videoType)
})

$('#header').on('keyup', '#search-input', function (event) {
    if (event.keyCode === 13) {
        const keyword = $('#search-input').val()
        const type = $('#inputCategory').val()
        const videoType = $('#inputType').val()

        searchMovie(keyword, type, videoType)
    }
})

const listDetail = (type, video) => {
    if (type === 'youtube#video') {
        return `
<li class="list-group-item"><b>Viewed :</b> ${video.statistics.viewCount}</li>
<li class="list-group-item"><b>Liked :</b> ${video.statistics.likeCount}</li>
<li class="list-group-item"><b>Comments :</b> ${video.statistics.commentCount}</li>
<li class="list-group-item"><b>Tags :</b> ${video.snippet.tags ? video.snippet.tags : 'none'}</li>
<li class="list-group-item">${video.snippet.description}</li>
`
    }

    else if (type === 'youtube#playlist') {
        return `
<li class="list-group-item"><b>Privacy :</b> ${video.status.privacyStatus}</li>
<li class="list-group-item"><b>Contents :</b> ${video.contentDetails.itemCount} videos</li>
`
    }

    else if (type === 'youtube#channel') {
        return `
        <li class="list-group-item"><b>Views :</b> ${video.statistics.viewCount}</li>
        <li class="list-group-item"><b>Subscriber :</b> ${video.statistics.subscriberCount}</li>
        <li class="list-group-item"><b>Hidden Subscriber :</b> ${video.statistics.hiddenSubscriberCount}</li>
        <li class="list-group-item"><b>Country :</b> ${video.snippet.country}</li>
        <li class="list-group-item"><b>Upload :</b> ${video.statistics.videoCount} video</li>
        <li class="list-group-item">${video.brandingSettings.channel.description}</li>
        `
    }
}

$('#movie-list').on('click', '#see-detail', function () {
    const videoId = $(this).data('id')
    const type = $(this).data('type')

    searchDetail(videoId, type)
})

$('#movie-list').on('click', '#watch-button', function () {
    $('.modal-body').empty()
    $('#modal-header').empty()
    const videoId = $(this).data('id')

    $('#modal-header').html(`<h5>${$(this).parent().children('#movie-title').html()}</h5>`)
    $('.modal-body').html(`
    <div class="iframe-container">
    <iframe class="res-iframe" src="http://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    </div>
    `)
})

$('#exampleModal').on('click', '#play-button', function () {
    const videoId = $(this).data('id')
    const title = $('#span-modal-title').html()
    $('.modal-body').empty()
    $('#modal-header').empty()

    $('#modal-header').html(`<h5>${title}</h5>`)
    $('.modal-body').html(`
    <div class="iframe-container">
    <iframe class="res-iframe" src="http://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    </div>
    `)
})

$('#exampleModal').on('click', '#channel-button', function () {
    const id = $(this).data('id')
    const category = "youtube#channel"

    searchDetail(id, category)
})

$('#header').on('click', '#detail2-button', function () {
    $('#header').empty()
    $('#header').append(`
    <div class="col-md-7">
                <h1 class="text-center">Youtube Search</h1>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Youtube video..." id="search-input">
                    <button type="button" class="btn btn-danger" id="detail-button">
                        <i class="bi bi-arrow-down-circle"></i> Detail
                    </button>
                    <button class="btn btn-dark" type="button" id="search-button"><i class="bi bi-search"></i>
                        Search</button>

                </div>
            </div>
    `)
})

$('#header').on('click', '#detail-button', function () {
    showDetailSearch()
})


function paginationFunction(value, allPages) {

    if (value !== undefined && allPages !== 0) {
        const currentPage = $('a.page-link.active').html()
        const destinationPage = Number(value)
        let content = ` <li class="page-item">
    <a class="page-link" onclick="paginationFunction(${destinationPage - 1 == 0 ? undefined : destinationPage - 1}, ${allPages})">Previous</a>
</li>`
        console.log('Test')
        console.log(destinationPage)
        const beforePage = destinationPage - 2
        const afterPage = destinationPage + 2

        for (let page = beforePage; page < afterPage + 1; page++) {
            let liActive = ``

            if (page < 1 || page > allPages) {
                continue
            }

            if (page == destinationPage) {
                liActive = `active`
            }
            content += `
            <li class="page-item"><a class="page-link ${liActive}" onclick="paginationFunction(${page}, ${allPages})" href="#">${page}</a></li>
        `
        }
        content += ` <li class="page-item">
    <a class="page-link" onclick="paginationFunction(${destinationPage + 1 > allPages ? undefined : destinationPage + 1}, ${allPages})" href="#">Next</a>
</li>`

        $('#pagination').empty()
        $('#pagination').html(content)
    }
}

$(document).ready(function () {
    searchMovie()
})