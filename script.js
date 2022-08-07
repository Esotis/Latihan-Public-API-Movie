const searchMovie = () => {
    $('#movie-list').empty()

    $.ajax({
        url: 'http://www.omdbapi.com/',
        type: 'get',
        dataType: 'json',
        data: {
            'apikey': '81bd7623',
            's': $('#search-input').val(),
            'y': $('#inputYear').val(),
            'type': $('#inputCategory').val(),
        },
        success: function (result) {
            console.log(result)
            if (result.Response == "True") {
                let movies = result.Search
                $.each(movies, (i, data) => {
                    $('#movie-list').append(`
                <div class="col-md-3">
                    <div class="card mb-3" style="width: 18rem;">
                     <img src=${data.Poster} class="card-img-top" alt="image movie">
                     <div class="card-body">
                     <h5 class="card-title">${data.Title}</h5>
                     <h6 class="card-subtitle mb-2 text-muted">${data.Year}</h6>
                     <a href="#" id="see-detail" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id=${data.imdbID}>See Detail</a>
                     </div>
                    </div>
                </div>
                    `)
                })

            } else {
                $('#movie-list').html(`
                <div class="col">
                <h1 class="text-center">${result.Error}</h1>
                </div>`

                )

            }
            $('#search-input').val('')
            $('#inputYear').val('')
            $('#inputCategory').val('movie')


        }

    })
}

const showDetailSearch = () => {
    $('#header').empty()
    $('#header').append(`
    <div class="col-md-7">
    <h1 class="text-center">Search Movie</h1>
    <div class="row g-3">
        <div class="col">
            <label for="search-input" class="form-label">Movie :</label>
            <input type="text" class="form-control" placeholder="Movie..." aria-label="First name"
                id="search-input">
        </div>
        <div class="col mb-1">
            <label for="inputYear" class="form-label">Year :</label>
            <input type="text" class="form-control" placeholder="Year..." aria-label="Last name"
                id="inputYear">
            
        </div>
        
        <div class="row mb-3">
            <div class="col-md-4">
                <label for="inputCategory" class="form-label">Category :</label>
                <select id="inputCategory" class="form-select">
                    <option selected value="movie">Movie</option>
                    <option value="series">Series</option>
                    <option value="episode">Episode</option>
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

$('#search-button').on('click', function () {
    searchMovie()
})

$('#header').on('click', '#search-button', function () {
    searchMovie()
})

$('#search-input').on('keyup', function (event) {
    if (event.keyCode === 13) {
        searchMovie()
    }
})

$('#header').on('keyup', '#search-input', function (event) {
    if (event.keyCode === 13) {
        searchMovie()
    }
})

$('#movie-list').on('click', '#see-detail', function () {
    $.ajax({
        url: 'http://omdbapi.com',
        dataType: 'json',
        type: 'get',
        data: {
            'apikey': '81bd7623',
            'i': $(this).data('id')
        },
        success: function (movie) {
            if (movie.Response === 'True') {
                console.log(movie.Poster)
                $('#exampleModalLabel').html(`${movie.Type.replace(movie.Type.charAt(0), movie.Type.charAt(0).toUpperCase())}`)
                $('.modal-body').html(`
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-md-4">
                      <img src=${movie.Poster} class="img-fluid">

                    </div>
                    
                    <div class="col-md-8">
                        <ul class="list-group">
                            <li class="list-group-item"><h3>${movie.Title} (${movie.imdbRating})</h3></li>
                            <li class="list-group-item">Released : ${movie.Released}</li>
                            <li class="list-group-item">Year : ${movie.Year}</li>
                            <li class="list-group-item">Rated : ${movie.Rated}</li>
                            <li class="list-group-item">Durations : ${movie.Runtime}</li>
                            <li class="list-group-item">Writer : ${movie.Writer}</li>
                            <li class="list-group-item">Actors : ${movie.Actors}</li>
                            <li class="list-group-item">${movie.Plot}</li>
                        </ul>
                    </div>
                  </div>
                </div>
                `)
            }
        }
    })
})

$('#detail-button').on('click', function () {

    showDetailSearch()
})

$('#header').on('click', '#detail2-button', function () {
    $('#header').empty()
    $('#header').append(`
    <div class="col-md-7">
                <h1 class="text-center">Search Movie</h1>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Movie's title..." id="search-input">
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

$('.nav-link').on('click', function () {
    $('.active').removeClass('active')
    $(this).addClass('active')
})