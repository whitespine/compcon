import gms from './theme_gms'
import horus from './theme_horus'
import msmc from './theme_msmc'


export interface Theme {
  type: string, // "light" | "dark"
  id: string,
  name: string,

  // The actual theme info
  [key: string]: any
}

// Build the options
const options = {} as {[key: string]: Theme};
for(const x of [gms, horus, msmc]) {
    options[x.id] = x;
}
export default options;

export const ThemeIDs = Object.keys(options);