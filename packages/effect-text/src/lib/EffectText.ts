import type {
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
  dataProcessor,
  Debug,
  FourNumberHelper,
  registerUI,
  Text,
  TextData,
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
const console = Debug.get('EffectText')

@registerUI()
export class EffectText<TConstructorData = IEffectTextInputData> extends Text<TConstructorData> implements IEffectText {
  get __tag() {
    return 'EffectText'
  }

  @dataProcessor(EffectTextData)
  public __: IEffectTextData

  @boundsType()
  textEffects?: ITextEffect[]

  public __effectTextGroup?: Text[]

  constructor(data?: TConstructorData) {
    super(data)
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
    const syncProps = omitKeys(this.toJSON(), IGNORE_SYNC_KEYS)

    super.__updateChange()

    this._forEachEffect((text) => {
      text.set(syncProps)
      text.parent = this as any
      this._updateEffectText(text)
    })

    this.__.updateEffectPositions()
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
    if (this.textEditing && !options.exporting)
      return

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
    this._forEachEffect(text => text.destroy())
    this.textEffects = this.__effectTextGroup = null
    super.destroy()
  }
}
