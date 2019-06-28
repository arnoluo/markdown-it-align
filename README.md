# markdown-it-align

> text align plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

__requires `markdown-it` v5.+__

`=-- inline words(left)` => `<p><span class="align-left align">inline words(left)</span></p>`

`-=- inline words(center)` => `<p><span class="align-center align">inline words(center)</span></p>`

`--= inline words(right)` => `<p><span class="align-right align">inline words(right)</span></p>`

## Install

node.js, browser:

```bash
npm install markdown-it-align --save
bower install markdown-it-align --save
```

## Use

```js
var align = require('markdown-it-align')

var md = require('markdown-it')()
    .use(align);

md.render('=-- inline words(left)') // => '<p><span class="align-left align">inline words(left)</span></p>'
md.render('-=- inline words(center)') // => '<p><span class="align-center align">inline words(center)</span></p>'
md.render('--= inline words(right)') // => '<p><span class="align-right align">inline words(right)</span></p>'
```
## Config
Default align conf:
```js
{
  alignClass: 'align',// css class name
  regexPrefix: '^|\\s+',// prefix regex for matching  align tag
  regexSuffix: '\\s+',// suffix regex for matching  align tag
  // Custom align tag map
  conf: {
    left: '=--',
    center: '-=-',
    right: '--='
  }
}
```

Example:
- change css class name
```js
var opt = {alignClass: 'my-class-name'};
```

- change align tag(Only chars not in regex keywords)
```js
var opt = {
  conf: {
    left: '=---',
    center: '-==-',
    right: '--='
  }
}
```

- usage
```js
var align = require('markdown-it-align')
var opt = {
  alignClass: 'my-class-name',
  conf: {
    left: '=---',
    center: '-==-',
    right: '--='
  }
};

var md = require('markdown-it')()
            .use(align, opt);

md.render('=--- inline words(left)')
// => '<p><span class="my-class-name-left my-class-name">inline words(left)</span></p>'

md.render('-==- inline words(center)')
// => '<p><span class="my-class-name-center my-class-name">inline words(center)</span></p>'

md.render('--= inline words(right)')
// => '<p><span class="my-class-name-right my-class-name">inline words(right)</span></p>'

md.render('-=- inline words(unmatched now)')
// => '<p>-=- inline words(unmatched now)</p>'
```

_Differences in browser._ If you load script directly into the page, without
package system, module will add itself globally as `window.markdownitAlign`.


## License

[MIT](https://github.com/arnoluo/markdown-it-align/blob/master/LICENSE)