Workflow of this wiki
==========

The normal way of create a new wiki item is just add a new [:CNMD]() page, and then publish,
it will be accessible from anywhere of this wiki using the cross-notation reference.

But for more complicated items, it may belongs to some specific category, like, an article, or
a source code snippet. I use folders as categories, and then can using folder name as the namespace
for all items in that category, and README.cn.md document under that folder will be the index of
the category.

Also I've created a utility script to complete the workflow.

e.g. if you want to create a new category:
```
./wiki new category entity
```

then you trying to add item into that category:
```
./wiki new entity "Wiki Item"
```

then go to `./cnmd/entity/Wiki Item.cn.md` edit the content.

All detailed code is in `wiki` script of [github:kenpusney/kimiwiki]() repository.
