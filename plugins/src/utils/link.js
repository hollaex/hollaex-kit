export const open = (url, target = '_blank') => {
  const a = document.createElement('a');
  a.style = 'display: none';
  a.href = url;
  a.target = target;
  a.rel = 'noopener noreferrer';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};