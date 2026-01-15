const elm_head = document.querySelector("head");
const elm_html = document.querySelector("html");
const elm_titleCont = document.querySelector(".titleContainer");
const elm_dialogTitle = document.querySelector("#dialogTitle");
const elm_h_hotspot = document.querySelector(".h-hotspot");
const elm_dialogMain = document.querySelector(".dialog")
const elm_closeDialogBtn = document.querySelector(".close");
const elm_commentBtn = document.querySelector(".commentButton");
const elm_dialogModalbg = document.querySelector(".modalbg")

//Add title to document
const elm_title = document.createElement("title");
const elm_titleTxt = document.createTextNode(elm_titleCont.textContent.trim());
elm_title.appendChild(elm_titleTxt);
elm_head.prepend(elm_title)

//Add heading ARIA attribute to title
elm_titleCont.setAttribute("role","heading");
elm_titleCont.setAttribute("aria-level","1");
elm_dialogTitle.setAttribute("role","heading");
elm_dialogTitle.setAttribute("aria-level","2");
elm_html.setAttribute("lang","en");
elm_h_hotspot.setAttribute("role","main");
elm_dialogMain.setAttribute("role", "dialog");
elm_dialogMain.setAttribute("aria-label", "Comment");
elm_closeDialogBtn.setAttribute("role","button");
elm_commentBtn.setAttribute("role","button");
elm_dialogModalbg.setAttribute('aria-hidden', 'true');

//Hide seperator
const elm_seperators = document.querySelectorAll("hr");
elm_seperators.forEach(elmhrs => {
    elmhrs.setAttribute("aria-hidden", "true");
});

//Add role button to hotspots
setTimeout(function(){
    var mainframe = document.getElementById("mainframe");

    if (mainframe) {
        mainframe.setAttribute("title", "Main Frame");
        mainframe.setAttribute("allowFullScreen", "true");
        mainframe.setAttribute("frameborder", "0");
        mainframe.setAttribute("scrolling", "no");

        // Access the content of the mainframe (Ensure it's from the same origin)
        var mainframeDoc = mainframe.contentDocument || mainframe.contentWindow.document;
        
        if (mainframeDoc) {
            // Get the nested iframe inside mainframe
            var activityFrame = mainframeDoc.getElementById("framecontainer"); // Use ID
            if (activityFrame) {
                activityFrame.setAttribute("title", "Activity");
            }
        }
    }
},1000)
