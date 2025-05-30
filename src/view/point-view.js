import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate, humanizeTime, formatToShortDefaultDate, formatToDefaultDate, capitalizeFirstLetter, humanizeTimeDuration} from '../utils/route-point-util.js';
import he from 'he';

const createOfferTemplate = ({title, price}) => (`
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>
`);

const createWaypointTemplate = (point, offersList, destination) => {
  const {basePrice, dateFrom, dateTo, isFavorite, offers : offersPoint, type} = point;
  const {offers} = offersList;
  const {name} = destination;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime=${formatToShortDefaultDate(dateFrom)}>${humanizeDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${he.encode(String(name))}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${formatToDefaultDate(dateFrom)}>${humanizeTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime=${formatToDefaultDate(dateTo)}>${humanizeTime(dateTo)}</time>
          </p>
          <p class="event__duration">${humanizeTimeDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersPoint.map((id) => createOfferTemplate(offers.find((offer) => id === offer.id))).join('')}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

export default class WaypointView extends AbstractView {
  #point = null;
  #offers = null;
  #destination = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor ({point, offers, destination, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteClick);
  }

  get template () {
    return createWaypointTemplate(this.#point, this.#offers, this.#destination);
  }
}
