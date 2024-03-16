const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input")
const randomButton = document.getElementById("random")

searchForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const q = searchInput.value
    search(q)

})

randomButton.addEventListener('click', function(e) {
    e.preventDefault()
    let r = 'random'
    search(r)
})



function search(q) {
    const apikey = 'b6Ovqn1dLBbx488ZoH6TvsQckxHYvn1r'
    const path = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${q}`
    const resultsElem = document.getElementById('results')

    fetch(path).then(function (res) {
        return res.json() 
    }).then(function (json) {
        console.log(json.data[0].images.fixed_width.url)
        
        let resultsHTML = ''
        json.data.forEach(function (obj) {
            console.log(obj.images.fixed_width.url)
            const url = obj.images.fixed_width.url
            const width = obj.images.fixed_width.width
            const height = obj.images.fixed_width.height
            const title = obj.title
            resultsHTML += `<img 
                class="item"
                src="${url}" 
                width=${width} 
                height="${height}"
                alt="${obj.title}">`
        })

        resultsElem.innerHTML = resultsHTML
    }).catch(function (err) {
        console.log(err.message)
    });
}

// function random(r) {
//     const apikey = 'b6Ovqn1dLBbx488ZoH6TvsQckxHYvn1r'
//     const path = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=random`
//     const resultsElem = document.getElementById('results')

//     fetch(path).then(function (res) {
//         return res.json() 
//     }).then(function (json) {
//         console.log(json.data[0].images.fixed_width.url)
        
//         let resultsHTML = ''
//         json.data.forEach(function (obj) {
//             console.log(obj.images.fixed_width.url)
//             const url = obj.images.fixed_width.url
//             const width = obj.images.fixed_width.width
//             const height = obj.images.fixed_width.height
//             const title = obj.title
//             resultsHTML += `<img 
//                 src="${url}" 
//                 width=${width} 
//                 height="${height}"
//                 alt="${obj.title}">`
//         })

//         resultsElem.innerHTML = resultsHTML
//     }).catch(function (err) {
//         console.log(err.message)
//     });
// }


