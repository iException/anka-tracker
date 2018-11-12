<p align="center">
  <img src="https://user-images.githubusercontent.com/10026019/48325653-9fb60800-e671-11e8-9e5f-46e625d8159f.png" width="300"/>
  <b>&nbsp;&nbsp;&nbsp;Tracker</b>
</p>

<p align="center">
	<a href="https://www.npmjs.com/package/@anka-dev/tracker">
	<img src="https://badge.fury.io/js/%40anka-dev%2Ftracker.svg"/>
	</a>
</p>

小程序打点库，用于统计用户行为数据。

# 功能

anka-tracker 会将打点任务缓存到队列中，对打点任务做限流处理，避免占用太多HTTP请求导致业务逻辑请求无法顺利完成。另外，当离线或应用关闭时任务会被暂停，直到重新连线/重启后，tracker 会继续先前未完成的任务。

详细配置见 [./src/types/types.d.ts](./src/types/types.d.ts)

适用于小程序/小游戏。

# 使用

## 安装

以下两种安装方式随意选择:

- 通过 npm 安装: `$ npm install @anka-dev/tracker --save`
- 下载该仓库下 dist/anka-tracker.min.js 文件

## 初始化

将 anka-tracker.min.js 和 配置文件 anka-tracker.config.js 放置在小程序的开发目录中（两者必须在同一文件夹下）

```diff
+ ├── anka-tracker.config.js
+ ├── anka-tracker.js
  ├── anka.config.json
  ├── app.js
  ├── app.json
  ├── app.wxss
  ├── dist
  │   └── index.js
  ├── pages
  │   ├── index
  │   └── log
  ├── project.config.json
  └── utils
  	└── util.js
```

在 `app.js` 中引入 tracker：

```javascript
/* app.js */
const { tracker } = require('./anka-tracker.js')
```

并在恰当的时机初始化：

```javascript
/* app.js */
onLaunch (options) {
	this.onLaunchOption = options
	this.tracker = tracker

	wx.login({
		complete: () => {
			// 只有初始化成功后才会开始打点请求
			// demo 里我们选择登录后初始化
			tracker.asyncInitWithCommonData({
				// 传入 commonData
				open_id: 'mock_open_id',
				union_id: 'mock_union_id'
			}).then(() => {
				console.log('初始化成功，开始执行打点任务')
			})
		}
	})
},
```

除上面的示例之外，你也可以选择用更灵活的方式初始化：

```javascript
const { BxTracker } = require('./anka-tracker.js')
const tracker = BxTracker.generateTrackerInstance({
    // 在这里传入配置，而不使用 anka-tracker.config.js
    detectChanel: false,
    detectAppStart: true
})
```

## API

提供两个通用打点 API 供开发者使用，建议配置 `autoPageView` 使用自动打点。

```javascript
getApp().tracker.evt('click_btn', {
	page_id: this.pageId,
	custom_data: 'custom_data'
})

getApp().tracker.pv('__viewPage', {
	page_id: 'log',
	page_type: 'common',
	page_title: '详情页',
	page_level: 'tabbar_page'
})
```

值得注意的是，目前在iOS机型上，小程序 `onHide` 事件中，`setTimeout` 不会在预期的时间触发，回调函数会被冻结直到小程序触发 `onShow` 钩子。换句话说，`setTimeout(() => {console.log('hello anka!')}, 2000)` 不会在小程序 `onHide` 触发后（`onShow` 之前）输出 `hello anka!`。

对于这样的情况，我们可以使用 `forceEvt` 方法强制执行一次打点请求。与 `evt` 不同的是，`forceEvt` 会立刻执行请求，不论成功与否均不会重试。通常情况下，不建议使用这个 API。

# 参考

- [./src/types/BxTracker.d.ts](./src/types/BxTracker.d.ts)

- [./src/types/types.d.ts](./src/types/types.d.ts)

- [示例](./test)
