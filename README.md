
Test passed by Chrome 67.0.3396.87 x64

------------

# zhuhai-bus-notifier(珠海公交到站提醒器)

此插件是由个人痛点，并结合珠海公交微信公众号启发而做的。微信公众号上有查询某个公交路线上的车子运行的实时数据，但如果我在用电脑，过一段时间后要去搭公交，为了得知车子是不是快要到我上车的站点，由于微信公众号没有**到站提醒**功能，我必须不断刷手机微信，十分麻烦。

这个Chrome扩展能实现如下功能:
1. 同时订阅多条公交线路，每条线路可以订阅多个不同站点；
2. 程序会在公交车接近指定站点时，在屏幕右下角弹出通知（暂设定是还有<=3站距离时触发通知，当然你觉得太烦也可以关掉通知功能）；
3. 可以查看订阅线路上所有公交车的运行状况。

## 安装方法
### 1. 通过Chrome Store安装
这是最简单的方式，如果你能访问Chrome Store，可以用Chrome打开[这个网址](https://chrome.google.com/webstore/detail/zhuhai-bus-arrival-notifi/fbeplekneeagbkkbffppkdmjlhbbpcai "这个网址")，点击右上角的**添加至Chrome**即可

### 2. 通过crx压缩包从本地安装
Step1：打开[Release页面](https://github.com/yellowb/zhuhai-bus-notifier/releases "Release页面")，下载最新版本的crx压缩包。

Step2：打开Chrome，点击右上角的`...`，选**更多工具**，再点击**扩展程序**：

[![](https://raw.githubusercontent.com/yellowb/zhuhai-bus-notifier/guide/guide-photos/1-chrome-menu.png)](https://raw.githubusercontent.com/yellowb/zhuhai-bus-notifier/guide/guide-photos/1-chrome-menu.png)

Step3：你需要手工打开**开发者模式**，在页面右上角：

[![](https://raw.githubusercontent.com/yellowb/zhuhai-bus-notifier/guide/guide-photos/2-enable-dev-mode.png)](https://raw.githubusercontent.com/yellowb/zhuhai-bus-notifier/guide/guide-photos/2-enable-dev-mode.png)

Step4：把crx压缩包拖进这个页面：

[![](https://raw.githubusercontent.com/yellowb/zhuhai-bus-notifier/guide/guide-photos/3-drap.png)](https://raw.githubusercontent.com/yellowb/zhuhai-bus-notifier/guide/guide-photos/3-drap.png)

Step5：确认安装：

[![](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/4-confirm.png)](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/4-confirm.png)

Step6：成功：

[![](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/5-complete.png)](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/5-complete.png)

## 使用方法
Step1：第一次使用时，由于还没有添加任何线路，所以数据是空的，可以点击**插件Icon**，在弹出页面右上角点击**设置**按钮进入设置界面：

[![](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/6-setup.png)](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/6-setup.png)

Step2：依次填写和选择线路名称、线路方向、提醒站点，点击保存：

[![](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/7-add-line.png)](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/7-add-line.png)

Step3：在我的关注页面里可以管理已经关注的线路，删除不想再关注的：

[![](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/8-mgr-line.png)](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/8-mgr-line.png)

Step4：设置完成！之后程序会定时（暂时是20s一次）抓取公交数据，并结合你关注的线路和站点做计算，在需要时提醒你。

如果想查看线路上车子的实时情况，可以点击浏览器右上角Icon，在这里你也可以暂停插件的运行或禁止右下角通知的弹出：

[![](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/9-show-bus-real-time.png)](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/9-show-bus-real-time.png)

右下角通知Sample如下，用的是chrome的notification：

[![](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/10-notification-show-bus.png)](https://github.com/yellowb/zhuhai-bus-notifier/raw/guide/guide-photos/10-notification-show-bus.png)

## Enjoy it！
