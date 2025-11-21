<script setup lang="ts">
import {onMounted} from 'vue'
import '@leafer-in/editor'
import '@leafer-in/text-editor'
import '@leafer-in/export'
import  '@leafer-in/view'
import  '@leafer-in/viewport'
import {App, Debug} from "leafer-ui";
import {EffectText} from "@lx/effect-text"

let leaferApp: App
Debug.showBounds = 'hit'
Debug.filter = 'EffectText'
Debug.enable = true
// console.log(UICreator.list);

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
    new EffectText({
      "textEffects": [
        {
          "fill": {
            "type": "solid",
            "color": "#000",
            "visible": false
          },
          "stroke": {
            "type": "linear",
            "color": "rgba(255, 255, 255, 1)",
            "visible": true,
            "style": {
              "strokeWidth": 10,
              "strokeJoin": "round"
            },
            "from": {
              "x": 0,
              "y": 0.5,
              "type": "percent"
            },
            "to": {
              "x": 1,
              "y": 0.5,
              "type": "percent"
            },
            "stops": [
              {
                "offset": 0,
                "color": "rgb(252, 92, 125)"
              },
              {
                "offset": 1,
                "color": "rgb(255, 251, 213)"
              }
            ]
          },
          "visible": true,
          "offset": {
            "x": 0,
            "y": 0,
            "visible": true
          }
        },
        {
          "fill": {
            "type": "solid",
            "color": "rgba(209, 209, 209, 1)",
            "visible": false
          },
          "stroke": {
            "type": "solid",
            "color": "#000",
            "visible": true,
            "style": {
              "strokeWidth": 5,
              "strokeJoin": "round",
              "dashPattern": [
                10,
                1
              ]
            }
          },
          "visible": true,
          "offset": {
            "x": 0,
            "y": 0,
            "visible": true
          }
        },
        {
          "fill": {
            "type": "linear",
            "color": "rgba(223, 22, 22, 1)",
            "visible": true,
            "from": {
              "x": 0,
              "y": 0.5,
              "type": "percent"
            },
            "to": {
              "x": 1,
              "y": 0.5,
              "type": "percent"
            },
            "stops": [
              {
                "offset": 0,
                "color": "rgb(30, 150, 0)"
              },
              {
                "offset": 0.51,
                "color": "rgb(255, 242, 0)"
              },
              {
                "offset": 1,
                "color": "rgb(243, 41, 53)"
              }
            ]
          },
          "stroke": {
            "type": "solid",
            "color": "rgba(255, 255, 255, 1)",
            "visible": true,
            "style": {
              "strokeWidth": 2,
              "strokeJoin": "round"
            }
          },
          "offset": {
            "x": 0,
            "y": 0,
            "visible": true
          },
          "visible": true
        }
      ],
      "width": 786.0278341182664,
      "height": 138.84994696510677,
      "text": "双击编辑一小段正文",
      fill: "#f40",
      "fontSize": 79.4,
      "fontWeight": 400,
      "italic": false,
      "textDecoration": "under",
      "lineHeight": {
        "type": "percent",
        "value": 1
      },
      "textAlign": "center",
      "verticalAlign": "middle",
      "opacity": 1,
      "x": 169.48608294086665,
      "y": 215.57502651744667,
      "scaleX": 1,
      "scaleY": 1,
      "rotation": 0,
      "skewX": 0,
      "skewY": 0,
      "editable": true,
    }),
    new EffectText({
      "tag": "EffectText",
      "textEffects": [
        {
          "fill": {
            "type": "linear",
            "color": "#000000",
            "visible": false,
            "from": {
              "x": 0,
              "y": 0.5,
              "type": "percent"
            },
            "to": {
              "x": 1,
              "y": 0.5,
              "type": "percent"
            },
            "stops": [
              {
                "offset": 0,
                "color": "rgb(248, 54, 0)"
              },
              {
                "offset": 1,
                "color": "rgb(250, 204, 34)"
              }
            ]
          },
          "stroke": {
            "type": "solid",
            "color": "rgba(41, 212, 138, 1)",
            "visible": true,
            "style": {
              "strokeJoin": "round",
              "strokeWidth": 9
            }
          },
          "offset": {
            "x": 0,
            "y": 8,
            "visible": true
          }
        },
        {
          "fill": {
            "type": "linear",
            "color": "#000000",
            "visible": false,
            "from": {
              "x": 0,
              "y": 0.5,
              "type": "percent"
            },
            "to": {
              "x": 1,
              "y": 0.5,
              "type": "percent"
            },
            "stops": [
              {
                "offset": 0,
                "color": "rgb(248, 54, 0)"
              },
              {
                "offset": 1,
                "color": "rgb(250, 204, 34)"
              }
            ]
          },
          "stroke": {
            "type": "solid",
            "color": "rgba(7, 32, 253, 1)",
            "visible": true,
            "style": {
              "strokeJoin": "round",
              "strokeWidth": 7
            }
          },
          "offset": {
            "x": 0,
            "y": 6,
            "visible": true
          }
        },
        {
          "fill": {
            "type": "linear",
            "color": "#000000",
            "visible": false,
            "from": {
              "x": 0,
              "y": 0.5,
              "type": "percent"
            },
            "to": {
              "x": 1,
              "y": 0.5,
              "type": "percent"
            },
            "stops": [
              {
                "offset": 0,
                "color": "rgb(248, 54, 0)"
              },
              {
                "offset": 1,
                "color": "rgb(250, 204, 34)"
              }
            ]
          },
          "stroke": {
            "type": "solid",
            "color": "rgba(250, 27, 27, 1)",
            "visible": true,
            "style": {
              "strokeJoin": "round",
              "strokeWidth": 5
            }
          },
          "offset": {
            "x": 0,
            "y": 4,
            "visible": true
          }
        },
        {
          "fill": {
            "type": "linear",
            "color": "#000000",
            "visible": true,
            "from": {
              "x": 0,
              "y": 0.5,
              "type": "percent"
            },
            "to": {
              "x": 1,
              "y": 0.5,
              "type": "percent"
            },
            "stops": [
              {
                "offset": 0,
                "color": "rgb(248, 54, 0)"
              },
              {
                "offset": 1,
                "color": "rgb(250, 204, 34)"
              }
            ]
          },
          "stroke": {
            "type": "solid",
            "color": "rgba(255, 255, 255, 1)",
            "visible": true,
            "style": {
              dashPattern: [22, 2],
              "strokeJoin": "round",
              "strokeWidth": 3
            }
          },
          "offset": {
            "x": 0,
            "y": 2,
            "visible": true
          }
        }
      ],
      "width": 494.0463372844983,
      "height": 92.42880484631613,
      "text": "双击编辑标题",
      "fontSize": 65.03683211635888,
      "fontWeight": 400,
      "italic": false,
      "lineHeight": {
        "type": "percent",
        "value": 1.5
      },
      "textAlign": "center",
      "verticalAlign": "middle",
      "x": 68.45366271550174,
      "y": 106.47872871902374,
      "scaleX": 1,
      "scaleY": 1,
      "rotation": 0,
      "skewX": 0,
      "skewY": 0,
      "editable": true,
      "shadow": [
        {
          "x": 0,
          "y": 5,
          "blur": 11,
          "color": "rgba(255, 255, 255, 1)",
          "spread": 15
        }
      ],
    })
  ])

  ;(window as any).app = leaferApp
}

onMounted(() => {
  initLeafer()
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
    <div id="leafer-app" style="background: rgb(105, 41, 225);"></div>
    <NFlex vertical>
      <h3>window.app 可获取leafer 实例, 自行操作</h3>
      <NFlex justify="start">
        <NButton @click="handleDebug"> Debug </NButton>
        <NButton @click="handleExport">导出图片</NButton>
        <NButton @click="handleExport2">导出JSON（见console）</NButton>
        <NButton @click="handleChangeOffest">随机特效偏移</NButton>
        <NButton @click="handleAddShadow">设置文字阴影</NButton>
      </NFlex>
    </NFlex>
  </NFlex>
</template>
