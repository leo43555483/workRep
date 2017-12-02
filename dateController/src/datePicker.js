(function($) {
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
        init: function() {
            var trigger = $(this.config.triggerBtn);
            let dataInput = $(this.config.dataInput);
            let wrap = $(this.config.dateWrap);
            let that = this;
            this.es5Method();
            dataInput.on('focus', facous);
            if (!this.editable) {
                this.dataCache.days = this.days;
                trigger.val(this.days);
                trigger.attr("readonly", "true");
            }else{
                this.dataCache.days = this.days;
                trigger.val(this.days);
            }
            $([window, document.body]).click(function(e) {
                e.stopPropagation();
                let target = that.eventTarget(e);
                let id = target.attr("id");
                let condition = that.clickOut(target);
                if (condition) {
                    //最终数据
                    let data = that.handle();
                    if(data === "" || !data) return
                    that.render(data);
                    that.result = data;
                    console.log('result',that.result)
                }

            })
            this.ele.change(startChange);
            //起始时间框获取焦点回调
            function facous() { 
                if (!that.period) {
                    $(that.config.noon).hide() && $(that.config.afternoon).hide();
                }
                wrap.on('click', function(e) {
                    let target = that.eventTarget(e);
                    if (target.attr("id") === that.config.dateWrap.slice(1)) return
                    if (that.dataCache.checked) {
                        let checked = that.dataCache.checked;
                        checked.removeClass('current');
                        target.addClass('current');
                        that.dataCache.checked = target;
                    } else {
                        target.addClass('current');
                        that.dataCache.checked = target;
                    }
                })
            }

            function startChange(e) {
                let target = that.eventTarget(e);
                if (target.attr("id") === that.config.dataInput.slice(1)) {
                    that.dataCache.start = target.val();
                }
            }
        },
        //判断鼠标是否点击body
        clickOut: function(value) { 
            let arr = this.config.idFilter;
            let pivot = true;
            for (let i = 0; i < arr.length; i++) {
                if ($(arr[i]).attr("id") === value.attr("id")) {
                    pivot = false;
                    break
                } else {
                    continue
                }
            }
            return pivot
        },
        thorwInfo: function() {
            alert(this.config.throwInfo);
            $(this.config.triggerBtn).val("").focus();
        },
        validty: function(n) {
            if (this.isDecimal(n)) {
                if (!this.period) {
                    alert('请假天数必须为整日');
                    return
                }
                let str = n.toString();
                let arr = str.split(".");
                if (parseInt(arr[0]) < 0 || parseInt(arr[1]) !== 5) {
                    console.log('0',arr[1])
                    console.log('1',typeof arr[1])
                    console.log('err')
                    this.thorwInfo();
                    return
                }
                return n
            }else if(n < 0){
                this.thorwInfo();
                return
            }
            return n
        },
        handle: function() {
            let date = this.dataCache.start;
            let period = this.dataCache.checked;
            let that = this;
            let arr = null;
            let checkResult = null;
            let pivot = 0; 
            if (date === "") return
            updata();
            if (date) arr = buildArry.call(that, date);

            return arr

            function buildArry(date) {
                let days = parseFloat(this.dataCache.days);
                let len = Math.ceil(days);
                let dataArray = [];
                let n = null;
                let k = null;
                let key = $(this.dataCache.checked).text();
                let curDate = this.formatDate(date);
                if (this.isDecimal(days)) {
                    n = 0;
                }
                if (!this.isDecimal(days) && key === "下午") {
                    n = 0;
                    len += 1;
                    k = len;
                }
                for (let i = 0; i < len; i++) {
                    let j = i === 0 ? 0 : 1;
                    let time = this.createTime(curDate, j);
                    if (this.normal) {
                        time = compare(time,dataArray);
                    }
                    let str = null;
                    if (i === n) {
                        str = key;
                        let result = time + " " + str + " " + "0.5天";
                        dataArray.push(result.split(" "));
                    } else if(i === (k-1)){
                        let result = time + " " + "上午" + " " + "0.5天";
                        dataArray.push(result.split(" "));
                    }else{
                        $(that.config.info).each(function(i,item) {
                            let result = time + " " + item + " " + "0.5天";
                            dataArray.push(result.split(" "));
                        })
                    }
                }
                dataArray.push(days);
                return dataArray
            }
            //对比是否与节假日重叠
            function compare(value,arr1) { 
                let arr =[];     //读取当前已存入的日期以便判断日期是否重复
                let date = value;
                let result = null;
                let sWork = that.workDay;
                let sHoliday = that.holiday;
                for(let i=0;i<arr1.length;i++){
                    arr.push(arr1[i][0])
                }
                
                return recursion(date,arr);

                function recursion(value,arr) {
                    if(isWeekend(value)){
                        if(sWork.indexOf(value)> -1) return value
                        if(!(sWork.indexOf(value)> -1) || arr.indexOf(value) > -1) {
                            let plus = that.createTime(that.formatDate(value), 1);
                            return recursion(plus,arr);
                        }
                    }else{
                        if(sHoliday.indexOf(value) > -1 || arr.indexOf(value) > -1){
                            let plus = that.createTime(that.formatDate(value), 1);
                            return recursion(plus,arr);
                        }
                    }
                    return value
                }
                //判断是否为周某
                function isWeekend(date){
                    let cur = that.formatDate(date);
                    let day = cur.getDay();
                    if(day ===0 || day ===6) return true;
                    return false
                }
            }
            function updata() {
                let target = $(that.config.triggerBtn);
                let value = Number(target.val());
                let curV = that.validty(value);
                that.dataCache.days = curV;
            }
            //判断是否为周末
        },
        createTime: function(curDate, j) {
            curDate.setDate(curDate.getDate() + j);
            let year = curDate.getFullYear();
            let month = curDate.getMonth() + 1;
            let targetDate = curDate.getDate();
            targetDate = targetDate < 10?'0'+targetDate:targetDate;
            let time = year + '-' + month + '-' +targetDate;
            return time
        },
        formatDate: function(date) {
            let form = date.replace(/-/g, "/");
            let curDate = new Date(form);
            return curDate
        },
        //判断是否是小数
        isDecimal: function(num) { 
            let str = num.toString();
            let s = str.indexOf('.') > -1 ? true : false;
            return s
        },
        eventTarget: function(e) {
            e = e || window.event;
            let target = $(e.target) || $(e.srcElement);
            return target
        },
        //渲染dom
        render: function(arr) {
            if (!arr) return
            let wrap = $(this.config.showArea).get(0);
            let str = '';
            for (let i = 0; i < arr.length-1; i++) {
                let content = arr[i].join(" ");
                str += this.view.input(content);

            }
            wrap.innerHTML = str;
        },
        getResult:function(){
          if(this.result !== ""){
            return this.result
          }else{
            console.log('数据空')
          }
        },
        es5Method: function() {
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
    }
    DataSelect._default_ = {
        view: {
            input: function(c) {
                return '<span class="showItem">'+c+'</span>'
            }
        },
        a:true,
        b:0,
        c:true,
        editable:true,
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
    }
    window.dataSelect = function(opt) {
        return new DataSelect(opt);
    };
}(jQuery))