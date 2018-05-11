import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import { CardContent } from 'material-ui/Card';
import GoogleMap from 'components/GoogleMap';
import Cleanup from 'models/Cleanup';
import Location from 'models/Location';

const styles = () => ({
  mapContainer: {
    flex: 1,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

const MAX_PHOTO_DIMENSIONS = {
  maxHeight: 1024,
  maxWidth: 1024,
};

/**
 * Component for displaying/selecting a cleanup location
 */
@connect(state => ({
  backgroundMapReference: state.app.get('backgroundMapReference'),
}))
class LocationRepresentation extends Component {
  static propTypes = {
    animate: PropTypes.bool,
    classes: PropTypes.object,
    cleanup: PropTypes.instanceOf(Cleanup),
    backgroundMapReference: PropTypes.object,
    setCleanup: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.cleanup && props.cleanup.location ? props.cleanup.location.query : '',
      suggestions: [],
    };
  }

  getSuggestionValue = suggestion => {
    this.setCleanupToSuggestion(suggestion);
    return suggestion.label;
  };

  setCleanupToSuggestion = suggestion => {
    const { cleanup, backgroundMapReference } = this.props;
    const { geometry } = suggestion.details;
    const newLocation = new Location({
      latitude: geometry.location.lat(),
      longitude: geometry.location.lng(),
      image: suggestion.details.photos ? suggestion.details.photos[0].getUrl(MAX_PHOTO_DIMENSIONS) : null,
      query: suggestion.label,
    });

    this.props.setCleanup(cleanup.set('title', suggestion.label).set('location', newLocation));

    // Also set the background map to the same location
    backgroundMapReference.setCenter(newLocation.getLatLngObj());
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const { cleanup, backgroundMapReference } = this.props;

    const service = new window.google.maps.places.PlacesService(backgroundMapReference);
    // https://developers.google.com/maps/documentation/javascript/places#place_searches
    const request = {
      location: cleanup.location.getLatLngObj(),
      radius: 20000,
      keyword: value,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const suggestions = results
          .filter(result => result.vicinity.indexOf('Oakland') >= 0)
          .slice(0, 5)
          .map(result => ({
            label: `${ result.name }, ${ result.vicinity }`,
            details: result,
          }));

        this.setState({ suggestions });
      }
    });
  };

  handleSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  handleChange = (event, { newValue }) => {
    this.setState({ value: newValue });

    // If the text has been cleared, clear out any previous location value
    if (newValue === '') {
      const { cleanup } = this.props;

      this.props.setCleanup(cleanup.set('location', cleanup.location.set('query', null)));
    }
  };

  handleEnterKeyPress = event => {
    // If the enter key is pressed, default to first suggestion if one exists
    const firstSuggestion = this.state.suggestions[0];
    if (event.key === 'Enter' && firstSuggestion != null) {
      this.setState({
        value: firstSuggestion.label,
      });

      this.setCleanupToSuggestion(firstSuggestion);
    }
  };

  renderInputComponent = inputProps => {
    const { classes, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        onKeyPress={ this.handleEnterKeyPress }
        InputProps={ {
          inputRef: ref,
          classes: {
            input: classes.input,
          },
          ...other,
        } }
      />
    );
  };

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
      <MenuItem
        selected={ isHighlighted }
        component='div'
        data-query={ suggestion.label }
      >
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span
                key={ String(index) }
                style={ { fontWeight: 300 } }
              >
                {part.text}
              </span>
            ) : (
              <strong
                key={ String(index) }
                style={ { fontWeight: 500 } }
              >
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  };

  renderSuggestionsContainer = options => {
    const { containerProps, children } = options;

    return (
      <Paper
        { ...containerProps }
        square
      >
        {children}
      </Paper>
    );
  };

  render() {
    const { classes, cleanup, animate, setCleanup } = this.props;
    if (cleanup == null) {
      return null;
    }

    return (
      <CardContent className={ classes.root }>
        { setCleanup && (
          <div style={ { height: '50px', zIndex: 1 } }>
            <Autosuggest
              theme={ {
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion,
              } }
              renderInputComponent={ this.renderInputComponent }
              suggestions={ this.state.suggestions }
              onSuggestionsFetchRequested={ this.handleSuggestionsFetchRequested }
              onSuggestionsClearRequested={ this.handleSuggestionsClearRequested }
              renderSuggestionsContainer={ this.renderSuggestionsContainer }
              getSuggestionValue={ this.getSuggestionValue }
              renderSuggestion={ this.renderSuggestion }
              inputProps={ {
                classes,
                placeholder: 'Cleanup location',
                value: this.state.value || '',
                onChange: this.handleChange,
              } }
            />
          </div>
        )}
        <div className={ classes.mapContainer }>
          <GoogleMap
            animate={ animate }
            cleanups={ [cleanup] }
            mapCenter={ cleanup.location }
          />
        </div>
      </CardContent>
    );
  }
}

export default withStyles(styles)(LocationRepresentation);
