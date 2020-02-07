declare const foo: Function

class MyClass {
  private ok1 = 1
  ok2 = !this.ng1
  constructor(
    ok3: string,
    public readonly ng1: boolean,
    @foo private ng2 = 1,
    protected ng3?: RegExp
  ) {}
}
