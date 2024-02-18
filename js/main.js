import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/32f6c21526e16b46a68938b9e54b096c/raw/aaa643f9c0374d02d8683ff491932d9a68dc18d3/stats-preview-data.xml';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardStatusItemTemplate = document.getElementById(
	'card-stat-item-template'
);
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (el) => {
		return dataDoc.getElementsByTagName(el)[0].childNodes[0].nodeValue;
	};

	const title = getElementValue('title');
	const description = getElementValue('description');
	const imageInfo = dataDoc.getElementsByTagName('image')[0];
	const imageSrc = imageInfo.children[0].childNodes[0].nodeValue;
	const imageAlt = imageInfo.children[1].childNodes[0].nodeValue;
	const statusesEl = dataDoc.getElementsByTagName('statuses')[0];
	const statuses = Array.from(statusesEl.children).map((link) => {
		const val = link.childNodes[0].nodeValue.split(': ');
		return {
			label: val[0],
			amount: val[1],
		};
	});

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	const cardImageEl = cardEl.querySelector('.card__image img');
	cardImageEl.src = './images/' + imageSrc;
	cardImageEl.alt = imageAlt;

	const cardTitleEl = cardEl.querySelector('.card__title');
	cardTitleEl.textContent = title;

	const cardDescEl = cardEl.querySelector('.card__desc');
	cardDescEl.textContent = description;

	const cardStatusListEl = cardEl.querySelector('.card__stats-list');

	for (const status of statuses) {
		const { label, amount } = status;

		const cardStatusItemTemplateNode = document.importNode(
			cardStatusItemTemplate.content,
			true
		);
		const cardStatusItemEl = cardStatusItemTemplateNode.querySelector(
			'.card__stats-list-item'
		);

		const cardStatusItemAmountEl = cardStatusItemEl.querySelector('.num');
		cardStatusItemAmountEl.textContent = amount;

		const cardStatusItemLabelEl = cardStatusItemEl.querySelector('.label');
		cardStatusItemLabelEl.textContent = label;

		cardStatusListEl.appendChild(cardStatusItemTemplateNode);
	}

	removeLoading();
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
