import { data_json } from "./data.js";


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

    let htmlStr = `<Button class='poular-cuisine-child'>
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

closeicon.addEventListener('click', () =>{
    search_input.value='';
    showMealList('')
})


const showMealList = (value) => {
    let html = "";
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

                    html += `
                    <div class="content-container">
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
                        <i class="fa fa-heart-o heart-icon -md-block" aria-hidden="true" onclick="addOrRemoveFavoutite(this)" id=${element.idMeal}></i>
                        <button class="button" onclick="details(this)" id=${element.idMeal}>More Deatils</button>
                    </div>
                </div>
                `;

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


export const details = (event, i) => {
    console.log('Details...........')
    console.log(event)
}

export const addOrRemoveFavoutite = (event, i) => {
    console.log('Add or Remove Favourite .........')
    console.log(event)
}

