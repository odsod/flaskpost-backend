var tracks = [
  '6rZSDBi6qEfeCNrbhGpq1j'
, '05AlnURAyEjbEbiWDju7lo'
, '2x71TCddP7QTNxl5sblGWM'
, '4Lgo0e03woV055yCKSMFuG'
, '2tU3i1kr8Oc8MfDKTZdWyq'
, '6Sny0aA3AeTa9epjq4fLGF'
, '2ckZhS6J4MGQUrbYRzscVt'
, '1oavuZZi5oWfQINRcbVxer'
, '0Zw4llKeB35SIKASy1aLtV'
, '4Lgo0e03woV055yCKSMFuG'
, '2tU3i1kr8Oc8MfDKTZdWyq'
, '6Sny0aA3AeTa9epjq4fLGF'
, '2ckZhS6J4MGQUrbYRzscVt'
, '1oavuZZi5oWfQINRcbVxer'
, '0Zw4llKeB35SIKASy1aLtV'
, '1yeFguiEhw3OkcIhYT68e2'
, '0Jj9EguPAPhhZBSmqJpvP9'
, '5RNGOlGqKBawkqLfdJqiqA'
, '2b4WRRaE0qOH1ptO1QL7IM'
, '070LIFx3CvC3WObrWE1jiU'
, '1pKYYY0dkg23sQQXi0Q5zN'
, '1CZ2hvYYWFiqIQyWVCXCqO'
, '6nAkBdopvL3Iu8LlGrFBcw'
, '0YjLBuUxrBX9zeAGaP9pKd'
, '4AjExw5583ppejDhyBqUXc'
, '15pjKGUrU2MUFMV37YgFD4'
, '5Wa3PIAwAl6MKywdy485jc'
, '2wwsLAu4H4J3skC30EDBkQ'
, '0eVPM6bXqsofXp6kAiuehb'
];

var locations = [
  '6.29424493,-111.36352641'
, '11.03211003,59.90028923'
, '-48.5388152,-38.46512861'
, '-24.4642027,-80.12985139'
, '36.01690143,-95.59984464'
, '-40.0728339,153.6835598'
, '2.94798193,-2.14136881'
, '52.7935627,108.26143821'
, '-22.16506885,-132.7380984'
, '74.00580189,-161.60585389'
, '-70.214445,-98.78292332'
, '-63.88618347,24.27006214'
, '45.29236913,72.19313827'
, '70.13802558,-168.52526658'
, '0.32698392,38.13856532'
, '-72.9376445,21.20377029'
, '44.12530879,-81.93207196'
, '41.20412433,96.56271462'
, '30.89888787,-105.41243226'
, '-53.89215531,-164.93447856'
, '-65.87570829,173.12043195'
, '77.69544057,-140.39030746'
, '35.85060595,-162.11816596'
, '-0.38248335,115.23667323'
, '-4.99576678,139.50314336'
, '-23.25614372,110.33838183'
, '-73.26401089,-155.27425528'
, '-25.26662422,50.13302244'
, '-27.20963496,64.91141557',
, '-28.07047215,166.51299712',
, '-65.37025413,-117.91948891'
, '15.61872931,-35.02757433'
, '-28.62898444,-52.0864223'
, '65.09006803,-56.93977481'
, '22.9521325,93.9064938'
, '60.65454814,-128.81889497'
];

var l1 = [
  'Epic'
, 'Supreme'
, 'Splendid'
, 'Wonderful'
, 'Nice'
, 'Great'
];

var l2 = [
  'songs'
, 'tunes'
, 'noise'
, 'sounds'
, 'tracks'
];

var l3 = [
  'of splendor'
, 'of epicness'
, 'of win'
, 'of joy'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomSongURI() {
  return 'spotify:track:' + randomElement(tracks);
}

function randomLocation() {
  return randomElement(locations);
}

function randomLabel() {
  return [
    randomElement(l1)
  , randomElement(l2)
  , randomElement(l3)
  ].join(' ');
}

function randomTune() {
  return {
    uri: randomSongURI()
  , location: randomLocation()
  };
}

function randomBottle() {
  return {
    label: randomLabel()
  , tunes: [randomTune()]
  };
}

function randomNumberedBottle(number) {
  return {
    label: 'Bottle ' + number
  , tunes: [randomTune()]
  };
}

function randomNumberedBottles(amount) {
  var bottles = [];
  var i = amount;
  while (i--) {
    bottles.push(randomNumberedBottle(i));
  }
  return bottles;
}

function randomBottles(amount) {
  var bottles = [];
  while (amount--) {
    bottles.push(randomBottle());
  }
  return bottles;
}

module.exports = {
  randomSongURI: randomSongURI
, randomLocation: randomLocation
, randomLabel: randomLabel
, randomTune: randomTune
, randomBottle: randomBottle
, randomBottles: randomBottles
, randomNumberedBottle: randomNumberedBottle
, randomNumberedBottles: randomNumberedBottles
};
