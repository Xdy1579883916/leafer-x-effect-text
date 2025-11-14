<script setup lang="ts">
import {onMounted} from 'vue'
import '@leafer-in/editor'
import '@lx/effect-text-editor'
import {App, UICreator} from "leafer-ui";
import {EffectText} from "@lx/effect-text";

let leaferApp: App
// Debug.showBounds = 'hit'
console.log(UICreator.list);

function initLeafer() {

  leaferApp = new App({
    view: 'leafer-app',
    width: 1200,
    height: 600,
    editor: {},
  })

  const t1 = new EffectText({
    text: 'DIY EffectText',
    fontSize: 40,
    x: 200,
    y: 200,
    fill: {
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
    writingMode: 'x-reverse',
    editable: true,
  })

  leaferApp.tree.add(t1)
  console.log(t1, t1.toJSON())

  ;(window as any).app = leaferApp
}

onMounted(() => {
  initLeafer()
})
</script>

<template>
  <NFlex justify="start">
    <div id="leafer-app" style="background: antiquewhite;"></div>
    <div>
      <NButton>xxx</NButton>
    </div>
  </NFlex>
</template>
