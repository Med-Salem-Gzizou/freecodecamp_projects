import React, { Component } from 'react';
import './App.css';

import marked from 'marked';
marked.setOptions({ breaks: true });

var renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  return '<a href="'+href+'" target="_blank" >'+text+'</a>';
}

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      strMarkdown: DEFAULT_TEXT
    };

    this.onTextChange = this.onTextChange.bind(this);
  }

  onTextChange(event) {
    this.setState({ strMarkdown: event.target.value });
  }

  render() {
    return (
      <div className="App">

        <div className="block">
          <Editor value={this.state.strMarkdown} onChange={this.onTextChange} />
        </div>

        <div className="block">
          <Preview strMarkdown={this.state.strMarkdown} />
        </div>

      </div>
    );
  }
}

const Editor = (props) => {
  return (
    <textarea id="editor" className="textarea" type="text"
      value={props.value}
      onChange={props.onChange} >
    </textarea>
  );
}

const Preview = (props) => {
  return (
    <div id="preview" className="textarea markdown-body" dangerouslySetInnerHTML={
        {__html: marked(props.strMarkdown, { renderer: renderer })}
    }></div>
  );
}

const DEFAULT_TEXT =`
# Markdown Previewer With React

## This is a sub-heading
### This is a h3 heading

This is one line code \`console.log("Hi!")\`

\`\`\`
// This is multi-line code:

const sayHi = () => {
    console.log("Hi !");
}
\`\`\`

This is :
**bold text**,
_italic text_,
**_italic and bold text_**,
~~crossed text~~.

This is [links](https://www.freecodecamp.com)

> This is Block Quotes!

This is a tables:

Header N1 | Header N2 | Header N3
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want!
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`

export default App;
