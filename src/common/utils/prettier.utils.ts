import pc from 'picocolors';
import prettier from 'prettier';
const { resolveConfig, format } = prettier;

const defaultPrettierOptions = {
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  htmlWhitespaceSensitivity: 'strict',
} as const;

export async function formatOutputWithPrettier(template: string): Promise<string> {
  try {
    let prettierFoundOptions = await resolveConfig(process.cwd());

    if (!prettierFoundOptions) {
      prettierFoundOptions = defaultPrettierOptions;
    }

    const formatedTemplate = format(template, {
      ...prettierFoundOptions,
      parser: 'typescript',
    });

    return formatedTemplate;
  } catch (e) {
    console.error(
      // logSymbols.error,
      pc.red('Error while formatting the output'),
      '\n' + e
    );
    return Promise.reject(e);
  }
}
