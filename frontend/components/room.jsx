const React = require('react');
const Toolbar = require('./toolbar');
const MessagesIndex = require('./messages_index');
const Submission = require('./submission');

const Room = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title={`#${this.props.room.title}`} />
        <MessagesIndex roomId={this.props.room.id} />
        <Submission roomId={this.props.room.id} />
      </div>
    );
  }
});

module.exports = Room;
