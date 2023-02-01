module.exports = {
    sanitizeLinks: (links, linkTypes) => {
        const sanitizedLinks = links.filter(link => {
            const platform = linkTypes[link.type];
            const regex = platform && platform.regex;
            return regex.test && regex.test(link.url);
        });

        return sanitizedLinks;
    },
    getHostName: () => {
        return process.env.HOST_NAME;
    }
};