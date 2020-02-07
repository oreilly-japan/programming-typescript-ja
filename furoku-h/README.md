# 「付録H ESLintとAST」のサンプルコード

## 使用方法

下記のコマンドにより挙動を確認できます。
詳細な解説は書籍をご覧ください。

```sh
# 依存パッケージのインストール
$ npm install

# ルールのコンパイル
$ npx tsc eslint-rules/no-parameter-properties.ts

# ルールの実行と自動修正の適用
$ npx eslint my-class.ts --rulesdir eslint-rules --fix
```
