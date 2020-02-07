export default null // モジュールモードを強制します

// 1. 宣言のマージをいろいろと試してみて、次のことを行ってください。

// 1a. 値と型の代わりに名前空間とインターフェースを使って、コンパニオンオブジェクトを実装し直してください。

interface Currency {
  unit: 'EUR' | 'GBP' | 'JPY' | 'USD'
  value: number
}

namespace Currency {
  export let DEFAULT: Currency['unit'] = 'USD'
  export function from(value: number, unit = Currency.DEFAULT): Currency {
    return {unit, value}
  }
}

let amountDue: Currency = {
  unit: 'JPY',
  value: 83733.1
}

let otherAmountDue = Currency.from(330, 'EUR')

// 1b. 列挙型に静的メソッドを追加してください。

enum Color {
  RED = '#ff0000',
  GREEN = '#00ff00',
  BLUE = '#0000ff'
}

namespace Color {
  export function getClosest(to: string): Color {
    // ...
  }
}

Color.getClosest('#ffa500')
