export const getArtistLink = (id, name) => {
    const artistLink = '/user/' + id + '/' + name
    return artistLink
}

export const getTrackLink = (id, title) => {
    const trackLink = '/track/' + id + '/' + title
    return trackLink
}

export const getMyProfilePath = () => {
    const link = '/my-profile/'
    return link
}