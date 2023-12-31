import { data_json } from "./data.js";


// it makes a favourites meal array if its not exist in local storage
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

/**
 * 
 * 
 * method to select the element by id or class
 * 
 */

const select = (el, all = false) => {
    el = el.trim()
    if (all) {
        return [...document.querySelectorAll(el)]
    } else {
        return document.querySelector(el)
    }
}


/**
 * 
 * add the default popular cuisine
 */

let cuisine = select('#cuisine-container')
cuisine.innerHTML = data_json.map((item, index) => {
    let image_url = item.url
    let title = item.name

    let htmlStr = `<Button class='poular-cuisine-child' name='${title}' onclick="popularCuisune(this)">
                    <img src=${image_url} class='poular-cuisine-image'/>
                        <h3 class='poular-cuisine-title'>${title}</h3>
                    </Button>`
    return htmlStr
}).join(' ')





/**
 * Easy on scroll event listener 
 */
const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
}

/**
 * Mobile Navigation view Function
 */

const toggleMobileView = () => {
    let x = select('#myTopnav')
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

var splitBar = select('.icon')
splitBar.addEventListener('click', toggleMobileView);

let navbarlinks = select('#myTopnav .scrollto', true)
navbarlinks.forEach(
    navbarlink => {
        navbarlink.addEventListener('click', toggleMobileView)
    }
)


/**
 * Toggle .header-scrolled class to #header when page is scrolled
 */
let selectHeader = select('#header')
if (selectHeader) {
    const headerScrolled = () => {
        if (window.scrollY > 100) {
            selectHeader.classList.add('header-scrolled')
        } else {
            selectHeader.classList.remove('header-scrolled')
        }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
}


/**
 * Stop the Preloader on load
 */
let preloader = select('#preloader');
if (preloader) {
    window.addEventListener('load', () => {
        preloader.remove()
    });
}

/**
* Navbar links active state on scroll
*/

const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            navbarlink.classList.add('active')
        } else {
            navbarlink.classList.remove('active')
        }
    })
}
window.addEventListener('load', navbarlinksActive)
onscroll(document, navbarlinksActive)


/**
 * 
 * add event listener to search input
 */

let search_input = select('#search-input')
search_input.addEventListener('input', () => {
    console.log('onClick');
    showMealList(search_input.value)
})


export const popularCuisune = (evt) => {
    search_input.value = evt.name
    showMealList(search_input.value)
}
/**
 * 
 * 
 * method to call fetch api
 *  
 */

async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

export const removeAddClass = (ele, rcls, acls) => {
    ele.classList.remove(rcls)
    ele.classList.add(acls)
}

window.removeAddClass = removeAddClass

/**
 * 
 * 
 * show food details
 * * 
 */

let popularCuisine = select('#popular-cuisines')
let contentDic = select('#content')
let searhicon = select('#search_icon')
let closeicon = select('#close_icon')

closeicon.addEventListener('click', () => {
    search_input.value = '';
    showMealList('')
})



const getHtml = (element, id , sd_id, md_id, fav) => {
    debugger
    let h_icon_s = '';
    let h_icon_m = '';
    if(fav){
        h_icon_s += `<i class="fa fa-heart-o -md-none heart-icon" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="heart-o-${element.idMeal}"></i>
        <i class="fa fa-heart heart-icon" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="heart-${element.idMeal}"></i>`

        h_icon_m += `<i class="fa fa-heart-o -md-none heart-icon" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="m-heart-o-${element.idMeal}"></i>
        <i class="fa fa-heart heart-icon" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="m-heart-${element.idMeal}"></i>`

    }else{
        h_icon_s += `<i class="fa fa-heart-o heart-icon" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="heart-o-${element.idMeal}"></i>
        <i class="fa fa-heart heart-icon -md-none" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="heart-${element.idMeal}"></i>`

        h_icon_m += `<i class="fa fa-heart-o heart-icon" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="m-heart-o-${element.idMeal}"></i>
        <i class="fa fa-heart heart-icon -md-none" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id="m-heart-${element.idMeal}"></i>`
    }

    var html=`<div id='${id}'>
                        <div class="content-container" id="${sd_id}">
                            <div style="display: flex; padding: 1rem;">
                                <img src=${element.strMealThumb} class="content-image"/>
                                <div style="display: flex ; flex-direction: column;align-items: center; justify-content: center; margin-left: 1rem;">
                                    <h7 style="color: black; font-weight: 550;">
                                    ${element.strMeal}
                                    </h7>
                                    <h7 style="color: gray;">
                                    ${element.strCategory}
                                    </h7>
                                </div>
                            </div>
                            <div style="padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end;">
                                ${h_icon_s}
                                <button class="button" onclick="details(this)" aria-expanded="true" name="${sd_id}">More Deatils</button>
                            </div>
                        </div>
                        <div class="content-container -md-none" style="flex-direction: column !important;" id="${md_id}">
                            <div style="display: flex; justify-content: space-between; padding: 1rem;">
                                <div class="details-con">
                                <img src=${element.strMealThumb} class="content-image-max"/>
                                <div class="meal-container">
                                    <h7 style="color: black; font-weight: 550; font-size: 2.5rem;">
                                    ${element.strMeal}
                                    </h7>
                                    <h7 style="color: gray; font-size: 1.2rem;">
                                    Category : ${element.strCategory}
                                    </h7>
                                    <h7 style="color: gray; font-size: 1.2rem;">
                                    Area : ${element.strArea}
                                    </h7>
                                </div>
                                </div>
                                ${h_icon_m}

                            </div>
                            <div style="padding: 1rem;">
                                <p>${element.strInstructions}</p>    
                            </div>
                            <div style="padding: 1rem; display: flex;  justify-content: space-between; align-items: flex-end;">
                                <button class="button" onclick="window.open('${element.strYoutube}','_blank')">Watch Vedio</button>
                                <button class="button" onclick="window.open('${element.strSource}','_blank')">Read Content</button>
                                <button class="button" onclick="details(this)" aria-expanded="false" name="${md_id}">Less Details</button>
                            </div>
                        </div>
                    </div>
                `;

                return html
}

const showMealList = (value) => {
    let html = "";
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    if (value != null && value != '') {
        removeAddClass(searhicon, '-md-block', '-md-none')
        removeAddClass(closeicon, '-md-none', '-md-block')
        let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
        let meals = fetchMealsFromApi(url, value);
        meals.then(data => {
            if (data.meals) {
                removeAddClass(popularCuisine, '-md-block', '-md-none')
                removeAddClass(contentDic, '-md-none', '-md-block')
                data.meals.forEach((element) => {
                    debugger
                    
                    if(arr.indexOf(element.idMeal) >= 0){
                        html += getHtml(element, element.idMeal, `sd-container-${element.idMeal}`, `md-container-${element.idMeal}`, true)
                    }else{
                        html += getHtml(element, element.idMeal,`sd-container-${element.idMeal}`, `md-container-${element.idMeal}`, false)
                    }

                });
            } else {
                removeAddClass(contentDic, '-md-block', '-md-none')
                removeAddClass(popularCuisine, '-md-none', '-md-block')
            }
            document.getElementById("content").innerHTML = html;
        });
    } else {
        removeAddClass(contentDic, '-md-block', '-md-none')
        removeAddClass(popularCuisine, '-md-none', '-md-block')

        removeAddClass(closeicon, '-md-block', '-md-none')
        removeAddClass(searhicon, '-md-none', '-md-block')
    }

}

const toggleMoreDetails = (expand, event) => {

    let ele = null;
    let ele1 = null;

    if (expand) {
        ele = document.getElementById(event.name)
        ele1 = document.getElementById(event.name.replace('sd', 'md'))

        ele.classList.add('-md-none')
        ele1.classList.remove('-md-none')

    }
    else {

        ele = document.getElementById(event.name)
        ele1 = document.getElementById(event.name.replace('md', 'sd'))

        ele.classList.add('-md-none')
        ele1.classList.remove('-md-none')

    }
}

export const details = (event, i) => {
    console.log('Details...........')
    console.log(event)
    let expand = event.ariaExpanded === 'true'

    toggleMoreDetails(expand, event)


}

let fav_block = select('#fav-content')
export const addOrRemoveFavoutite = (event, i) => {
    debugger
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    console.log('Add or Remove Favourite .........')
    console.log(event)

    let sData = event.id.split('-')
    let id = sData[sData.length - 1]

    if (arr.indexOf(id) >= 0) {
        document.getElementById('heart-'+id).classList.add("-md-none")
        document.getElementById("heart-o-" + id).classList.remove("-md-none")
        document.getElementById('m-heart-'+id).classList.add("-md-none")
        document.getElementById("m-heart-o-" + id).classList.remove("-md-none")
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        let node = document.getElementById('fav-' + id)
        fav_block.removeChild(node)
    }
    else {
        document.getElementById('heart-o-'+id).classList.add("-md-none")
        document.getElementById("heart-" + id).classList.remove("-md-none")
        document.getElementById('m-heart-o-'+id).classList.add("-md-none")
        document.getElementById("m-heart-" + id).classList.remove("-md-none")
        arr.push(id);
        let newNode = document.getElementById(id).cloneNode(true)
        newNode.id = 'fav-' + id
        newNode.childNodes[1].id='fav-sd-container-'+id
        newNode.childNodes[3].id='fav-md-container-'+id
        newNode.childNodes[3].childNodes[5].childNodes[5].name = 'fav-md-container-'+id
        newNode.childNodes[1].childNodes[3].childNodes[5].name = 'fav-sd-container-'+id
        fav_block.appendChild(newNode)
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));

}

let fav_html = ''
let favourites = JSON.parse(localStorage.getItem("favouritesList"));
async function showFavMealList (url, item) {
    await fetchMealsFromApi(url, item).then( data => {
        let meal = data.meals[0]
        fav_html += getHtml(meal,'fav-'+meal.idMeal ,'fav-sd-container-'+meal.idMeal, 'fav-md-container-'+meal.idMeal, true)    
    })
    debugger
    fav_block.innerHTML = fav_html

}

let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

favourites.map((item, index) => {
    showFavMealList(url, item)
})


