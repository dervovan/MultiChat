GlobalChatNamespace = typeof (GlobalChatNamespace) == 'undefined' ? {} : GlobalChatNamespace;

GlobalChatNamespace.Chat = function () {
    this.hub = null;
    this.model = null;
    this.Id = null;
    this.init();
};

GlobalChatNamespace.Chat.prototype = {
    init: function (ID) {
        //this.chatArray = new [];
        var Chat = this;
        Chat.Id = ID;
        Chat.hub = $.connection.simpleChatHub;
        $.connection.hub.logging = true;
        $.connection.hub.start();
        Chat.hub.client.PostChatMessage = function (message) {
            Chat.model.addMessage(message);
        };
        
        Chat.ChatVM = function () {
            var self = this;
            self.message = ko.observable("");
            self.messages = ko.observableArray();
        };

        Chat.ChatVM.prototype = {
            sendMessage: function () {
                var self = this;
                Chat.hub.server.sendMassage(self.message(), "vovka");
                self.message("");
            },
            
            addMessage: function (message) {
                var self = this;
                self.messages.push(message);
            }
        };

        Chat.model = new Chat.ChatVM();
        
        //chatArray.push(new Chat.SimpleChat());
    }
};

$(function () {
    
    var simpleChat = new GlobalChatNamespace.Chat("defaultChatId");
    ko.applyBindings(simpleChat.model, document.getElementById('defaultChatId'));
});
