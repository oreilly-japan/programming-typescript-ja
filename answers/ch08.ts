export default null // モジュールモードを強制します

// 1. 汎用的なpromisify関数を実装してください。promisifyは、1つの引数と1つのコールバックを取る任意の関数をパラメーターとして取り、それを、プロミスを返す関数の中にラップします。

function promisify<T, A>(
  f: (arg: A, f: (error: unknown, result: T | null) => void) => void
): (arg: A) => Promise<T> {
  return (arg: A) =>
    new Promise<T>((resolve, reject) =>
      f(arg, (error, result) => {
        if (error) {
          return reject(error)
        }
        if (result === null) {
          return reject(null)
        }
        resolve(result)
      })
    )
}

import {readFile} from 'fs'

let readFilePromise = promisify(readFile)
readFilePromise(__dirname + '/exercises.js')
  .then(result => console.log('done!', result.toString()))

// 2. 「8.6.1.1 型安全なプロトコル」では、型安全な行列演算のためのプロトコルの半分を作成しました。これをメインスレッドで実行すると仮定して、Web Workerスレッドで実行する残りの半分を実装してください。

type Matrix = number[][]

type MatrixProtocol = {
  determinant: {
    in: [Matrix]
    out: number
  }
  'dot-product': {
    in: [Matrix, Matrix]
    out: Matrix
  }
  invert: {
    in: [Matrix]
    out: Matrix
  }
}

// MainThread.ts
type Protocol = {
  [command: string]: {
    in: unknown[]
    out: unknown
  }
}

function createProtocol<P extends Protocol>(script: string) {
  return <K extends keyof P>(command: K) => (...args: P[K]['in']) =>
    new Promise<P[K]['out']>((resolve, reject) => {
      let worker = new Worker(script)
      worker.onerror = reject
      worker.onmessage = event => resolve(event.data)
      worker.postMessage({command, args})
    })
}

let runWithMatrixProtocol = createProtocol<MatrixProtocol>(
  'MatrixWorkerScript.js'
)
let parallelDeterminant = runWithMatrixProtocol('determinant')

parallelDeterminant([[1, 2], [3, 4]]).then(
  determinant => console.log(determinant) // -2
)

// WorkerScript.ts

type Data<
  P extends Protocol,
  C extends keyof P = keyof P
> = C extends C
  ? {command: C; args: P[C]['in']}
  : never

function handle(
  data: Data<MatrixProtocol>
): MatrixProtocol[typeof data.command]['out'] {
  switch (data.command) {
    case 'determinant':
      return determinant(...data.args)
    case 'dot-product':
      return dotProduct(...data.args)
    case 'invert':
      return invert(...data.args)
  }
}

onmessage = ({data}) => postMessage(handle(data))

declare function determinant(matrix: Matrix): number
declare function dotProduct(matrixA: Matrix, matrixB: Matrix): Matrix
declare function invert(matrix: Matrix): Matrix

// 3. （「8.6.1 Web Worker（ブラウザー）」のように）マップ型を使って、Node.jsの`child_process`用の型安全なメッセージパッシングプロトコルを実装してください。

// MainThread.ts
import {fork} from 'child_process'

function createProtocolCP<P extends Protocol>(script: string) {
  return <K extends keyof P>(command: K) => (...args: P[K]['in']) =>
    new Promise<P[K]['out']>((resolve, reject) => {
      let child = fork(script)
      child.on('error', reject)
      child.on('message', resolve)
      child.send({command, args})
    })
}

let runWithMatrixProtocolCP = createProtocolCP<MatrixProtocol>(
  './ChildThread.js'
)
let parallelDeterminantCP = runWithMatrixProtocolCP('determinant')

parallelDeterminantCP([[1, 2], [3, 4]]).then(
  determinant => console.log(determinant) // -2
)

// ChildThread.ts

// type Data ... （2のWorkerScript.tsと同様）
// function handle ... （2のWorkerScript.tsと同様）

process.on('message', data => process.send!(handle(data)))
