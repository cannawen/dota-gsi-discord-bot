import Mixpanel from "mixpanel";

const mixpanel = Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN || "");

export default mixpanel;
