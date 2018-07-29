import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display_val: '0',
      display_expression: '0'
    };

    this.onKeyClick = this.onKeyClick.bind(this);
  }

  onKeyClick(event) {
    let val = event.target.innerText;
    console.log(val, 'is clicked!');

    let display = this.state.display_val;
    let expression = this.state.display_expression;

    if( !isNaN(val) ) {
      if( expression.includes("=") ){ expression = '0'; display = '0'; }
      if( isNaN(display) || display == 0 ){
        display = val;
      }else{
        display += val;
      }
    }else if( val === 'AC' ){
      display = '0'; expression = '0';
    }else if( val === 'CE' ){
      display = '0';
    }else if( val === '.' ){
      if( expression.includes("=") ){ expression = '0'; display = '0'; }
      if( display.indexOf('.') < 0 ){ display += "."; }
    }else if( val === '=' ){
      if( expression.includes("=") ){ expression = '0'; }
      if( isNaN(display) ){
        expression = expression.substr(0, expression.length - 1);
      }else{
        if( expression === '0' ){ expression = ''; }
        expression = expression + display;
      }

      console.log(expression);
      let result = String(eval(expression));

      display = result;
      expression = expression + "=" + result;
    }else{
      if(expression.includes('=') || expression === '0'){ expression = ''; }
      if( isNaN(display) ){
        expression = expression.substr(0, expression.length - 1);
        expression += val;
      }else{
        expression += display + val;
      }
      display = val;
    }

    this.setState({
      display_val: display, display_expression: expression
    });

  }

  render() {
    let keysComponents = KEYS_LIST.map((element, i) => {
      return (
        <Key key={i} onClick={this.onKeyClick}
          id={element.id} val={element.val} style={element.style} />
      );
    });
    return (
      <div>
        <div id="calculator">

          <p style={{marginTop: "0px"}}>Calculator by
            <a target="_blank" href="https://med-salem-gzizou.ml"> MED-SALEM-GZIZOU</a>
          </p>

          <Display display={this.state.display_val} expression={this.state.display_expression} />

          <div id="keys-section">{keysComponents}</div>

        </div>
      </div>
    );
  }
}

const Key = (props) => {
  return (
    <div className={"key " + props.style}
      id={props.id}
      onClick={props.onClick}
      >{props.val}</div>
  );
}

const Display = (props) => {
  return (
    <div id="display-screen" >
      <p id="display-expression">{props.expression}</p>
      <p id="display">{props.display}</p>
    </div>
  );
}

const KEYS_LIST = [
  {id: 'CE', val: 'CE', style: 'command'},
  {id: 'clear', val: 'AC', style: 'command'},
  {id: '', val: '', style: 'hidden'},
  {id: '', val: '', style: 'hidden'},

  {id: 'seven', val: '7', style: ''},
  {id: 'eight', val: '8', style: ''},
  {id: 'nine',  val: '9', style: ''},
  {id: 'divide', val: '/', style: 'operation'},

  {id: 'four',  val: '4', style: ''},
  {id: 'five',  val: '5', style: ''},
  {id: 'six',   val: '6', style: ''},
  {id: 'multiply', val: '*', style: 'operation'},

  {id: 'one',   val: '1', style: ''},
  {id: 'two',   val: '2', style: ''},
  {id: 'three', val: '3', style: ''},
  {id: 'subtract', val: '-', style: 'operation'},

  {id: 'zero',  val: '0', style: ''},
  {id: 'decimal', val: '.', style: ''},
  {id: 'equals',  val: '=', style: 'operation'},
  {id: 'add',     val: '+', style: 'operation'}
];

export default App;
