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

export interface IEffectTextData extends ITextStyleComputedData, IUIData {
  _textEffects?: ITextEffect[]
  __effectTextGroup?: IText[]
  __baseSize?: { width: number, height: number, fontSize: number }
  __originalOffsets?: Array<{ x: number, y: number }>
  _updateEffectPositions: () => void
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

// ==================== Data Class ====================

export class EffectTextData extends TextData implements IEffectTextData {
  _textEffects?: ITextEffect[]
  __effectTextGroup: IText[]
  __baseSize?: { width: number, height: number, fontSize: number }
  __originalOffsets?: Array<{ x: number, y: number }>

  setTextEffects(value: ITextEffect[]) {
    const mainText = this.__leaf as IEffectText

    if (value?.length) {
      this._recordBaseMetrics(mainText)
      this._recordOriginalOffsets(value)
      this._updateOrCreateEffectTexts(mainText, value)
    }
    else {
      this._clearAllEffects(mainText)
    }

    this._textEffects = value
  }

  private _recordBaseMetrics(mainText: IEffectText) {
    const boxBounds = mainText.__layout?.boxBounds
    this.__baseSize = {
      width: mainText.width || boxBounds?.width || 0,
      height: mainText.height || boxBounds?.height || 0,
      fontSize: mainText.fontSize || DEFAULT_FONT_SIZE,
    }
  }

  private _recordOriginalOffsets(effects: ITextEffect[]) {
    this.__originalOffsets = effects.map(v => getOffsetValue(v.offset))
  }

  private _updateOrCreateEffectTexts(mainText: IEffectText, effects: ITextEffect[]) {
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

  private _clearAllEffects(mainText: IEffectText) {
    if (this.__effectTextGroup?.length) {
      this.__effectTextGroup.forEach(t => t.visible = 0)
      this.__effectTextGroup = mainText.__effectTextGroup = []
    }
  }

  _updateEffectPositions() {
    const mainText = this.__leaf as IEffectText
    const { __effectTextGroup: group, __baseSize, __originalOffsets, _textEffects } = this

    if (!group || !__baseSize || !__originalOffsets)
      return

    const currentFontSize = mainText.fontSize || DEFAULT_FONT_SIZE
    const scale = currentFontSize / __baseSize.fontSize

    __originalOffsets.forEach((originalOffset, index) => {
      const text = group[index]
      const effect = _textEffects[index]
      if (!text || !effect)
        return

      const newX = originalOffset.x * scale
      const newY = originalOffset.y * scale

      text.x = newX
      text.y = newY
      effect.offset = {
        x: newX,
        y: newY,
        visible: true,
      }
      text.__updateLocalMatrix()
      text.__updateWorldMatrix()
    })
  }
}

// ==================== Main Class ====================

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
    const syncProps = omitKeys(this.toJSON(), IGNORE_SYNC_KEYS)

    super.__updateChange()

    this._forEachEffect((text) => {
      text.set(syncProps)
      text.parent = this as any
      this._updateEffectText(text)
    })

    this.__._updateEffectPositions()
  }

  override __updateBoxBounds() {
    super.__updateBoxBounds()
    this._forEachEffect((text) => {
      text.__updateBoxBounds()
    })
  }

  override __draw(canvas: ILeaferCanvas, options: IRenderOptions, originCanvas?: ILeaferCanvas): void {
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
    const rootSpread = super.__updateRenderSpread()
    let [top, right, bottom, left] = FourNumberHelper.get(rootSpread)

    if (!this.textEffects?.length) {
      return [top, right, bottom, left]
    }

    this.textEffects.forEach((effect) => {
      if (!effect.visible)
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
