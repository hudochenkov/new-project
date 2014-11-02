# Как работать с CSS

main.css генерируется с помощью Grunt, Sass, Autoprefixer.

** Не редактируйте main.css! Редактируйте только *.scss файлы и затем запускайте `grunt build`.**

## Установка

1. Установить [Ruby](https://www.ruby-lang.org/en/installation/) (по-умолчанию стоит на Mac OS X).
2. Установить [Sass](http://sass-lang.com/install).
3. Установить [Node.js](http://nodejs.org/).
4. Установить Grunt Command Line Interface (grunt-cli):

        $ npm install -g grunt-cli

5. Зайти в корень проекта (там, где лежит package.json) и установить все нужные компоненты для разработки:

        $ npm install

6. Запустить `grunt build`.

## Генерация CSS

Запустить следящий сервис, который будет генерировать dev-версию (несжатую) main.css при каждом сохранении *.scss файла:

    $ grunt

Сгенерировать версию для продакшена (минифицированную):

    $ grunt build

## Стоит почитать

[Grunt для тех, кто считает штуки вроде него странными и сложными](http://frontender.info/grunt-is-not-weird-and-hard/)

----------

# How to edit CSS

All CSS generated with Sass, Autoprefixer and Grunt.

**DON'T EDIT main.css! Edit only *.scss files and then compile with `grunt build`.**

## Setup

1. Install [Ruby](https://www.ruby-lang.org/en/installation/) (already installed in Mac OS X).
2. Install [Sass](http://sass-lang.com/install).
3. Install [Node.js](http://nodejs.org/).
4. Install Grunt Command Line Interface (grunt-cli):

        $ npm install -g grunt-cli

5. In website root folder:

        $ npm install

    This install all needed node.js-modules.

6. Run `grunt build`.

## Generating CSS

Start watching service which generate _dev_ version (unminified) on each *.scss-file save:

    $ grunt

Generate _production_ (minified) version:

    $ grunt build

## Worth reading

[Grunt for People Who Think Things Like Grunt are Weird and Hard](http://24ways.org/2013/grunt-is-not-weird-and-hard/)
