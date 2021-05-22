/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
// Client.socket = io("http://192.168.104.55:5555/");
Client.socket = io("http://185.108.171.161:5555/");

Client.login = function(username, password){
    Client.socket.emit('login', {username: username, password: password});
};

Client.logout = function(){
    Client.socket.emit('logout', {username: userData.username});
};

Client.register = function(username, email, password){
    Client.socket.emit('register', {username: username, email: email, password: password});
};

Client.ranking = function(){
    Client.socket.emit('ranking', {username: userData.username});
}

Client.user_data = function(avatar){
    Client.socket.emit('user_data', {username: userData.username, avatar: avatar});
};

////////////////////////////////////////////////////////////////////////////

Client.socket.on('login',function(data){
    if(data.result)
    {
        userData = data.result;
        window.localStorage.setItem("UserName", userData.username);
        window.localStorage.setItem("Password", userData.password);
        stripe_key = data.stripe_key;
        
        game.scene.stop('LoginScreen');
        game.scene.start('HomeScreen');
        console.log('success');
    }
    else
    {
        game.scene.getScene('LoginScreen').toast_failed();
        console.log('failed');
    }
});

Client.socket.on('register',function(data){
    if(data.result)
    {
        game.scene.stop('RegisterScreen');
        game.scene.start('LoginScreen');
        game.scene.getScene('LoginScreen').toast_register_succeed();
        console.log('success');
    }
    else
    {
        game.scene.getScene('RegisterScreen').toast_failed();
        console.log('failed');
    }
});

Client.socket.on('update_userdata',function(data){
    userData = data.result;
    if(game.scene.isActive('HomeScreen'))
        game.scene.getScene('HomeScreen').updateUser();
    if(game.scene.isActive('GameScreen'))
        game.scene.getScene('GameScreen').updateUser();
    if(game.scene.isActive('SettingScreen'))
        game.scene.getScene('GameScreen').updateUser();
    if(game.scene.isActive('EndScreen'))
        game.scene.getScene('GameScreen').updateUser();
});

Client.socket.on('ranking',function(data){
    if(game.scene.isActive('HomeScreen'))
        game.scene.getScene('HomeScreen').updateRanking(data.my_rank, data.rank_list);
});

