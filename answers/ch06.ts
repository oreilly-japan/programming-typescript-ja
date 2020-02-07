export default null // モジュールモードを強制します

// 1. 次のそれぞれの型のペアについて、最初の型が2番目の型に割り当て可能かどうかを、その理由も添えて答えてください。サブタイプと変性の観点からこれらについて考え、もし確信を持って答えられなければ、章の初めのほうのルールを参照してください（それでも確信が持てなければ、コードエディターに入力してチェックしてください）。

// 1a. 1 と number

let a: number
a = 1 as 1

/* 割り当て可能です。リテラル型の1はnumberのサブタイプなので、numberに割り当てることができます。 */

// 1b. number と 1

let b: 1
b = 2 as number

/* 割り当て可能ではありません。numberはリテラル型の1のスーパータイプなので、1に割り当てることはできません。 */

// 1c. string と number | string

let c: number | string
c = 'foo' as string

/* 割り当て可能です。stringはnumber | stringのサブタイプなので、number | stringに割り当てることができます。 */

// 1d. boolean と number

let d: number
d = true as boolean

/* 割り当て可能ではありません。boolean型とnumber型は関係がありません。 */

// 1e. number[] と (number | string)[]

let e: (number | string)[]
e = [1] as number[]

/* 割り当て可能です。配列はそのメンバーに関して共変なので、配列が別の配列に割り当て可能であるためには、「そのメンバー <: 別の配列のメンバー」でなければなりません。numberはnumber | stringのサブタイプなので、number[]を(number | string)[]に割り当てることができます。 */

// 1f. (number | string)[] と number[]

let f: number[]
f = [1] as (number | string)[]

/* 割り当て可能ではありません。配列はそのメンバーに関して共変なので、配列が別の配列に割り当て可能であるためには、「そのメンバー <: 別の配列のメンバー」でなければなりません。number | stringはnumberのサブタイプではなく、スーパータイプなので、(number | string)[]をnumber[]に割り当てることはできません。 */

// 1g. {a: true} と {a: boolean}

let g: {a: boolean}
g = {a: true} as {a: true}

/* 割り当て可能です。オブジェクトはそのメンバーに関して共変なので、オブジェクトが別のオブジェクトに割り当て可能であるためには、「そのそれぞれのメンバー <: 別のオブジェクトのメンバー」でなければなりません。このオブジェクトはaという1つのメンバーだけを持ち、その型はリテラル型のtrueです。「true <: boolean」なので、{a: true} というオブジェクト全体を {a: boolean} に割り当てることができます。 */

// 1h. {a: {b: [string]}} と {a: {b: [number | string]}}

let h: {a: {b: [number | string]}}
h = {a: {b: ['c']}} as {a: {b: [string]}}

/* 割り当て可能です。（e）から（g）のルールを組み合わせると、ネストされたオブジェクトが別のオブジェクトに割り当て可能であるためには、「そのそれぞれのメンバー <: 別のオブジェクトのメンバー」でなければなりません。これを再帰的に繰り返します。

{a: {b: [string]}} は {a: {b: [number | string]}} に割り当て可能か？
以下が真であれば、割り当て可能です：
  {b: [string]} は {b: [number | string]} に割り当て可能か？
  以下が真であれば、割り当て可能です：
    [string] は [number | string] に割り当て可能か？
    以下が真であれば、割り当て可能です：
      string は number | string に割り当て可能か？
      string は number | string という合併型に含まれているので、割り当て可能です。
*/

// 1i. (a: number) => string と (b: number) => string

let i: (b: number) => string
i = ((b: number) => 'c') as (b: number) => string

/* 割り当て可能です。関数が別の関数に割り当て可能であるためには、「そのそれぞれのパラメーター >: 別の関数のパラメーター」および「その戻り値の型 <: 別の関数の戻り値の型」でなければなりません。「number >: number」であり、「string <: string」なので、この関数型は割り当て可能です。 */

// 1j. (a: number) => string と (a: string) => string

let j: (a: string) => string
j = ((a: number) => 'b') as (a: number) => string

/* 割り当て可能ではありません。関数が別の関数に割り当て可能であるためには、「そのそれぞれのパラメーター >: 別の関数のパラメーター」および「その戻り値の型 <: 別の関数の戻り値の型」でなければなりません。numberはstringとは関係がないので、「number >: string」ではなく、この関数型は割り当て可能ではありません。 */

// 1k. (a: number | string) => string と (a: string) => string

let k: (a: string) => string
k = ((a: number | string) => 'b') as (a: number | string) => string

/* 割り当て可能です。関数が別の関数に割り当て可能であるためには、「そのそれぞれのパラメーター >: 別の関数のパラメーター」および「その戻り値の型 <: 別の関数の戻り値の型」でなければなりません。number | stringはstringのスーパータイプであり、「string <: string」なので、この関数型は割り当て可能です。 */

// 1l. （列挙型 enum E {X = 'X'} で定義されている）E.X と（列挙型 enum F {X = 'X'} で定義されている）F.X

enum E {
  X = 'X'
}
enum F {
  X = 'X'
}
let l: F.X
l = E.X as E.X

/* 割り当て可能ではありません。列挙型のメンバーが別の列挙型のメンバーに割り当て可能であるためには、同じ列挙型に由来するものでなければなりません。どちらのメンバーもXという名前であり、同じ文字列値'X'を持っていますが、それらは異なる列挙型について定義されているので、それらを互いに割り当てることはできません。 */

// 2. type O = {a: {b: {c: string}}} というオブジェクト型がある場合、keyof Oの型は何になるでしょうか？ O['a']['b']については、どうでしょうか？

type O = {a: {b: {c: string}}}
type P = keyof O // 'a'
type Q = O['a']['b'] // {c: string}

// 3. TかUのどちらかに含まれる（ただし両方には含まれない）型を計算するExclusive<T, U>型を記述してください。たとえば、Exclusive<1 | 2 | 3, 2 | 3 | 4>は、1 | 4になります。Exclusive<1 | 2, 2 | 4>を型チェッカーがどのように評価するかを、ステップごとに書き出してください。

type Exclusive<T, U> = Exclude<T, U> | Exclude<U, T>

type R = Exclusive<1 | 2 | 3, 2 | 3 | 4> // 1 | 4
type U = Exclusive<1 | 2, 2 | 4>

/*
  1. Exclusive<1 | 2, 2 | 4> から始めます。
  2. Exclude<1 | 2, 2 | 4> | Exclude<2 | 4, 1 | 2> に置き換えます。
  3. (1 | 2 extends 2 | 4 ? never : 1 | 2) | (2 | 4 extends 1 | 2 ? never : 2 | 4) に置き換えます。
  4. (1 extends 2 | 4 ? never : 1) | (2 extends 2 | 4 ? never : 2) | (2 extends 1 | 2 ? never : 2) | (4 extends 1 | 2 ? never : 4) と分配します。
  5. 1 | never | never | 4 と単純化します。
  6. 1 | 4 と単純化します。
*/

// 4. 明確な割り当てアサーションを使わないように、（「6.6.3 明確な割り当てアサーション」の）例を書き直してください。

let globalCache = {
  get(key: string) {
    return 'user'
  }
}

let userId = fetchUser()
userId.toUpperCase()

function fetchUser() {
  return globalCache.get('userId')
}
