import type { ITextCharData, ITextRowData } from '@leafer-ui/interface'

export const TextRowHelper = {

  trimRight(row: ITextRowData): void {
    const { words } = row
    let trimRight = 0; const len = words.length; let char: ITextCharData

    for (let i = len - 1; i > -1; i--) {
      char = words[i].data[0]
      if (char.char === ' ') {
        trimRight++
        row.width -= char.width
      }
      else {
        break
      }
    }

    if (trimRight)
      words.splice(len - trimRight, trimRight)
  },

}
