"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function ($) {
    /**
            *@param {boolen} this.period 可否选上下午，true 为可以，false不可以
            *@param {number} this.days 请假天数，默认值为0
            *@param {boolen} this.normal 是否计算特殊上班及，true 跳过，false不跳过
            *@param {boolen} this.editable 可否编辑请假天数框 true可以 false不可以
            *@param {arr} this.holiday 存放特殊放假时间
            *@param {arr} this.workDay 存放特殊上班事件
            */
    function DataSelect(opt) {
        this.config = $.extend(true, DataSelect._default_, opt);
        this.view = this.config.view;
        this.ele = $(this.config.contanier);
        //可否上下午
        this.period = this.config.a;
        //是否跳过假期
        this.normal = this.config.c;
        //传入请假天数
        this.days = parseFloat(this.config.b);
        this.editable = this.config.editable;
        this.holiday = this.config.holiday;
        this.workDay = this.config.workDay;
        this.result = []; //最终数据
        this.dataCache = {
            start: null,
            days: null,
            checked: DataSelect._default_.defaultChecked
        };
        this.init();
    }

    DataSelect.prototype = {
        init: function init() {
            var trigger = $(this.config.triggerBtn);
            var dataInput = $(this.config.dataInput);
            var wrap = $(this.config.dateWrap);
            var that = this;
            this.es5Method();
            dataInput.on('focus', facous);
            if (!this.editable) {
                this.dataCache.days = this.days;
                trigger.val(this.days);
                trigger.attr("readonly", "true");
            } else {
                this.dataCache.days = this.days;
                trigger.val(this.days);
            }
            $([window, document.body]).click(function (e) {
                e.stopPropagation();
                var target = that.eventTarget(e);
                var id = target.attr("id");
                var condition = that.clickOut(target);
                if (condition) {
                    //最终数据
                    var data = that.handle();
                    if (data === "" || !data) return;
                    that.render(data);
                    that.result = data;
                    console.log('result', that.result);
                }
            });
            this.ele.change(startChange);
            //起始时间框获取焦点回调
            function facous() {
                if (!that.period) {
                    $(that.config.noon).hide() && $(that.config.afternoon).hide();
                }
                wrap.on('click', function (e) {
                    var target = that.eventTarget(e);
                    if (target.attr("id") === that.config.dateWrap.slice(1)) return;
                    if (that.dataCache.checked) {
                        var checked = that.dataCache.checked;
                        checked.removeClass('current');
                        target.addClass('current');
                        that.dataCache.checked = target;
                    } else {
                        target.addClass('current');
                        that.dataCache.checked = target;
                    }
                });
            }

            function startChange(e) {
                var target = that.eventTarget(e);
                if (target.attr("id") === that.config.dataInput.slice(1)) {
                    that.dataCache.start = target.val();
                }
            }
        },
        //判断鼠标是否点击body
        clickOut: function clickOut(value) {
            var arr = this.config.idFilter;
            var pivot = true;
            for (var i = 0; i < arr.length; i++) {
                if ($(arr[i]).attr("id") === value.attr("id")) {
                    pivot = false;
                    break;
                } else {
                    continue;
                }
            }
            return pivot;
        },
        thorwInfo: function thorwInfo() {
            alert(this.config.throwInfo);
            $(this.config.triggerBtn).val("").focus();
        },
        validty: function validty(n) {
            if (this.isDecimal(n)) {
                if (!this.period) {
                    alert('请假天数必须为整日');
                    return;
                }
                var str = n.toString();
                var arr = str.split(".");
                if (parseInt(arr[0]) < 0 || parseInt(arr[1]) !== 5) {
                    console.log('0', arr[1]);
                    console.log('1', _typeof(arr[1]));
                    console.log('err');
                    this.thorwInfo();
                    return;
                }
                return n;
            } else if (n < 0) {
                this.thorwInfo();
                return;
            }
            return n;
        },
        handle: function handle() {
            var date = this.dataCache.start;
            var period = this.dataCache.checked;
            var that = this;
            var arr = null;
            var checkResult = null;
            var pivot = 0;
            if (date === "") return;
            updata();
            if (date) arr = buildArry.call(that, date);

            return arr;

            function buildArry(date) {
                var _this = this;

                var days = parseFloat(this.dataCache.days);
                var len = Math.ceil(days);
                var dataArray = [];
                var n = null;
                var k = null;
                var key = $(this.dataCache.checked).text();
                var curDate = this.formatDate(date);
                if (this.isDecimal(days)) {
                    n = 0;
                }
                if (!this.isDecimal(days) && key === "下午") {
                    n = 0;
                    len += 1;
                    k = len;
                }

                var _loop = function _loop(i) {
                    var j = i === 0 ? 0 : 1;
                    var time = _this.createTime(curDate, j);
                    if (_this.normal) {
                        time = compare(time, dataArray);
                    }
                    var str = null;
                    if (i === n) {
                        str = key;
                        var result = time + " " + str + " " + "0.5天";
                        dataArray.push(result.split(" "));
                    } else if (i === k - 1) {
                        var _result = time + " " + "上午" + " " + "0.5天";
                        dataArray.push(_result.split(" "));
                    } else {
                        $(that.config.info).each(function (i, item) {
                            var result = time + " " + item + " " + "0.5天";
                            dataArray.push(result.split(" "));
                        });
                    }
                };

                for (var i = 0; i < len; i++) {
                    _loop(i);
                }
                dataArray.push(days);
                return dataArray;
            }
            //对比是否与节假日重叠
            function compare(value, arr1) {
                var arr = []; //读取当前已存入的日期以便判断日期是否重复
                var date = value;
                var result = null;
                var sWork = that.workDay;
                var sHoliday = that.holiday;
                for (var i = 0; i < arr1.length; i++) {
                    arr.push(arr1[i][0]);
                }

                return recursion(date, arr);

                function recursion(value, arr) {
                    if (isWeekend(value)) {
                        if (sWork.indexOf(value) > -1) return value;
                        if (!(sWork.indexOf(value) > -1) || arr.indexOf(value) > -1) {
                            var plus = that.createTime(that.formatDate(value), 1);
                            return recursion(plus, arr);
                        }
                    } else {
                        if (sHoliday.indexOf(value) > -1 || arr.indexOf(value) > -1) {
                            var _plus = that.createTime(that.formatDate(value), 1);
                            return recursion(_plus, arr);
                        }
                    }
                    return value;
                }
                //判断是否为周某
                function isWeekend(date) {
                    var cur = that.formatDate(date);
                    var day = cur.getDay();
                    if (day === 0 || day === 6) return true;
                    return false;
                }
            }
            function updata() {
                var target = $(that.config.triggerBtn);
                var value = Number(target.val());
                var curV = that.validty(value);
                that.dataCache.days = curV;
            }
            //判断是否为周末
        },
        createTime: function createTime(curDate, j) {
            curDate.setDate(curDate.getDate() + j);
            var year = curDate.getFullYear();
            var month = curDate.getMonth() + 1;
            var targetDate = curDate.getDate();
            targetDate = targetDate < 10 ? '0' + targetDate : targetDate;
            var time = year + '-' + month + '-' + targetDate;
            return time;
        },
        formatDate: function formatDate(date) {
            var form = date.replace(/-/g, "/");
            var curDate = new Date(form);
            return curDate;
        },
        //判断是否是小数
        isDecimal: function isDecimal(num) {
            var str = num.toString();
            var s = str.indexOf('.') > -1 ? true : false;
            return s;
        },
        eventTarget: function eventTarget(e) {
            e = e || window.event;
            var target = $(e.target) || $(e.srcElement);
            return target;
        },
        //渲染dom
        render: function render(arr) {
            if (!arr) return;
            var wrap = $(this.config.showArea).get(0);
            var str = '';
            for (var i = 0; i < arr.length - 1; i++) {
                var content = arr[i].join(" ");
                str += this.view.input(content);
            }
            wrap.innerHTML = str;
        },
        getResult: function getResult() {
            if (this.result !== "") {
                return this.result;
            } else {
                console.log('数据空');
            }
        },
        es5Method: function es5Method() {
            if (typeof Array.prototype.indexOf != "function") {
                Array.prototype.indexOf = function (searchElement, fromIndex) {
                    var index = -1;
                    fromIndex = fromIndex * 1 || 0;

                    for (var k = 0, length = this.length; k < length; k++) {
                        if (k >= fromIndex && this[k] === searchElement) {
                            index = k;
                            break;
                        }
                    }
                    return index;
                };
            }
        }
    };
    DataSelect._default_ = {
        view: {
            input: function input(c) {
                return '<span class="showItem">' + c + '</span>';
            }
        },
        a: true,
        b: 0,
        c: true,
        editable: true,
        throwInfo: '请假天数至少为0.5天',
        info: ["上午", "下午"],
        triggerBtn: '#dataCount', //触发事件按钮
        dataInput: '#dataStart',
        contanier: '.container',
        noon: '#noon',
        afternoon: '#afternoon',
        whole: '#whole',
        dateWrap: '#dateWrap',
        defaultChecked: '',
        showArea: '.resultShow',
        infoDom: '.info',
        idFilter: ['#dataCount', '#dataStart', '#selector']
    };
    window.dataSelect = function (opt) {
        return new DataSelect(opt);
    };
})(jQuery);