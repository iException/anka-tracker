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

    var Task = (function () {
        function Task(trackData) {
            this.status = TaskStatus.pending;
            this.data = trackData;
        }
        Task.prototype.isSucceed = function () {
            this.status = TaskStatus.success;
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
            config = Object.assign(config, DEFAULT_CONFIG);
            this.retry = config.retry;
            this.interval = config.interval;
            this.groupMaxLength = config.groupMaxLength;
            this.sender = config.sender;
        }
        return Inilialzer;
    }());

    var TASK_STATUS;
    (function (TASK_STATUS) {
        TASK_STATUS[TASK_STATUS["PENDING"] = 0] = "PENDING";
        TASK_STATUS[TASK_STATUS["SUCCESS"] = 1] = "SUCCESS";
        TASK_STATUS[TASK_STATUS["FAILED"] = 2] = "FAILED";
    })(TASK_STATUS || (TASK_STATUS = {}));
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
        }
        QueueManager.prototype.init = function (config) {
            if (this.sender === void (0)) {
                this.sender = config.sender;
                this.status = QUEUE_MANAGER_STATUS.IDLE;
                this.runner();
            }
        };
        QueueManager.prototype.push = function (task) {
            if (task.status === TASK_STATUS.PENDING) {
                this.queue.push(task);
            }
            else if (task.status === TASK_STATUS.FAILED) {
                this.failedQueue.push(task);
            }
            if (this.status === QUEUE_MANAGER_STATUS.IDLE) {
                this.runner();
            }
        };
        QueueManager.prototype.runner = function () {
            var _this = this;
            var failedQueueLength = this.failedQueue.length;
            var groupMaxLength = this.config.groupMaxLength;
            var tasks = failedQueueLength - groupMaxLength >= 0 ?
                this.failedQueue.splice(0, groupMaxLength) :
                this.failedQueue.splice(0, failedQueueLength - 1).concat(this.queue.splice(0, groupMaxLength - failedQueueLength));
            if (tasks.length === 0)
                return;
            this.status = QUEUE_MANAGER_STATUS.RUNNING;
            return Promise.all(tasks.map(function (task) { return _this.sender.send(task); })).then(function (results) {
                results.forEach(function (task) {
                    if (task.status === TASK_STATUS.FAILED) {
                        _this.push(task);
                    }
                });
            }).then(function () {
                _this.status = QUEUE_MANAGER_STATUS.IDLE;
                _this.runner();
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
        Core.prototype.initSender = function (sender) {
            this.queueManager.init(__assign({ sender: sender }, this.config));
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

    var WeChatSender = (function () {
        function WeChatSender(url, commonData) {
            this.url = url;
            this.commonData = commonData;
        }
        WeChatSender.prototype.send = function (task) {
            return request({
                url: this.url,
                method: 'POST',
                header: this.commonData,
                data: task.data
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

    var Tracker = (function () {
        function Tracker(config) {
            this.core = new Core(config);
        }
        Tracker.prototype.init = function (url, commonData) {
            this.sender = new WeChatSender(url, commonData);
            this.core.initSender(this.sender);
        };
        return Tracker;
    }());

    return Tracker;

})));
