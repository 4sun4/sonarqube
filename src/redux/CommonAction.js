import { LOGIN_STATUS,POST_ID ,TOP_TAB_NAME,ROUTE_NAME} from './Types';

export const addLoginStatus = status => (
    {
      type: LOGIN_STATUS,
      loginStatus: status,
    }
  );

  export const addPostId = post_id => (
    {
      type: POST_ID,
      postId: post_id,
    }
  );

  export const addTabName = tabname => (
    {
      type: TOP_TAB_NAME,
      tabName: tabname,
    }
  );

  export const addRouteName = routeName => (
    {
      type: ROUTE_NAME,
      routeName: routeName,
    }
  );
  