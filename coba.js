const testing = () => {
    const sentence = `
 <div class="col-md-8">
 <ul class="list-group">
     <li class="list-group-item"><h3>video.snippet.title}</h3></li>
${scantext(2)}
 </ul>
</div>
</div>
</div>
 `
    return sentence
}

const scantext = (num) => {
    if (num == 1) {
        return `
        <li class="list-group-item"><b>Published :</b> {fullDate}</li>
        `
    }

    else if (num == 2) {
        return `
        <li class="list-group-item"><b>Tags :</b>{video.snippet.tags ? video.snippet.tags : 'none'}</li>
        <li class="list-group-item">{video.snippet.description}</li>
        `
    }
}

console.log(testing())