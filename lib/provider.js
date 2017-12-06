'use babel'

import DATA from '../ramda'

const PATTERN = /R\.(\w*)$/

const isStartsWith = (item, prefix) => {
  return item.toLowerCase().startsWith(prefix.toLowerCase())
}

export default {
  selector: '.source.js, .source.coffee, .source.ts, .source.jsx',
  disableForSelector: '.source.js .comment, .source.coffee .comment, .source.jsx .comment',
  suggestionPriority: 0,
	properties: DATA,

  getSuggestions (...args) {
    if (this.getMatches(...args)) {
      return this.buildSuggestions(...args)
    }
    return []
  },

  getMatches ({ bufferPosition, editor }) {
    const line = editor.getTextInRange([ [bufferPosition.row, 0], bufferPosition ])
    return PATTERN.exec(line)
  },

  buildSuggestions ({ prefix }) {
		const result = prefix === '.' ? DATA :
			DATA.filter(item => isStartsWith(item.name, prefix));
		return result.map((item) => this.transformSuggestion(item));
  },

  transformSuggestion ({ name, args, returns, ...other }) {
    return {
      ...other,
      name,
      leftLabel: `${returns}`,
      snippet: `${name}(${args.map((arg, i) => `\$\{${i+1}:${arg}\}`).join(', ')})`,
      displayText: `R.${name}(${args})`,
    }
  }
}
