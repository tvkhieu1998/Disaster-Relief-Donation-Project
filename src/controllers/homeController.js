const getHomepage = async (req, res) => {
    //Process data -> call model
    res.render('Home')

}
const getAbout = (req, res) => {
    //Process data -> call model
    res.render('sample')
}

const getMap = (req, res) => {
    //Process data -> call model
    res.render('HeatMap.hbs')
}

module.exports = {
    getHomepage,
    getAbout,
    getMap
}