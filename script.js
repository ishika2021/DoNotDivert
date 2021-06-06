let addToBlockBtn=document.querySelector("#add_page");
let blockedContainer=document.querySelector(".bottom_container");
let linksArrEle=document.querySelector(".link_box")
let startWorkMode=document.querySelector(".toggle");
let startBtn=document.querySelector(".timeBtn1");
let stopBtn=document.querySelector(".timeBtn2");
let timerEle=document.querySelector(".time_box");
let websiteArr=[];
let timeObj;
let startBtnState=false;
localStorage.setItem("timerState",startBtnState);

chrome.tabs.onActivated.addListener(function(tabId){
    console.log("New page");
    startBtnState=false;
    localStorage.setItem("timerState",startBtnState);
});
addToBlockBtn.addEventListener("click",addtoBlockList);
startWorkMode.addEventListener("click",function(){
    localStorage.setItem("checkbox",startWorkMode.checked);
    startModeOn();
});
let checked=JSON.parse(localStorage.getItem("checkbox"));
startWorkMode.checked=checked
if(localStorage.getItem("allWebsite")){
    websiteArr=JSON.parse(localStorage.getItem("allWebsite"));
    for(let i=0;i<websiteArr.length;i++){
        let {name}=websiteArr[i];
        createBlockList(name);
    }
}

function addtoBlockList(){
    (async function getCurrentTab(){
        let queryOptions={active:true};
        await chrome.tabs.query(queryOptions,function(tab){
            
            let website=tab[0].url.split(".");
            let name=website[website.length-2];
            let link=tab[0].url;
            createBlockList(name);
            let obj={"name":name,"url":link};
            websiteArr.push(obj);
            let stringArr=JSON.stringify(websiteArr);
            localStorage.setItem("allWebsite",stringArr);
        })
    })();
}
function createBlockList(name){
    let blockedlinkedEle=document.createElement("div");
    blockedlinkedEle.setAttribute("class","link");
    blockedlinkedEle.innerText=name;
    linksArrEle.appendChild(blockedlinkedEle);
    
    // delete from list
    let linkArr=document.querySelectorAll(".link");
    for(let i=0;i<linkArr.length;i++){
        linkArr[i].addEventListener("dblclick",function(){
            console.log(linkArr[i].innerText);
            let currName=linkArr[i].innerText;
            for(let i=0;i<websiteArr.length;i++){
                let {name}=websiteArr[i];
                if(name===currName){
                    // console.log(name," matched to ",currName,"for i= ",i);
                    websiteArr.splice(i,1);
                    let updatedArr=JSON.stringify(websiteArr);
                    localStorage.setItem("allWebsite",updatedArr);
                }
            }
            linkArr[i].remove();
            
        })
    }
}
function startModeOn(){
    (async function getCurrentTab() {
        let queryOptions = { windowType:'normal'};
        await chrome.tabs.query(queryOptions,function(tabs){
            for(let i=0;i<tabs.length;i++){
                // console.log("tab",i,"= ",tabs[i].url);
                for(let j=0;j<websiteArr.length;j++){
                    let{url}=websiteArr[j];
                    if(url===tabs[i].url){
                        // console.log("yeeee");
                        chrome.tabs.remove(tabs[i].id);
                    }
                }
            }
        });

    })();
}

startBtn.addEventListener("click",function(){
    console.log("yess");
    startBtnState=true;
    localStorage.setItem("timerState",startBtnState);
    chrome.runtime.sendMessage("start");
    chrome.runtime.onMessage.addListener(function(time) {
        timerEle.innerText=time;
   });
})
stopBtn.addEventListener("click",function(){
    chrome.runtime.sendMessage("stop");
    startBtnState=false;
    localStorage.setItem("timerState",startBtnState);
})


