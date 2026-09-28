let addPromise

const getAdd = async () => {
  if (!addPromise) {
    addPromise = fetch(new URL('../wasm/add.wasm', self.location.href))
      .then((response) => response.arrayBuffer())
      .then((bytes) => WebAssembly.instantiate(bytes))
      .then(({ instance }) => ({ add: instance.exports.add, engine: 'wasm' }))
      .catch(() => ({ add: (a, b) => a + b, engine: 'js' }))
  }
  return addPromise
}

self.onmessage = async (event) => {
  const { add, engine } = await getAdd()
  const totals = {}
  for (const order of event.data.orders) {
    const orderTotals = {}
    for (const product of order.products) {
      for (const price of product.price) {
        const current = Math.round((orderTotals[price.symbol] ?? 0) * 100)
        const next = Math.round(price.value * 100)
        orderTotals[price.symbol] = add(current, next) / 100
      }
    }
    totals[order.id] = orderTotals
  }
  self.postMessage({ totals, engine })
}
