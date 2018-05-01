export const BENTLEY = {
  name: 'Bentley',
  styles: [
    {
      featureType: 'landscape',
      stylers: [
        {
          hue: '#F1FF00',
        },
        {
          saturation: -27.4,
        },
        {
          lightness: 9.4,
        },
        {
          gamma: 1,
        },
      ],
    },
    {
      featureType: 'road.highway',
      stylers: [
        {
          hue: '#0099FF',
        },
        {
          saturation: -20,
        },
        {
          lightness: 36.4,
        },
        {
          gamma: 1,
        },
      ],
    },
    {
      featureType: 'road.arterial',
      stylers: [
        {
          hue: '#00FF4F',
        },
        {
          saturation: 0,
        },
        {
          lightness: 0,
        },
        {
          gamma: 1,
        },
      ],
    },
    {
      featureType: 'road.local',
      stylers: [
        {
          hue: '#FFB300',
        },
        {
          saturation: -38,
        },
        {
          lightness: 11.2,
        },
        {
          gamma: 1,
        },
      ],
    },
    {
      featureType: 'water',
      stylers: [
        {
          hue: '#00B6FF',
        },
        {
          saturation: 4.2,
        },
        {
          lightness: -63.4,
        },
        {
          gamma: 1,
        },
      ],
    },
    {
      featureType: 'poi',
      stylers: [
        {
          hue: '#9FFF00',
        },
        {
          saturation: 0,
        },
        {
          lightness: 0,
        },
        {
          gamma: 1,
        },
      ],
    },
  ],
};

export const UNSATURATED_BROWNS = {
  name: 'Unsaturated Browns',
  styles: [
    {
      elementType: 'geometry',
      stylers: [
        {
          hue: '#ff4400',
        },
        {
          saturation: -68,
        },
        {
          lightness: -4,
        },
        {
          gamma: 0.72,
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#0077ff',
        },
        {
          gamma: 3.1,
        },
      ],
    },
    {
      featureType: 'water',
      stylers: [
        {
          hue: '#00ccff',
        },
        {
          gamma: 0.44,
        },
        {
          saturation: -33,
        },
      ],
    },
    {
      featureType: 'poi.park',
      stylers: [
        {
          hue: '#44ff00',
        },
        {
          saturation: -23,
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          hue: '#007fff',
        },
        {
          gamma: 0.77,
        },
        {
          saturation: 65,
        },
        {
          lightness: 99,
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          gamma: 0.11,
        },
        {
          weight: 5.6,
        },
        {
          saturation: 99,
        },
        {
          hue: '#0091ff',
        },
        {
          lightness: -86,
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          lightness: -48,
        },
        {
          hue: '#ff5e00',
        },
        {
          gamma: 1.2,
        },
        {
          saturation: -23,
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          saturation: -64,
        },
        {
          hue: '#ff9100',
        },
        {
          lightness: 16,
        },
        {
          gamma: 0.47,
        },
        {
          weight: 2.7,
        },
      ],
    },
  ],
};
export const AUBERGINE = {
  name: 'Aubergine',
  styles: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#1d2c4d',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#8ec3b9',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#1a3646',
        },
      ],
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#4b6878',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#64779e',
        },
      ],
    },
    {
      featureType: 'administrative.province',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#4b6878',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#334e87',
        },
      ],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [
        {
          color: '#023e58',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#283d6a',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#6f9ba5',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#1d2c4d',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#023e58',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#3C7680',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#304a7d',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#98a5be',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#1d2c4d',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2c6675',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#255763',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#b0d5ce',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#023e58',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#98a5be',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#1d2c4d',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#283d6a',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#3a4762',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#0e1626',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#4e6d70',
        },
      ],
    },
  ],
};

export const NIGHT = {
  name: 'Night',
  styles: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#263c3f',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#6b9a76',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#38414e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#212a37',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9ca5b3',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#1f2835',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#f3d19c',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2f3948',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#515c6d',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
  ],
};

export const RETRO = {
  name: 'Retro',
  styles: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#ebe3cd',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#523735',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f1e6',
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#c9b2a6',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#dcd2be',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#ae9e90',
        },
      ],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#93817c',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a5b076',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#447530',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f1e6',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#fdfcf8',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f8c967',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#e9bc62',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e98d58',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#db8555',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#806b63',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#8f7d77',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#ebe3cd',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#b9d3c2',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#92998d',
        },
      ],
    },
  ],
};
