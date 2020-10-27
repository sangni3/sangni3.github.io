
        var rotateVal = 0 // 旋转角度
        var InterVal // 定时器
        var audio = document.getElementById("audio")
        audio.addEventListener("play",function () {
            clearInterval(InterVal)
            rotate()
            document.getElementById('icon1').style.transform='rotate(30deg)'
        })
        audio.addEventListener('pause',function (){
            clearInterval(InterVal)
            document.getElementById('icon1').style.transform='rotate(0deg)'
        })
        // 设置定时器
        function rotate () {
            InterVal = setInterval(function () {
                var img = document.getElementById('icon2')
                rotateVal += 1
                // 设置旋转属性(顺时针)
                img.style.transform = 'rotate(' + rotateVal + 'deg)'
                // 设置旋转时的动画  匀速0.1s
                img.style.transition = '0.1s linear'
            }, 100)
        }
