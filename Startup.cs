using Microsoft.Owin;
using Owin;
using MultiChat;


namespace MultiChat
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}