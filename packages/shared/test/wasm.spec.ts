import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('webassembly price engine', () => {
  it('exports integer addition', async () => {
    const bytes = await readFile('apps/orders/public/wasm/add.wasm')
    const { instance } = await WebAssembly.instantiate(bytes)
    const add = instance.exports.add as (left: number, right: number) => number
    expect(add(2500, 1750)).toBe(4250)
  })
})
