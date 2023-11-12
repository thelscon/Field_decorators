// створити декоратор Memoize для методу класу, який буде на основі отриманих
//  аргументів метода повертати закешоване значення

function Memoize () {

  return function <T , A extends any[] , R > (
    originalMethod : (...args : A) => R ,
    context : ClassMethodDecoratorContext<T , (...args : A) => R >
  ) {

    if (context.kind !=='method') throw new Error ('not method')
  
    return function (this : T , ...value : A) {
      return value[0] > 100 ? 'cache value' : originalMethod.apply (this , value)
    }
  }
}

// + Мемоизация для методов типа TypeMemoize, и только для DecorableClass , возвращает cache, если значение
// аргумента соответствует значению декоратора

type TypeMemoize = (value : number) => string

interface IMemoize {
  Memoize : TypeMemoize
}

function MemoizeForDecorableClass (cache : number ) {

  //start decorator
  return function <T extends DecorableClass> (
    originalMethod : TypeMemoize ,
    context : ClassMethodDecoratorContext<T, typeof originalMethod >
  ) {
    
    //start method
    return function (this : T , value : number) {
      return value === cache ? `cache value ${cache} === argument value ${value}` : originalMethod.call (this , value)
    }
  }
}



// створити декоратор Debounce для методу класу, який за отриманим значенням
//  буде відтерміновувати запуск методу

function Debounce (milliseconds ?: number) {

  return function <T , A extends any[] , R> (
    originalMethod : (...args : A) => R ,
    context : ClassMethodDecoratorContext<T , (...args : A) => R>
  ) {

    if (context.kind !=='method') throw new Error ('not method')

    return function (this : T , ...args : A) {
      if (milliseconds && milliseconds > 0) {
        setTimeout(() => {
          originalMethod.apply (this , args)
        }, milliseconds);
      }
      else {
        originalMethod.apply (this , args)
      }
    }
    
  }
}



//examples
class DecorableClass implements IMemoize{
  private id = 1000000

  @Memoize()
  Memoize (value : number) {
    return `argument value - ${value}`
  }

  @Debounce (300)
  Debounce (value : number) {
    console.log (value + this.id)
  }
}

const e = new DecorableClass
e.Debounce(233)
console.log (e.Memoize(101))