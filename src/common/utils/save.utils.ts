import fs from 'fs';
import { resolve } from 'pathe';
import pc from 'picocolors';
import mkdirp from 'mkdirp';
import { formatOutputWithPrettier } from './prettier.utils';

export async function saveRouteFiles(
  outDir: string,
  fileName: string,
  content: string
): Promise<void> {
  try {
    const outputFile = resolve(process.cwd(), `${outDir}/${fileName}`);
    const formatedContent = await formatOutputWithPrettier(content);
    if (fs.existsSync(outputFile)) {
      await writeFile(outputFile, formatedContent);
    } else {
      let dirList = outputFile.split('/');
      dirList.pop();
      const dirPath = dirList.join('/');
      await mkdirp(dirPath);
      await writeFile(outputFile, formatedContent);
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

async function writeFile(path: string, content: string): Promise<void> {
  try {
    await fs.writeFileSync(path, content);
  } catch (e) {
    console.log(
      // logSymbols.error,
      pc.red(`Error while saving file at ${path}, ${e}`)
    );
    return Promise.reject(e);
  }
}
