export default null // モジュールモードを強制します

// 1. この章で紹介したパターンのいずれかを使って、次に示すAPIに関するエラーの処理方法を設計してください。このAPIでは、すべての操作は失敗する可能性があります――失敗を考慮に入れるよう、APIのメソッドのシグネチャを自由に書き換えてください（もしくは、望むのであれば、書き換えずにそのまま使ってください）。発生するエラーを処理しながら、一連のアクションをどのように実行できるかについて考えてください（たとえば、ログインしたユーザーのIDを取得し、彼らの友人のリストを取得し、それぞれの友人の名前を取得する）。

type UserID = unknown

declare class API {
  getLoggedInUserID(): Option<UserID>
  getFriendIDs(userID: UserID): Option<UserID[]>
  getUserName(userID: UserID): Option<string>
}

interface Option<T> {
  flatMap<U>(f: (value: T) => None): None
  flatMap<U>(f: (value: T) => Option<U>): Option<U>
  getOrElse(value: T): T
}
class Some<T> implements Option<T> {
  constructor(private value: T) {}
  flatMap<U>(f: (value: T) => None): None
  flatMap<U>(f: (value: T) => Some<U>): Some<U>
  flatMap<U>(f: (value: T) => Option<U>): Option<U> {
    return f(this.value)
  }
  getOrElse(): T {
    return this.value
  }
}
class None implements Option<never> {
  flatMap(): None {
    return this
  }
  getOrElse<U>(value: U): U {
    return value
  }
}

function listOfOptionsToOptionOfList<T>(list: Option<T>[]): Option<T[]> {
  let empty = {}
  let result = list.map(_ => _.getOrElse(empty as T)).filter(_ => _ !== empty)
  if (result.length) {
    return new Some(result)
  }
  return new None()
}

let api = new API()
let friendsUserNames = api
  .getLoggedInUserID()
  .flatMap(api.getFriendIDs)
  .flatMap(_ => listOfOptionsToOptionOfList(_.map(api.getUserName)))
