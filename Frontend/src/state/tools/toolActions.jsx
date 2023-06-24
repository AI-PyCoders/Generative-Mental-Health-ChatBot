import * as requestFromServer from "./toolCrud";
import { toolListSlice, callTypes } from "./toolSlice";
const { actions } = toolListSlice;

export const fetchTools = (queryParams, token) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findTools(queryParams, token)
    .then((response) => {
      if (response && response.status === 200) {
        dispatch(actions.toolsFetched({ entities: response.data.tools }));
      }
    })

    .catch((error) => {
      error.clientMessage = "Can't find Tools";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchParticularTool = (id, token) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .fetchTool(id, token)
    .then((response) => {
      return {success:true,data:response.data};
    })
    .catch((error) => {
      error.clientMessage = "Can't find Tool";
      return {success:false,error};;
    });
};

export const getLendingByToolId = (id, token) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .fetchLendingsByToolId(id, token)
    .then((response) => {
      return {success:true,data:response.data};
    })
    .catch((error) => {
      error.clientMessage = "Can't find Tools Lendings";
      return {success:false,error};;
    });
};

export const deleteTool = (id, token) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .deleteTool(id, token)
    .then((response) => {
      return {success:true,data:response.data};
    })
    .catch((error) => {
      error.clientMessage = "Can't delete Tools";
      return {success:false,error};;
    });
};

export const borrowTool = (data, token) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .borrowTool(data, token)
    .then((response) => {
      return {success:true,data:response.data};
    })
    .catch((error) => {
      error.clientMessage = "Can't find Tools";
      return {success:false,error};;
    });
};

export const addNewTool = (details, token) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addTools(details, token)
    .then((response) => {
      const toolDetails = response.data.data;
      if (response.status === 201) {
        dispatch(actions.toolsCreated({ toolDetails }));
        return true;
      } else {
        dispatch(
          actions.catchError({
            error: response.data.message,
            callType: callTypes.action,
          })
        );
        return false;
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't create account";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      return false;
    });
};
