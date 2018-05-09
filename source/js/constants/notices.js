import Notice from 'models/Notice';
import React from 'react';
import Typography from 'material-ui/Typography';

export const WELCOME = new Notice({
  description: (
    <div>
      <Typography paragraph={ true }>
        <strong>Problem Scope:</strong> In 2016, Oakland Public Works collected nearly 29,000 piles of illegal trash. Over the last five years, the city has expierienced an 85% increase in illegal dumping activity. These sites negatively impact the health of the public, the integrity of the environment, and the strength of the local economy.
      </Typography>
      <Typography paragraph={ true }>
        <strong>Mission:</strong> Provide a medium for Oakland Residents to organize Cleanups of illegal dumping sites in their neighborhoods.
      </Typography>
      <Typography paragraph={ true }>
        <strong>Vision:</strong> Become a trusted tool Oaklanders use to foster a sense of community and an ownership of their local places.
      </Typography>
    </div>
  ),
  title: 'TrashTalk',
});
