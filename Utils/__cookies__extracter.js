exports.parseCookies  = (request)=> {
    var list = {},
        reqList = request.headers.cookie;

    reqList && reqList.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}