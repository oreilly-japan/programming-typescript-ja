export default null // モジュールモードを強制します

// 1. TypeScriptは、関数の型シグネチャのうち、どの部分を推論するでしょうか？ パラメーターでしょうか、戻り値の型でしょうか、それともその両方でしょうか？

/* TypeScriptは常に関数の戻り値の型を推論します。文脈から推論できる場合は、関数のパラメーター型を推論することもあります（たとえば、その関数がコールバックの場合）。 */

// 2. JavaScriptのargumentsオブジェクトは型安全でしょうか？ もしそうでないとすると、代わりに何が使えるでしょうか？

/* argumentsは型安全ではありません。代わりに、次のようにレストパラメーターを使用すべきです。

変更前：function f() { console.log(arguments) }

変更後：function f(...args: unknown[]) { console.log(args) }
*/

// 3. すぐに出発する旅行を予約する機能が欲しいとします。オーバーロードされたreserve関数（「4.1.9 オーバーロードされた関数の型」を参照）を、3番目の呼び出しシグネチャを作成して書き換えてください。このシグネチャは、目的地（destination）だけを取り、明示的な出発日（from）は取りません。

type Reservation = unknown

type Reserve = {
  (from: Date, to: Date, destination: string): Reservation
  (from: Date, destination: string): Reservation
  (destination: string): Reservation
}

let reserve: Reserve = (
  fromOrDestination: Date | string,
  toOrDestination?: Date | string,
  destination?: string
) => {
  if (
    fromOrDestination instanceof Date &&
    toOrDestination instanceof Date &&
    destination !== undefined
  ) {
    // 宿泊旅行を予約する
  } else if (
    fromOrDestination instanceof Date &&
    typeof toOrDestination === 'string'
  ) {
    // 日帰り旅行を予約する
  } else if (typeof fromOrDestination === 'string') {
    // すぐに出発する旅行を予約する
  }
}

// 4. ［難問］callの実装（「4.2.5.2 制限付きポリモーフィズムを使って、可変長引数をモデル化する」を参照）を、2番目の引数がstringである関数についてだけ機能するように書き換えてください。そうではない関数を渡すと、コンパイル時にエラーとなるようにします。

function call<T extends [unknown, string, ...unknown[]], R>(
  f: (...args: T) => R,
  ...args: T
): R {
  return f(...args)
}

function fill(length: number, value: string): string[] {
  return Array.from({length}, () => value)
}

call(fill, 10, 'a') // string[]

// 5. 型安全なアサーション関数、`is`を実装してください。型で概略を記述することから始めます。これは、完成したら、次のように使えるものです。

// stringとstringを比較します
is('string', 'otherstring') // false

// booleanとbooleanを比較します
is(true, false) // false

// numberとnumberを比較します
is(42, 42) // true

// 異なる型同士を比較すると、コンパイル時エラーになります
is(10, 'foo') // エラー TS2345: 型 '"foo"' の引数を型 'number' の
              // パラメーターに割り当てることはできません。

// ［難問］任意の数の引数を渡せるようにします
is(1, 1, 1) // true
is(1, 2, 3) // false

function is<T>(a: T, ...b: [T, ...T[]]): boolean {
  return b.every(_ => _ === a)
}
