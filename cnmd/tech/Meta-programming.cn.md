# Meta-Programming (draft)

元编程，参考[wiki:Metaprogramming]()，表示一种高级的编程技巧：即，可以操纵程序的程序。
通过把程序作为数据，读取、生成、分析和转换从而得到（特别是功能上）更加完善的程序。

### 宏和模板引擎

宏（[wiki:Macro]()），是一些简单的生成指令的集合。作为元编程的一种形态而广泛存在：通过简单的
逻辑关系和内嵌的相应的代码来生成和完善程序的功能。简单的例子比如C语言的预处理器（[wiki:C Preprocessor]()）
或者Scheme的<del>卫生巾</del>宏（[wiki:Hygienic macro]()）。作为独立的宏处理器，[wiki:m4 (computer language)]()在Unix世界也被广泛应用。

宏的另一个延伸就是模板引擎（[wiki:Template engine]()），也可以看成是一种元编程技法：利用数据和模板表达式来
生成数据或者特定的标记语言，更有甚者配合动态语言的eval特性可以实现更丰富的功能。

[to be continued...]