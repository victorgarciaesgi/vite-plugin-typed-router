export interface TypedRouterOptions {
  /** Location of your src directory
   * @default "src"
   */
  srcDir?: string;
  /** Output directory where you cant the files to be saved (ex: "./generated")
   * @default "<srcDir>/generated"
   */
  outDir?: string;
  /** Location of your pages directory
   * @default "<srcDir>/pages"
   */
  pagesDir?: string;
}
