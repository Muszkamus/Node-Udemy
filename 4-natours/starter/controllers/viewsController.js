exports.getOverview = (req, res) => {
  // 1) Get your data from collection

  // 2) Build template

  // 3) Render that template using tour data from {}
  res.status(200).render('overview', {
    title: 'All tours',
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
