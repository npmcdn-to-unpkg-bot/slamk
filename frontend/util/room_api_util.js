const SessionStore = require('../stores/session_store');

const RoomApiUtil = {
  fetchJoinedRooms(success) {
    $.ajax({
      url: 'api/rooms',
      success,
      error: function () {
			  console.log("error in RoomApiUtil#fetchJoinedRooms");
			}
    });
  },
  fetchJoinableChannels(success) {
    $.ajax({
      url: "api/channels/joinable",
      success
    });
  },
  createRoom(room, userIds, success, error) {
    $.ajax({
      url: 'api/rooms',
      method: 'POST',
      data: { room },
      success(room) {
        const RoomActions = require('../actions/room_actions');
        RoomActions.addRoomMember(room.id, SessionStore.currentUser().id);
        success(room);
        if (userIds.length) {
          userIds.forEach(id => RoomActions.addRoomMember(room.id, id));
        }
      },
      error(xhr) {
        const roomType = room.channel ? "channel" : "dM";
        const errors = xhr.responseJSON;
        error(roomType, errors);
      }
    });
  },
  addRoomMember(room_id, user_id, success) {
    $.ajax({
      url: 'api/room_users/add',
      method: 'POST',
      data: {room_user: {room_id: room_id, user_id: user_id}},
      success(room) {
        success(room);
      },
      error() {console.log("error under RoomApiUtil#addRoomMember");}
    });
  },
  fetchSingleRoomByTitle(room_title, success, error) {
    $.ajax({
      url: 'api/rooms/title',
      data: {room_title: room_title},
      success,
      error
    });
  },
  joinRoom(room_id, success) {
    $.ajax({
      url: 'api/room_users',
      method: 'POST',
      data: {room_user: {room_id: room_id}},
      success,
      error() {console.log("error under RoomApiUtil#joinRoom");}
    });
  },
  unjoinRoom(room_user_id, success) {
    $.ajax({
      url: `api/room_users/${room_user_id}`,
      method: 'DELETE',
      success,
      error() {console.log("error under RoomApiUtil#unjoinRoom");}
    });
  },
  destroyRoom(room_id, success) {
    $.ajax({
      url: `api/rooms/${room_id}`,
      method: 'DELETE',
      success,
      error() {console.log("error under RoomApiUtil#destroyRoom");}
    });
  }
};

module.exports = RoomApiUtil;
