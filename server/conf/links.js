module.exports = {
  LINK_TYPES: {
    ARTIST: {
      spotify: {
        regex: /^https:\/\/open.spotify.com\/.*/,
        maxLength: 300,
      },
      appleMusic: {
        regex: /^https:\/\/music.apple.com\/.*/,
        maxLength: 300,
      },
      soundCloud: {
        regex: /^https:\/\/soundcloud.com\/.*/,
        maxLength: 300,
      },
      facebook: {
        regex: /^https:\/\/www.facebook.com\/.*/,
        maxLength: 300,
      },
      youtube: {
        regex: /^https:\/\/www.youtube.com\/.*/,
        maxLength: 300,
      },
    },
    TRACK: {
      spotify: {
        regex: /^https:\/\/open.spotify.com\/.*/,
        maxLength: 300,
      },
      appleMusic: {
        regex: /^https:\/\/music.apple.com\/.*/,
        maxLength: 300,
      },
      soundCloud: {
        regex: /^https:\/\/soundcloud.com\/.*/,
        maxLength: 300,
      },
      youtube: {
        regex: /^https:\/\/www.youtube.com\/.*/,
        maxLength: 300,
      },
    },
  },
};
