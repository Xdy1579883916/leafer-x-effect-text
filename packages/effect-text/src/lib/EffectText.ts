import type {
  IEventListenerId,
  IFourNumber,
  ILeaferCanvas,
  IPaint,
  IPointData,
  IRenderOptions,
  IStrokePaint,
  IText,
  ITextInputData,
  ITextStyleAttrData,
  ITextStyleComputedData,
  IUI,
  IUIData,
  IUIInputData,
} from '@leafer-ui/interface'
import {
  boundsType,
  DataHelper,
  dataProcessor,
  dataType,
  Debug,
  FourNumberHelper,
  isArray,
  isNull,
  isString,
  Plugin,
  PropertyEvent,
  registerUI,
  Text,
  TextData,
  tryToNumber,
  UICreator,
} from '@leafer-ui/core'

// ==================== Types ====================

export type IEnable<T> = T & {
  visible?: boolean
}

export type ITextEffect = IEnable<{
  offset?: IEnable<IPointData>
  stroke?: IEnable<IStrokePaint>
  fill?: IEnable<IPaint>
}>

export interface IEffectTextAttrData {
  textEffects?: ITextEffect[]
}

export type IEffectRatio = Partial<{
  offsetXRatio: number
  offsetYRatio: number
  strokeWidthRatio: number
  dashPatternRatios: number[]
}>

export interface IEffectTextData extends ITextStyleComputedData, IUIData {
  _textEffects?: ITextEffect[]
  __effectTextGroup?: IText[]
  __effectRatios?: IEffectRatio[]
  __ratiosInitialized?: boolean
  updateEffectPositions: () => void
}

export interface IEffectText extends IEffectTextAttrData, ITextStyleAttrData, IUI {
  __: IEffectTextData
  textEffects?: ITextEffect[]
  __effectTextGroup?: IText[]
}

export interface IEffectTextInputData extends IEffectTextAttrData, ITextInputData {
  textEffects?: ITextEffect[]
}

interface StrokeRatioItem {
  width?: number
  dashPattern?: number[]
}

interface ShadowRatioItem {
  x?: number
  y?: number
  blur?: number
  spread?: number
}

export type ITextRatio = Partial<{
  stroke: Array<StrokeRatioItem>
  shadow: Array<ShadowRatioItem>
  innerShadow: Array<ShadowRatioItem>
}>

// ==================== Constants ====================

export const DEFAULT_FONT_SIZE = 12
export const IGNORE_SYNC_KEYS = [
  'tag',
  'textEffects',
  'fill',
  'stroke',
  'x',
  'y',
  'skew',
  'scale',
  'scaleX',
  'scaleY',
  'rotation',
  'textEditing',
  'editable',
  'id',
  'states',
  'data',

  'shadow',
  'innerShadow',
  'visible',
]

// ==================== Helper Functions ====================

function isVisible(item?: any): boolean {
  return item?.visible !== false && item?.visible !== 0
}

function getOffsetValue(offset?: IEnable<IPointData>): { x: number, y: number } {
  if (!offset || !isVisible(offset)) {
    return { x: 0, y: 0 }
  }
  return { x: offset.x || 0, y: offset.y || 0 }
}

function getStrokeWidth(stroke?: IEnable<IStrokePaint>): number {
  if (!stroke || !isVisible(stroke)) {
    return 0
  }
  return (stroke as any).style?.strokeWidth || 0
}

function getDashPattern(stroke?: IEnable<IStrokePaint>): number[] | undefined {
  if (!stroke || !isVisible(stroke)) {
    return undefined
  }
  const dashPattern = (stroke as any).style?.dashPattern
  return dashPattern && Array.isArray(dashPattern) && dashPattern.length > 0 ? dashPattern : undefined
}

function calculateDirectionSpread(offset: number, strokeSpread: number): { positive: number, negative: number } {
  if (offset < 0) {
    return { positive: 0, negative: Math.abs(offset) + strokeSpread }
  }
  else if (offset > 0) {
    return { positive: offset + strokeSpread, negative: 0 }
  }
  else {
    return { positive: strokeSpread, negative: strokeSpread }
  }
}

function omitKeys(obj: any, keys: string[]) {
  const newObj: any = {}
  for (const key in obj) {
    if (!keys.includes(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

function toArr(data: any) {
  if (isNull(data)) {
    return []
  }
  if (isArray(data)) {
    return data
  }
  if (isString(data)) {
    return data.split(' ')
  }
  return [data]
}

/**
 * 将特效配置从一个 fontSize 基准标准化到另一个 fontSize 基准
 * 用于创建固定尺寸的预览文字，保持特效比例一致
 *
 * @param effects - 源特效配置
 * @param sourceFontSize - 源文字的 fontSize
 * @param targetFontSize - 目标文字的 fontSize
 * @returns 标准化后的特效配置（深拷贝）
 */
export function normalizeTextEffects(
  effects: ITextEffect[] | undefined,
  sourceFontSize: number,
  targetFontSize: number,
): ITextEffect[] | undefined {
  if (!effects?.length)
    return effects
  if (sourceFontSize === targetFontSize)
    return effects

  const scale = targetFontSize / sourceFontSize

  const clonedEffects: ITextEffect[] = JSON.parse(JSON.stringify(effects))
  return clonedEffects.map((effect) => {
    // 根据参数决定是否缩放 offset
    if (effect.offset && isVisible(effect.offset)) {
      effect.offset = {
        x: (effect.offset.x || 0) * scale,
        y: (effect.offset.y || 0) * scale,
      }
    }

    // 缩放 stroke 相关属性
    if (effect.stroke?.style) {
      // 缩放 strokeWidth
      if (effect.stroke.style.strokeWidth) {
        (effect.stroke.style.strokeWidth as any) *= scale
      }

      // 缩放 dashPattern
      if (effect.stroke.style.dashPattern && Array.isArray(effect.stroke.style.dashPattern)) {
        effect.stroke.style.dashPattern = effect.stroke.style.dashPattern.map((value: number) => value * scale)
      }
    }

    return effect
  })
}

/**
 * 按指定 fontSize 标准化输出新比例的阴影、描边和特效文字数据
 * @param ui - 源文字
 * @param fontSize - 目标文字的 fontSize
 * @returns 标准化后的文字配置（深拷贝）
 */
export function normalizeTextData(ui: IEffectText, fontSize: number) {
  const data = DataHelper.clone(ui.toJSON())
  const sourceFontSize = ui.fontSize || DEFAULT_FONT_SIZE

  if (sourceFontSize === fontSize) {
    return data
  }

  const scale = fontSize / sourceFontSize

  // 标准化 textEffects
  if (data.textEffects) {
    data.textEffects = normalizeTextEffects(data.textEffects, sourceFontSize, fontSize)
  }

  // 标准化描边
  if (data.stroke) {
    const strokeList = toArr(data.stroke)
    data.stroke = strokeList.map((stroke: any) => {
      if (isString(stroke)) {
        return stroke
      }
      const clonedStroke = { ...stroke }
      if (clonedStroke.style) {
        clonedStroke.style = { ...clonedStroke.style }
        if (clonedStroke.style.strokeWidth) {
          clonedStroke.style.strokeWidth *= scale
        }
        if (clonedStroke.style.dashPattern && Array.isArray(clonedStroke.style.dashPattern)) {
          clonedStroke.style.dashPattern = clonedStroke.style.dashPattern.map((v: number) => v * scale)
        }
      }
      return clonedStroke
    })
    if (strokeList.length === 1) {
      data.stroke = data.stroke[0]
    }
  }

  // 标准化 strokeWidth
  if (data.strokeWidth) {
    data.strokeWidth *= scale
  }

  // 标准化 dashPattern
  if (data.dashPattern && Array.isArray(data.dashPattern)) {
    data.dashPattern = data.dashPattern.map((v: number) => v * scale)
  }

  // 标准化 shadow
  if (data.shadow) {
    const shadowList = toArr(data.shadow)
    data.shadow = shadowList.map((shadow: any) => {
      const clonedShadow = { ...shadow }
      if (clonedShadow.x)
        clonedShadow.x *= scale
      if (clonedShadow.y)
        clonedShadow.y *= scale
      if (clonedShadow.blur)
        clonedShadow.blur *= scale
      if (clonedShadow.spread)
        clonedShadow.spread *= scale
      return clonedShadow
    })
    if (shadowList.length === 1) {
      data.shadow = data.shadow[0]
    }
  }

  // 标准化 innerShadow
  if (data.innerShadow) {
    const innerShadowList = toArr(data.innerShadow)
    data.innerShadow = innerShadowList.map((shadow: any) => {
      const clonedShadow = { ...shadow }
      if (clonedShadow.x)
        clonedShadow.x *= scale
      if (clonedShadow.y)
        clonedShadow.y *= scale
      if (clonedShadow.blur)
        clonedShadow.blur *= scale
      if (clonedShadow.spread)
        clonedShadow.spread *= scale
      return clonedShadow
    })
    if (innerShadowList.length === 1) {
      data.innerShadow = data.innerShadow[0]
    }
  }

  return data
}

// ==================== Data Class ====================

export class EffectTextData extends TextData implements IEffectTextData {
  _textEffects?: ITextEffect[]
  __effectTextGroup: IText[]
  __effectRatios?: IEffectRatio[]
  __ratiosInitialized?: boolean

  setTextEffects(value: ITextEffect[]) {
    const mainText = this.__leaf as IEffectText

    if (value?.length) {
      this.recordAbsoluteValues(value)
      this.updateOrCreateEffectTexts(mainText, value)
    }
    else {
      this.clearAllEffects(mainText)
    }

    this._textEffects = value
  }

  recordAbsoluteValues(effects: ITextEffect[]) {
    // 先记录绝对值，存储在 ratio 字段中（此时还不是比例）
    this.__effectRatios = effects.map((effect) => {
      const offset = getOffsetValue(effect.offset)
      const strokeWidth = getStrokeWidth(effect.stroke)
      const dashPattern = getDashPattern(effect.stroke)
      return {
        offsetXRatio: offset.x,
        offsetYRatio: offset.y,
        strokeWidthRatio: strokeWidth,
        dashPatternRatios: dashPattern ? [...dashPattern] : undefined,
      }
    })
    this.__ratiosInitialized = false
  }

  updateOrCreateEffectTexts(mainText: IEffectText, effects: ITextEffect[]) {
    const existingGroup = this.__effectTextGroup || []

    const newGroup: IText[] = effects.map((effect, index) => {
      const offset = getOffsetValue(effect.offset)
      const { fill, stroke } = effect
      const inputData: IUIInputData = {
        fill,
        stroke,
        ...offset,
        visible: isVisible(effect),
      }
      // 复用现有元素或创建新元素
      let text = existingGroup[index]
      if (text) {
        text.set(inputData)
      }
      else {
        text = UICreator.get('Text', inputData) as IText
      }
      return text
    })

    // 隐藏多余的元素
    for (let i = effects.length; i < existingGroup.length; i++) {
      existingGroup[i].visible = 0
    }

    mainText.__effectTextGroup = this.__effectTextGroup = newGroup
  }

  clearAllEffects(mainText: IEffectText) {
    if (this.__effectTextGroup?.length) {
      this.__effectTextGroup.forEach(t => t.visible = 0)
      this.__effectTextGroup = mainText.__effectTextGroup = []
    }
  }

  updateEffectPositions() {
    const mainText = this.__leaf as IEffectText
    const { __effectTextGroup: group, __effectRatios, __ratiosInitialized, _textEffects } = this

    if (!group || !__effectRatios)
      return

    const currentFontSize = mainText.fontSize || DEFAULT_FONT_SIZE

    // 第一次调用时，计算比例
    if (!__ratiosInitialized) {
      __effectRatios.forEach((ratio) => {
        ratio.offsetXRatio = ratio.offsetXRatio / currentFontSize
        ratio.offsetYRatio = ratio.offsetYRatio / currentFontSize
        ratio.strokeWidthRatio = ratio.strokeWidthRatio / currentFontSize
        if (ratio.dashPatternRatios) {
          ratio.dashPatternRatios = ratio.dashPatternRatios.map(value => value / currentFontSize)
        }
      })
      this.__ratiosInitialized = true
    }

    __effectRatios.forEach((ratio, index) => {
      const text = group[index]
      const effect = _textEffects[index]
      if (!text)
        return

      // 根据当前 fontSize 和比例计算实际值
      const actualX = ratio.offsetXRatio * currentFontSize
      const actualY = ratio.offsetYRatio * currentFontSize
      const actualStrokeWidth = ratio.strokeWidthRatio * currentFontSize

      text.x = actualX
      text.y = actualY
      effect.offset = {
        ...(effect.offset || {}),
        x: actualX,
        y: actualY,
      }

      // 更新描边宽度和 dashPattern
      if (text.stroke && (text.stroke as any).style) {
        (text.stroke as any).style.strokeWidth = actualStrokeWidth
        effect.stroke.style.strokeWidth = actualStrokeWidth

        // 更新 dashPattern
        if (ratio.dashPatternRatios) {
          const actualDashPattern = ratio.dashPatternRatios.map(value => value * currentFontSize)
          ;(text.stroke as any).style.dashPattern = actualDashPattern
          effect.stroke.style.dashPattern = actualDashPattern
        }
      }

      text.__updateLocalMatrix()
      text.__updateWorldMatrix()
    })
  }
}

// ==================== Main Class ====================
const console = Debug.get('leafer-x-effect-text')

@registerUI()
export class EffectText<TConstructorData = IEffectTextInputData> extends Text<TConstructorData> implements IEffectText {
  get __tag() {
    return 'EffectText'
  }

  @dataProcessor(EffectTextData)
  declare public __: IEffectTextData

  @boundsType()
  declare textEffects?: ITextEffect[]

  @dataType(true)
  declare fontSizeEffect: boolean

  declare public __effectTextGroup?: Text[]

  get hasEffects(): boolean {
    return !!this.textEffects?.length
  }

  protected __eventIds: IEventListenerId[] = []
  protected __textRatio: ITextRatio

  constructor(data?: TConstructorData) {
    super(data)
    this.__eventIds = [
      this.on_(PropertyEvent.CHANGE, this._lisFontSizeEffects, this),
    ]
  }

  // 监听 fontSize 变化，动态更新元素描边、阴影到合适比例，实现元素放大缩小后的展示效果一致
  protected _lisFontSizeEffects(e: PropertyEvent): void {
    if (!this.fontSizeEffect) {
      return
    }
    if (['fontSize'].includes(e.attrName)) {
      this._updateEffectAttr()
      if (this.hasEffects) {
        this.__.updateEffectPositions()
      }
    }
    else if ([
      'strokeWidth',
      'dashPattern',
      'stroke',

      'shadow',
      'innerShadow',
    ].includes(e.attrName)) {
      this._collectRatios()
    }
  }

  // 更新元素描边、阴影到合适比例
  protected _updateEffectAttr() {
    const { stroke, fontSize, __textRatio } = this
    if (!__textRatio) {
      return
    }
    // 描边
    if (stroke) {
      this.__.stroke = toArr(stroke).map((v, i) => {
        const { width, dashPattern } = __textRatio.stroke[i]
        // 子描边独立控制
        if (v.style) {
          if ('strokeWidth' in v.style) {
            v.style.strokeWidth = width * fontSize
          }
          if ('dashPattern' in v.style) {
            const _dashPattern = v.style.dashPattern
            if (_dashPattern && _dashPattern.length) {
              v.style.dashPattern = dashPattern.map(v => v * fontSize)
            }
          }
        }
        // 整体描边控制
        if (this.strokeWidth) {
          this.__.strokeWidth = width * fontSize
        }
        if (this.dashPattern) {
          this.__.dashPattern = dashPattern.map(v => v * fontSize)
        }
        return v
      })
    }
    // 阴影、内阴影
    const shadowAttr = ['shadow', 'innerShadow']
    shadowAttr.forEach((attr) => {
      const attrItem = (this as any)[attr]
      if (attrItem) {
        (this.__ as any)[attr] = toArr(attrItem).map((v: any, i) => {
          const ratio: any = (__textRatio as any)[attr][i]
          Object.keys(ratio).forEach((key: string) => {
            if (key in v) {
              v[key] = ratio[key] * fontSize
            }
          })
          return v
        })
      }
    })
  }

  // 获取元素描边、阴影比例
  protected _collectRatios(): void {
    const { shadow, innerShadow, stroke, strokeWidth, dashPattern, fontSize } = this
    function getRatio(num?: any): number {
      if (isNull(num))
        return 1
      if (isArray(num)) {
        return getRatio(num[0])
      }
      return tryToNumber(num) / fontSize
    }
    function getListRatio(arr?: any): number[] {
      return toArr(arr).map(getRatio)
    }

    const strokeList = toArr(stroke)
    const shadowList = toArr(shadow)
    const innerShadowList = toArr(innerShadow)
    this.__textRatio = {
      stroke: strokeList.map((stroke) => {
        if (isString(stroke)) {
          return {
            width: getRatio(strokeWidth),
            dashPattern: getListRatio(dashPattern || []),
          } as StrokeRatioItem
        }
        if (stroke.style) {
          const { strokeWidth: itemWidth, dashPattern: itemDash } = stroke.style
          const width = getRatio(itemWidth || strokeWidth)
          const dash = getListRatio(itemDash || dashPattern)
          return {
            width,
            dashPattern: dash,
          } as StrokeRatioItem
        }
        return {
          width: getRatio(strokeWidth),
          dashPattern: getListRatio(dashPattern || []),
        } as StrokeRatioItem
      }),
      shadow: shadowList.map((shadow) => {
        return {
          x: getRatio(shadow.x),
          y: getRatio(shadow.y),
          blur: getRatio(shadow.blur),
          spread: getRatio(shadow.spread),
        } as ShadowRatioItem
      }),
      innerShadow: innerShadowList.map((shadow) => {
        return {
          x: getRatio(shadow.x),
          y: getRatio(shadow.y),
          blur: getRatio(shadow.blur),
          spread: getRatio(shadow.spread),
        } as ShadowRatioItem
      }),
    }
  }

  protected _forEachEffect(callback: (text: Text) => void): void {
    this.__effectTextGroup?.forEach(callback)
  }

  protected _updateEffectText(text: Text): void {
    text.__updateWorldOpacity()
    text.__onUpdateSize()
    text.__updateChange()
    text.__updateLocalMatrix()
    text.__updateWorldMatrix()
    text.__updateLocalBounds()
    text.__updateWorldBounds()
  }

  override __updateChange(): void {
    console.log('__updateChange')
    if (!this.__textRatio) {
      this._collectRatios()
    }
    const syncProps = omitKeys(this.toJSON(), IGNORE_SYNC_KEYS)

    super.__updateChange()

    this._forEachEffect((text) => {
      text.set(syncProps)
      text.parent = this as any
      this._updateEffectText(text)
    })
  }

  override __updateBoxBounds() {
    console.log('__updateBoxBounds')
    this._forEachEffect((text) => {
      text.__updateBoxBounds()
    })
    super.__updateBoxBounds()
  }

  override __draw(canvas: ILeaferCanvas, options: IRenderOptions, originCanvas?: ILeaferCanvas): void {
    console.log('__draw')
    super.__draw(canvas, options, originCanvas)

    this._forEachEffect((text) => {
      this._updateEffectText(text)
      if (!isVisible(text)) {
        return
      }
      canvas.setWorld(text.__nowWorld = text.__getNowWorld(options))
      text.__draw(canvas, options, originCanvas)
    })
  }

  override __updateRenderSpread(): IFourNumber {
    console.log('__updateRenderSpread')
    const rootSpread = super.__updateRenderSpread()
    let [top, right, bottom, left] = FourNumberHelper.get(rootSpread)

    if (!this.textEffects?.length) {
      return [top, right, bottom, left]
    }

    this.textEffects.forEach((effect) => {
      if (!isVisible(effect))
        return

      const { x: offsetX, y: offsetY } = getOffsetValue(effect.offset)
      const strokeWidth = getStrokeWidth(effect.stroke)
      const strokeSpread = strokeWidth / 2

      const horizontalSpread = calculateDirectionSpread(offsetX, strokeSpread)
      const verticalSpread = calculateDirectionSpread(offsetY, strokeSpread)

      right = Math.max(right, horizontalSpread.positive)
      left = Math.max(left, horizontalSpread.negative)
      bottom = Math.max(bottom, verticalSpread.positive)
      top = Math.max(top, verticalSpread.negative)
    })

    return [top, right, bottom, left]
  }

  override destroy(): void {
    this.off_(this.__eventIds)
    this._forEachEffect(text => text.destroy())
    this.textEffects = this.__effectTextGroup = null
    super.destroy()
  }
}

Plugin.add('leafer-x-effect-text')
