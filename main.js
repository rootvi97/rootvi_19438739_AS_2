/* Todo List App */
window.onload = function () 
{ 
    //declaring variables for the following; 
    let form = document.getElementById("form");
    let input = document.getElementById("input");
    let btn = document.getElementById("btn");
    let list = document.getElementById("list");
    let btnClr = document.getElementById("btnClr");
    let id = 1;
    let liItem = "";
    let todoList = [];
    //button event listener, gets activated when clicked 
    btn.addEventListener("click", addTodoItem);
    
    //list event listener
    list.addEventListener("click", boxChecked);
    
    //event listener for clear list
    btnClr.addEventListener("click", clearList);

    // input.addEventListener("keydown", addTodoItem);
    if (localStorage.length < 0) {
    btnClr.style.display = "none"; //hiding clear btn	
        console.log("button");
        }
    
        //checking localStorage has data
        if(localStorage.length <= 0) {
            btnClr.style.display = "none"; 

        }
    
        //adding to-do items to list
	function addTodoItem() {
        //when value gets entered, the here button enables
		if(input.value === "") {
			alert("You must enter some value!");
        }
		else {
			if(list.style.borderTop === "") {
				console.log("here!")
				list.style.borderTop = "2px solid white";
				btnClr.style.display = "inline";
            }
            //allows the user to input text
			let text = input.value;	
			let item = `<li id="li-${id}">${text}<input id="box-${id}" class="checkboxes" type="checkbox"></li>`;				
			list.insertAdjacentHTML('beforeend', item);	
			liItem = {item: text, checked: false};
			todoList.push(liItem);		
			id++;
			addToLocalStorage();
			form.reset();
		}
	}    
        //adding string through style to list item
        function boxChecked(event) {
            const element = event.target;
            if (element.type === "checkbox") {
                element.parentNode.style.textDecoration = "line-through";
                todoList = JSON.parse(localStorage.getItem("todoList"));
                todoList[element.id.split('-')[1] - 1].checked = element.checked.toString();
                localStorage.setItem("todoList", JSON.stringify(todoList));
            }
        }

        //adding data to local storage
        function addToLocalStorage() {
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("todoList", JSON.stringify(todoList));
            } else {
                alert("browser doesn't support local storage!");
            }
        }
    
        //display all todo list elements together in order to display the list
        function displayList() {
            list.style.borderTop = "2px solid white";
            todoList = JSON.parse(localStorage.getItem("todoList"));
            todoList.forEach(function (element) {
                console.log(element.item)
                let text = element.item;
                let item = `<li id="li-${id}">${text}<input id="box-${id}" class="checkboxes" type="checkbox"></li>`;
                list.insertAdjacentHTML("beforeend", item);
                
                //if there is a checked box, then style will be implemented
                if (element.checked) {
                    let li = document.getElementById("li-" + id);
                    li.style.textDecoration = "line-through";
                    li.childNodes[1].checked = element.checked;
                }
                id++;
            });
        }
    
        //clearing list event listener
        function clearList() {
            todoList = [];
            localStorage.clear();
            list.innerHTML = "";
            btnClr.style.display = "none";
            list.style.borderTop = "";
        }
    }

  
/* Quote Generator App */
    //using math function of getting randome quotes from twitter site below
    function genQuote() {
        let randNum = Math.floor(Math.random() * 8) + 1;
        document.getElementById('quote').innerHTML = quotes[randNum];
        let tweetQuote = quotes[randNum].split(' ').join('%20');
        tweetQuote = tweetQuote.split('<br>').join('');
        tweetQuote = "https://twitter.com/intent/tweet?text=" + tweetQuote.split('"').join('')
        $('.twitter-share-button').attr('href', tweetQuote);
    }
      //listing some good quotes
      let quotes = ["The Greatest Teacher, Failure is" - "Yoda", "\"Fear leads to self-doubt which is the worst enemy of creativity.\" - David Ogilvy",  "\"Only those who dare to fail greatly can ever achieve greatly.\"- Robert F. Kennedy", "\"All our dreams can come true, if we have the courage to pursue them.\"- Walt Disney", "\"Imitation is not just the sincerest form of flattery - it's the sincerest form of learning.\"- George Bernard Shaw", "\"There are no facts, only interpretations.\"-  Friedrich Wilhelm Nietzsche", "\"If you always put limit on everything you do, physical or anything else. It will spread into your work and into your life. There are no limits. There are only plateaus, and you must not stay there, you must go beyond them.\"- Bruce Lee", "\"In the midst of movement and chaos, keep stillness inside of you.\" - Deepak Chopra", ];

/* Weather App */
//using constant elements for all. 
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const weather = {};
//the temperature should only be measured in celcius
weather.temperature = {
    unit : "celsius"
}
//declaring constant value for kelvin
const KELVIN = 273;

const key = "41678f5c317ac16c4e60e08efcbbf2f8";

//implementing location and it will block the weather display for user unitl it allows it to display and will need to refesh the page
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

//fetching positions of the user's location
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

//else it will display error if no location identified
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//the location is identified from below link
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        //calculating and converting ferhenheit to celcius
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        //displaying the weather
        .then(function(){
            displayWeather();
        });
}

//displaying location with weather
function displayWeather(){
    iconElement.innerHTML = `<img src="symbols/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//formula to convert farenheit to celicus
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } 
    
    else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});


/* Image setting in gallery  */
// Image count function is used to find the number of image onjects in image arrays
imgCount = () => {
    return image.length;
} 

// The function below is used to find the number of images which is fit on single row of the gallery
maxImgPLine = () => { 
    let size = window.innerWidth;

    // Setting the viewport width to less than 600px, and placinng only one image per row
    /* Math.round function tells the width percentage of the viewport and it is divided by 100px, 
    to calculate the number of 100 px needed in the images to fit in 80% width */
    if(size < 600){
        return 1;     
    }else {
        let num = Math.round((size * 0.8) / 180); 

        // If the number of px is less than one then, fix only one image in a row else, fix maximum of 6 images in  a row
        if (num < 1) {
            return 1; 
        }else{
            if(num < 6){
                return num;
            }else{
                return 6;
            }
        }
    }
}

// The function below is used to find out how many images should be put on a line
imgPerLine = () => { 
    if (maxImgPLine() === 1){
        return 1; 
    }else {
        let value;
        let max = Math.floor(maxImgPLine());

        // Cancelling the interference of iterator z with other for loops
        // For loop takes maximum of 1/3 part of maximum line size
        for (z = 0; z < Math.round(imgCount() / 3); z++) { 

            // If the loop takes off 1 image from maximum per iteration until the total number of images is evenly divisible by the number found
            if((imgCount() % (max - z)) === 0){
                value = (max - z);
            } 
        }

        // If no image is identified then, it will use the maximum size of the line
        if(!value){
            value = max;
        } 

        // If maximum size of line is used then, take half of the line else return to down
        if(value > max / 2) {
            value = max / 2;
        }
        return Math.floor(value); 
    }
}

// Below function describes the total number of images that can be stored in a line
lineTotal = () => {
    return Math.ceil(imgCount() / imgPerLine());
} 

// Build gallery function places images lines in the gallery 
function buildGallery() { 
    let current;
    let next;
    let gallery = document.getElementById("gallery");

    // emptying the galllery
    gallery.innerHTML = ""; 

    /* For every line required, add the HTML to the gallery this means,
    total number of line starts at 1 and i started counting from 0 so, i need one less than the line total
    Fetching the gallery */
    for(i = 0; i <= (lineTotal() - 1); i++){
        current = gallery.innerHTML; 

        // Adding this html to the end of it and the gallery with old items ir replaced by new one
        // The div class is creating serveral rows in grid which has several rows of images with description box and text
        // The description text box in div class uses i as identifier
        next = current + "<div class =\"row\" id=\"grid-" + i + "\"></div><div class = \"descBox\"><div class=\"descText\" id=\"descBox-" + i + "\"></div>"; 
        gallery.innerHTML = next; 
    } 
}

// The fill gallery function fills each line with number of images 
function fillGallery() { 
    let current;
    let num = 0;

    // The for loop uses iterator i-- for total line-1 as i started coutning  from 0 not 1
    // Each line of images is filled in the grid 
    for(i = 0; i <= (lineTotal() - 1); i++){ 
        let grid = document.getElementById("grid-" + i); 

        // Getting contents of the lineto be  added in html and put both items back in
        // This creates buttons for images, clicks for descriptions from images as arrays of the objects
        // Every image is responsible for title section due to hover due to use of boostraap
        for(j = 0; j <= (imgPerLine() - 1); j++){
            current = grid.innerHTML; 
            grid.innerHTML = current + "<div class=\"col\"><button id=\"img" + (num) + "\" onclick=\"addDescription(" + num + ", " + i + ")\"><img src=\"" + image[num].src + "\"  class=\"img-fluid\" alt=\"Responsive image\"><div class=\"middle\">" + image[num].title + "</div></button><div class=\"triangle-up\" id=\"tri" + num + "\"></div></div>";
            num++;
        }
    }
}

// Opening description box and adding requried portfolio items as description
function addDescription(num, line) {

    // Fetching the required box, based on images in gallery line 
    let box = document.getElementById("descBox-" + line); 
    let newContent = "";

    // If the images have links, include it in the contents of the description box
    // Else refer the image in object object array and attributes such as .desc or .title
    if(image[num].link) { 
        newContent = "<h2>" + image[num].title + "</h2><p>" + image[num].desc + "</p><p>" + image[num].date + "</p><div class=\"icon\"><a href=\"" + image[num].link + "\"><i class=\"fab fa-github\" aria-hidden=\"true\"></i></a></div>";
    } else { 
        newContent = "<h2>" + image[num].title + "</h2><p>" + image[num].desc + "</p><p>" + image[num].date + "</p>";
    }

    // There are 3 possibilities for how the content should be entered in the gallery
    // If the current box is closed then, fill in the inner boxes with required contents 
    if(!box.style.maxHeight) {
        box.innerHTML = newContent; 

        // For every line close description box
        for(i = 0; i <= (lineTotal() - 1); i++){ 
            document.getElementById("descBox-" + i).style.maxHeight = null;
        }

        // Hiding all pointers, that point to other images
        for(i = 0; i <= (imgCount() - 1); i++){
            document.getElementById("tri" + i).style.opacity = "0";
        } 

        // Showing the pointer corresponding to image clicked
        document.getElementById("tri" + num).style.opacity = "1";

        // Showing the description box under the image clicked
        //if the clicked box was open and already had the content in it
        box.style.maxHeight = box.scrollHeight + "px";
    } else if (box.style.maxHeight === box.scrollHeight + "px" && box.innerHTML === newContent) { 
        box.style.maxHeight = null;// Close the box
        for(i = 0; i <= (imgCount() - 1); i++){ //hide all pointers again
            document.getElementById("tri" + i).style.opacity = "0";
        }

        // Otherwise (the box is open but has the wrong content)
    } else { 
        box.style.maxHeight = null; //close the box
        for(i = 0; i <= (imgCount() - 1); i++){//hide all image pointers
            document.getElementById("tri" + i).style.opacity = "0";
        }
        // The window is waiting for the box to close, put in the new content, then open the box and show the corresponding pointer
        window.setTimeout(function() {box.innerHTML = newContent; box.style.maxHeight = box.scrollHeight + "px"; document.getElementById("tri" + num).style.opacity = "1";}, 260);
    }
}

// Collapse portfolio function is used to close all boxes in the portfolio and scrolling the portfolio away
// To do so, close every line of coressponding portfolio away and for each image hid its pointer
function collapsePortfolio() { 
    for(i = 0; i <= (lineTotal() - 1); i++){ 
        document.getElementById("descBox-" + i).style.maxHeight = null;
    }
    for(i = 0; i <= (imgCount() - 1); i++){ 
        document.getElementById("tri" + i).style.opacity = "0";
    }
}

// Copy text function puts my email on the clipboard to copy if clicked by the user and tip text gets successful if written
// This function is taken from https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
function copyText() { 
    navigator.clipboard.writeText("pandyarootvi@gmail.com").then(function() {
        let tip = document.getElementById("tiptext");
        let tipbox = document.getElementById("tip")
        tipbox.style.transform = "scale(1.1) translateX(.4rem)";
        tip.innerHTML = "Copied!"
        window.setTimeout(function() {tipbox.style.transform = "scale(1) translateX(0)"}, 800);

        document.getElementById("mail").addEventListener("mouseleave", function() {window.setTimeout(function() {tip.innerHTML = "Copy E-mail"}, 200)});

    }, function() {
        
        // Alert occurs when the written information is failed and message is displayed as cannot copy
        alert("Sorry, cannot copy.");
    });
} 