<script setup lang="ts">
import {onMounted} from 'vue'
import '@leafer-in/editor'
import '@lx/effect-text-editor'
import {App, Text, UICreator} from "leafer-ui";
import {EffectText} from "@lx/effect-text";

let leaferApp: App

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
    editable: true,
  })

  leaferApp.tree.add(t1)
  const t2 = new Text({
    tag: 'EffectText',
    text: 'Leafer Text',
    fontSize: 40,
    x: 200,
    y: 100,
    editable: true,
  })
  leaferApp.tree.add(t2)
  console.log(t1, t2)

  console.log(t1.toJSON(), t2.toJSON())

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
