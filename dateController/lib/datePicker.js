'use strict';

(function ($) {
    //a可否上下午，b请假天数，C是否为非正常上班时间
    function DataSelect(a, b, c) {
        this.config = $.extend(true, DataSelect._default_, null);
        this.view = this.config.view;
        this.ele = $(this.config.contanier);
        this.period = true && a;
        this.normal = true && c;
        this.days = parseFloat(b);
        this.holiday = ['2017-11-29', '2017-11-30', '2017-12-1', '2017-12-2'];
        console.log(this.period);
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
            dataInput.on('focus', facous);
            if (this.days) {
                this.dataCache.days = this.days;
                trigger.val(this.days);
                trigger.attr("readonly", "true");
            }
            $([window, document.body]).click(function (e) {
                e.stopPropagation();
                var target = that.eventTarget(e);
                var id = target.attr("id");
                var condition = that.clickOut(target);
                if (condition) {
                    var data = that.handle();
                    that.render(data);
                }
            });
            this.ele.change(startChange);

            function facous() {
                //起始时间框获取焦点回调
                console.log(that.period);
                if (!that.period) {
                    console.log(that.config.noon);
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
                    console.log(that.dataCache);
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
            console.log('target', value.attr("id"));
            for (var i = 0; i < arr.length; i++) {
                console.log(i, $(arr[i]));
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
                if (arr[1] != 5 || n <= 0) {
                    this.thorwInfo();
                    return;
                }
                return n;
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
                var key = $(this.dataCache.checked).text();
                var curDate = this.formatDate(date);
                if (this.isDecimal(days)) {
                    n = 0;
                }

                var _loop = function _loop(i) {
                    var j = i === 0 ? 0 : 1;
                    var time = _this.createTime(curDate, j);
                    if (_this.normal) {
                        time = compare(time, dataArray);
                        console.log('cac', time);
                    }
                    var str = null;
                    if (i === n) {
                        str = key;
                        var result = time + " " + str + " " + "0.5天";
                        dataArray.push(result.split(" "));
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

            function compare(date, arr1) {
                //对比与节假日重叠
                var arr = [];
                for (var i = 0; i < arr1.length; i++) {
                    arr.push(arr1[i][0]);
                }
                console.log(arr);
                return recursion(date, arr);

                function recursion(value, arr) {
                    if (that.holiday.indexOf(value) > -1 || arr.indexOf(value) > -1) {
                        console.log('inV', value);
                        var plus = that.createTime(that.formatDate(value), 1);
                        pivot++;
                        console.log('plus', plus);
                        return recursion(plus, arr);
                    }
                    console.log('va', value);
                    return value;
                }
            }

            function updata() {
                var target = $(that.config.triggerBtn);
                var value = Number(target.val());
                var curV = that.validty(value);
                that.dataCache.days = curV;
            }
        },
        createTime: function createTime(curDate, j) {
            curDate.setDate(curDate.getDate() + j);
            var year = curDate.getFullYear();
            var month = curDate.getMonth() + 1;
            var targetDate = curDate.getDate();
            var time = year + '-' + month + '-' + targetDate;
            return time;
        },
        formatDate: function formatDate(date) {
            var form = date.replace(/-/g, "/");
            var curDate = new Date(form);
            return curDate;
        },
        isDecimal: function isDecimal(num) {
            //判断是否是小数
            var str = num.toString();
            var s = str.indexOf('.') > -1 ? true : false;
            return s;
        },
        eventTarget: function eventTarget(e) {
            e = e || window.event;
            var target = $(e.target) || $(e.srcElement);
            return target;
        },
        render: function render(arr) {
            if (!arr) return;
            var wrap = $(this.config.showArea).get(0);
            var str = '';
            for (var i = 0; i < arr.length; i++) {
                var content = arr[i].join(" ");
                str += this.view.input(content);
            }
            wrap.innerHTML = str;
        }
    };
    DataSelect._default_ = {
        view: {
            input: function input(c) {
                return '<span class="showItem">' + c + '</span>';
            }
        },
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
    window.dataSelect = function (period, days, normal) {
        return new DataSelect(period, days, normal);
    };
})(jQuery);