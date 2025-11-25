<script setup lang="ts">
import {onMounted} from 'vue'
import '@leafer-in/editor'
import {TextEditor} from '@leafer-in/text-editor'
import '@leafer-in/export'
import '@leafer-in/view'
import '@leafer-in/viewport'
import {App, Debug} from "leafer-ui";
import "@lx/effect-text"
import {EffectText} from "@lx/effect-text"

let leaferApp: App
Debug.showBounds = 'hit'
Debug.filter = 'EffectText'
Debug.enable = true
// console.log(UICreator.list);
const load = TextEditor.prototype.onLoad
TextEditor.prototype.onLoad = function () {
  load.call(this)
  this.editDom.classList.add('leafer-x-text-editor')
}

function initLeafer() {

  leaferApp = new App({
    view: 'leafer-app',
    width: 1200,
    height: 600,
    editor: {
      editSize: 'size',
      point: {
        editConfig: {editSize: 'font-size'},
      }
    },
  })

  leaferApp.tree.add([
    {
      "tag": "EffectText",
      "textEffects": [
        {
          "offset": {
            "x": 0,
            "y": 0,
            "visible": false
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 2.0560892174126377,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#ffffff"
          }
        },
        {
          "offset": {
            "x": 3.537972978430056,
            "y": 5.052749057052346,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 2.0560892174126377,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#ff5e04"
          }
        },
        {
          "offset": {
            "x": 7.075945956860116,
            "y": 10.105498114104693,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 2.0560892174126377,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#dc0000"
          }
        },
        {
          "offset": {
            "x": 10.613918935290172,
            "y": 15.15824717115704,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 2.0560892174126377,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#8145ff"
          }
        },
        {
          "offset": {
            "x": 14.151891913720224,
            "y": 20.210996228209385,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 2.0560892174126377,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#348fff"
          }
        },
        {
          "offset": {
            "x": 17.689864892150286,
            "y": 25.263745285261734,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 2.0560892174126377,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#50d777"
          }
        },
        {
          "offset": {
            "x": 21.227837870580345,
            "y": 30.31649434231408,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 2.0560892174126377,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#ffc83d"
          }
        }
      ],
      "width": 600,
      "height": 215.1707779272391,
      "fill": {
        "type": "solid",
        "color": "#000"
      },
      "text": "ABC",
      "fontSize": 97.87429373657935,
      "fontWeight": 400,
      "italic": false,
      "textDecoration": "under",
      "letterSpacing": 6.919274268088775,
      "lineHeight": {
        "type": "percent",
        "value": 1.5
      },
      "textAlign": "center",
      "verticalAlign": "middle",
      "id": "uZVMcRhGDbkLeHMjBdCoOVIL8aWqwwlF",
      "visible": true,
      "locked": false,
      "x": 599.9999999999999,
      "y": 2.9422060868672264e-14,
      "scaleX": 1,
      "scaleY": 1,
      "rotation": 0,
      "skewX": 0,
      "skewY": 0,
      "editable": true,
      "data": {},
      "states": {}
    },
    {
      "tag": "EffectText",
      "textEffects": [
        {
          "offset": {
            "x": 0,
            "y": 0,
            "visible": false
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 3.8425635840188477,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "linear",
            "from": {
              "x": 0.49999999999999994,
              "y": 0,
              "type": "percent"
            },
            "to": {
              "x": 0.5,
              "y": 1,
              "type": "percent"
            },
            "stops": [
              {
                "offset": 0.42857142857142855,
                "color": "#ffffffff"
              },
              {
                "offset": 0.9846938775510204,
                "color": "#ffe197ff"
              }
            ]
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 15.37025433607539,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000000",
            "style": {
              "strokeWidth": 3.8425635840188477,
              "strokeJoin": "round",
              "strokeAlign": "outside"
            }
          },
          "fill": {
            "type": "solid",
            "color": "#e48e4a"
          }
        }
      ],
      "width": 600,
      "height": 139.8761622653169,
      "fill": {
        "type": "solid",
        "color": "#000"
      },
      "text": "ABC",
      "fontSize": 112.78929824561591,
      "fontWeight": 400,
      "italic": false,
      "textDecoration": "under",
      "letterSpacing": 6.824935064935066,
      "lineHeight": {
        "type": "percent",
        "value": 1.5
      },
      "textAlign": "center",
      "verticalAlign": "middle",
      "id": "uvY8JyYHdr4vvi4czhFgpJ69AigL0R9O",
      "visible": true,
      "locked": false,
      "x": 6.394884621840902e-14,
      "y": 252.1693135956547,
      "scaleX": 1,
      "scaleY": 1,
      "rotation": 0,
      "skewX": 0,
      "skewY": 0,
      "editable": true,
      "data": {},
      "states": {}
    },
    {
      "tag": "EffectText",
      "textEffects": [
        {
          "offset": {
            "x": 0,
            "y": 0,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#ffffff"
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 3.3090695520784172,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#f20000"
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 6.792300659529384,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#ff7700"
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 10.275531766980349,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#fff600"
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 13.758762874431318,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#2eff22"
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 17.241993981882285,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#00d5d5"
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 20.72522508933325,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#005ad5"
          }
        },
        {
          "offset": {
            "x": 0,
            "y": 24.208456196784212,
            "visible": true
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#8c00e0"
          }
        }
      ],
      "width": 600,
      "height": 221.4112161462067,
      "fill": {
        "type": "solid",
        "color": "#000"
      },
      "text": "ABC",
      "fontSize": 96.35625533201065,
      "fontWeight": 400,
      "italic": false,
      "textDecoration": "under",
      "letterSpacing": 6.81495064720368,
      "lineHeight": {
        "type": "percent",
        "value": 1.5
      },
      "textAlign": "center",
      "verticalAlign": "middle",
      "id": "uXZhaVH7y4mwWgCgjPlKcqIwNmFCdRa1",
      "visible": true,
      "locked": false,
      "x": -5.684341886080802e-14,
      "y": 2.932356633951227e-14,
      "scaleX": 1,
      "scaleY": 1,
      "rotation": 0,
      "skewX": 0,
      "skewY": 0,
      "editable": true,
      "data": {},
      "states": {}
    },
    {
      "tag": "EffectText",
      "textEffects": [
        {
          "offset": {
            "x": 0,
            "y": 0,
            "visible": false
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "fill": {
            "type": "solid",
            "color": "#000000"
          }
        }
      ],
      "width": 598.6311973481079,
      "height": 152.62193046362552,
      "fill": {
        "type": "solid",
        "color": "#000"
      },
      "text": "ABC",
      "fontSize": 118.04283487778547,
      "fontWeight": 400,
      "italic": false,
      "textDecoration": "under",
      "letterSpacing": 6.919190488236782,
      "lineHeight": {
        "type": "percent",
        "value": 1.5
      },
      "textAlign": "center",
      "verticalAlign": "middle",
      "id": "upZJUT6pdjPFvDKGP4ZV5mEwPSio5FEb",
      "visible": true,
      "locked": false,
      "x": 599.9999999999999,
      "y": 252.16931359565467,
      "scaleX": 1,
      "scaleY": 1,
      "rotation": 0,
      "skewX": 0,
      "skewY": 0,
      "editable": true,
      "shadow": [
        {
          "x": 12.838601627598841,
          "y": 13.294761172059543,
          "blur": 2.310236616582426,
          "color": "#0000004e"
        }
      ],
      "data": {},
      "states": {}
    }
  ])

  ;(window as any).app = leaferApp
}

onMounted(() => {
  initLeafer()
  handleDebug()
})

function handleExport() {
  leaferApp.tree.export("test.png")
}

function getTexts(): EffectText[] {
  return leaferApp.tree.children as EffectText[]
}

function handleExport2() {
  console.log(getTexts().map(v => v.toJSON()))
}
function handleDebug() {
  Debug.enable = !Debug.enable
  Debug.showBounds = Debug.enable ? 'hit' : false
}
function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function handleChangeOffest() {
  getTexts().forEach((text) => {
    const max = 200
    const x = getRandom(-max, max)
    const y = getRandom(-max, max)
    text.textEffects = text.textEffects.map(v => {
      v.offset = {visible: true, x, y}
      return v
    })
  })
}
function handleAddShadow() {
  getTexts().forEach((text) => {
    text.set({
      shadow: [
        {
          "x": 10,
          "y": -10,
          "blur": 63,
          "color": "rgba(255, 255, 255, 1)",
          "spread": 41
        }
      ]
    })
  })
}
</script>

<template>
  <NFlex justify="start">
    <div id="leafer-app" style="background: rgb(242 235 255);"></div>
    <NFlex vertical>
      <h3>window.app 可获取leafer 实例, 自行操作</h3>
      <NFlex justify="start">
        <NButton @click="handleDebug"> Debug </NButton>
        <NButton @click="handleExport">导出图片</NButton>
        <NButton @click="handleExport2">导出JSON（见console）</NButton>
        <!--<NButton @click="handleChangeOffest">随机特效偏移</NButton>
        <NButton @click="handleAddShadow">设置文字阴影</NButton>-->
      </NFlex>
    </NFlex>
  </NFlex>
</template>

<style>
.leafer-x-text-editor {
  color: transparent !important;
  caret-color: black !important;
}
.leafer-x-text-editor::selection {
  background: rgba(0, 0, 255, 0.2) !important;
  color: transparent !important;
}
</style>
