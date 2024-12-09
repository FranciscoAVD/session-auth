export function isInArray(arr: string[], str: string): boolean {
    return arr.some((s) => s.startsWith(str));
  }
  
  export function getOneWeekFromNow(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  }
  
  export function isInRoute(routes: string[], path: string): boolean {
    let isRoute = false;
    for (let i = 0; i < routes.length; i++) {
      if (path.startsWith(routes[i])) {
        isRoute = true;
        break;
      }
    }
    return isRoute;
  }