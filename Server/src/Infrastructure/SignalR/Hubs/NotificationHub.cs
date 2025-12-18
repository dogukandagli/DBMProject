using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR.Hubs;

public sealed class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}
