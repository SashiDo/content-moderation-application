/*
* To learn more about the Parse.Config and the NodeJS Environment Variables with SashiDo
* you can see the following tutorials:
* - https://blog.sashido.io/parse-config/
* - https://blog.sashido.io/announcing-environment-variables/
*/

const configCacheMs = process.env.CONFIG_CACHE_MS || 1000 * 60 * 1;

const getParseConfigWithCaching = (() => {
  let lastFetch;
  const timeBeforeFetch = parseInt(configCacheMs); // Re-fetch the config from the server only if the given time has passed. In this example, 1 minute
  return () => {
    const currentDate = new Date();
    if (
      lastFetch === undefined ||
      currentDate.getTime() - lastFetch.getTime() > timeBeforeFetch
    ) {
      lastFetch = currentDate;
      return Parse.Config.get();
    } else {
      return Promise.resolve(Parse.Config.current());
    }
  };
})();

const config = {

  // Remember: When you change env variable via the Dashboard
  // This operation will redeploy your application.

  env: {
    nsfw_model_url: process.env.TF_MODEL_URL,
    nsfw_model_shape_size: process.env.TF_MODEL_INPUT_SHAPE_SIZE
  },

  // Remember: Changing Parse.Config via the Dashboard will not redeploy your application.
  // You must think of these settings like on-the-fly settings.

  parse: {
    current: getParseConfigWithCaching
  }
}

export default config;
