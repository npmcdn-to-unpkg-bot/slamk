const React = require('react');
const MessageStore = require('../stores/message_store');
const MessageActions = require('../actions/message_actions');
const MessageIndexItem = require('./message_index_item');

const MessagesIndex = React.createClass({
  getInitialState() {
    return { messages: MessageStore.all() };
  },
  componentDidMount() {
    this.messageListener = MessageStore.addListener(this.handleChange);
    MessageActions.fetchRoomMessages(this.props.roomId);
    this.pusher = new Pusher('0d04cf841bc3ee166b79', {
      encrypted: true
    });
    var channel = this.pusher.subscribe(`room_${this.props.roomId}`);
    const self = this;
    channel.bind('message_created', function(data) {
      MessageActions.fetchRoomMessages(self.props.roomId);
    });
  },
  componentWillReceiveProps(nextProps) {
    MessageActions.fetchRoomMessages(nextProps.roomId);
  },
  componentWillUnmount() {
    this.messageListener.remove();
    this.pusher.unsubscribe(`room_${this.props.roomId}`);
  },
  handleChange() {
    this.setState({ messages: MessageStore.all() });
  },

  render() {
    return (
      <div>
        {this.state.messages.map((message, idx) => {
          const showMessageOnly = (idx && (this.state.messages[idx - 1].user_id === message.user_id));
          return <MessageIndexItem message={message}
            showMessageOnly={showMessageOnly} key={message.id} />;
        })}
      </div>
    );
  }
});

module.exports = MessagesIndex;
