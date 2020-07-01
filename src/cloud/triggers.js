import config from "./config";

Parse.Cloud.afterSave("UserImage", async (req) => {
  const currentObject = req.object;
  const originalObject = req.original;

  const conf = await config.parse.current();
  const nsfwAutomationEnabled = conf.get("moderationAutomation"); // feature flag

  // classify only if is a new image or the image is changed/updated.
  const shouldClassify = (currentObject.get("NSFWPredictions") === undefined) ||
    (currentObject.get("image").url() !== originalObject.get("image").url());

  if (nsfwAutomationEnabled) {
    if (shouldClassify) {
      const url = currentObject.get("image").url().replace(process.env.LOCAL_FILES_URL, process.env.PRODUCTION_FILES_URL);
      const nsfwResult = await nsfwModel.isSafe(url)

      currentObject.set("NSFWPredictions", nsfwResult.predictions);
      currentObject.set("isSafe", nsfwResult.isSafe);

      // --
      // Our Moderation Business Logic
      //
      if (nsfwResult.isToxic) {
        // The Super Danger images should be marked for deletion
        // without need of manual moderation
        currentObject.set("moderationRequired", false);
        currentObject.set("deleted", true);
      } else {
        if (nsfwResult.isSafe) {
          // Safe images no need to be moderated manually
          currentObject.set("moderationRequired", false);
          currentObject.set("deleted", false);
        } else {
          // Not Safe images should be moderated manually
          currentObject.set("moderationRequired", true);
          currentObject.set("deleted", false);
        }

      }

      return await currentObject.save(null, { useMasterKey: true })
    }

  } else {
    console.info(`nsfwAutomationEnabled is disabled! You should enable it via the "moderationAutomation" param in the Parse.Config Section.`)
  }

  return "Successfuly classified.";
});
