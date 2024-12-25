const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

describe('Site Render Test', () => {
    it('should contain the keyword "GHZ782155"', async () => {
        const filePath = path.resolve(__dirname, '../views/sample.hbs');
        const template = fs.readFileSync(filePath, 'utf8');

        const compiledTemplate = handlebars.compile(template);
        const renderedHtml = compiledTemplate();
        expect(renderedHtml).toMatch(/GHZ782155/);
    });
});