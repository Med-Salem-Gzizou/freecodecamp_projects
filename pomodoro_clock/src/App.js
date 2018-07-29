import React, { Component } from 'react';
import './App.css';

const STATES = {
  BREAK: 'Break',
  SESSION: 'Session'
};

const AUDIO_SRC_URL = 'https://www.soundjay.com/clock/alarm-clock-01.mp3';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      clockState: STATES.SESSION,
      intervalId: NaN,
      isCounting: false
    };

    this.updateBreakLength = this.updateBreakLength.bind(this);
    this.updateSessionLength = this.updateSessionLength.bind(this);
    this.onStartStop = this.onStartStop.bind(this);
    this.onReset = this.onReset.bind(this);
    this.updateClock = this.updateClock.bind(this);
  }

  updateBreakLength(length) {
    console.log("updateBreakLength", length);
    if(length > 60){ length = 60; }else if(length < 1){ length = 1; }
    let timeLeft = this.state.clockState === STATES.BREAK ? length * 60 : this.state.timeLeft;
    this.setState({ breakLength: length, timeLeft: timeLeft });
  }

  updateSessionLength(length) {
    console.log("updateSessionLength", length);
    if(length > 60){ length = 60; }else if(length < 1){ length = 1; }
    let timeLeft = this.state.clockState === STATES.SESSION ? length * 60 : this.state.timeLeft;
    this.setState({ sessionLength: length, timeLeft: timeLeft });
  }

  onStartStop(e) {
    if( !this.state.isCounting ){
      console.log('start');
      let id = setInterval(this.updateClock, 1000);
      this.setState({ intervalId: id, isCounting: true });
    }else{
      console.log('stop');
      clearInterval(this.state.intervalId);
      this.setState({ isCounting: false, intervalId: NaN });
    }
  }

  onReset(e) {
    clearInterval(this.state.intervalId);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      clockState: STATES.SESSION,
      intervalId: NaN,
      isCounting: false
    });
    let audioElement = document.getElementById('beep');
    audioElement.pause();
    audioElement.currentTime = 0;
  }

  updateClock(newState) {
    console.log("updateClock", this.state.timeLeft);

    let timeLeft = this.state.timeLeft - 1;
    let clockState = this.state.clockState;

    if(timeLeft < 0) {
      if(clockState === STATES.SESSION){
        timeLeft = this.state.breakLength * 60;
        clockState = STATES.BREAK;
      }else{
        timeLeft = this.state.sessionLength * 60;
        clockState = STATES.SESSION;
      }
    }else if(timeLeft === 0){
      let audioElement = document.getElementById('beep');
      audioElement.currentTime = 0;
      audioElement.play();
    }

    this.setState({ timeLeft: timeLeft, clockState: clockState });

  }

  render() {
    return (
      <div className="App">

        <TimerUpdater label="Break Length" id={{
            label: "break-label", decrement: "break-decrement",
            length: "break-length", increment: "break-increment" }}
          length={this.state.breakLength} isOn={!this.state.isCounting}
          onUpdate={this.updateBreakLength} />

        <TimerUpdater label="Session Length" id={{
            label: "session-label", decrement: "session-decrement",
            length: "session-length", increment: "session-increment" }}
          length={this.state.sessionLength} isOn={!this.state.isCounting}
          onUpdate={this.updateSessionLength} />

        <div>
          <p id="timer-label">{this.state.clockState}</p>
          <TimeLeft timeLeft={this.state.timeLeft} />
          <div id="start_stop" onClick={this.onStartStop}
            className="btn on" >{this.state.isCounting ? "STOP" : "START"}</div>
          <div id="reset" onClick={this.onReset}
            className="btn on" >Reset</div>
        </div>

        <audio id="beep" src={AUDIO_SRC_URL} ></audio>
      </div>
    );
  }
}

const TimerUpdater = (props) => {
  let btnClassName = props.isOn ? "btn on" : "btn off" ;
  return (
    <div className="timer-updater" >
      <div id={props.id.label} className="label" >{props.label}</div>
      <div id={props.id.decrement} className={btnClassName}
        onClick={() => {
          props.isOn && props.onUpdate(props.length - 1);
        }}>-</div>
      <p id={props.id.length} className="length" >{props.length}</p>
      <div id={props.id.increment} className={btnClassName}
        onClick={() => {
          props.isOn && props.onUpdate(props.length + 1);
        }}>+</div>
    </div>
  );
}

const TimeLeft = (props) => {
  let minutes = Math.floor( props.timeLeft / 60 );
  let seconds = Math.floor( props.timeLeft % 60 );
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return <p id="time-left">{ minutes + ':' + seconds }</p> ;
}

export default App;
