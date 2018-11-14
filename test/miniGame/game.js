import './js/libs/weapp-adapter'
import './js/libs/symbol'
import { tracker } from './anka-tracker.js'

import Main from './js/main'

new Main()

tracker.asyncInitWithCommonData({
    open_id: 'mock_open_id'
}).then(() => {
    console.log('初始化成功，开始执行打点任务')
})

wx.onHide(() => {
    tracker.forceEvt('pause', {
        ttt: new Date().toLocaleString()
    })
    new Promise((resolve, reject) => {
        console.log(new Date().toLocaleString())
        resolve()
    }).then(() => {
        console.log(new Date().toLocaleString())        
    })

})
tracker.evt('start')
