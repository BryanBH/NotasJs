import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPluging } from './plugins/fetch-plugin';
/**
 * Initialzes Esbuild and bundles the user's rawcode
 * @returns bundled output file
 */
const bundle = async (rawCode: string) => {
  // initialize esbuild
  try {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.17.17/esbuild.wasm',
    });
  } catch (err) {}
  // create env definition for vite
  const env = ['process', 'env', 'node_env'].join('.');

  // compile & bundle raw code
  try {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPluging(rawCode)],
      define: {
        [env]: '"production"',
        global: 'window',
      },
      // this allows for users to import react but don't really need it 
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment'
    });
    return {
      code: result.outputFiles[0].text,
      err: '',
    };
  } catch (err: any) {
    // If any errors in the bundle process, throw the error to be handles accordingly by the rejected thunk
    // console.log(err)
    throw err.message;
    // throw err;
    // if (err instanceof Error) {
    //   return {
    //     code: '',
    //     err: err.message,
    //   };
    // } else {
    //   throw err;
    // }
  }
};

export default bundle;
