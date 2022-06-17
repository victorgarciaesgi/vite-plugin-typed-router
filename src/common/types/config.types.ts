import { UserOptions } from 'vite-plugin-pages';

export interface PluginOptions {
  /** Options for vite-plugin-pages-plugin */
  pluginPagesOptions: UserOptions;
  /** Output directory where you cant the files to be saved (ex: "./generated")
   * @default "<srcDir>/generated"
   */
  outDir?: string;
  /**  Name of the routesNames object (ex: "routesTree")
   * @default "routerPagesNames"
   * */
  routesObjectName?: string;
}
