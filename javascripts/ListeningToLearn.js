function selectPage(pageNum) {
    var nodes = document.querySelectorAll(".page");
    for (var i=0; i<nodes.length; ++i) {
        nodes[i].style.visibility = ( (i+1)==pageNum ? "visible" :  "hidden" );
    }
}
