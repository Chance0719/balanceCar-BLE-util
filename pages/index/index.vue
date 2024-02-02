<template>
	<view>
		<uni-section title="蓝牙" type="line">
			<view class="example-body">
				<button class="button1" type="primary" @click="showDrawer('showLeft')">
					<text class="word-btn-white">连接蓝牙</text>
				</button>
			</view>
		</uni-section>
		<uni-section title="PID调试" type="line">
			<span style="margin-left: 20px;color:darkblue">kp：{{kp}}&nbsp;&nbsp;&nbsp;ki：{{ki}}&nbsp;&nbsp;&nbsp;kd：{{kd}}</span>
			<uni-row :gutter="20">
				<uni-col :span="8" :offset="4">
					<button class="button1" @longpress="pidLongpress('kp')" @click="sendKp('+')" type="primary">kp+</button>
				</uni-col>
				<uni-col :span="8">
					<button class="button1" @longpress="pidLongpress('kp')" @click="sendKp('-')" type="primary">kp-</button>
				</uni-col>
			</uni-row>
			<uni-row :gutter="20">
				<uni-col :span="8" :offset="4">
					<button class="button1" @longpress="pidLongpress('ki')" @click="sendKi('+')" type="primary">ki+</button>
				</uni-col>
				<uni-col :span="8">
					<button class="button1" @longpress="pidLongpress('ki')" @click="sendKi('-')" type="primary">ki-</button>
				</uni-col>
			</uni-row>
			<uni-row :gutter="20">
				<uni-col :span="8" :offset="4">
					<button class="button1" @longpress="pidLongpress('kd')" @click="sendKd('+')" type="primary">kd+</button>
				</uni-col>
				<uni-col :span="8">
					<button class="button1" @longpress="pidLongpress('kd')" @click="sendKd('-')" type="primary">kd-</button>
				</uni-col>
			</uni-row>
			<uni-row :gutter="20">
				<uni-col :span="8">
					<button class="button1" @click="getPidData()" type="primary">读取缓存</button>
				</uni-col>
				<uni-col :span="8">
					<button class="button1" @click="resetPidData()" type="primary">重置参数</button>
				</uni-col>
				<uni-col :span="8">
					<button class="button1" @click="openSendStrChange()" type="primary">摇杆设置</button>
				</uni-col>
			</uni-row>
		</uni-section>
		<uni-section title="操控" type="line"> 
			<span style="margin-left: 20px;">已连接设备：{{deviceName}}</span>
			<view class="wrapper">
			        <view class="rocker">
			            <rocker :front1="front" :back1="back" :left1="left" :right1="right" :pSend="send"></rocker>
			        </view>
			</view>
		</uni-section>
		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" background-color="#fff">
				<uni-section title="设置" type="line">
					<view>
						<input style="border: 2px solid dodgerblue; margin: 20rpx;border-radius:6px;" type="digit" v-model="accuracyNum"/>
						<button class="button1" type="primary" @click="changeAccuracy">
							<text class="word-btn-white">确定</text>
						</button>
					</view>
				</uni-section>
			</uni-popup>
		</view>
		<view>
			<!-- 设置摇杆的弹窗 -->
			<uni-popup ref="popup2" background-color="#fff" :is-mask-click="false">
				<uni-section title="设置" type="line" style="margin-left: 10px;margin-right: 20px;">
					<view style="margin-left: 10px;margin-bottom: 10px;"> 
						<text style="color: red;">设置摇杆不同方向发送的字符串</text>
					</view>
					<uni-forms-item label="前" style="margin-left: 10px;">
						<uni-easyinput class="drt" v-model="front" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="后" style="margin-left: 10px;">
						<uni-easyinput class="drt" v-model="back" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="左" style="margin-left: 10px;">
						<uni-easyinput class="drt" v-model="left" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="右" style="margin-left: 10px;">
						<uni-easyinput class="drt" v-model="right" placeholder="请输入" />
					</uni-forms-item>
					<button class="button1" type="primary" @click="changeDrt">
						<text class="word-btn-white">确定</text>
					</button>				
				</uni-section>
			</uni-popup>
		</view>
		<uni-drawer ref="showLeft" mode="left" :width="320">
			<!-- <view class="close">
				<button @click="closeDrawer('showLeft')"><text class="word-btn-white">关闭Drawer</text></button>
			</view> -->
			<view style="background-color: aliceblue;">
			    <scroll-view
			        scroll-y
			        class="box"
			    >
				<view v-if="showList">
			        <view  class="item" v-for="item in blueDeviceList" @click="connect(item)">
			            <view>
			                <text>id: {{ item.deviceId }}</text>    
			            </view>
			            <view>
			                <text>name: {{ item.name }}</text>    
			            </view>
			        </view>
				</view>
					<view v-if="!showList" class="msg_txt">
					    已连接的设备：{{ deviceName }}
					</view>
			    </scroll-view>
			
			    <button class="button1" @click="initBlue">1 初始化蓝牙</button>
			
			    <button class="button1" @click="discovery">2 搜索附近蓝牙设备</button>
			
			    <button class="button1" @click="getServices">3 获取蓝牙服务</button>
			
			    <button class="button1" @click="getCharacteristics">4 获取特征值</button>
			
			    <button class="button1" @click="notify">5 开启消息监听</button>
				<input style="border: 2px solid dodgerblue; margin: 20rpx;border-radius:6px;" v-model="param"/>
			    <button class="button1" @click="send('')">6 发送数据</button>
				<input style="border: 2px solid dodgerblue; margin: 20rpx;border-radius:6px;" v-model="param2" disabled=true/>
			    <button class="button1" @click="read">7 读取数据</button>
			
			    <view class="msg_x">
			        <view class="msg_txt">
			            监听到的内容：{{ message }}
			        </view>
			        <view class="msg_hex">
			            监听到的内容（十六进制）：{{ messageHex }}
			        </view>    
			    </view>    
			
			</view>
		</uni-drawer>
	</view>
</template>
<script setup>
import { ref } from 'vue'
import rocker from "../components/rocker/rocker.vue"
import { onMounted } from 'vue'

//  搜索到的蓝牙设备列表
const blueDeviceList = ref([])
const param = ref('')
const param2 = ref('')
const showList = ref(true)
const deviceName = ref("未连接")
const innerRadius = ref(60)
const outerRadius = ref(180)
const kp = ref(1)
const ki = ref(1)
const kd = ref(1)
const popup = ref()
const popup2 = ref()
const accuracyNum = ref()
const nowSetObj = ref()
const kpAcr = ref(1)
const kiAcr = ref(1)
const kdAcr = ref(1)
const front = ref('F')
const back = ref('B')
const left = ref('L')
const right = ref('R')

onMounted(()=>{
	getPidData()
})

// 打开设置摇杆的窗口
function openSendStrChange() {
	popup2.value.open()
}

function changeDrt() {
	setStorage({key:'front',value:front.value})
	setStorage({key:'back',value:back.value})
	setStorage({key:'left',value:left.value})
	setStorage({key:'right',value:right.value})
	popup2.value.close()
}

//调节跨度修改
function pidLongpress(res) {
	nowSetObj.value = res
	if(res === 'kp') {
		accuracyNum.value = kpAcr.value
	}
	if(res === 'ki') {
		accuracyNum.value = kiAcr.value
	}
	if(res === 'kd') {
		accuracyNum.value = kdAcr.value
	}
	setTimeout(()=>{
		console.log("=========触发了长按=========")
		popup.value.open()
	},100)
}

//设置调节精度
function changeAccuracy() {
	if(nowSetObj.value === 'kp') {
		kpAcr.value = accuracyNum.value
		setStorage({key:'kpAcr',value:kpAcr.value})
	}
	if(nowSetObj.value === 'ki') {
		kiAcr.value = accuracyNum.value
		setStorage({key:'kiAcr',value:kiAcr.value})
	}
	if(nowSetObj.value === 'kd') {
		kdAcr.value = accuracyNum.value
		setStorage({key:'kdAcr',value:kdAcr.value})
	}
	popup.value.close()
}

//调节kp
function sendKp(res) {
	if(res === '+') {
		kp.value += Number(kpAcr.value)
		kp.value = Number(kp.value.toFixed(1))
	} else {
		kp.value -= Number(kpAcr.value)
		kp.value = Number(kp.value.toFixed(1))
	}
	if(kp.value <= 0) {
		kp.value = 0
	}
	setStorage({
		key: 'pid_kp',
		value: kp.value
	})
	//蓝牙发送数据
	send('kp:' + kp.value)
}

//调节ki
function sendKi(res) {
	if(res === '+') {
		ki.value += Number(kiAcr.value)
		ki.value = Number(ki.value.toFixed(1))
	} else {
		ki.value -= Number(kiAcr.value)
		ki.value = Number(ki.value.toFixed(1))
	}
	if(ki.value <= 0) {
		ki.value = 0
	}
	setStorage({
		key: 'pid_ki',
		value: ki.value
	})
	//蓝牙发送数据
	send('ki:' + ki.value)
}

//调节kd
function sendKd(res) {
	if(res === '+') {
		kd.value += Number(kdAcr.value)
		kd.value = Number(kd.value.toFixed(1))
	} else {
		kd.value -= Number(kdAcr.value)
		kd.value = Number(kd.value.toFixed(1))
	}
	if(kd.value <= 0) {
		kd.value = 0
	}
	setStorage({
		key: 'pid_kd',
		value: kd.value
	})
	//蓝牙发送数据
	send('kd:' + kd.value)
}

//存储数据到缓存
function setStorage(res) {
	uni.setStorage({
		key: res.key,
		data: res.value,
		success: function () {
			console.log('success');
			console.log(res.key + ':' + res.value);
		}
	});
}

//重置参数
function resetPidData() {
	setStorage({
		key: 'pid_kp',
		value: 1
	})
	setStorage({
		key: 'pid_ki',
		value: 1
	})
	setStorage({
		key: 'pid_kd',
		value: 1
	})
	setStorage({
		key: 'kpAcr',
		value: 1
	})
	setStorage({
		key: 'kiAcr',
		value: 1
	})
	setStorage({
		key: 'kdAcr',
		value: 1
	})
	setStorage({
		key: 'front',
		value: 'F'
	})
	setStorage({
		key: 'back',
		value: 'B'
	})
	setStorage({
		key: 'left',
		value: 'L'
	})
	setStorage({
		key: 'right',
		value: 'R'
	})
	kp.value = 1
	ki.value = 1
	kd.value = 1
	kpAcr.value = 1
	kiAcr.value = 1
	kdAcr.value = 1
	front.value = 'F'
	back.value = 'B'
	left.value = 'L'
	right.value = 'R'
}

// 从缓存中读取pid数据
function getPidData() {
	console.log('读取数据')
	try {
		const value = uni.getStorageSync('pid_kp');
		if (value) {
			kp.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('pid_ki');
		if (value) {
			ki.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('pid_kd');
		if (value) {
			kd.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	
	
	try {
		const value = uni.getStorageSync('kpAcr');
		if (value) {
			kpAcr.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('kiAcr');
		if (value) {
			kiAcr.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('kdAcr');
		if (value) {
			kdAcr.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('front');
		if (value) {
			front.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('back');
		if (value) {
			back.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('left');
		if (value) {
			left.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
	try {
		const value = uni.getStorageSync('right');
		if (value) {
			right.value = value
			console.log(value);
		}
	} catch (e) {
		console.log(e);
	}
}

// 【1】初始化蓝牙
function initBlue() {
    uni.openBluetoothAdapter({
        success(res) {
			uni.showToast({
			    title: '初始化蓝牙成功'
			})
            console.log('初始化蓝牙成功')
            console.log(res)
        },
        fail(err) {
			uni.showToast({
			    title: '初始化蓝牙失败',
				icon: 'error'
			})
            console.log('初始化蓝牙失败')
            console.error(err)
        }
    })
}

// 【2】开始搜寻附近设备
function discovery() {
	blueDeviceList.value.splice(0, blueDeviceList.value.length)
	showList.value = true
    uni.startBluetoothDevicesDiscovery({
        success(res) {
            console.log('开始搜索')
            // 开启监听回调
            uni.onBluetoothDeviceFound(found)
        },
        fail(err) {
			uni.showToast({
			    title: '请先初始化蓝牙',
				icon: 'error'
			})
            console.log('搜索失败')
            console.error(err)
        }
    })
}

// 【3】找到新设备就触发该方法
function found(res) {
    console.log(res)
	if(res.devices[0].name != "") {
		blueDeviceList.value.push(res.devices[0])
	}
}

// 蓝牙设备的id
const deviceId = ref('')

// 【4】连接设备
function connect(data) {
    console.log(data)

    deviceId.value = data.deviceId // 将获取到的设备ID存起来

    uni.createBLEConnection({
        deviceId: deviceId.value,
        success(res) {
            console.log('连接成功')
            console.log(res)
            // 停止搜索
            stopDiscovery()
            uni.showToast({
                title: '连接成功'
            })
			showList.value = false
			deviceName.value = data.name
        },
        fail(err) {
            console.log('连接失败')
            console.error(err)
            uni.showToast({
                title: '连接失败',
                icon: 'error'
            })
        }
    })
}

// 【5】停止搜索
function stopDiscovery() {
    uni.stopBluetoothDevicesDiscovery({
        success(res) {
            console.log('停止成功')
            console.log(res)
        },
        fail(err) {
            console.log('停止失败')
            console.error(err)
        }
    })
}

// 【6】获取服务
function getServices() {
    // 如果是自动链接的话，uni.getBLEDeviceServices方法建议使用setTimeout延迟1秒后再执行
    uni.getBLEDeviceServices({
        deviceId: deviceId.value,
        success(res) {
            console.log(res) // 可以在res里判断有没有硬件佬给你的服务
            uni.showToast({
                title: '获取服务成功'
            })
        },
        fail(err) {
            console.error(err)
            uni.showToast({
                title: '获取服务失败',
                icon: 'error'
            })
        }
    })
}

// 硬件提供的服务id，开发中需要问硬件佬获取该id
const serviceId = ref('4FAFC201-1FB5-459E-8FCC-C5C9C331914B')
// const serviceId = ref('0000FFE0-0000-1000-8000-00805F9B34FB')

// 【7】获取特征值
function getCharacteristics() {
    // 如果是自动链接的话，uni.getBLEDeviceCharacteristics方法建议使用setTimeout延迟1秒后再执行
    uni.getBLEDeviceCharacteristics({
        deviceId: deviceId.value,
        serviceId: serviceId.value,
        success(res) {
            console.log(res) // 可以在此判断特征值是否支持读写等操作，特征值其实也需要提前向硬件佬索取的
            uni.showToast({
                title: '获取特征值成功'
            })
        },
        fail(err) {
			console.log(deviceId.value)
			console.log(serviceId.value)
            console.error(err)
            uni.showToast({
                title: '获取特征值失败' + err,
                icon: 'error'
            })
        }
    })
}

const characteristicId = ref('BEB5483E-36E1-4688-B7F5-EA07361B26A8')
// const characteristicId = ref('0000FFE1-0000-1000-8000-00805F9B34FB')

// 【8】开启消息监听
function notify() {
    uni.notifyBLECharacteristicValueChange({
        deviceId: deviceId.value, // 设备id
        serviceId: serviceId.value, // 监听指定的服务
        characteristicId: characteristicId.value, // 监听对应的特征值
        success(res) {
            console.log(res)
            listenValueChange()
            uni.showToast({
                title: '已开启监听'
            })
        },
        fail(err) {
            console.error(err)
            uni.showToast({
                title: '监听失败',
                icon: 'error'
            })
        }
    })
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('')
}

// 将16进制的内容转成我们看得懂的字符串内容
function hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
            alert("存在非法字符!");
            return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
            curCharCode = parseInt(rawStr.substr(i, 2), 16);
            resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
}

// 监听到的内容
const message = ref('')
const messageHex = ref('') // 十六进制

// 【9】监听消息变化
function listenValueChange() {
    uni.onBLECharacteristicValueChange(res => {
        console.log(res)
        let resHex = ab2hex(res.value)
        console.log(resHex)
        messageHex.value = resHex
        let result = hexCharCodeToStr(resHex)
        console.log(String(result))
        message.value = String(result)
    })
}

// 【10】发送数据
function send(res) {
    // 向蓝牙设备发送一个0x00的16进制数据
    let msg = res ? res : param.value
	console.log(msg)
    const buffer = new ArrayBuffer(msg.length)
    const dataView = new DataView(buffer)
    // dataView.setUint8(0, 0)

    for (var i = 0; i < msg.length; i++) {
      dataView.setUint8(i, msg.charAt(i).charCodeAt())
    }

    uni.writeBLECharacteristicValue({
      deviceId: deviceId.value,
      serviceId: serviceId.value,
      characteristicId: characteristicId.value,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
            uni.showToast({
                title: 'write发送成功'
            })
      },
        fail(err) {
            console.error(err)
            uni.showToast({
                title: 'write发送失败',
                icon: 'error'
            })
        }
    })
}

// 【11】读取数据
function read() {
    uni.readBLECharacteristicValue({
        deviceId: deviceId.value,
        serviceId: serviceId.value,
        characteristicId: characteristicId.value,
        success(res) {
            console.log(res)
            uni.showToast({
                title: 'read发送成功'
            })
			uni.onBLECharacteristicValueChange(res => {
			        // 结果
			        console.log(res)
			
			        // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
			        let resHex = ab2hex(res.value)
			        console.log(resHex)
			
			        // 最后将16进制转换为ascii码，就能看到对应的结果
			        let result = hexCharCodeToStr(resHex)
					param2.value = result
			        console.log(result)
			    })
        },
        fail(err) {
            console.error(err)
            uni.showToast({
                title: 'read发送失败',
                icon: 'error'
            })
        }
    })
}
</script>
<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			confirm() {},
			// 打开窗口
			showDrawer(e) {
				this.$refs[e].open()
			},
			// 关闭窗口
			closeDrawer(e) {
				this.$refs[e].close()
			}
		},
		onNavigationBarButtonTap(e) {
			if (this.showLeft) {
				this.$refs.showLeft.close()
			} else {
				this.$refs.showLeft.open()
			}
		},
		// app端拦截返回事件 ，仅app端生效
		onBackPress() {
			if (this.showRight || this.showLeft) {
				this.$refs.showLeft.close()
				this.$refs.showRight.close()
				return true
			}
		}
	}
</script>

<style lang="scss">
.box {
    width: 93%;
    height: 350rpx;
    box-sizing: border-box;
    margin: 20rpx auto 20rpx;
    border: 2px solid dodgerblue;
	border-radius:6px;
}
.item {
    box-sizing: border-box;
    padding: 10rpx;
    border-bottom: 1px solid #ccc;
}
.button1 {
    margin-bottom: 20rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
}

.msg_x {
    border: 2px solid seagreen;
    width: 93%;
    margin: 20rpx auto;
    box-sizing: border-box;
    padding: 20rpx;
	border-radius:6px;
}

.msg_x .msg_txt {
    margin-bottom: 20rpx;
}
.example-body {
	padding: 10px;
}
.scroll-view {
	/* #ifndef APP-NVUE */
	width: 100%;
	height: 100%;
	/* #endif */
	flex:1
}
// 处理抽屉内容滚动
.scroll-view-box {
	flex: 1;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}
.info {
	padding: 15px;
	color: #666;
}

.info-text {
	font-size: 14px;
	color: #666;
}
.info-content {
	padding: 5px 15px;
}
.close {
	padding: 10px;
}
.drt {
	margin-right: 20rpx;
}
.wrapper{
        position: relative;
        width: 100%;
        .rocker, .rocker-nvue{
            position: relative;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 20px 0;
            margin-bottom: 20px;
            h3{
                margin: 20px 0;
            }
        }
    }
</style>

