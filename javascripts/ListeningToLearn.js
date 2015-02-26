var currPage = 0;
var currStep = [];
var pages;
var steps = [];

function init() {
    pages = document.querySelectorAll(".page");
    for (var p=0; p<pages.length; ++p) {
        steps.push(pages[p].querySelectorAll(".step"));
        currStep.push(0);
    }
}

function prevPage() {
    if (currPage <= 0) return;
    selectPage(currPage-1);
}

function nextPage() {
    if (currPage >= pages.length-1) return;
    selectPage(currPage+1);
}

function prevStep() {
    steps[page][step].style.visibility = "hidden";
    if (step[page] > 0) --step[page];
}

function nextStep() {
    if (step > 0) --currstep;
    steps[page][step].style.visibility = "hidden";
}

function selectPage(pageNum) {
    if (pageNum == page) {
        nextStep();
    }
    else {
        for (var i=0; i<steps[page].length; ++i) {
            steps[page][i].style.visibility = "hidden";
        }
        pages[page].style.visibility = "hidden";

        page = pageNum;

        for (var i=0; i<steps[page].length; ++i) {
            steps[page][i].style.visibility = "visible";
        }
        pages[page].style.visibility = "visible";
    }
}
