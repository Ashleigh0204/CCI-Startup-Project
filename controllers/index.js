// GET / => display index page
exports.index = (req, res) => {
    res.sendFile('index/index.html', { root: __dirname + '/../frontend/' });
};