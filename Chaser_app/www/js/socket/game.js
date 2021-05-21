Client.game_start = function(){
    Client.socket.emit('game_start', {username : userData.username});
};

Client.level_end = function(heart, coin, point, level){
    Client.socket.emit('level_end', {username : userData.username, result:{heart:heart, point:point, coin:coin, level:level}});
};
