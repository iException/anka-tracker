(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Tracker = {})));
}(this, (function (exports) { 'use strict';

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
            var now = Date.now();
            this.status = TASK_STATUS.PENDING;
            this.data = trackData;
            this.timestamp = now;
        }
        Task.prototype.isSucceed = function () {
            this.status = TASK_STATUS.SUCCESS;
        };
        Task.prototype.isFailed = function () {
            this.status++;
        };
        return Task;
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
            this.config = config;
            this.queueManager = new QueueManager(this.config);
        }
        Core.prototype.init = function (config) {
            this.queueManager.init(__assign({}, this.config, config));
        };
        Core.prototype.log = function (trackData) {
            this.queueManager.push(trackData);
        };
        return Core;
    }());

    var DEFAULT_CONFIG = {
        retry: 2,
        interval: 1000,
        groupMaxLength: 5,
        timestampKey: 'timestamp_ms'
    };
    var Inilialzer = (function () {
        function Inilialzer(config) {
            if (config === void 0) { config = {}; }
            config = Object.assign(DEFAULT_CONFIG, config);
            this.retry = config.retry;
            this.interval = config.interval;
            this.groupMaxLength = config.groupMaxLength;
            this.timestampKey = config.timestampKey;
            this.sender = config.sender;
        }
        return Inilialzer;
    }());

    function request(requestPramas) {
        return new Promise(function (resolve, reject) {
            wx.request(__assign({}, requestPramas, { success: function (res) {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve && resolve(res.data);
                    }
                    else {
                        reject && reject(res.data);
                    }
                }, fail: function (err) {
                    reject && reject(err);
                } }));
        });
    }
    function setStorage(pramas) {
        return new Promise(function (resolve, reject) {
            wx.setStorage(__assign({}, pramas, { success: function (res) {
                    resolve(res);
                }, fail: function (err) {
                    reject(err);
                } }));
        });
    }
    function getStorage(pramas) {
        return new Promise(function (resolve, reject) {
            wx.getStorage(__assign({}, pramas, { success: function (res) {
                    resolve(res.data);
                }, fail: function (err) {
                    reject(err);
                } }));
        });
    }
    function getSystemInfo() {
        return new Promise(function (resolve, reject) {
            wx.getSystemInfo({
                success: function (res) {
                    resolve(res);
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    }
    function getNetworkType() {
        return new Promise(function (resolve, reject) {
            wx.getNetworkType({
                success: function (res) {
                    resolve(res.networkType);
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    }

    var has = Object.prototype.hasOwnProperty;

    var hexTable = (function () {
        var array = [];
        for (var i = 0; i < 256; ++i) {
            array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
        }

        return array;
    }());

    var compactQueue = function compactQueue(queue) {
        var obj;

        while (queue.length) {
            var item = queue.pop();
            obj = item.obj[item.prop];

            if (Array.isArray(obj)) {
                var compacted = [];

                for (var j = 0; j < obj.length; ++j) {
                    if (typeof obj[j] !== 'undefined') {
                        compacted.push(obj[j]);
                    }
                }

                item.obj[item.prop] = compacted;
            }
        }

        return obj;
    };

    var arrayToObject = function arrayToObject(source, options) {
        var obj = options && options.plainObjects ? Object.create(null) : {};
        for (var i = 0; i < source.length; ++i) {
            if (typeof source[i] !== 'undefined') {
                obj[i] = source[i];
            }
        }

        return obj;
    };

    var merge = function merge(target, source, options) {
        if (!source) {
            return target;
        }

        if (typeof source !== 'object') {
            if (Array.isArray(target)) {
                target.push(source);
            } else if (typeof target === 'object') {
                if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                    target[source] = true;
                }
            } else {
                return [target, source];
            }

            return target;
        }

        if (typeof target !== 'object') {
            return [target].concat(source);
        }

        var mergeTarget = target;
        if (Array.isArray(target) && !Array.isArray(source)) {
            mergeTarget = arrayToObject(target, options);
        }

        if (Array.isArray(target) && Array.isArray(source)) {
            source.forEach(function (item, i) {
                if (has.call(target, i)) {
                    if (target[i] && typeof target[i] === 'object') {
                        target[i] = merge(target[i], item, options);
                    } else {
                        target.push(item);
                    }
                } else {
                    target[i] = item;
                }
            });
            return target;
        }

        return Object.keys(source).reduce(function (acc, key) {
            var value = source[key];

            if (has.call(acc, key)) {
                acc[key] = merge(acc[key], value, options);
            } else {
                acc[key] = value;
            }
            return acc;
        }, mergeTarget);
    };

    var assign = function assignSingleSource(target, source) {
        return Object.keys(source).reduce(function (acc, key) {
            acc[key] = source[key];
            return acc;
        }, target);
    };

    var decode = function (str) {
        try {
            return decodeURIComponent(str.replace(/\+/g, ' '));
        } catch (e) {
            return str;
        }
    };

    var encode = function encode(str) {
        // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
        // It has been adapted here for stricter adherence to RFC 3986
        if (str.length === 0) {
            return str;
        }

        var string = typeof str === 'string' ? str : String(str);

        var out = '';
        for (var i = 0; i < string.length; ++i) {
            var c = string.charCodeAt(i);

            if (
                c === 0x2D // -
                || c === 0x2E // .
                || c === 0x5F // _
                || c === 0x7E // ~
                || (c >= 0x30 && c <= 0x39) // 0-9
                || (c >= 0x41 && c <= 0x5A) // a-z
                || (c >= 0x61 && c <= 0x7A) // A-Z
            ) {
                out += string.charAt(i);
                continue;
            }

            if (c < 0x80) {
                out = out + hexTable[c];
                continue;
            }

            if (c < 0x800) {
                out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
                continue;
            }

            if (c < 0xD800 || c >= 0xE000) {
                out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
                continue;
            }

            i += 1;
            c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
            out += hexTable[0xF0 | (c >> 18)]
                + hexTable[0x80 | ((c >> 12) & 0x3F)]
                + hexTable[0x80 | ((c >> 6) & 0x3F)]
                + hexTable[0x80 | (c & 0x3F)];
        }

        return out;
    };

    var compact = function compact(value) {
        var queue = [{ obj: { o: value }, prop: 'o' }];
        var refs = [];

        for (var i = 0; i < queue.length; ++i) {
            var item = queue[i];
            var obj = item.obj[item.prop];

            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; ++j) {
                var key = keys[j];
                var val = obj[key];
                if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                    queue.push({ obj: obj, prop: key });
                    refs.push(val);
                }
            }
        }

        return compactQueue(queue);
    };

    var isRegExp = function isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    };

    var isBuffer = function isBuffer(obj) {
        if (obj === null || typeof obj === 'undefined') {
            return false;
        }

        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    };

    var utils = {
        arrayToObject: arrayToObject,
        assign: assign,
        compact: compact,
        decode: decode,
        encode: encode,
        isBuffer: isBuffer,
        isRegExp: isRegExp,
        merge: merge
    };

    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;

    var formats = {
        'default': 'RFC3986',
        formatters: {
            RFC1738: function (value) {
                return replace.call(value, percentTwenties, '+');
            },
            RFC3986: function (value) {
                return value;
            }
        },
        RFC1738: 'RFC1738',
        RFC3986: 'RFC3986'
    };

    var arrayPrefixGenerators = {
        brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
            return prefix + '[]';
        },
        indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
            return prefix + '[' + key + ']';
        },
        repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
            return prefix;
        }
    };

    var toISO = Date.prototype.toISOString;

    var defaults = {
        delimiter: '&',
        encode: true,
        encoder: utils.encode,
        encodeValuesOnly: false,
        serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
            return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
    };

    var stringify = function stringify( // eslint-disable-line func-name-matching
        object,
        prefix,
        generateArrayPrefix,
        strictNullHandling,
        skipNulls,
        encoder,
        filter,
        sort,
        allowDots,
        serializeDate,
        formatter,
        encodeValuesOnly
    ) {
        var obj = object;
        if (typeof filter === 'function') {
            obj = filter(prefix, obj);
        } else if (obj instanceof Date) {
            obj = serializeDate(obj);
        } else if (obj === null) {
            if (strictNullHandling) {
                return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
            }

            obj = '';
        }

        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
            if (encoder) {
                var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
                return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
            }
            return [formatter(prefix) + '=' + formatter(String(obj))];
        }

        var values = [];

        if (typeof obj === 'undefined') {
            return values;
        }

        var objKeys;
        if (Array.isArray(filter)) {
            objKeys = filter;
        } else {
            var keys = Object.keys(obj);
            objKeys = sort ? keys.sort(sort) : keys;
        }

        for (var i = 0; i < objKeys.length; ++i) {
            var key = objKeys[i];

            if (skipNulls && obj[key] === null) {
                continue;
            }

            if (Array.isArray(obj)) {
                values = values.concat(stringify(
                    obj[key],
                    generateArrayPrefix(prefix, key),
                    generateArrayPrefix,
                    strictNullHandling,
                    skipNulls,
                    encoder,
                    filter,
                    sort,
                    allowDots,
                    serializeDate,
                    formatter,
                    encodeValuesOnly
                ));
            } else {
                values = values.concat(stringify(
                    obj[key],
                    prefix + (allowDots ? '.' + key : '[' + key + ']'),
                    generateArrayPrefix,
                    strictNullHandling,
                    skipNulls,
                    encoder,
                    filter,
                    sort,
                    allowDots,
                    serializeDate,
                    formatter,
                    encodeValuesOnly
                ));
            }
        }

        return values;
    };

    var stringify_1 = function (object, opts) {
        var obj = object;
        var options = opts ? utils.assign({}, opts) : {};

        if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
            throw new TypeError('Encoder has to be a function.');
        }

        var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
        var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
        var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
        var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
        var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
        var sort = typeof options.sort === 'function' ? options.sort : null;
        var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
        var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
        var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
        if (typeof options.format === 'undefined') {
            options.format = formats['default'];
        } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        var formatter = formats.formatters[options.format];
        var objKeys;
        var filter;

        if (typeof options.filter === 'function') {
            filter = options.filter;
            obj = filter('', obj);
        } else if (Array.isArray(options.filter)) {
            filter = options.filter;
            objKeys = filter;
        }

        var keys = [];

        if (typeof obj !== 'object' || obj === null) {
            return '';
        }

        var arrayFormat;
        if (options.arrayFormat in arrayPrefixGenerators) {
            arrayFormat = options.arrayFormat;
        } else if ('indices' in options) {
            arrayFormat = options.indices ? 'indices' : 'repeat';
        } else {
            arrayFormat = 'indices';
        }

        var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

        if (!objKeys) {
            objKeys = Object.keys(obj);
        }

        if (sort) {
            objKeys.sort(sort);
        }

        for (var i = 0; i < objKeys.length; ++i) {
            var key = objKeys[i];

            if (skipNulls && obj[key] === null) {
                continue;
            }

            keys = keys.concat(stringify(
                obj[key],
                key,
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encode ? encoder : null,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }

        var joined = keys.join(delimiter);
        var prefix = options.addQueryPrefix === true ? '?' : '';

        return joined.length > 0 ? prefix + joined : '';
    };

    var has$1 = Object.prototype.hasOwnProperty;

    var defaults$1 = {
        allowDots: false,
        allowPrototypes: false,
        arrayLimit: 20,
        decoder: utils.decode,
        delimiter: '&',
        depth: 5,
        parameterLimit: 1000,
        plainObjects: false,
        strictNullHandling: false
    };

    var parseValues = function parseQueryStringValues(str, options) {
        var obj = {};
        var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
        var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
        var parts = cleanStr.split(options.delimiter, limit);

        for (var i = 0; i < parts.length; ++i) {
            var part = parts[i];

            var bracketEqualsPos = part.indexOf(']=');
            var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

            var key, val;
            if (pos === -1) {
                key = options.decoder(part, defaults$1.decoder);
                val = options.strictNullHandling ? null : '';
            } else {
                key = options.decoder(part.slice(0, pos), defaults$1.decoder);
                val = options.decoder(part.slice(pos + 1), defaults$1.decoder);
            }
            if (has$1.call(obj, key)) {
                obj[key] = [].concat(obj[key]).concat(val);
            } else {
                obj[key] = val;
            }
        }

        return obj;
    };

    var parseObject = function (chain, val, options) {
        var leaf = val;

        for (var i = chain.length - 1; i >= 0; --i) {
            var obj;
            var root = chain[i];

            if (root === '[]') {
                obj = [];
                obj = obj.concat(leaf);
            } else {
                obj = options.plainObjects ? Object.create(null) : {};
                var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
                var index = parseInt(cleanRoot, 10);
                if (
                    !isNaN(index)
                    && root !== cleanRoot
                    && String(index) === cleanRoot
                    && index >= 0
                    && (options.parseArrays && index <= options.arrayLimit)
                ) {
                    obj = [];
                    obj[index] = leaf;
                } else {
                    obj[cleanRoot] = leaf;
                }
            }

            leaf = obj;
        }

        return leaf;
    };

    var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
        if (!givenKey) {
            return;
        }

        // Transform dot notation to bracket notation
        var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

        // The regex chunks

        var brackets = /(\[[^[\]]*])/;
        var child = /(\[[^[\]]*])/g;

        // Get the parent

        var segment = brackets.exec(key);
        var parent = segment ? key.slice(0, segment.index) : key;

        // Stash the parent if it exists

        var keys = [];
        if (parent) {
            // If we aren't using plain objects, optionally prefix keys
            // that would overwrite object prototype properties
            if (!options.plainObjects && has$1.call(Object.prototype, parent)) {
                if (!options.allowPrototypes) {
                    return;
                }
            }

            keys.push(parent);
        }

        // Loop through children appending to the array until we hit depth

        var i = 0;
        while ((segment = child.exec(key)) !== null && i < options.depth) {
            i += 1;
            if (!options.plainObjects && has$1.call(Object.prototype, segment[1].slice(1, -1))) {
                if (!options.allowPrototypes) {
                    return;
                }
            }
            keys.push(segment[1]);
        }

        // If there's a remainder, just add whatever is left

        if (segment) {
            keys.push('[' + key.slice(segment.index) + ']');
        }

        return parseObject(keys, val, options);
    };

    var parse = function (str, opts) {
        var options = opts ? utils.assign({}, opts) : {};

        if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
            throw new TypeError('Decoder has to be a function.');
        }

        options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
        options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults$1.delimiter;
        options.depth = typeof options.depth === 'number' ? options.depth : defaults$1.depth;
        options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults$1.arrayLimit;
        options.parseArrays = options.parseArrays !== false;
        options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults$1.decoder;
        options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults$1.allowDots;
        options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults$1.plainObjects;
        options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults$1.allowPrototypes;
        options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults$1.parameterLimit;
        options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$1.strictNullHandling;

        if (str === '' || str === null || typeof str === 'undefined') {
            return options.plainObjects ? Object.create(null) : {};
        }

        var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
        var obj = options.plainObjects ? Object.create(null) : {};

        // Iterate over the keys and setup the new object

        var keys = Object.keys(tempObj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var newObj = parseKeys(key, tempObj[key], options);
            obj = utils.merge(obj, newObj, options);
        }

        return utils.compact(obj);
    };

    var lib = {
        formats: formats,
        parse: parse,
        stringify: stringify_1
    };

    var version = "0.0.1";

    var WeChatCommonDataVender = {
        dataScheme: {
            event_type: 1,
            tracktype: 1,
            action: 1,
            timestamp_ms: 1,
            __debug: 0,
            app_type: 1,
            app_id: 1,
            app_name: 1,
            template_version: 1,
            app_category: 1,
            preview_version: 0,
            app_role: 0,
            internal_app: 0,
            track_id: 1,
            open_id: 0,
            union_id: 0,
            bx_user_id: 0,
            visitor_mobile: 0,
            distinct_id: 0,
            ip: 1,
            os: 1,
            os_version: 1,
            model: 1,
            network_type: 1,
            env_version: 0,
            source: 1,
            source_path: 1,
            source_params: 0,
            source_src_key: 0,
            source_app_id: 0,
            page_type: 1,
            page_id: 1,
            last_page_type: 0,
            last_page_id: 0,
            page_level: 1,
            sdk_version: 1
        },
        getCommonData: function (config) {
            var onLaunchOption = config.onLaunchOption;
            return Promise.all([
                getSystemInfo(),
                getNetworkType()
            ]).then(function (_a) {
                var systemInfo = _a[0], networkType = _a[1];
                var system = systemInfo.system.split(/\s+/);
                var query = lib.stringify(onLaunchOption.query);
                var commonData = {
                    __debug: 1,
                    sdk_version: version,
                    model: systemInfo.model,
                    os: system[0],
                    os_version: system[1],
                    network_type: networkType,
                    env_version: systemInfo.version,
                    ip: '',
                    app_type: 'wx',
                    app_id: '',
                    app_name: '',
                    template_version: '',
                    app_category: '',
                    source: onLaunchOption.scene,
                    source_path: onLaunchOption.path,
                    source_app_id: onLaunchOption.referrerInfo ? onLaunchOption.referrerInfo.appId : '',
                    source_params: query,
                    source_src_key: onLaunchOption.query ? onLaunchOption.query.src : ''
                };
                return Promise.resolve(commonData);
            });
        },
        validate: function (data) {
            var result = {
                required: [],
                optional: []
            };
            var dataScheme = this.dataScheme;
            for (var key in dataScheme) {
                if (dataScheme.hasOwnProperty(key) && !data[key]) {
                    result[dataScheme[key] === 1 ? 'required' : 'optional'].push(key);
                }
            }
            return result;
        }
    };

    var WeChatSender = (function () {
        function WeChatSender(url, config, globalData) {
            this.url = url;
            this.config = config;
            this.globalData = globalData;
        }
        WeChatSender.prototype.send = function (task) {
            var data = __assign({}, this.globalData, task.data);
            console.log('打点数据校验结果:', WeChatCommonDataVender.validate(data));
            return request({
                url: this.url,
                method: 'POST',
                data: data
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
        function WeChatStore(config) {
            this.data = [];
            this.config = config;
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
            this.config = new Inilialzer(config);
            this.core = new Core(this.config);
            this.commonDataVendor = WeChatCommonDataVender;
        }
        Tracker.prototype.init = function (url, globalData) {
            this.sender = new WeChatSender(url, this.config, globalData);
            this.store = new WeChatStore(this.config);
            this.core.init({
                sender: this.sender,
                store: this.store
            });
        };
        Tracker.prototype.log = function (data) {
            var now = Date.now();
            data[this.config.timestampKey] = now;
            this.core.log(new Task(data));
        };
        Tracker.prototype.commonData = function () {
            return this.commonDataVendor.getCommonData();
        };
        return Tracker;
    }());

    exports.Tracker = Tracker;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
