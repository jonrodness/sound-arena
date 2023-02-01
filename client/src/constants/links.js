export const LINK_TYPES = {
    ARTIST: {
        spotify: {
            type: 'Spotify',
            name: 'Spotify',
            regex: /^https:\/\/open.spotify.com\/.*/,
            sample: 'https://open.spotify.com/artist/artist-id',
            maxLength: 300
        },
        soundCloud: {
            type: 'soundCloud',
            name: 'SoundCloud',
            regex: /^https:\/\/soundcloud.com\/.*/,
            sample: 'https://soundcloud.com/artist-name',
            maxLength: 300
        },
        appleMusic: {
            type: 'appleMusic',
            name: 'Apple Music',
            regex: /^https:\/\/music.apple.com\/.*/,
            sample: 'https://music.apple.com/us/artist/artist-name/1234567',
            maxLength: 300
        },
        facebook: {
            type: 'facebook',
            name: 'Facebook',
            regex: /^https:\/\/www.facebook.com\/.*/,
            sample: 'https://www.facebook.com/username',
            maxLength: 300
        },
        youtube: {
            type: 'youtube',
            name: 'YouTube',
            regex: /^https:\/\/www.youtube.com\/.*/,
            sample: 'https://www.youtube.com/...',
            maxLength: 300
        }               
    },
    TRACK: {
        spotify: {
            type: 'Spotify',
            name: 'Spotify',
            regex: /^https:\/\/open.spotify.com\/.*/,
            sample: 'https://open.spotify.com/track/track-id',
            maxLength: 300
        },
        soundCloud: {
            type: 'soundCloud',
            name: 'SoundCloud',
            regex: /^https:\/\/soundcloud.com\/.*/,
            sample: 'https://soundcloud.com/username/track-name',
            maxLength: 300
        },
        appleMusic: {
            type: 'appleMusic',
            name: 'Apple Music',
            regex: /^https:\/\/music.apple.com\/.*/,
            sample: 'https://music.apple.com/us/album/album-name/1234567',
            maxLength: 300
        },
        youtube: {
            type: 'youtube',
            name: 'YouTube',
            regex: /^https:\/\/www.youtube.com\/.*/,
            sample: 'https://www.youtube.com/...',
            maxLength: 300
        }         
    }
}