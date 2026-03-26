const TRANSFER_URL = 'http://localhost:3000/transfer'

async function makeTransfer() {
  return fetch(TRANSFER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      value: 100,
      payer: 2,
      payee: 3,
    }),
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
}

async function runTest() {
  await Promise.all([
    makeTransfer(),
    makeTransfer(),
    makeTransfer(),
  ])
}

runTest()