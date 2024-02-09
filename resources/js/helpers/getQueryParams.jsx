export const getQueryParam = ((url,key) => {
    const queryParameters =  new URLSearchParams(url.slice(url.indexOf('?') + 1));
    return queryParameters.get(key);
})