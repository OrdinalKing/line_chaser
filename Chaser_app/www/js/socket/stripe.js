Client.purchase_coin = function(tokenId){
    Client.socket.emit('purchase_coin', {username: userData.username, tokenId : tokenId});
};
