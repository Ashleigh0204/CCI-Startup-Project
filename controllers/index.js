import { frontendPath } from "../config.js";
// GET / => display index page
export const index = (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
};