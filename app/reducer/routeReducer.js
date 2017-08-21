import AppNavigation from '../route/RouteContainer';

const initialState = AppNavigation.router.getStateForAction(
  AppNavigation.router.getActionForPathAndParams('Navigation')
);

const NavigationReducer = (state = initialState, action) => {
  if (action.type === 'Navigation/NAVIGATE') {
    const { routeName } = action;
    const lastRoute = state.routes[state.routes.length - 1];
    if (routeName === lastRoute.routeName) return state;
  }
  return AppNavigation.router.getStateForAction(action, state) || state;
};

export default NavigationReducer;
