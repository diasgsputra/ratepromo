const viapulsaYesterday = rowsViaPulsaYesterday.map(row => ({
    ...row,
    company: row.company,
    rate: JSON.parse(row.rate),
    createdAt: new Date(row.createdAt).toLocaleDateString()
  }));

  const viapulsaToday = rowsViaPulsaToday.map(row => ({
    ...row,
    company: row.company,
    rate: JSON.parse(row.rate),
    createdAt: new Date(row.createdAt).toLocaleDateString()
  }));

  const bypulsaYesterday = rowsByPulsaYesterday.map(row => ({
    ...row,
    company: row.company,
    rate: JSON.parse(row.rate),
    createdAt: new Date(row.createdAt).toLocaleDateString()
  }));

  const bypulsaToday = rowsByPulsaToday.map(row => ({
    ...row,
    company: row.company,
    rate: JSON.parse(row.rate),
    createdAt: new Date(row.createdAt).toLocaleDateString()
  }));
  const viapulsaYesterdayObj = {};
  viapulsaYesterday.forEach(obj => {
    obj.rate.forEach(rateObj => {
      const provider = Object.keys(rateObj)[0];
      const rate = rateObj[provider];
      viapulsaYesterdayObj[provider] = rate;
    });
  });
  const bypulsaYesterdayObj = {};
  bypulsaYesterday.forEach(obj => {
    obj.rate.forEach(rateObj => {
      const provider = Object.keys(rateObj)[0];
      const rate = rateObj[provider];
      bypulsaYesterdayObj[provider] = rate;
    });
  });
  const comp = {
    viapulsa: viapulsaToday.map(obj => {
      const rates = [];
      obj.rate.forEach(rateObj => {
        const provider = Object.keys(rateObj)[0];
        const rateToday = parseFloat(rateObj[provider]);
        const rateYesterday = parseFloat(viapulsaYesterdayObj[provider]);
        const difference = parseFloat((rateToday - rateYesterday).toFixed(2))
        let status = 'same';
        if (rateToday > rateYesterday) {
          status = 'up';
        } else if (rateToday < rateYesterday) {
          status = 'down';
        }
        rates.push({
          provider,
          rateToday,
          rateYesterday,
          status,
          difference
        });
      });
      return {
        company: obj.company,
        rates
      };
    }),
    bypulsa: bypulsaToday.map(obj => {
      const rates = [];
      obj.rate.forEach(rateObj => {
        const provider = Object.keys(rateObj)[0];
        const rateToday = parseFloat(rateObj[provider]);
        const rateYesterday = parseFloat(bypulsaYesterdayObj[provider]);
        const difference = parseFloat((rateToday - rateYesterday).toFixed(2))
        let status = 'same';
        if (rateToday > rateYesterday) {
          status = 'up';
        } else if (rateToday < rateYesterday) {
          status = 'down';
        }
        rates.push({
          provider,
          rateToday,
          rateYesterday,
          status,
          difference
        });
      });
      return {
        company: obj.company,
        rates
      };
    })
  };
  const data = [
    ...comp.viapulsa.map(obj => ({
        company: obj.company,
        rates: obj.rates
    })),
    ...comp.bypulsa.map(obj => ({
        company: obj.company,
        rates: obj.rates
    }))
];
  
  res.status(200).json({ success: true, data });