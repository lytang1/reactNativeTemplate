import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import _ from 'lodash';
import moment from 'moment';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getAllConversationsRequest: null,
  getAllConversationsSuccess: ['conversations'],
  getAllConversationsFailure: null,

  getConversationWithPlvyerRequest: ['plvyerId'],
  getConversationWithPlvyerSuccess: ['conversation'],
  getConversationWithPlvyerFailure: null,

  sendMessageRequest: ['message', 'plvyerId'],
  sendMessageSuccess: ['message', 'plvyerId'],
  sendMessageFailure: ['plvyerId'],

  resetConversations: null,
  setUnreadMessages: ['data'],
});

export const ConversationTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  loading: false,
  error: false,
  conversationPreviews: {},
  data: {},
  latestAllConversationsQuery: null,
  unReadMessages: [],
});

/* ------------- Reducers ------------- */

// all

export const resetConversationsReducer = (state) =>
  state.merge({ conversationPreviews: {}, data: {}, latestAllConversationsQuery: null });

export const getAllConversationsRequestReducer = (state) =>
  state.merge({ loading: true, error: null });

export const getAllConversationsSuccessReducer = (state, { conversations }) => {
  const data = conversations.reduce((obj, conversation) =>
    ({ ...obj,
      [conversation.plvyerId]: {
        data: conversation,
        loading: false,
        error: null,
      } }),
    {});
  return state.merge({
    latestAllConversationsQuery: moment.utc().format(),
    loading: false,
    conversationPreviews: Object.assign({}, state.conversationPreviews, data),
  });
};

export const getAllConversationsFailureReducer = (state) =>
  state.merge({ loading: false, error: true });

// by plvyer

export const getConversationWithPlvyerRequestReducer = (state, { plvyerId }) => {
  const data = {};
  data[plvyerId] = { loading: true, error: null };
  return state.merge({ data });
};

export const getConversationWithPlvyerSuccessReducer = (state, { conversation }) =>
  state.setIn(['data', conversation.plvyerId], { ...state.data[conversation.plvyerId], loading: false, data: conversation, error: null });

export const getConversationWithPlvyerFailureReducer = (state, { plvyerId }) =>
  state.setIn(['data', plvyerId], state.data[plvyerId].merge({ loading: false, error: true }));

// sending of messages

export const sendMessageRequestReducer = (state, { plvyerId }) => state;

export const sendMessageSuccessReducer = (state, { message, plvyerId }) => {
  const conversation = state.data[plvyerId];
  const oldMessages = conversation.data.messages || [];
  // const messages = _.unionBy(oldMessages, message, 'id')
    // .sort((a, b) => moment(a.date).isBefore(moment(b.date)));
    const messages = oldMessages.concat(message);
  return state.setIn(['data', plvyerId, 'data', 'messages'], messages);
};

export const setUnreadMessagesReducer = (state, { data }) =>
  state.set('unReadMessages', data);

// export const getConversationWithPlvyerFailureReducer = (state, { plvyerId }) =>
//   state.setIn(['data', plvyerId], state.data[plvyerId].merge({ loading: false, error: true }));

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESET_CONVERSATIONS]: resetConversationsReducer,

  [Types.GET_ALL_CONVERSATIONS_REQUEST]: getAllConversationsRequestReducer,
  [Types.GET_ALL_CONVERSATIONS_SUCCESS]: getAllConversationsSuccessReducer,
  [Types.GET_ALL_CONVERSATIONS_FAILURE]: getAllConversationsFailureReducer,

  [Types.GET_CONVERSATION_WITH_PLVYER_REQUEST]: getConversationWithPlvyerRequestReducer,
  [Types.GET_CONVERSATION_WITH_PLVYER_SUCCESS]: getConversationWithPlvyerSuccessReducer,
  [Types.GET_CONVERSATION_WITH_PLVYER_FAILURE]: getConversationWithPlvyerFailureReducer,

  [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccessReducer,
  [Types.SET_UNREAD_MESSAGES]: setUnreadMessagesReducer,
});
