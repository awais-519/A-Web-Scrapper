const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const PORT = '1234';
const app = express();
app.listen(PORT, () => console.log(`SERVERS RUNNING ON ${PORT}`));

const newspapers = [
	{
		name: 'guardian',
		url: 'https://www.theguardian.com/environment/climate-crisis',
		base: '',
	},
	{
		name: 'times',
		url: 'https://www.thetimes.co.uk/environment/climate-change',
		base: '',
	},
	{
		name: 'telegraph',
		url: 'https://www.telegraph.co.uk/climate-change',
		base: 'https://www.telegraph.co.uk',
	},
];

const articles = [];
const specifiedArticle = [];

newspapers.forEach((news) => {
	axios(news.url).then((resp) => {
		const html = resp.data;
		const $ = cheerio.load(html);

		$('a:contains("climate")', html).each(function () {
			const headline = $(this).text();
			const url = $(this).attr('href');

			articles.push({ headline, url: news.base + url, source: news.name });
		});
	});
});

app.get('/news', (req, res) => {
	res.json(articles);
});

app.get('/news/:source', (req, res) => {
	const requiredNewspaper = newspapers.filter(
		(source) => source.name === req.params.source
	)[0];

	axios(requiredNewspaper.url).then((res) => {
		const html = res.data;
		const $ = cheerio.load(html);

		$('a:contains("climate")').each(function () {
			const headline = $(this).text();
			const url = $(this).attr('href');

			specifiedArticle.push({ headline, url: requiredNewspaper.base + url });
		});
	});
	res.json(specifiedArticle);
});

app.get('/', (req, res) => {
	return res.json('Welcome to Climate News');
});
