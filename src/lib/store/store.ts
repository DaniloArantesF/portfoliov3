import { map } from 'nanostores';

interface LayoutState {
  isNavVisible: boolean; // if navbar is in viewport & user has scrolled
  isNavOpen: boolean; // if mobile nav menu is open

  isSceneOptionsOpen: boolean; // if scene options menu is open
  isSceneInfoOpen: boolean; // if scene info menu is open
}

export const layout = map<LayoutState>({
  isNavVisible: false,
  isNavOpen: false,
  isSceneOptionsOpen: false,
  isSceneInfoOpen: false,
});
