import gms from './theme_gms'
import horus from './theme_horus'
import msmc from './theme_msmc'

const options = { gms, horus, msmc }
export type ThemeChoice = keyof typeof options;
export default options;
