import type { ITextData, ITextDrawData } from '@leafer-ui/interface'

import { Direction4, isString, Platform } from '@leafer-ui/core'

import { layoutChar } from './CharLayout'
import { clipText } from './TextClip'
import { decorationText } from './TextDecoration'
import { layoutText } from './TextLayout'
import { createRows } from './TextRows'

const { top, right, bottom, left } = Direction4

export function getDrawData(content: string | number, style: ITextData): ITextDrawData {
  if (!isString(content))
    content = String(content)

  let x = 0; let y = 0

  let width = style.__getInput('width') || 0
  let height = style.__getInput('height') || 0

  const { __padding: padding } = style

  if (padding) {
    if (width)
      x = padding[left], width -= (padding[right] + padding[left]), !width && (width = 0.01) // 防止变为自动宽度
    else if (!style.autoSizeAlign)
      x = padding[left]

    if (height)
      y = padding[top], height -= (padding[top] + padding[bottom]), !height && (height = 0.01)
    else if (!style.autoSizeAlign)
      y = padding[top]
  }

  const drawData: ITextDrawData = {
    bounds: { x, y, width, height },
    rows: [],
    paraNumber: 0,
    font: Platform.canvas.font = style.__font,
  }

  createRows(drawData, content, style) // set rows, paraNumber

  if (padding)
    padAutoText(padding, drawData, style, width, height)

  layoutText(drawData, style) // set bounds

  if (style.__isCharMode)
    layoutChar(drawData, style, width, height) // set char.x

  if (drawData.overflow)
    clipText(drawData, style, x, width)

  if (style.textDecoration !== 'none')
    decorationText(drawData, style)

  return drawData
}

function padAutoText(padding: number[], drawData: ITextDrawData, style: ITextData, width: number, height: number): void {
  if (!width && style.autoSizeAlign) {
    switch (style.textAlign) {
      case 'left': offsetText(drawData, 'x', padding[left]); break
      case 'right': offsetText(drawData, 'x', -padding[right])
    }
  }

  if (!height && style.autoSizeAlign) {
    switch (style.verticalAlign) {
      case 'top': offsetText(drawData, 'y', padding[top]); break
      case 'bottom': offsetText(drawData, 'y', -padding[bottom])
    }
  }
}

function offsetText(drawData: ITextDrawData, attrName: 'x' | 'y', value: number): void {
  const { bounds, rows } = drawData
  bounds[attrName] += value
  for (let i = 0; i < rows.length; i++) rows[i][attrName] += value
}
