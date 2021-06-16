import * as ActionTypes from './ActionTypes';

export const serviceActionPending = () => ({
    type: ActionTypes.OTPLOGIN_PENDING
})

export const serviceActionError = (error) => ({
    type: ActionTypes.OTPLOGIN_ERROR,
    error: error
})

export const serviceActionSuccess = (data) => ({
    type: ActionTypes.OTPLOGIN_SUCCESS,
    data: data
})
