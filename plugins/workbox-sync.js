const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('formQueue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});
    
workbox.routing.registerRoute(
    ///http:\/\/localhost:8080\/api\/employee\/new/
    /https:\/\/code-red-lm5dxmp3ka-uc.a\.run\.app\/employee\/new/,
    ///https:\/\/jsonplaceholder\.typicode\.com\/posts/,
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);