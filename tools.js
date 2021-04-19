module.exports = {
  randInt: (min, max) => Math.floor( Math.random() * (max - min + 1) ) + min,
  friendlyProductName: (productName) => productName.split('-').map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' '),
  categoryToTiredChange: (category) => ({
    resting: -2,
    petting: -1,
    eating: 1,
    playing: 2,
  }[category]),
  calcTiredFactor: (activity, tired) => {
    switch (activity) {
    case 'resting': case 'petting':
      return Math.ceil( (1.25) ** (tired - 3) );
    case 'eating': case 'playing':
      return Math.ceil( (1.25) ** (6 - tired) );
    default:
      return 1;
    }
  },
  categoryToTrait: (category) => ({
    resting: 'lazy',
    petting: 'cuddly',
    eating: 'hungry',
    playing: 'playful',
  }[category]),
  activityMessage: (pet, category, product, amount) => ({
    resting: `${pet} rested on the ${product}! +${amount}`,
    petting: `You pet ${pet} with the ${product}! +${amount}`,
    eating: `${pet} ate the ${product}! +${amount}`,
    playing: `${pet} played with the ${product}! +${amount}`,
  }[category])
};