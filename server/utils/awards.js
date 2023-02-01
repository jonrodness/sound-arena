const crypto = require('crypto');
const {
  encryptString,
} = require('./encryption');
const {
  awardLinkVersion,
  hmacSecret,
} = require('../conf');
const { getHostName } = require('./links');

const awardPath = '/award';

const generateAwardLinkByEncryption = (award, trackId) => {
  const serializedAwardInfo = JSON.stringify({
    id: award.id,
    date: award.date,
    genre: award.genre,
    place: award.place,
    awardGroupId: award.awardGroupId,
    totalParticipants: award.totalParticipants,
  });

  const encryptedAwardInfo = encryptString(serializedAwardInfo);
  const hostName = getHostName();

  const path = awardPath;

  let url = `${hostName}${path}/${trackId}`;
  // 'i' is encryption version
  // 'v' is initialization vector
  url += `?i=${awardLinkVersion}`;
  url += `&id=${award.id}`;
  url += `&a=${encryptedAwardInfo.encryptedStr}`;
  url += `&v=${encryptedAwardInfo.iv}`;
  url += `&t=${encryptedAwardInfo.tag}`;
  url += '#links';

  return url;
};

const generateHMAC = (string) => {
  const hmac = crypto.createHmac('sha1', hmacSecret)
    .update(string)
    .digest('hex');

  return hmac;
};

const generateAwardHmac = (awardId, date, genre, place, awardGroupId, totalParticipants) => {
  const serializedAwardInfo = JSON.stringify({
    awardId,
    date,
    genre,
    place,
    awardGroupId,
    totalParticipants,
  });

  return generateHMAC(serializedAwardInfo);
};

const isHmacValid = (awardId, date, genre, place, awardGroupId, totalParticipants, queryHmac) => {
  try {
    const generatedHmac = generateAwardHmac(
      awardId,
      date,
      genre,
      place,
      awardGroupId,
      totalParticipants,
    );
    return generatedHmac === queryHmac;
  } catch (err) {
    return false;
  }
};

const generateAwardLinkByHMAC = (award, trackId) => {
  const hostName = getHostName();
  const path = awardPath;
  const awardDate = award.date;
  const hmac = generateAwardHmac(
    award.id,
    awardDate,
    award.genre,
    award.place,
    award.awardGroupId,
    award.totalParticipants,
  );

  let url = `${hostName}${path}/${trackId}`;

  url += `?i=${awardLinkVersion}`;
  url += `&id=${encodeURIComponent(award.id)}`;
  url += `&d=${encodeURIComponent(awardDate)}`;
  url += `&g=${encodeURIComponent(award.genre)}`;
  url += `&p=${encodeURIComponent(award.place)}`;
  url += `&gid=${encodeURIComponent(award.awardGroupId)}`;
  url += `&tp=${encodeURIComponent(award.totalParticipants)}`;
  url += `&h=${encodeURIComponent(hmac)}`;

  url += '#links';

  return url;
};

/*
* Ie: 2 out of 25 will yield 96. Rank is indexed by 1.
* @return the percentile rank or 0 if either param is not a valid number
*/
const calculatePercentileRank = (rank, totalParticipants) => {
  if (!Number.isInteger(rank) || rank < 1) return 0;
  if (!Number.isInteger(totalParticipants) || totalParticipants < 1) return 0;

  if (rank === 1) {
    // Return top 10% for any first place
    return 100;
  }

  const numberOfRank = totalParticipants - rank;
  const percentileRank = (numberOfRank / totalParticipants) * 100;

  return percentileRank;
};

module.exports = {
  // Filter for awards with > 50% win percentage + map '0' to 'false'
  getDbAwards: (awards) => {
    const winningAwards = awards.filter((award) => {
      const percentage = award.wins / (award.wins + award.losses);
      return percentage >= 0.5;
    });

    winningAwards.forEach((award) => {
      award.acknowledged = !!award.acknowledged;
    });

    return winningAwards;
  },

  // Filter for awards with < 50% win percentage + map '0' to 'false'
  getDbAwardLosses: (awards) => {
    const losingAwards = awards.filter((award) => {
      const percentage = award.wins / (award.wins + award.losses);
      return percentage < 0.5;
    });

    losingAwards.forEach((award) => {
      award.acknowledged = !!award.acknowledged;
    });

    return losingAwards;
  },
  calculatePercentileRank,

  generateAwardLink: (award, trackId) => {
    switch (awardLinkVersion) {
      case 0:
        return generateAwardLinkByEncryption(award, trackId);
      case 1:
        return generateAwardLinkByHMAC(award, trackId);
      default:
        return generateAwardLinkByEncryption(award, trackId);
    }
  },

  /*
    * @Throws Error
    */
  getAwardFromVersion1Link: (query) => {
    const date = decodeURIComponent(query.d);
    const genre = decodeURIComponent(query.g);
    const place = parseInt(decodeURIComponent(query.p));
    const awardGroupId = decodeURIComponent(query.gid);
    const totalParticipants = parseInt(decodeURIComponent(query.tp));
    const hmac = decodeURIComponent(query.h);
    const awardId = parseInt(decodeURIComponent(query.id));

    const hmacIsValid = isHmacValid(awardId, date, genre, place, awardGroupId, totalParticipants, hmac);
    if (!hmacIsValid) throw new Error('HMAC not valid');

    return {
      id: awardId,
      date,
      genre,
      place,
      awardGroupId,
      totalParticipants,
    };
  },
};
