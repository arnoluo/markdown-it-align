'use strict';


module.exports = function ins_plugin(md, opt) {
  var regex, confKey, alignSign = [], confMap = {},
      alignClass = 'align',
      regexPrefix = '^|\\s+',
      regexSuffix = '\\s+',
      conf = {
        left: '=--',
        center: '-=-',
        right: '--='
      };

  if (opt) {
    if (typeof opt.conf !== 'undefined') {
      conf = opt.conf;
    }
    if (typeof opt.alignClass !== 'undefined') {
      alignClass = opt.alignClass;
    }
    if (typeof opt.regexPrefix !== 'undefined') {
      regexPrefix = opt.regexPrefix;
    }
    if (typeof opt.regexSuffix !== 'undefined') {
      regexSuffix = opt.regexSuffix;
    }
  }

  for (confKey in conf) {
    if (conf.hasOwnProperty(confKey)) {
      alignSign.push(conf[confKey]);
      confMap[conf[confKey]] = confKey;
    }
  }

  regex = new RegExp('(' + regexPrefix + ')(' + alignSign.join('|') + ')(' + regexSuffix + ')');


  // Insert each marker as a separate text token, and add it to delimiter list
  function tokenize(state, silent) {
    var token, matched, align, src, prevChar, prevRegex,
        start = state.pos;

    if (silent) { return false; }

    src = state.src.substring(start);
    matched = src.match(regex);
    if (matched === null) {
      return false;
    }

    state.pos = start + matched.index + matched[0].length;
    if (start > 0) {
      prevChar = state.src.substr(start - 1, 1);
      prevRegex = new RegExp('\\s');
      if (!prevRegex.test(prevChar)) {
        token = state.push('text', '', 0);
        token.content = matched[0];

        return false;
      }
    }

    align = matched[2];
    token = state.push('text', '', 0);
    token.content = align;
    state.delimiters.push({
      marker: align,
      jump: 0,
      token: state.tokens.length - 1,
      level: state.level,
      sign: 'align'
    });

    return true;
  }


  // Walk through delimiter list and replace text tokens with tags

  function postProcess(state) {
    var i, delim, token, align,
        delimiters = state.delimiters,
        max = delimiters.length;
    for (i = 0; i < max; i++) {
      delim = delimiters[i];
      if (delim.sign !== 'align') {
        continue;
      }
      align = delim.marker;

      token         = state.tokens[delim.token];
      token.type    = 'align_open';
      token.tag     = 'span';
      token.nesting = 1;
      token.markup  = align;
      token.content = '';
      token.attrPush([ 'class', alignClass + '-' + confMap[align] + ' ' + alignClass ]);

      token = state.push('text', '', 0);
      token.type    = 'align_close';
      token.tag     = 'span';
      token.nesting = -1;
      token.markup  = align;
      token.content = '';
    }
  }

  md.inline.ruler.before('emphasis', 'align', tokenize);
  md.inline.ruler2.before('emphasis', 'align', postProcess);
};
