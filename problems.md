# console.log() not work in popup

https://stackoverflow.com/questions/14858909/cannot-get-chrome-popup-js-to-use-console-log

# inline function invocation not work in popup.html

https://stackoverflow.com/questions/17601615/the-chrome-extension-popup-is-not-working-click-events-are-not-handled

# play sound when popup notifications

https://stackoverflow.com/questions/14917531/how-to-implement-a-notification-popup-with-sound-in-chrome-extension

# 定时任务in background的问题
可以用chrome.alarms API, 但是production模式的时间间隔最短只能1min, 建议manifest里把persistence设为true, 然后background.js里用js原生的setInterval
