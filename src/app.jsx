'use strict';

let React = require('react'),
    Bacon = require('baconjs'),
    Moment = require('moment');

// Create a dummy "time" stream
const time = Bacon.fromBinder(observer => {
  let timer = setInterval(() => {
    observer( Moment().format('h:mm:ss a') );
  }, 1000);

  return function() {
    clearTimeout(timer);
  };
});

// The view, that subscribes to the stream
const Timer = React.createClass({
  getInitialState: function() {
    return { time: 0 };
  },
  componentDidMount: function() {
    // onValue or subscribe return a function which will unsubscribe from the stream
    this._unsubscribe = time.onValue(time => this.setState({ time: time }));
  },
  componentWillUnmount: function() {
    this._unsubscribe();
  },
  render: function() {
    return (
      <section className="container">
        <h1>Current Time</h1>
        <h3 className="text-primary">{this.state.time}</h3>
      </section>
    );
  }
});

React.render(<Timer />, document.querySelector('#main'));
