export interface TypedRouterOptions {
  /** Output directory where you cant the files to be saved (ex: "./generated")
   * The path is based on `srcDir`
   * @default "src/generated"
   */
  outDir?: string;
  /** Location of your pages directory
   * Based on `srcDir`
   * @default "src/pages"
   */
  pagesDir?: string;
  /** Print the generated routes tree object in output
   * @default "true"
   */
  printRoutesTree?: boolean;
}
