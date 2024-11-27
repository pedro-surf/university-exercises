const seshs = ['BARRELS', 'T4', 'BEAST', 'AVANÇADO'];
console.log(
  arr2
    .filter((val) => seshs.some((s) => val.friendlyName.includes(s)))
    .map((val) => ({
      name: `${val.friendlyName.split('SESSÃO ')[1]} ${val.category}`,
      schedules: (val.schedules || []).reduce((acc, val) => {
        acc[val.schedule] = val.available;
        return acc;
      }, {}),
    }))
    .reduce((acc, val) => {
      acc[val.name] = val.schedules;
      return acc;
    }, {}),
);
