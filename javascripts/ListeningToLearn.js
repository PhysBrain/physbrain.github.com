function Slide(slide) {
    this.slide = slide;
    this.steps = slide.querySelectorAll(".step");
    this.currStep = -1;
    this.numSteps = this.steps.length;
    this.hide = function() {
        for (var s=0; s<this.numSteps; ++s) {
            this.hideStep(s);
        }
        this.slide.style.visibility = "hidden";
    }
    this.show = function() {
        for (var s=0; s<=this.currStep; ++s) {
            this.showStep(s);
        }
        this.slide.style.visibility = "visible";
    }
    this.hideStep = function(s) {
        if (s<0 || s>=this.numSteps) return;
        this.steps[s].style.visibility = "hidden";
    }
    this.showStep = function(s) {
        if (s<0 || s>=this.numSteps) return;
        this.steps[s].style.visibility = "visible";
    }
    this.prevStep = function() {
        if (this.currStep >= 0) {
            this.hideStep(this.currStep);
            this.currStep--;
        }
    }
    this.nextStep = function() {
        if (this.currStep < this.numSteps-1) {
            this.currStep++;
            this.showStep(this.currStep);
        }
    }
}

var currSlide = 0;
var slides = [];

function init() {
    initSlides();
    initMenu();
}

function initSlides() {
    var pages = document.querySelectorAll(".slide");
    for (var p=0; p<pages.length; ++p) {
        var div = document.createElement("div");
        div.className = "number";
        div.innerHTML = "Page " + p;
        pages[p].appendChild(div);

        slides.push(new Slide(pages[p]));
    }
    slides[0].show();
}

function initMenu() {
    var menu = document.getElementById("menu");
    var button = document.createElement("button");
    button.innerHTML = "&lt&lt";
    button.addEventListener('click', prevSlide, false);
    menu.appendChild(button);

    button = document.createElement("button");
    button.innerHTML = "&lt";
    button.addEventListener('click', prevStep, false);
    menu.appendChild(button);

    for (var p=0; p<slides.length; ++p) {
        button = document.createElement("button");
        button.id = String(p);
        button.innerHTML = String(p);
        button.addEventListener('click', function(event, p) {
            selectSlide(this.id);
        }, false);
        menu.appendChild(button);
    }

    button = document.createElement("button");
    button.innerHTML = "&gt";
    button.addEventListener('click', nextStep, false);
    menu.appendChild(button);

    button = document.createElement("button");
    button.innerHTML = "&gt&gt";
    button.addEventListener('click', nextSlide, false);
    menu.appendChild(button);

		//<button id="btn1" onClick="selectSlide(0);">0</button>
}

function prevSlide() {
    if (currSlide > 0) {
        slides[currSlide].hide();
        --currSlide;
        slides[currSlide].show();
    }
}

function nextSlide() {
    if (currSlide < slides.length-1) {
        slides[currSlide].hide();
        ++currSlide;
        slides[currSlide].show();
    }
}

function prevStep() {
    slides[currSlide].prevStep();
}

function nextStep() {
    slides[currSlide].nextStep();
}

function selectSlide(slideNum) {
    if (slideNum == currSlide) {
        slides[currSlide].nextStep();
    }
    else if (slideNum >= 0 && slideNum < slides.length) {
        slides[currSlide].hide();
        currSlide = slideNum;
        slides[currSlide].show();
    }
}
