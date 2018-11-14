<p>
  <img src="https://user-images.githubusercontent.com/10026019/48325653-9fb60800-e671-11e8-9e5f-46e625d8159f.png" width="300"/>
  <b>&nbsp;&nbsp;&nbsp;Tracker</b>
</p>

<p>
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
	
[文档](https://iexception.github.io/anka-doc/book/library/tracker.html)

# 参考

- [src/types/BxTracker.d.ts](./src/types/BxTracker.d.ts)

- [src/types/types.d.ts](./src/types/types.d.ts)

- [小程序及小游戏示例](./test)
