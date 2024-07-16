export type ISquare = {
  id: number
  row: number
  col: number
  isOpen: boolean
  value: number | null
  isBomb: boolean
  isFlagged: boolean
}
