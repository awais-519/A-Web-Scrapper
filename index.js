const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const PORT = '6969';
const app = express();
app.listen(PORT, () => console.log(` SERVERS RUNNING ON ${PORT}`));

const articles = [];

axios('https://www.theguardian.com/international').then((resp) => {
	const html = resp.data;
	const $ = cheerio.load(html);

	$('.fc-item__title', html).each(function () {
		const title = $(this).text();
		const url = $(this).find('a').attr('href');

		articles.push({ title, url });
	});

	console.log(articles);
});
