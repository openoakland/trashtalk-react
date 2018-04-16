
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
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 250,
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

/**
 * Component for displaying/selecting a cleanup location
 */
@connect(state => ({
  backgroundMapReference: state.app.get('backgroundMapReference'),
}))
class LocationRepresentation extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.instanceOf(Cleanup),
    backgroundMapReference: PropTypes.object,
    setCleanup: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.cleanup.location ? props.cleanup.location.name : '',
      suggestions: [],
    };
  }

  getSuggestionValue = (suggestion) => {
    // Before we return the suggestion value, save the selected location
    // to the cleanup object
    const { cleanup, backgroundMapReference } = this.props;
    const { name, vicinity, geometry } = suggestion.details;
    const newLocation = new Location({
      latitude: geometry.location.lat(),
      longitude: geometry.location.lng(),
      name: `${ name }, ${ vicinity }`,
    });

    this.props.setCleanup(
      cleanup.set('location', newLocation)
    );

    // Also set the background map to the same location
    backgroundMapReference.setCenter(newLocation.getLatLngObj());

    return suggestion.label;
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    const {
      cleanup,
      backgroundMapReference,
      setCleanup,
    } = this.props;

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

    setCleanup(cleanup.set('location', null));
  };

  handleSuggestionsClearRequested = () => this.setState({ suggestions: [] })
  handleChange = (event, { newValue }) => this.setState({ value: newValue })

  renderInputComponent = (inputProps) => {
    const { classes, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        InputProps={
          {
            inputRef: ref,
            classes: {
              input: classes.input,
            },
            ...other,
          }
        }
      />
    );
  }

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
      <MenuItem selected={ isHighlighted } component='div'>
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={ String(index) } style={ { fontWeight: 300 } }>
                {part.text}
              </span>
            ) : (
              <strong key={ String(index) } style={ { fontWeight: 500 } } >
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }

  renderSuggestionsContainer = (options) => {
    const { containerProps, children } = options;

    return (
      <Paper { ...containerProps } square>
        {children}
      </Paper>
    );
  }

  render() {
    const { classes, cleanup } = this.props;
    let locations;
    if (cleanup.location != null) {
      locations = [cleanup.location];
    }

    return (
      <CardContent>
        <div style={ { display: 'flex', flexDirection: 'column' } }>
          <div style={ { height: '50px', zIndex: 1 } } >
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
                placeholder: 'Enter a location',
                value: this.state.value,
                onChange: this.handleChange,
               } }
            />
          </div>
          <div style={ { height: '300px', zIndex: 0 } }>
            <GoogleMap
              locations={ locations }
              mapCenter={ cleanup.location }
            />
          </div>
        </div>
      </CardContent>
    );
  }
}

export default withStyles(styles)(LocationRepresentation);
