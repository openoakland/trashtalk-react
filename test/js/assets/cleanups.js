export const CLEANUP_WITH_TOOLS = {
  'id': 5,
  'title': 'Great Western Power Company, 520 20th St, Oakland',
  'description': null,
  'image': 'images/defaults/bow_rake.jpg',
  'participants': [],
  'start': '2018-07-26T15:00:00Z',
  'end': '2018-07-26T16:00:00.001000Z',
  'location': {
    'id': 5,
    'latitude': 37.809793,
    'longitude': -122.270206,
    'image': 'https://lh3.googleusercontent.com/p/AF1QipOO68qNGUzBItP9ko92JIC2DddGamyL4KJhiBjY=w1024-h1024-k',
    'number': '',
    'query': 'Great Western Power Company, 520 20th St, Oakland',
    'street': null
  },
  'host': null,
  'required_tools': [{
    'quantity': 2,
    'tool': 35
  }, {
    'quantity': 2,
    'tool': 22
  }, {
    'quantity': 2,
    'tool': 9
  }, {
    'quantity': 1,
    'tool': 10
  }, {
    'quantity': 2,
    'tool': 3
  }, {
    'quantity': 1,
    'tool': 4
  }]
};

export const CLEANUP_WITH_TITLE = {
  'title': 'Great Western Power Company, 520 20th St, Oakland',
};

export const CLEANUP_WITH_LOCATION_QUERY = {
  'location': {
    'query': 'Great Western Power Company, 520 20th St, Oakland',
  },
};

export const CLEANUP_WITH_TITLE_AND_LOCATION_QUERY = {
  'title': 'This should be the name',
  'location': {
    'query': 'This should not',
  },
};

export const CLEANUP_WITH_HOST = {
  'host': 1
};

export const CLEANUP_WITH_PARTICIPANTS = {
  'participants': [1, 2]
};
