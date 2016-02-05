GlobalChatNamespace = typeof (GlobalChatNamespace) == 'undefined' ? {} : GlobalChatNamespace;

GlobalChatNamespace.chatHtml = function(id) {
    return "<div id ='" + id + "' class='chat'>"
 + "            <div class='chat-content'>"
 + "                <div class='chat-text' data-bind='foreach:messages'>"
 + "                    <div data-bind='text:$data'></div>"
 + "                </div>"
 + "            </div>"
 + "            <div class='chat-managing'>"
 + "                <input type='text' placeholder='...' data-bind='value:message'/>"
 + "                <button data-bind='click:sendMessage' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'>Отправить</button>"
 + "            </div>"
 + "        </div>";
};
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
        Chat.hub.client.PostChatMessage = function (message, room) {
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
    }
};

$(function () {
    var $chatName = $("#addChatName");
    var $chatContent = $("#mainChatContainer");
    $("#addChatAction").click(function () {
        var html = GlobalChatNamespace.chatHtml($chatName.val());
        $chatContent.append(html);
    });

    var simpleChat = new GlobalChatNamespace.Chat("defaultChatId");
    ko.applyBindings(simpleChat.model, document.getElementById('defaultChatId'));

    
});
