<template>
	<view class="movable" :style="{'--outerW': outerW+'px'}">
		<view class="movableArea" :style="{'--outerW': outerW+'px'}"></view>
		<view class="movableView"
				@touchstart="onTouchstart($event)" 
				@touchmove="onTouchmove($event)"
				@touchend="onTouchend" 
				@touchcancel="onTouchend"
				:style="{left: left+'px', top: top+'px', '--innerW': innerW+'px', '--margin': margin+'px'}"
		></view>
	</view>
</template>

<script>
	export default {
		props: {
			innerRadius: {
				type: Number,
				default: 80
			},
			outerRadius: {
				type: Number,
				default: 200
			}
		},
		data() {
			return {
				innerW: 0,	// 内圈半径
				outerW: 0,	// 外圈半径
				margin: 0,	// 内圈移动到外圈中心点
				left: 0,
				top: 0,
				startx: 0,	// 按下时的位置
				starty: 0,	// 按下时的位置
				compareWidth: 0,	// 移动的半径边距
				touchNum : 0,	// 点击次数
				moveTimer: null,
				clickTimer: null,
			}
		},
		mounted() {
			this.innerW = this.innerRadius
			this.outerW = this.outerRadius
			// 内圈初始化移动到外圈中心点
			this.margin = this.outerW / 2 - this.innerW / 2
			// 内圈移动到外圈边距触发事件的边界
			this.compareWidth = this.outerW / 2 - this.innerW / 2 + 10
		},
		methods: {
			onTouchstart(e){
				this.startx = e.touches[0].clientX;
				this.starty = e.touches[0].clientY;
				this.touchNum ++
				this.clickTimer = setTimeout(()=>{
					clearTimeout(this.clickTimer)
					this.clickTimer = null
					if(this.touchNum == 1){
						console.log('单击')
					}
					if(this.touchNum >= 2){
						console.log('双击')
					}
					this.touchNum = 0
				}, 250)
			},
			onTouchend(){
				console.log('松开')
				this.x = 0
				this.y = 0
				this.left = 0
				this.top = 0
				clearTimeout(this.moveTimer)
				this.moveTimer = null
			},
			changeDir(state) {
				//按顺时针
				switch(state){
					case 1:
					  console.log("上")
					  break;
					case 2:
					  console.log("右上")
					  break;
					case 3:
					  console.log("右")
					  break;	
					case 4:
					  console.log("右下")
					  break;
					case 5:
					  console.log("下")
					  break;	  
					case 6:
					  console.log("左下")
					  break;	  
					case 7:
					  console.log("左")
					  break;	  
					case 8:
					  console.log("左上")
					  break;	  						  
				}
			},
			onTouchmove(e){
				if(this.moveTimer) return
				let templeft = (e.touches[0].clientX - this.startx) * 1;
				let temptop = (e.touches[0].clientY - this.starty) * 1;
				let powV = Math.sqrt(Math.pow(templeft, 2) + Math.pow(temptop, 2))
				if (powV >= this.compareWidth) {
					let angle = Math.atan(Math.abs(templeft) / Math.abs(temptop));
					let rad = (180 * angle) / Math.PI;
					let cx = 0;
					let cy = 0;
					let r = this.compareWidth;
					//第一象限(右上)
					if (this.startx < e.touches[0].clientX && this.starty > e.touches[0].clientY) {
						cx = Math.cos(angle) * -r;
						cy = Math.sin(angle) * r;
					}
					//第三象限(左下)
					if (this.startx > e.touches[0].clientX && this.starty < e.touches[0].clientY) {
						cx = Math.cos(angle) * r;
						cy = Math.sin(angle) * -r;
					}
					//第四象限(右下)
					if (this.startx < e.touches[0].clientX && this.starty < e.touches[0].clientY) {
						cx = Math.cos(angle) * r;
						cy = Math.sin(angle) * r;
					}
					//第二象限(左上)
					if (this.startx >= e.touches[0].clientX && this.starty >= e.touches[0].clientY) {
						cx = Math.cos(angle) * -r;
						cy = Math.sin(angle) * -r;
					}
					//上
					if (e.touches[0].clientY - this.starty < 0 && rad < 22.5) {
						this.changeDir(1);
					}
					//右上
					if (e.touches[0].clientY - this.starty < 0 && rad >= 22.5 && rad < 67.5 && e.touches[0].clientX - this.startx > 0) {
						this.changeDir(2);
					}
					//右
					if (e.touches[0].clientX - this.startx > 0 && rad >= 67.5) {
						this.changeDir(3);
					}
					//右下
					if (e.touches[0].clientY - this.starty > 0 && rad >= 22.5 && rad < 67.5 && e.touches[0].clientX - this.startx > 0) {
						this.changeDir(4);
					}
					//下
					if (e.touches[0].clientY - this.starty > 0 && rad < 22.5) {
						this.changeDir(5);
					}
					//左下
					if (e.touches[0].clientY - this.starty > 0 && rad >= 22.5 && rad < 67.5 && e.touches[0].clientX - this.startx < 0) {
						this.changeDir(6);
					}
					//左
					if (e.touches[0].clientX - this.startx < 0 && rad >= 67.5) {
						this.changeDir(7);
					}
					//左上
					if (e.touches[0].clientY - this.starty < 0 && rad >= 22.5 && rad < 67.5 && e.touches[0].clientX - this.startx < 0) {
						this.changeDir(8);
					}
					templeft = r / powV * templeft;
					temptop = r / powV * temptop;
				}
				this.left = templeft
				this.top = temptop
				// 节流
				this.moveTimer = setTimeout(()=>{
					clearTimeout(this.moveTimer)
					this.moveTimer = null
				}, 50)
			},
		}
	}
</script>

<style>
	.movable{
	 	position: relative;
		width: var(--outerW);
		height: var(--outerW);
	}
	.movableArea{
	 	position: relative;
	}
	.movableArea::after{
		content: '';
		position: absolute;
		top: -1px;
		left: -1px;
		z-index: 100;
	 	width: var(--outerW);
	 	height: var(--outerW);
	 	border-radius: var(--outerW);
	 	border: 2px solid #cccccc;
		box-sizing: border-box;
	}
	.movableView{
		position: absolute;
		z-index: 101;
		top: 0;
		left: 0;
		width: var(--innerW);
		height: var(--innerW);
		margin-top: var(--margin);
		margin-left: var(--margin);
		border-radius: var(--innerW);
		background-color: #999999;
	}
</style>