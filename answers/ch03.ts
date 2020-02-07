export default null // モジュールモードを強制します

// 1. 次のそれぞれの値について、TypeScriptはどのような型を推論するでしょうか？

// 1a
let a = 1042 // number

// 1b
let b = 'apples and oranges' // string

// 1c
const c = 'pineapples' // 'pineapples'

// 1d
let d = [true, true, false] // boolean[]

// 1e
let e = {type: 'ficus'} // {type: string}

// 1f
let f = [1, false] // (number | boolean)[]

// 1g
const g = [3] // number[]

// 1h
let h = null // any

// 2. 次のそれぞれのものは、なぜエラーをスローするのでしょうか？

// 2a
let i: 3 = 3
i = 4 // エラー TS2322: 型 '4' を型 '3' に割り当てることはできません。

/*
iの型はリテラル型の3です。4の型はリテラル型の4であり、これをリテラル型の3に割り当てることはできません。
*/

// 2b
let j = [1, 2, 3]
j.push(4)
j.push('5') // エラー TS2345: 型 '"5"' の引数を型 'number' の
            // パラメーターに割り当てることはできません。

/*
jはnumberのセットを使って初期化されたので、TypeScriptはjの型をnumber[]と推論しました。'5'の型はリテラル型の'5'であり、これをnumberに割り当てることはできません。
*/

// 2c
let k: never = 4 // エラー TS2322: 型 '4' を型 'never' に
                 // 割り当てることはできません。

/*
neverはボトム型です。つまり、neverを他のすべての型に割り当てることはできますが、neverにはどの型も割り当てることができません。
*/

// 2d
let l: unknown = 4
let m = l * 2 // エラー TS2571: オブジェクトの型は 'unknown' です。

/*
unknownは、実行時に何にでもなりうる値を表します。あなたがしていることが安全であることをTypeScriptに示すには、まず、unknown型の値が、実際にはより具体的なサブタイプを持っていることをTypeScriptに示す必要があります。これを行うには、typeof、instanceof、または他の型クエリーや型ガードを使って値を絞り込みます。
*/
