'use babel';

import DATA from '../data';

const PATTERN = /R\.(\w*)$/;

const isStartsWith = (item, prefix) => {
  return item.toLowerCase().startsWith(prefix.toLowerCase());
};

export default Provider = {
  selector: '.source.js, .source.coffee, .source.ts, .source.jsx',
  disableForSelector: '.source.js .comment, .source.coffee .comment, .source.jsx .comment',
  suggestionPriority: 0,

  getSuggestions(...args) {
    if(this.getMatches(...args)) {
      return this.buildSuggestions(...args);
    }
    return [];
  },

  getMatches({ bufferPosition, editor }) {
    const line = editor.getTextInRange([ [bufferPosition.row, 0], bufferPosition ]);
    return PATTERN.exec(line);
  },

  buildSuggestions({ prefix }) {
    const result = DATA.filter(item => isStartsWith(item.name, prefix));
    return result.map((item) => this.transformSuggestion(item));
  },

  transformSuggestion(suggestion) {
    return {
      ...suggestion,
      leftLabel: `${suggestion.returns}`,
      snippet: `R.${suggestion.name}(${suggestion.args})`,
    }
  },
};