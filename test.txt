Test File about this site
======

Here is the thing, I want to try something to make this site looks 
like an wiki, but what I can see is that there are no one can fit
my need. that's why I am trying using simple text file to write this
things.

This format I use adoped mainly from [wiki:Markdown](), and all these
extensions is intend to enhance the cross reference between internal
and external of the site contents.

Since there are no some translator for this format now, it will stay
in plain text format, and I'll gonna translate much of my work into
this style.

## Extension used in this format

### namespaces

First thing that I introduced is the namespace.

Let's say if you want link an item exists in Wikipedia, you can just add
a normal link, but with a `wiki:` prefix like `[wiki:Markdown]()`, it
means that you want link this page to `https://en.wikipedia.org/wiki/Markdown`.

For internal items(like in wikipedia, it's single page for one item),
just put an `:` as a prefix, e.g. `[:about me]()` ([:about me]()).

But with a `[]()` decorator is far ugly than what we expect, if you want
just ref an internal item, you can simply put an `:` in front of a word,
e.g. `:Lisp` (:Lisp).

### sections

Let's say if you want ref a inner section of an item. Like in an URI, just
treat it as a fragment, tag an hash in between of the item and the section,
e.g. `:Lisp#History`

### Other DSLs for complex relationships.

Surely I'll invent lots of stuff with this format to represent my idea,
like if I want try build an graph, will try graphviz/dot(although there
is a community driven graphviz for GitHub [github:TLmaK0/gravizo]()).

List of DSLs which may exists in this site:
 - Graphviz
 - LaTeX/math
 - PlanetUML
 - ...

### Contributions

If you have any new idea, or want to help me implement this, please visit 
[github:kenpusney/plt-collections/issues/new]()

Thanks!
