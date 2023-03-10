import axios from 'axios';
import { getCategoriesAction } from '../redux/categories/categories';
import { getDetailsAction } from '../redux/details/details';
import box from './images/box.svg';
import cat1 from './images/cat1.svg';
import cat2 from './images/cat2.svg';
import cat3 from './images/cat3.svg';
import cat4 from './images/cat4.svg';
import cat5 from './images/cat5.svg';
import cat6 from './images/cat6.svg';
import cat7 from './images/cat7.svg';
import cat8 from './images/cat8.svg';
import cat9 from './images/cat9.svg';
import cat10 from './images/cat10.svg';
import cat11 from './images/cat11.svg';
import cat12 from './images/cat12.svg';

const REACT_APP_BASE_URL = 'https://api.fda.gov/drug/label.json?';
const REACT_APP_COUNT_ROUTE = 'https://api.fda.gov/drug/label.json?count=openfda.route.exact';

const standardCategories = [
  {
    name: 'ORAL',
    image: cat1,
  },
  {
    name: 'TOPICAL',
    image: cat2,
  },
  {
    name: 'INTRAVENOUS',
    image: cat3,
  },
  {
    name: 'INTRAMUSCULAR',
    image: cat4,
  },
  {
    name: 'OPHTHALMIC',
    image: cat5,
  },
  {
    name: 'DENTAL',
    image: cat6,
  },
  {
    name: 'RESPIRATORY (INHALATION)',
    image: cat7,
  },
  {
    name: 'SUBLINGUAL',
    image: cat8,
  },
  {
    name: 'SUBCUTANEOUS',
    image: cat9,
  },
  {
    name: 'NASAL',
    image: cat10,
  },
  {
    name: 'EPIDURAL',
    image: cat11,
  },
  {
    name: 'AURICULAR (OTIC)',
    image: cat12,
  },
];

const getDateFrom = () => {
  const now = new Date();
  now.setDate(now.getDate() - 7);

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const newDate = year * 10000 + month * 100 + day;

  return newDate;
};

const getDateTo = () => {
  const now = new Date();
  now.setDate(now.getDate() + 365);

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const newDate = year * 10000 + month * 100 + day;

  return newDate;
};

const getCategories = () => async (dispatch) => {
  const transformData = (data) => {
    const newData = [];
    let id = 0;

    data.forEach((item) => {
      const name = item.term;
      id += 1;
      const { count } = item;
      const catFound = standardCategories.filter((e) => e.name === item.term);
      const image = catFound.length !== 0 ? catFound[0].image : box;
      const newItem = {
        id, name, image, count,
      };
      newData.push(newItem);
    });
    return newData;
  };

  let url = REACT_APP_COUNT_ROUTE; // process.env.REACT_APP_COUNT_ROUTE;
  const dateFrom = getDateFrom();
  const dateTo = getDateTo();
  url += `&search=effective_time:[${dateFrom}+TO+${dateTo}]`;

  const sendRequest = async () => {
    await axios.get(`${url}`)
      .then((response) => {
        const { data } = response;
        const categories = transformData(data.results);
        dispatch(getCategoriesAction(categories));
      })
      .catch(() => {
      });
  };
  await sendRequest();
};

const getDetails = (category) => async (dispatch) => {
  const transformData = (data) => {
    const newData = [];

    data.forEach((item) => {
      const newItem = {
        id: item.set_id,
        name: item.spl_product_data_elements,
        AI: item.active_ingredient,
        purpose: item.purpose,
        indications: item.indications_and_usage,
      };
      newData.push(newItem);
    });
    return newData;
  };

  let url = REACT_APP_BASE_URL; // process.env.REACT_APP_BASE_URL;
  const dateFrom = getDateFrom();
  const dateTo = getDateTo();
  url += `&search=effective_time:[${dateFrom}+TO+${dateTo}]`;
  url += `+AND+openfda.route:${category}`;
  url += '&limit=1000';

  const sendRequest = async () => {
    await axios.get(`${url}`)
      .then((response) => {
        const { data } = response;
        const details = transformData(data.results);
        dispatch(getDetailsAction(category, details));
      })
      .catch(() => {
      });
  };
  await sendRequest();
};

export { getCategories, getDetails };
