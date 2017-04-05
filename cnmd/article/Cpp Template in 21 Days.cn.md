21天精通C++模板编程语言
==========

这篇文章最初发布于我的Lofter博客：
- http://kimleo.lofter.com/post/46977_4f86f38
- http://kimleo.lofter.com/post/46977_509271f

这是看憋了很久没有完成的21天学成Erlang之后才萌生的一个想法。所有的代码源自于我的一个项目Canvas/tpl。

另外：

> **Warning**：文中提到的所有技术都未经生产实践检验。如果大家希望通过学习C++模版元编程进而提升一些生产实践的效率，可以转到吴野菊苣的GitHub去学习，或者是去知乎/微博 @vczh。

好吧，废话到这里结束，我们进入正题：

为什么是C++模版？

- C++模版给我们提供了一套自由的类型系统
- C++模版是原生支持模式匹配和递归的
- C++模版可以允许我们对其进行动态扩展
- 最重要的是，我们能够并且必须用C++模版重新构造整个世界。包括从如何数（shǔ）数（shù）开始。因为模版是图灵完备的。

OK，接下来是我们的整套计划：

- 构造
- 使用
- 相等性与同一
- 模式匹配
- 类型限定
- 递归
- 扩展
- 表
- 映射与规约
- 数据结构
- 抽象（Range）
- 对象与状态
- 函数式思维
- 表达式树
- 求值
- 解释器

嗯，没错，我们也是走的同样的一条路：用C++模版最后写出一个类Scheme语言的解释器。

好的我们开始吧。

首先是构造整个世界，要从如何数数开始。
```c++
struct zero{};

template<class Nat>
struct succ{};
```

很简单嘛，我们就把整个自然数系统给构建出来了。

为什么要这么说？因为皮埃诺公理说明我们是正确的。

于是`zero`表示自然数0，`succ<zero>`就可以表示自然数1，`succ<n>`就可以表示自然数n+1。

当然，也许我们需要知道更多的关于自然数的信息，比如它的前驱是什么？

这里的定义是，如果`succ<x> = n`，那么，`x = pred<n>`。

但是目前如何表示这个关系呢？

我们试着把`succ`修改一下：
```c++
template<class Nat>
struct succ{ using pred = Nat; };
```
很简单了，succ<n>::pred = n。

任何时候都能够这样使用我们在代码中定义的这些结构，比如作为形式参数（如Nat），作为实际参数（succ<n>中的n），作为属性值（succ<n>::pred中的pred）。

话说，怎么知道succ<n>::pred = n就一定是正确的呢？

在这之前，我们还要定义相等性：

```c++
struct $true{};

struct $false{};

template<class Obj1, class Obj2>
struct equal{ using value = $false; };

template<class T>
struct equal<T,T>{ using value = $true; };
```

没错，这就是相等性的玩法。当然这也是一个小技巧，当`equal`遇到他的两个参数都是同一个的时候，属性`value`就是`$true`。至于`$true`和`$false`代表的是什么，就看我们自己的约定啦。

然后是弄一个辅助测试的结构，来帮助我们进行每一次过程中的测试：

```c++
template<class Result>
struct Assert{
    Assert() {throw 0;}
};

template<>
struct Assert<$true>{
    Assert() {}
};
```

然后我们只需要在测试代码中这样写就好了：

```c++
Assert<typename equal<typename succ<zero>::pred,
                zero>::value>();
```
意图很明显，当我们测试用例的结果不为`$true`的时候，直接throw一个exception出来中止测试就好。

可以看出我们在定义`equal`和`Assert`的时候分别定义了多次，这其实是C++模版的一个很重要的东西，叫做模版（偏）特化。因为这个特性的存在，我们就可以让编译器按照我们设定好的参数模式去匹配相应的定义。嗯，没错这就是模式匹配。

比如，pred也可以这样子定义：

```c++
struct undefined {};

template<class T>
struct pred{ using value=undefined; };

template<class T>
struct pred<succ<T>> 
{ using value=T; };
```

完全按照pred的定义来。并且如果可以的话我们还能够继续加上一条：

```c++
template<>
struct pred<zero> { using value=zero; };
```

0的前驱也默认为0，防止后面出现某些错误情况。

但是到这里是否大家也发现了一个问题：

我们既可以使用`succ<zero>`，也可以使用`succ<$false>`，甚至是`succ<undefined>`，也就是说，模版带给我们方便的类型系统的同时，并没有很细致的告诉我们，哪些操作是错误的。而同时我们又需要避免这个错误。

但还好可以写出以下这种样子的代码：

```c++
template<class Nat>
struct succ;

template<>
struct succ<zero> {};

template<class Nat>
truct succ<succ<Nat>> {};
```

当我们去`succ`除了`zero`和`succ<...>`之外的任何结构的时候，都会造成一次失败的展开。

好的，有了这些东西我们就可以自在地数数了。但是可能用来表示一个大数还是很困难，比如6就要这样子表示：
```c++
succ<succ<succ<succ<succ<succ<zero>>>>>>
```
当然这么做的话就太失败了。其实我们只要把加法和乘法定义出来，就能够做到简单的来表示一些比较大的数字了。

```c++
template<class Num1, class Num2>
struct add;

template<class Num1>
struct add<zero, Num1>
{ using value = Num1; };

template<class Num1, class Num2>
struct add<succ<Num1>, Num2>
{ using value = typename add<Num1, succ<Num2>>::value; };
```

对应到Haskell-like的代码如下：

```haskell
add :: nat -> nat -> nat
add 0 n = n
add (succ m) n = add m (succ n) 
```

递归就是这么简单;)。

然后我们看乘法：

```c++
template<class Num1, class Num2>
struct mul;

template<class Num1>
struct mul<zero, Num1>
{ using value = zero; };

template<class Num1, class Num2>
struct mul<succ<Num1>, Num2>
{ using value = typename add<Num2, 
                        typename mul<Num1, 
                                Num2>::value>::value; };
```

只是一个更复杂的递归。

> 练习：试用递归定义出来幂运算。

于是，我们就能用现有的运算来定义更复杂的内容了：

```c++
using i0 = zero;
using i1 = succ<zero>;
using i2 = succ<i1>;
using i3 = succ<i2>;
using i4 = typename add<i2, i2>::value;
// blablabla
```

然后我们可以定义一个更加容易的定义数据的方式：

```c++
template<class Num, class... Nums>
struct decimal
{ using value = typename add<typename mul<i10, Num>::value,
                            typename decimal<Nums...>::value>::value; };

template<class Num>
struct decimal<Num>
{ using value = Num; };
```

> 练习：请根据以下声明来定义用于布尔类型的操作。
>（Hint：模式匹配）
> ```c++
> template<class Bool1, class Bool2>
> struct $and;
> 
> template<class Bool1, class Bool2>
> struct $or;
> 
> template<class Bool, class Op1, class Op2>
> struct $if;
> ```

接下来我们看另外一个重要的结构，列表。

```c++
struct nil { using length = zero; };

template<class First, class Rest>
struct pair
{ using length = succ<typename Rest::length>; };
```

对应来一个创建列表的构造：

```c++
template<class Head, class... Tail>
struct list {
    using value = pair<Head, typename list<Tail...>::value>;
    using length = typename value::length;
};

template<class Head>
struct list<Head> {
    using value = pair<Head, nil>;
    using length = i1;
};
```

> 如`list<Elems...>`构造的样子，列表本身就是一个递归的结构，所以，对于大多数列表的处理，我们都可以通过使用递归来实现。

比如：

```c++
template<class Num, class List>
struct take;

template<class Head, class Tail, class Num>
struct take<succ<Num>, pair<Head, Tail>>
{ using value = pair<Head, typename take<Tail, Num>::value>; };

template<class Num>
struct take<Num, nil> { using value = nil; };

template<class List>
struct take<zero, List> { using value = nil; };
```

同理：

> 练习：实现`drop :: nat -> [x] -> [x]`和`concat :: [x] -> [x] -> [x]`函数；前者用于返回去掉指定个数元素的列表，后者用于连接两个列表。

于是，我们有了对列表的一些基本构造法。同样的利用这些构造法，我们就能够做更多地操作。比如，`map :: (a -> b) -> [a] -> [b]`：

```c++
template<template<class A> class Fn, class ListA>
struct map;
```

map接受一个从A到B的变换，然后接受一个A类型元素的列表，把该变换对应到列表的每一个元素，然后产生一个新的B类型元素的列表。

```c++
template<template<class A> class Fn, class Head, class Tail>
struct map<Fn, pair<Head, Tail>>{
    using value = pair<typename Fn<Head>::value,
                            typename map<Fn, Tail>::value>;
};

template<template<class A> class Fn>
struct map<Fn, nil>{
    using value = nil;
};
```

> 练习：实现`filter :: (a -> bool) -> [a] -> [a]`。


其实，作为组合数据结构来说，还有更多的类型。

比如

```c++
template<class... Elems>
struct array {};
```

我们定义一个新的函数叫做`index :: num -> array of a -> a`：

```c++
template<class Num, class Array>
struct index;

template<class Num, class Elem, class... Elems>
struct index<succ<Num>, array<Elem, Elems...>>{
    using value = typename index<Num, array<Elems...>>::value;
};

template<class Elem, class... Elems>
struct index<zero, array<Elem, Elems...>> {
    using value = Elem;
};
```

因为跟`list`有着类似的形式：表示形式上的线性和处理形式上的递归性，所以我们似乎可以考虑把对于`list`的某些操作转换到`array`上，比如：

```c++
template<template<class A> class Fn, class... Elems>
struct map<Fn, array<Elems...>> {
    using value = array<typename Fn<Elems>::value...>;
};
```

毫无违和感。C++模版给我们提供的parameter pack成功的帮我们简化了操作。同样，依赖着partial specialization技术，这样子对map进行扩展也没有什么异样。

> 练习：尝试写一个`range`构造，用法与Python的`range`函数类似，同样的，写出一个与该构造对应的`map`函数

模版给了我们自由创造构造和添加扩展的能力，一方面用于组合数据，另一方面用于提供抽象操作。而根据我之前的论证，这两点足以让我们组合出更复杂的程序。

所以接下来我们就来写一个简单的逻辑求值器。

首先是各项的表示：（Hint：为了避免名字冲突问题，请尽量把前面表示布尔和逻辑关系的一些项与本节内容放在不同空间内（本节假设为boolean）。

```c++
struct $false {};

template<class T>
struct $var {};

using $undefined = $var<$false>;

template <class Prop1, class Prop2>
struct $and {};

template<class T>
struct $not {};

using $true = $not<$false>;

template<class Var, class Prop>
struct $exists {};

template <class Prop1, class Prop2>
using $or = $not<$and<$not<Prop1>, $not<Prop2>>>;

template <class Prop1, class Prop2>
using $iff = $or<$and<Prop1, Prop2>, $and<$not<Prop1>, $not<Prop2>>>;

template <class Prop1, class Prop2>
using $implies = $or<$not<Prop1>, Prop2>;

template <class Var, class Prop>
using $forall = $not<$exists<Var, $not<Prop>>>;
```

有了这些，我们就有了一套清晰的结构来表达任意复杂的命题逻辑了。

比如：

```c++
$exists<$var<A>, $forall<$var<B>, $implies<B, A>>>
```

每个表达式，要么是一个基本构造（比如`$false`， `$not`），要么是能通过一个等价变换转换成基本构造（比如`$forall`、`$implies`）。所以这样子就能让这些表达式反复组合，从简单到变到复杂；而同样的一个任意复杂的表达式也可以一层一层的展开成最简单的基本构造。展开后的结果大致上是一个树形，一般称为AST。

于是对一个命题逻辑表达式求值为的过程就是对其进行一步步的展开然后再一步步的归约成最终结果的过程。

于是我们可以把这个求值器抽象成这个样子：

```c++
template<class Env, class Prop>
struct eval;
```

在指定环境中对指定表达式进行求值。

比如：
```c++
template<class Env>
struct eval<Env, $false> {
    using value = boolean::$false;
};

template<class Env, class Prop>
struct eval<Env, $not<Prop>>{
    using value = typename boolean::$not<
                                            typename eval<Env, Prop>::value
                                        >::value
};

template<class Env, class Prop1, class Prop2>
struct eval<Env, $and<Prop1, Prop2>>{
    using value = typename boolean::$and<
                                            typename eval<Env, Prop1>::value,
                                            typename eval<Env, Prop2>::value
                                        >::value;
};
```

当然这里处理起来很简单，我们只需要按照表达式的结构对其递归求值即可。不过当引入量化（exists、forall）和变量的时候，就需要考虑一下深层的问题了。

首先要考虑的是如何构建和查询求值环境：

```c++
template<class A, class B>
struct $entry {
    using first = A;
    using next = B;
};

template<class Var = $undefined, 
                    class Val = $false, 
                    class List = list::nil>
struct $env {
    using value = typename list::pair<$entry<Var,Val>, List>;
};

template<class Env,class Val>
struct $env_lookup {
    template<class Var>
    struct helper {
        using value = typename boolean::same<Val, typename Var::first>::value;
    };
    using value = typename list::iter::find<helper, typename Env::value>::value::next;
};
```

解释起来很简单，env其实就是用list来实现的，然后我们利用`list::iter::find`（ `(a -> bool) -> [a] -> a`，返回列表中第一个符合条件的元素）实现了查找env中的变量的值。

嗯，有了这两样东西，我们就可以完整的实现eval了：

```c++
template<class Env, class Var>
struct eval<Env, $var<Var>> {
    using value = typename $eval<Env, 
                            typename $env_lookup<Env, $var<Var>>::value 
                        >::value;
};

template <class Env, class Var, class Prop>
struct eval<Env, $exists<Var, Prop>> {
    using value = typename boolean::$or<
                    typename $eval<$env<Var,
                                            $false,
                                            typename Env::value>,
                                        Prop>::value,
                    typename $eval<$env<Var,
                                            $true,
                                            typename Env::value>,
                                        Prop>::value
                    >::value;
};
```

嗯，没错就这么简单。

看一下测试代码吧：

```c++
AssertAll<
    typename $eval<$env<>, $true>::value, /// T
    typename $eval<$env<>, $not<$false>>::value,    /// !F
    typename $eval<$env<>, $or<$false,$true>>::value,  /// F || T
    typename $eval<$env<>, $implies<$false,$true>>::value, /// F => T
    typename $eval<$env<>, $iff<$false,$false>>::value,    /// F <=> F
    typename $eval<$env<$var<A>, $false>, $not<$var<A>>>::value, /// A = F, !A

    /// A = T, !A => A
    typename $eval<$env<$var<A>, $true>,  $implies<$not<$var<A>>, $var<A>>>::value,

    /// forall A, T
    typename $eval<$env<>, $forall<$var<A>, $true>>::value,
    /// exists A, !A
    typename $eval<$env<>, $exists<$var<A>, $not<$var<A>>>>::value
>();
```

有了这么几个实例，我觉的写Scheme解释器应该不是问题了吧。