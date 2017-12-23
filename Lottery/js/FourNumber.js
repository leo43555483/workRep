!(function($) {
    window.Flottery = function(u, a, ex) {
        if (typeof(a) !== 'number') alert('参数为数字')
        const _Llimit_ = u ? 0 : 1; //下限
        const range = a || 700; //上限
        const _distance = 265; //每个字在垂直方向的距离
        const _k = 30; //总长度系数
        const _delay = 300;
        let basicTime = 4000;
        let interval = 1000;
        let existed = ex || [];
        let Onum = $(".num");
        let run = false; //开关节流器
        let clicked = true;
        let wrap = $('#js-infor');
        let disable = false;
        let obj = {
            existed: [],
            winner: [],
            pass:[],
            getResult: function() {
                if (run || clicked) return
                clicked = true;
                let c = this.existed.pop();
                let number = c['num'];
                c['status'] = '出席';
                this.winner.push(c);
                this.existed.push(c);
                render();

                function render() {
                    let ele = `<tr class="winItem">
                                   <td class="winTitle">获奖号码</td> 
                                   <td class="winNumber">${number}</td>
                              </tr>`;

                    wrap.append($(ele));
                }

                console.log(this.winner)
                console.log(this.existed)
                return {
                    winner: this.winner,
                    existed: this.existed
                }
            },
            passNumber:function(){
                if (run || clicked) return
                clicked = true;
                let c = this.existed[this.existed.length-1];
                let number = c['num'];
                this.pass.push(number);
                render();
                return this.pass
                function render(){
                    let ele = `<tr class="winItem">
                                   <td class="winTitle">缺席号码</td> 
                                   <td class="winNumber">${number}</td>
                              </tr>`;
                   $("#js-passInfor").append($(ele));
                }
            }
        }
        init();
        return obj

        function init() {
            $(".num").css('backgroundPositionY', 0);
            $("#js-getNum").on("click", begin);
            $("#js-toggle").click(toggleBtn);

            $(document).on("keyup", function(e) {
                if (e.keyCode === 13 && !disable) begin();
            })
        }

        function begin() {
            if (run) return
            run = true;
            clicked = false;
            disable = !disable;
            $("#js-getNum").hide();
            let lucky = (getNumber() + '').split("");
            let final = {
                num: 0,
                status: ''
            };
            playAudio();
            play(lucky);
            final['num'] = lucky.join("") * 1;
            final['status'] = '未出席';
            obj.existed.push(final);

            function playAudio() {
                let audio = $("#js-audio").get(0);
                if (audio !== null) {
                    audio.currentTime = 0;
                    audio.play();
                }
            }
        }

        function play(lucky) {
            let totalL = _k * _distance;
            let index = (_Llimit_ === 0 && range === 9) ? 0 : 4 - lucky.length;
            let j = 0;
            for (let i = 0; i < Onum.length; i++) {
                let ele = $(Onum[i]);
                if (i >= index) {
                    let k = lucky[j];
                    setTimeout(function() {
                        animate(i, null, k);
                    }, i * _delay)
                    j++;
                } else {
                    setTimeout(function() {
                        animate(i, totalL, null);
                    }, i * _delay)

                }
            }

            function animate(i, z, k) {
                let dist = z || totalL - (k * _distance);
                let ele = $(Onum[i]);
                ele.animate({
                    backgroundPositionY: dist
                }, {
                    duration: basicTime + i * interval,
                    easing: "easeInOutCirc",
                    complete: function() {
                        ele.css({
                            backgroundPositionY: (k * _distance) * -1
                        })
                        if (i === Onum.length - 1) {
                            run = false;
                        }
                    }
                });
            }
        }

        function isPresent(date) {
            obj.winner.push(date);
        }

        function getNumber() {
            let result = parseInt(Math.random() * (range - _Llimit_ + 1) + _Llimit_);
            result = isExist(result);
            return result

            function isExist(val) {
                if (existed.indexOf(val) < 0) {
                    existed.push(result);
                    return val;
                }
                if (existed.indexOf(val) > -1) return getNumber();
            }
        }
        function toggleBtn() {
                let action = $("#js-getNum");
                action.show();
                disable = !disable;
            }
    }
}(jQuery));