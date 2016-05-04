NG: Next generation Programming language
======

This is about the detailed description of ng-lang and for now
it's still work in progress.


## core concept

ng is a programming language which may be different from today's
programming languages, it won't be object-oriented, and it is
strong and static-typed. It is also not so much like modern
functional programming language, no such FP things annoying you.
No vars, no macros, and no MONADs! and every function should
be explicitly annotated with types.

And ng inherites **templat** from C++/D with much powerful
enhancement to let you do CTFE (Compile time function execution).


## Types

Here we have to different kinds of types, everything with out
the `ref` modifier is an value type, which is on value semantics.
and ones with `ref`, is reference type, and on ref semantics.

Let me explain you what is this about in following details.

Simple type:

 - Primitives:
   - Num (what? float?? sorry, make it yourself!)
   - Bool
   - Char
   - Unit
 - Composites:
   - Tuples (a.k.a. Product types)
   - Records
   - Sum types
   
Parameterized type:

Let's say we want build a thing that may useful like an array.
which can support different type with fixed size. How could 
you represent this? I got `Array<Int, 3>` here.

The Int and 3 in `Array<Int, 3>` are the parameters of this
type. And for the prototype of array, should looks like
```ng
type Array<'t, 'arity: Num> where 'arity >= 0
```

The where clause is a constraints for 'arity parameter which
indicates that field cannot be negative.

Here is another syntax to do this checking
```ng
type NonNegative<'num: Num> where 'num >= 0

type Array<'t, 'arity: NonNegative>
```

NonNegative is like typeclass / type traits / concepts in
other languages such like Haskell/C++/D.

Here is another constraint example in ng.
```ng
type ValueType<'t: * 'a> = 'a
```
Here we can use ValueType<ref Int> to represent Int now.



