const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const PORT = '1234';
const app = express();
app.listen(PORT, () => console.log(`SERVERS RUNNING ON ${PORT}`));

const newspapers = [
	{
		name: 'guardian',
		url: 'https://www.theguardian.com/international',
	},
	{
		name: 'times',
		url: 'https://www.thetimes.co.uk',
	},
];

const articles = [];

newspapers.forEach((news) => {
	axios(news.url).then((resp) => {
		const html = resp.data;
		const $ = cheerio.load(html);

		$('a:contains("climate")', html).each(function () {
			const headline = $(this).text();
			const url = $(this).attr('href');

			articles.push({ headline, url, source: news.name });
		});
	});
});

app.get('/news', (req, res) => {
	res.json(articles);
});

app.get('/', (req, res) => {
	return res.json('SUCCESSFLUL GETting HIT');
});
