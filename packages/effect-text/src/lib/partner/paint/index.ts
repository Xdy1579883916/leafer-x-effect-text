import type { IPaintModule } from '@leafer-ui/interface'

import { compute } from './Compute'
import { fill, fillPathOrText, fills } from './Fill'
import { fillText } from './FillText'
import { shape } from './Shape'
import { stroke, strokes } from './Stroke'
import { drawStrokesStyle, drawTextStroke, strokeText } from './StrokeText'

export const PaintModule: IPaintModule = {
  compute,

  fill,
  fills,
  fillPathOrText,
  fillText,

  stroke,
  strokes,
  strokeText,
  drawTextStroke,
  drawStrokesStyle,

  shape,
}
