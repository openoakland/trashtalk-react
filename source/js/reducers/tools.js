import { Map } from 'immutable';

import {
  GET_TOOLS_START,
  GET_TOOLS_ERROR,
  GET_TOOLS_SUCCESS,
  GET_TOOL_CATEGORIES_START,
  GET_TOOL_CATEGORIES_ERROR,
  GET_TOOL_CATEGORIES_SUCCESS,
} from 'actions/tools';

import ToolCategory from 'models/ToolCategory';
import Tool from 'models/Tool';

const initialState = Map({
  loading: false,
  error: null,
  tools: Map(),
  toolCategories: Map(),
  categoryToToolMap: Map(),
});

const actionsMap = {
  // Async action
  [GET_TOOLS_START]: (state) => {
    return state.merge(Map({
      loading: true,
      error: null,
    }));
  },
  [GET_TOOLS_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
  [GET_TOOLS_SUCCESS]: (state, action) => {
    const tools = {};
    const categoryToToolMap = {};
    action.data.forEach(tool => {
      tools[tool.id] = new Tool(tool);
      const currentCategory = (
        categoryToToolMap[tool.category] || []
      );
      currentCategory.push(tool.id);
      categoryToToolMap[tool.category] = currentCategory;
    });

    return state.merge(Map({
      loading: false,
      tools,
      categoryToToolMap,
    }));
  },
  // Async action
  [GET_TOOL_CATEGORIES_START]: (state) => {
    return state.merge(Map({
      loading: true,
      error: null,
    }));
  },
  [GET_TOOL_CATEGORIES_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
  [GET_TOOL_CATEGORIES_SUCCESS]: (state, action) => {
    return state.merge(Map({
      loading: false,
      toolCategories: action.data.reduce(
        (prev, curr) => Object.assign(
          {},
          prev,
          { [curr.id]: new ToolCategory(curr) }
        ),
        {}
      ),
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
