import { useDispatch } from 'react-redux';
import { useCallback } from 'react';


export const useEnhanchedDispatch = (thunk: any) => {
  const dispatch = useDispatch();

  const runDispatch = useCallback(
    (arg: any) => {
      // TODO: fix arg type 
      
      // console.log(arg)
      // arg returns action payload to send to reducer
      dispatch(thunk(arg));
    },
    [dispatch, thunk]
  );

  return [runDispatch];
};
