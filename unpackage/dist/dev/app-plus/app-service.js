if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$3 = {
    name: "UniDrawer",
    components: {},
    emits: ["change"],
    props: {
      /**
       * 显示模式（左、右），只在初始化生效
       */
      mode: {
        type: String,
        default: ""
      },
      /**
       * 蒙层显示状态
       */
      mask: {
        type: Boolean,
        default: true
      },
      /**
       * 遮罩是否可点击关闭
       */
      maskClick: {
        type: Boolean,
        default: true
      },
      /**
       * 抽屉宽度
       */
      width: {
        type: Number,
        default: 220
      }
    },
    data() {
      return {
        visibleSync: false,
        showDrawer: false,
        rightMode: false,
        watchTimer: null,
        drawerWidth: 220
      };
    },
    created() {
      this.drawerWidth = this.width;
      this.rightMode = this.mode === "right";
    },
    methods: {
      clear() {
      },
      close(type) {
        if (type === "mask" && !this.maskClick || !this.visibleSync)
          return;
        this._change("showDrawer", "visibleSync", false);
      },
      open() {
        if (this.visibleSync)
          return;
        this._change("visibleSync", "showDrawer", true);
      },
      _change(param1, param2, status) {
        this[param1] = status;
        if (this.watchTimer) {
          clearTimeout(this.watchTimer);
        }
        this.watchTimer = setTimeout(() => {
          this[param2] = status;
          this.$emit("change", status);
        }, status ? 50 : 300);
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.visibleSync ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass([{ "uni-drawer--visible": $data.showDrawer }, "uni-drawer"]),
        onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.clear && $options.clear(...args), ["stop", "prevent"]))
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-drawer__mask", { "uni-drawer__mask--visible": $data.showDrawer && $props.mask }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.close("mask"))
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-drawer__content", { "uni-drawer--right": $data.rightMode, "uni-drawer--left": !$data.rightMode, "uni-drawer__content--visible": $data.showDrawer }]),
            style: vue.normalizeStyle({ width: $data.drawerWidth + "px" })
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      34
      /* CLASS, HYDRATE_EVENTS */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$1], ["__scopeId", "data-v-f7c32d22"], ["__file", "D:/workspace/HbuilderProjects/balanceCar-BLE-util/uni_modules/uni-drawer/components/uni-drawer/uni-drawer.vue"]]);
  const _sfc_main$2 = {
    name: "UniSection",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        required: true,
        default: ""
      },
      titleFontSize: {
        type: String,
        default: "14px"
      },
      titleColor: {
        type: String,
        default: "#333"
      },
      subTitle: {
        type: String,
        default: ""
      },
      subTitleFontSize: {
        type: String,
        default: "12px"
      },
      subTitleColor: {
        type: String,
        default: "#999"
      },
      padding: {
        type: [Boolean, String],
        default: false
      }
    },
    computed: {
      _padding() {
        if (typeof this.padding === "string") {
          return this.padding;
        }
        return this.padding ? "10px" : "";
      }
    },
    watch: {
      title(newVal) {
        if (uni.report && newVal !== "") {
          uni.report("title", newVal);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-section" }, [
      vue.createElementVNode("view", {
        class: "uni-section-header",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
      }, [
        $props.type ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["uni-section-header__decoration", $props.type])
          },
          null,
          2
          /* CLASS */
        )) : vue.renderSlot(_ctx.$slots, "decoration", { key: 1 }, void 0, true),
        vue.createElementVNode("view", { class: "uni-section-header__content" }, [
          vue.createElementVNode(
            "text",
            {
              style: vue.normalizeStyle({ "font-size": $props.titleFontSize, "color": $props.titleColor }),
              class: vue.normalizeClass(["uni-section__content-title", { "distraction": !$props.subTitle }])
            },
            vue.toDisplayString($props.title),
            7
            /* TEXT, CLASS, STYLE */
          ),
          $props.subTitle ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              style: vue.normalizeStyle({ "font-size": $props.subTitleFontSize, "color": $props.subTitleColor }),
              class: "uni-section-header__content-sub"
            },
            vue.toDisplayString($props.subTitle),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "uni-section-header__slot-right" }, [
          vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          class: "uni-section-content",
          style: vue.normalizeStyle({ padding: $options._padding })
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render], ["__scopeId", "data-v-637fd36b"], ["__file", "D:/workspace/HbuilderProjects/balanceCar-BLE-util/uni_modules/uni-section/components/uni-section/uni-section.vue"]]);
  const __default__ = {
    data() {
      return {
        showRight: false,
        showLeft: false
      };
    },
    methods: {
      confirm() {
      },
      // 打开窗口
      showDrawer(e) {
        this.$refs[e].open();
      },
      // 关闭窗口
      closeDrawer(e) {
        this.$refs[e].close();
      },
      // 抽屉状态发生变化触发
      change(e, type) {
        formatAppLog("log", "at pages/index/index.vue:357", (type === "showLeft" ? "左窗口" : "右窗口") + (e ? "打开" : "关闭"));
        this[type] = e;
      }
    },
    onNavigationBarButtonTap(e) {
      if (this.showLeft) {
        this.$refs.showLeft.close();
      } else {
        this.$refs.showLeft.open();
      }
    },
    // app端拦截返回事件 ，仅app端生效
    onBackPress() {
      if (this.showRight || this.showLeft) {
        this.$refs.showLeft.close();
        this.$refs.showRight.close();
        return true;
      }
    }
  };
  const _sfc_main$1 = /* @__PURE__ */ Object.assign(__default__, {
    __name: "index",
    setup(__props) {
      const blueDeviceList = vue.ref([]);
      const param = vue.ref("");
      const param2 = vue.ref("");
      function initBlue() {
        uni.openBluetoothAdapter({
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:68", "初始化蓝牙成功");
            formatAppLog("log", "at pages/index/index.vue:69", res);
          },
          fail(err) {
            formatAppLog("log", "at pages/index/index.vue:72", "初始化蓝牙失败");
            formatAppLog("error", "at pages/index/index.vue:73", err);
          }
        });
      }
      function discovery() {
        blueDeviceList.value.length = 0;
        uni.startBluetoothDevicesDiscovery({
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:83", "开始搜索");
            uni.onBluetoothDeviceFound(found);
          },
          fail(err) {
            formatAppLog("log", "at pages/index/index.vue:88", "搜索失败");
            formatAppLog("error", "at pages/index/index.vue:89", err);
          }
        });
      }
      function found(res) {
        formatAppLog("log", "at pages/index/index.vue:96", res);
        if (res.devices[0].name != "") {
          blueDeviceList.value.push(res.devices[0]);
        }
      }
      const deviceId = vue.ref("");
      function connect(data) {
        formatAppLog("log", "at pages/index/index.vue:107", data);
        deviceId.value = data.deviceId;
        uni.createBLEConnection({
          deviceId: deviceId.value,
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:114", "连接成功");
            formatAppLog("log", "at pages/index/index.vue:115", res);
            stopDiscovery();
            uni.showToast({
              title: "连接成功"
            });
          },
          fail(err) {
            formatAppLog("log", "at pages/index/index.vue:123", "连接失败");
            formatAppLog("error", "at pages/index/index.vue:124", err);
            uni.showToast({
              title: "连接成功",
              icon: "error"
            });
          }
        });
      }
      function stopDiscovery() {
        uni.stopBluetoothDevicesDiscovery({
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:137", "停止成功");
            formatAppLog("log", "at pages/index/index.vue:138", res);
          },
          fail(err) {
            formatAppLog("log", "at pages/index/index.vue:141", "停止失败");
            formatAppLog("error", "at pages/index/index.vue:142", err);
          }
        });
      }
      function getServices() {
        uni.getBLEDeviceServices({
          deviceId: deviceId.value,
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:153", res);
            uni.showToast({
              title: "获取服务成功"
            });
          },
          fail(err) {
            formatAppLog("error", "at pages/index/index.vue:159", err);
            uni.showToast({
              title: "获取服务失败",
              icon: "error"
            });
          }
        });
      }
      const serviceId = vue.ref("4FAFC201-1FB5-459E-8FCC-C5C9C331914B");
      function getCharacteristics() {
        uni.getBLEDeviceCharacteristics({
          deviceId: deviceId.value,
          serviceId: serviceId.value,
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:179", res);
            uni.showToast({
              title: "获取特征值成功"
            });
          },
          fail(err) {
            formatAppLog("log", "at pages/index/index.vue:185", deviceId.value);
            formatAppLog("log", "at pages/index/index.vue:186", serviceId.value);
            formatAppLog("error", "at pages/index/index.vue:187", err);
            uni.showToast({
              title: "获取特征值失败" + err,
              icon: "error"
            });
          }
        });
      }
      const characteristicId = vue.ref("BEB5483E-36E1-4688-B7F5-EA07361B26A8");
      function notify() {
        uni.notifyBLECharacteristicValueChange({
          deviceId: deviceId.value,
          // 设备id
          serviceId: serviceId.value,
          // 监听指定的服务
          characteristicId: characteristicId.value,
          // 监听对应的特征值
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:206", res);
            listenValueChange();
            uni.showToast({
              title: "已开启监听"
            });
          },
          fail(err) {
            formatAppLog("error", "at pages/index/index.vue:213", err);
            uni.showToast({
              title: "监听失败",
              icon: "error"
            });
          }
        });
      }
      function ab2hex(buffer) {
        const hexArr = Array.prototype.map.call(
          new Uint8Array(buffer),
          function(bit) {
            return ("00" + bit.toString(16)).slice(-2);
          }
        );
        return hexArr.join("");
      }
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
      const message = vue.ref("");
      const messageHex = vue.ref("");
      function listenValueChange() {
        uni.onBLECharacteristicValueChange((res) => {
          formatAppLog("log", "at pages/index/index.vue:258", res);
          let resHex = ab2hex(res.value);
          formatAppLog("log", "at pages/index/index.vue:260", resHex);
          messageHex.value = resHex;
          let result = hexCharCodeToStr(resHex);
          formatAppLog("log", "at pages/index/index.vue:263", String(result));
          message.value = String(result);
        });
      }
      function send() {
        let msg = param.value;
        formatAppLog("log", "at pages/index/index.vue:272", msg);
        const buffer = new ArrayBuffer(msg.length);
        const dataView = new DataView(buffer);
        for (var i = 0; i < msg.length; i++) {
          dataView.setUint8(i, msg.charAt(i).charCodeAt());
        }
        uni.writeBLECharacteristicValue({
          deviceId: deviceId.value,
          serviceId: serviceId.value,
          characteristicId: characteristicId.value,
          value: buffer,
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:287", "writeBLECharacteristicValue success", res.errMsg);
            uni.showToast({
              title: "write发送成功"
            });
          },
          fail(err) {
            formatAppLog("error", "at pages/index/index.vue:293", err);
            uni.showToast({
              title: "write发送失败",
              icon: "error"
            });
          }
        });
      }
      function read() {
        uni.readBLECharacteristicValue({
          deviceId: deviceId.value,
          serviceId: serviceId.value,
          characteristicId: characteristicId.value,
          success(res) {
            formatAppLog("log", "at pages/index/index.vue:309", res);
            uni.showToast({
              title: "read发送成功"
            });
            uni.onBLECharacteristicValueChange((res2) => {
              formatAppLog("log", "at pages/index/index.vue:315", res2);
              let resHex = ab2hex(res2.value);
              formatAppLog("log", "at pages/index/index.vue:319", resHex);
              let result = hexCharCodeToStr(resHex);
              param2.value = result;
              formatAppLog("log", "at pages/index/index.vue:324", result);
            });
          },
          fail(err) {
            formatAppLog("error", "at pages/index/index.vue:328", err);
            uni.showToast({
              title: "read发送失败",
              icon: "error"
            });
          }
        });
      }
      return (_ctx, _cache) => {
        const _component_uni_drawer = resolveEasycom(vue.resolveDynamicComponent("uni-drawer"), __easycom_0);
        const _component_uni_section = resolveEasycom(vue.resolveDynamicComponent("uni-section"), __easycom_1);
        return vue.openBlock(), vue.createElementBlock("view", null, [
          vue.createVNode(_component_uni_section, {
            title: "蓝牙",
            type: "line"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "example-body" }, [
                vue.createElementVNode("button", {
                  type: "primary",
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.showDrawer("showLeft"))
                }, [
                  vue.createElementVNode("text", { class: "word-btn-white" }, "连接蓝牙")
                ]),
                vue.createVNode(
                  _component_uni_drawer,
                  {
                    ref: "showLeft",
                    mode: "left",
                    width: 320,
                    onChange: _cache[3] || (_cache[3] = ($event) => _ctx.change($event, "showLeft"))
                  },
                  {
                    default: vue.withCtx(() => [
                      vue.createCommentVNode(` <view class="close">\r
						<button @click="closeDrawer('showLeft')"><text class="word-btn-white">关闭Drawer</text></button>\r
					</view> `),
                      vue.createElementVNode("view", { style: { "background-color": "aliceblue" } }, [
                        vue.createElementVNode("scroll-view", {
                          "scroll-y": "",
                          class: "box"
                        }, [
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList(blueDeviceList.value, (item) => {
                              return vue.openBlock(), vue.createElementBlock("view", {
                                class: "item",
                                onClick: ($event) => connect(item)
                              }, [
                                vue.createElementVNode("view", null, [
                                  vue.createElementVNode(
                                    "text",
                                    null,
                                    "id: " + vue.toDisplayString(item.deviceId),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                vue.createElementVNode("view", null, [
                                  vue.createElementVNode(
                                    "text",
                                    null,
                                    "name: " + vue.toDisplayString(item.name),
                                    1
                                    /* TEXT */
                                  )
                                ])
                              ], 8, ["onClick"]);
                            }),
                            256
                            /* UNKEYED_FRAGMENT */
                          ))
                        ]),
                        vue.createElementVNode("button", { onClick: initBlue }, "1 初始化蓝牙"),
                        vue.createElementVNode("button", { onClick: discovery }, "2 搜索附近蓝牙设备"),
                        vue.createElementVNode("button", { onClick: getServices }, "3 获取蓝牙服务"),
                        vue.createElementVNode("button", { onClick: getCharacteristics }, "4 获取特征值"),
                        vue.createElementVNode("button", { onClick: notify }, "5 开启消息监听"),
                        vue.withDirectives(vue.createElementVNode(
                          "input",
                          {
                            style: { "border": "2px solid dodgerblue", "margin": "20rpx", "border-radius": "6px" },
                            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => param.value = $event)
                          },
                          null,
                          512
                          /* NEED_PATCH */
                        ), [
                          [vue.vModelText, param.value]
                        ]),
                        vue.createElementVNode("button", { onClick: send }, "6 发送数据"),
                        vue.withDirectives(vue.createElementVNode(
                          "input",
                          {
                            style: { "border": "2px solid dodgerblue", "margin": "20rpx", "border-radius": "6px" },
                            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => param2.value = $event),
                            disabled: "true/"
                          },
                          null,
                          512
                          /* NEED_PATCH */
                        ), [
                          [vue.vModelText, param2.value]
                        ]),
                        vue.createElementVNode("button", { onClick: read }, "7 读取数据"),
                        vue.createElementVNode("view", { class: "msg_x" }, [
                          vue.createElementVNode(
                            "view",
                            { class: "msg_txt" },
                            " 监听到的内容：" + vue.toDisplayString(message.value),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "view",
                            { class: "msg_hex" },
                            " 监听到的内容（十六进制）：" + vue.toDisplayString(messageHex.value),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ]),
                    _: 1
                    /* STABLE */
                  },
                  512
                  /* NEED_PATCH */
                )
              ])
            ]),
            _: 1
            /* STABLE */
          })
        ]);
      };
    }
  });
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "D:/workspace/HbuilderProjects/balanceCar-BLE-util/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/workspace/HbuilderProjects/balanceCar-BLE-util/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
