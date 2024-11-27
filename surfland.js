const seshs = ['BARRELS', 'T4', 'BEAST', 'AVANÇADO'];
console.log(arr.filter(val => seshs.some(s => val.friendlyName.includes(s))).map(val => ({ 
[val.friendlyName.split('SESSÃO ')[1]]: val.category, ...(val.schedules || []).reduce((acc, val) => {
acc[val.schedule] = val.available;
return acc;
}, {}) })));
