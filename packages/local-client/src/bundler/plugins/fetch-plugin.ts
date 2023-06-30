import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const filecache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPluging = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // override esbuild of attempt to load from the system
      // attempting to load the file from the obkect we return

      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });
      // cache loader
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // atempt to get cached code from local storage
        const cacheResults = await filecache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // if so, return immediately
        if (cacheResults) {
          return cacheResults;
        }
      });
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        // if no cached result found, then make the request
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          // provided to the next file that's required and describes where we found this original file
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store response in cache
        await filecache.setItem(args.path, result);
        return result;
      });
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // if no cached result found, then make the request
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          // provided to the next file that's required and describes where we found this original file
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store response in cache
        await filecache.setItem(args.path, result);
        return result;
      });
    },
  };
};
