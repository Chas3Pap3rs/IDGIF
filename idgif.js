
const gifSearch = document.querySelector('.container');
const q = 'cats';
const apikey = 'b6Ovqn1dLBbx488ZoH6TvsQckxHYvn1r';
const path = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}q=${q}`;

const p = fetch(path)
const p2.then(function (res) {
    return res.json() 

})

p2.then(function (json) {
    console.log(json)
})