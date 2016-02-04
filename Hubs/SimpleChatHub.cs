using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace MultiChat.Hubs
{
    public class SimpleChatHub : Hub
    {
        private string userName { get; set; }

        public SimpleChatHub()
        {
            userName = MvcApplication.userByConnectionIds.FirstOrDefault(o => o.Key == Context.ConnectionId).Value;
        }
        
        public void SendMassage(string message, string groupName)
        {
            Clients.Group(groupName).PostChatMessage(userName + " wrote: " + message);
            ////Clients.All.PostChatMessage(userName + " wrote: " + message);
        }

        public async Task JoinRoom(string roomName, string userName)
        {
            if (MvcApplication.userByConnectionIds.All(o => o.Key != Context.ConnectionId))
            {
                MvcApplication.userByConnectionIds.Add(Context.ConnectionId, userName);
            }
            await Groups.Add(Context.ConnectionId, roomName);
            Clients.Group(roomName).PostChatMessage(userName + " joined");
        }

        public async Task LeaveRoom(string roomName)
        {
            try
            {
                Clients.Group(roomName).PostChatMessage(userName + " has left the room");
                await Groups.Remove(Context.ConnectionId, roomName);
            }
            catch (TaskCanceledException)
            {
            }
        }
    }
}