const SIDEBAR_STORAGE_KEY = 'is_sidebar_open';

export const setSideBarState = (isSidebarOpen = false) => {
	localStorage.setItem(SIDEBAR_STORAGE_KEY, isSidebarOpen);
};

export const getSideBarState = () => {
	const isOpen = localStorage.getItem(SIDEBAR_STORAGE_KEY);
	return isOpen ? JSON.parse(isOpen) : isOpen;
};
