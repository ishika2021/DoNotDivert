chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if(changeInfo.status=='complete'){
        let checked=JSON.parse(localStorage.getItem("checkbox"));
        if(checked==true){
            if(localStorage.getItem("allWebsite")){
                websiteArr=JSON.parse(localStorage.getItem("allWebsite"));
                (async function getCurrentTab() {
                    let queryOptions = { windowType:'normal'};
                    await chrome.tabs.query(queryOptions,function(tabs){
                        for(let i=0;i<tabs.length;i++){
                            for(let j=0;j<websiteArr.length;j++){
                                let{url}=websiteArr[j];
                                if(url===tabs[i].url){
                                    console.log("yeeee");
                                    chrome.tabs.remove(tabs[i].id);
                                }
                            }
                        }
                    });
            
                })();
            }
        }
    }
})
chrome.tabs.onActivated.addListener(function(tabId){
    console.log("New tab is made");
    let time="00:00:00";
    let timeCount=0;
    // this id done to make the timer stop when going to a new tab
    if(JSON.parse(localStorage.getItem("timerState")))
        localStorage.setItem("timerState",false);
    startCounting(time,timeCount);
})

function startCounting(time,timeCount){
    let msgReturned="";
    chrome.runtime.onMessage.addListener(function(msg){
        msgReturned=msg;
        runTimer(msgReturned);
    })
    function runTimer(msgReturned){
        if(msgReturned=="start"){
               let interval=setInterval(function(){
                    timeBtnState=JSON.parse(localStorage.getItem("timerState"));
                    if(timeBtnState==true){
                        let second=(timeCount%60)<10?`0${timeCount%60}`:`${timeCount%60}`;
                        let minute=(timeCount/60)<10?`0${Number.parseInt(timeCount/60)}`:`${Number.parseInt(timeCount/60)}`;
                        let hour=(timeCount/3600)<10?`0${Number.parseInt(timeCount/3600)}`:`${Number.parseInt(timeCount/3600)}`;
                        time=`${hour}:${minute}:${second}`;
                        timeCount++;
                        chrome.runtime.sendMessage(time);
                    }else{
                        chrome.runtime.sendMessage(time);
                        clearInterval(interval);
                        return;
                    }
                },1000);
        }
    }
}
