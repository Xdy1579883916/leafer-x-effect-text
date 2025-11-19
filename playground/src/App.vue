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

  const et = new EffectText({
    text: '多层特效',
    fontSize: 72,
    fill: '#ff4400',
    textEffects: [
      // 底层阴影
      {
        visible: true,
        offset: {x: 5, y: 5},
        fill: 'rgba(0, 0, 0, 0.5)'
      },
      // 外描边
      {
        visible: true,
        offset: {x: 0, y: 0},
        stroke: {
          type: 'solid',
          color: '#ffffff',
          style: {strokeWidth: 8}
        }
      },
      // 内描边
      {
        visible: true,
        offset: {x: 0, y: 0},
        stroke: {
          type: 'solid',
          color: '#000000',
          style: {strokeWidth: 4}
        }
      }
    ],
    editable: true,
  })

  leaferApp.tree.add(et)
  console.log(et, et.toJSON())

  ;(window as any).app = leaferApp
}

onMounted(() => {
  initLeafer()
})

function handleExport() {
  leaferApp.tree.export("test.png")
}
function handleExport2() {
  const text = leaferApp.tree.children[0]
  console.log(text.toJSON())
}
function handleDebug() {
  Debug.enable = !Debug.enable
  Debug.showBounds = Debug.enable ? 'hit' : false
}
</script>

<template>
  <NFlex justify="start">
    <div id="leafer-app" style="background: antiquewhite;"></div>
    <NFlex vertical>
      <h3>操作</h3>
      <NFlex justify="start">
        <NButton @click="handleDebug"> Debug </NButton>
        <NButton @click="handleExport">导出图片</NButton>
        <NButton @click="handleExport2">导出JSON（见console）</NButton>
      </NFlex>
    </NFlex>
  </NFlex>
</template>
