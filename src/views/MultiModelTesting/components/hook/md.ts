import markdownItKatexGpt from 'markdown-it-katex-gpt';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
// import 'highlight.js/styles/ir-black.css';
import 'highlight.js/styles/mono-blue.css';

// import katex from 'katex';
// import 'katex/dist/katex.min.css';
// import markdownit from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    // 当前时间加随机数生成唯一的id标识
    const codeIndex = parseInt(Date.now()) + Math.floor(Math.random() * 10000000);
    // 复制功能主要使用的是 clipboard.js
    let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制</button>`;
    const linesLength = str.split(/\n/).length - 1;
    // 生成行号
    let linesNum = '<span aria-hidden="true" class="line-numbers-rows">';
    for (let index = 0; index < linesLength; index++) {
      linesNum = linesNum + '<span></span>';
    }
    linesNum += '</span>';
    if (lang && hljs.getLanguage(lang)) {
      try {
        // highlight.js 高亮代码
        const preCode = hljs.highlight(lang, str, true).value;
        html = html + preCode;
        if (linesLength) {
          html += '<b class="name">' + lang + '</b>';
        }
        // 将代码包裹在 textarea 中
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(
          /<\/textarea>/g,
          '&lt;/textarea>',
        )}</textarea>`;
      } catch (error) {
        console.log(error);
      }
    }

    const preCode = md.utils.escapeHtml(str);
    html = html + preCode;
    // 将代码包裹在 textarea 中
    return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(
      /<\/textarea>/g,
      '&lt;/textarea>',
    )}</textarea>`;
  },
});

// import katex from 'katex';
// import 'katex/dist/katex.min.css';
import mathjax3 from 'markdown-it-mathjax3';
const katexInline = (state, silent) => {
  const start = state.pos;
  if (state.src[start] !== '\\' || state.src[start + 1] !== '(') {
    return false;
  }
  const match = state.src.slice(start).match(/^\\\((.+?)\\\)/);
  if (!match) return false;

  const token = state.push('math_inline', 'math', 0);
  token.content = match[1];
  state.pos += match[0].length;
  return true;
};

const katexBlock = (state, start, end, silent) => {
  // console.log(state, start, end, silent);

  const pos = state.bMarks[start] + state.tShift[start];
  const max = state.eMarks[start];
  // console.log(state.src, pos, max);
  if (pos + 1 >= max || state.src.slice(pos, pos + 2) !== '\\[') {
    return false;
  }

  let endPos = pos + 2;
  while (endPos < max && state.src.slice(endPos, endPos + 2) !== '\\]') {
    endPos++;
  }

  if (state.src.slice(endPos, endPos + 2) !== '\\]') {
    // console.log('endPos', state.src.slice(endPos, endPos + 2), endPos, endPos + 2);
    return false;
  }

  if (silent) {
    // console.log('silent');
    return true;
  }

  const token = state.push('math_block', 'math', 0);
  token.content = state.src.slice(pos + 2, endPos);
  token.map = [start, start + 1];
  state.line = start + 1;
  // console.log('token', token.content);
  return true;
};

// Extend the markdown-it instance
md.inline.ruler.before('escape', 'math_inline', katexInline);
md.block.ruler.before('blockquote', 'math_block', katexBlock, {
  alt: ['paragraph', 'reference', 'blockquote', 'list'],
});

// Add rendering rules
md.renderer.rules.math_inline = (tokens, idx) => {
  return katex.renderToString(tokens[idx].content);
};
md.renderer.rules.math_block = (tokens, idx) => {
  return `<div class="katex-block">${katex.renderToString(tokens[idx].content, {
    displayMode: true,
  })}</div>`;
};

// md.use(markdownItKatexGpt, {
//   delimiters: [
//     { left: '\\[', right: '\\]', display: true },
//     { left: '\\(', right: '\\)', display: false },
//     { left: '$$', right: '$$', display: false },
//   ],
// });

md.use(mathjax3);

md.use(markdownItKatexGpt, {
  delimiters: [
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$$', right: '$$', display: false },
  ],
});

export { md };

// export default md;
