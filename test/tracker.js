(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Tracker = factory());
}(this, (function () { 'use strict';

    const __assign = Object.assign || function (target) {
        for (var source, i = 1; i < arguments.length; i++) {
            source = arguments[i];
            for (var prop in source) {
                if (Object.prototype.hasOwnProperty.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    };

    var TASK_STATUS;
    (function (TASK_STATUS) {
        TASK_STATUS[TASK_STATUS["PENDING"] = 0] = "PENDING";
        TASK_STATUS[TASK_STATUS["SUCCESS"] = 1] = "SUCCESS";
        TASK_STATUS[TASK_STATUS["FAILED"] = 2] = "FAILED";
    })(TASK_STATUS || (TASK_STATUS = {}));
    var Task = (function () {
        function Task(trackData) {
            this.status = TASK_STATUS.PENDING;
            this.data = trackData;
        }
        Task.prototype.isSucceed = function () {
            this.status = TASK_STATUS.SUCCESS;
        };
        Task.prototype.isFailed = function () {
            this.status++;
        };
        return Task;
    }());

    var DEFAULT_CONFIG = {
        retry: 2,
        interval: 1000,
        groupMaxLength: 5
    };
    var Inilialzer = (function () {
        function Inilialzer(config) {
            if (config === void 0) { config = {}; }
            config = Object.assign(DEFAULT_CONFIG, config);
            this.retry = config.retry;
            this.interval = config.interval;
            this.groupMaxLength = config.groupMaxLength;
            this.sender = config.sender;
        }
        return Inilialzer;
    }());

    var QUEUE_MANAGER_STATUS;
    (function (QUEUE_MANAGER_STATUS) {
        QUEUE_MANAGER_STATUS[QUEUE_MANAGER_STATUS["IDLE"] = 0] = "IDLE";
        QUEUE_MANAGER_STATUS[QUEUE_MANAGER_STATUS["RUNNING"] = 1] = "RUNNING";
        QUEUE_MANAGER_STATUS[QUEUE_MANAGER_STATUS["INITIALIZING"] = 2] = "INITIALIZING";
    })(QUEUE_MANAGER_STATUS || (QUEUE_MANAGER_STATUS = {}));
    var QueueManager = (function () {
        function QueueManager(config) {
            this.queue = [];
            this.failedQueue = [];
            this.config = config;
            this.status = QUEUE_MANAGER_STATUS.INITIALIZING;
            this.lastStoreUpdate = 0;
        }
        QueueManager.prototype.init = function (config) {
            var _this = this;
            if (this.sender === void (0)) {
                this.sender = config.sender;
                this.status = QUEUE_MANAGER_STATUS.IDLE;
            }
            if (this.store === void (0)) {
                this.store = config.store;
            }
            if (this.store) {
                this.store.get().then(function (tasks) {
                    var _a;
                    (_a = _this.queue).push.apply(_a, tasks.map(function (task) { return new Task(task.data); }));
                    _this.run();
                });
            }
            else {
                this.run();
            }
        };
        QueueManager.prototype.push = function (task) {
            if (task.status === TASK_STATUS.PENDING) {
                this.queue.push(task);
            }
            else if (task.status >= TASK_STATUS.FAILED && task.status <= this.config.retry) {
                this.failedQueue.push(task);
            }
            this.updateStore();
            if (this.status === QUEUE_MANAGER_STATUS.IDLE) {
                this.run();
            }
        };
        QueueManager.prototype.pop = function () {
            var failedQueueLength = this.failedQueue.length;
            var groupMaxLength = this.config.groupMaxLength;
            var tasks = failedQueueLength - groupMaxLength >= 0 ?
                this.failedQueue.splice(0, groupMaxLength) :
                this.failedQueue.splice(0, failedQueueLength - 1).concat(this.queue.splice(0, groupMaxLength - failedQueueLength));
            this.updateStore();
            return tasks;
        };
        QueueManager.prototype.updateStore = function () {
            var now = Date.now();
            if (this.store && now - this.lastStoreUpdate >= 500) {
                this.store.update(this.queue.concat(this.failedQueue));
                this.lastStoreUpdate = now;
            }
        };
        QueueManager.prototype.run = function () {
            var _this = this;
            var tasks = this.pop();
            if (!this.sender || tasks.length === 0)
                return;
            this.status = QUEUE_MANAGER_STATUS.RUNNING;
            return Promise.all(tasks.map(function (task) { return _this.sender.send(task); })).then(function (results) {
                results.forEach(function (task) {
                    if (task.status === TASK_STATUS.FAILED) {
                        _this.push(task);
                    }
                });
            }).then(function () {
                setTimeout(function () {
                    _this.status = QUEUE_MANAGER_STATUS.IDLE;
                    _this.run();
                }, _this.config.interval);
            });
        };
        return QueueManager;
    }());

    var Core = (function () {
        function Core(config) {
            if (config === void 0) { config = {}; }
            this.config = new Inilialzer(config);
            this.queueManager = new QueueManager(this.config);
        }
        Core.prototype.init = function (config) {
            this.queueManager.init(__assign({}, this.config, config));
        };
        Core.prototype.log = function (trackData) {
            this.queueManager.push(new Task(trackData));
        };
        return Core;
    }());

    var request = function (requestPramas) {
        return new Promise(function (resolve, reject) {
            wx.request(__assign({}, requestPramas, { success: function (res) {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve && resolve(res.data);
                    }
                    else {
                        reject && reject(res.data);
                    }
                },
                fail: function (err) {
                    reject && reject(err);
                } }));
        });
    };
    var setStorage = function (pramas) {
        return new Promise(function (resolve, reject) {
            wx.setStorage(__assign({}, pramas, { success: function (res) {
                    resolve(res);
                }, fail: function (err) {
                    reject(err);
                } }));
        });
    };
    var getStorage = function (pramas) {
        return new Promise(function (resolve, reject) {
            wx.getStorage(__assign({}, pramas, { success: function (res) {
                    resolve(res.data);
                }, fail: function (err) {
                    reject(err);
                } }));
        });
    };

    var WeChatSender = (function () {
        function WeChatSender(url, globalData) {
            this.url = url;
            this.globalData = globalData;
        }
        WeChatSender.prototype.send = function (task) {
            return request({
                url: this.url,
                method: 'POST',
                data: __assign({}, this.globalData, task.data)
            }).then(function () {
                task.isSucceed();
                return Promise.resolve(task);
            })["catch"](function () {
                task.isFailed();
                return Promise.resolve(task);
            });
        };
        return WeChatSender;
    }());

    var STORAGE_KEY = 'tracker_tasks';
    var WeChatStore = (function () {
        function WeChatStore() {
            this.data = [];
        }
        WeChatStore.prototype.get = function () {
            return getStorage({
                key: STORAGE_KEY
            });
        };
        WeChatStore.prototype.update = function (data) {
            this.data = data;
            return setStorage({
                key: STORAGE_KEY,
                data: data
            });
        };
        return WeChatStore;
    }());

    var Tracker = (function () {
        function Tracker(config) {
            this.core = new Core(config);
        }
        Tracker.prototype.init = function (url, globalData) {
            this.sender = new WeChatSender(url, globalData);
            this.store = new WeChatStore();
            this.core.init({
                sender: this.sender,
                store: this.store
            });
        };
        Tracker.prototype.log = function (data) {
            this.core.log(data);
        };
        return Tracker;
    }());

    return Tracker;

})));
