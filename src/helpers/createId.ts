import { customAlphabet } from 'nanoid'
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(alphabet, 25)

export function createId() {
  return nanoid(25)
}
