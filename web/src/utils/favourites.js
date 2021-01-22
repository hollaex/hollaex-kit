const FAVOURITES_STORAGE_KEY = 'favourite_markets';

export const setFavourites = (favourites = []) => {
	localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
};

export const getFavourites = () => {
	const favourites = localStorage.getItem(FAVOURITES_STORAGE_KEY);
	return favourites ? JSON.parse(favourites) : favourites;
};
